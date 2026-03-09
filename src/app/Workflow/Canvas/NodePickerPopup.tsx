import { useEffect, useState } from "react";
import { GET_NODES } from "../../../api";
import type { NodeResponse } from "../../../types/api";
import styles from "./NodePickerPopup.module.scss";

interface Props {
  position: { x: number; y: number };
  onSelect: (node: NodeResponse) => void;
  onClose: () => void;
}

export function NodePickerPopup({ position, onSelect, onClose }: Props) {
  const [nodes, setNodes] = useState<NodeResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const { url, options } = GET_NODES();
        const res = await fetch(url, options);
        if (res.ok) {
          const data = await res.json();
          setNodes(data.nodes ?? []);
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    fetchNodes();
  }, []);

  const filtered = nodes.filter((n) =>
    n.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.popup}
        style={{ left: position.x, top: position.y }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>Select a Node</div>
        <input
          className={styles.search}
          placeholder="Search nodes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
        <div className={styles.list}>
          {isLoading && <div className={styles.empty}>Loading nodes...</div>}
          {!isLoading && filtered.length === 0 && (
            <div className={styles.empty}>No nodes found</div>
          )}
          {filtered.map((node) => (
            <button
              key={node.id}
              className={styles.nodeItem}
              onClick={() => onSelect(node)}
            >
              <span
                className={styles.status}
                style={{ background: node.isOnline ? "#22c55e" : "#8E9BA6" }}
              />
              <span className={styles.nodeName}>{node.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
