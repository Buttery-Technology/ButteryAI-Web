import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { SummaryCards } from "@common";
import type { SummaryCard, NodeResponse, NetworkInfo } from "../../../types/api";
import CreateNodePopup from "./CreateNodePopup";
import styles from "./Cluster.module.scss";

interface Props {
  summaryCards: SummaryCard[];
  nodes: NodeResponse[];
  isLoading: boolean;
  clusterConnectionInfo?: NetworkInfo;
  clusterID?: string;
}

const FALLBACK_CARDS: SummaryCard[] = [
  { type: "health", header: "Cluster Health", title: "—", description: "Loading...", actionType: "none", actionTarget: "", order: 1 },
  { type: "activity", header: "Activity", title: "—", description: "Loading...", actionType: "none", actionTarget: "", order: 2 },
  { type: "grade", header: "Value", title: "—", description: "Loading...", actionType: "none", actionTarget: "", order: 3 },
  { type: "knowledge", header: "Knowledge", title: "—", description: "Loading...", actionType: "none", actionTarget: "", order: 4 },
];

const HEX_PATH =
  "M273 22 L427 112 Q468 135 468 180 L468 360 Q468 405 427 428 L273 518 Q234 540 195 518 L41 428 Q0 405 0 360 L0 180 Q0 135 41 112 L195 22 Q234 0 273 22 Z";


function NodeHex({ node, delay, clusterConnectionInfo, clusterID }: { node: NodeResponse; delay: string; clusterConnectionInfo?: NetworkInfo; clusterID?: string }) {
  return (
    <Link
      to={`/node/${encodeURIComponent(node.name)}/overview`}
      state={{ node, clusterConnectionInfo, clusterID }}
      className={styles.hexCell}
      style={{ "--delay": delay } as React.CSSProperties}
    >
      <svg viewBox="0 0 468 540" className={styles.hexBg}>
        <path d={HEX_PATH} fill={node.isOnline ? "#22908C" : "#8E9BA6"} />
      </svg>
      <div className={styles.hexContent}>
        <span className={styles.hexName}>{node.name}</span>
        <span className={styles.hexLinkBadge}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 10L10 2M10 2H4M10 2V8"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

type SheetTarget = "createNode" | "createCluster" | "joinCluster" | "addKnowledge";

/**
 * Distribute nodes into three honeycomb rows.
 *
 * Nodes fill from the top-right, across the top, then wrap around Core
 * tightly before extending left in columns:
 *
 *   0 → T0 (top-right, above Core/Add gap)
 *   1 → T1 (top, above M1/Core gap — adjacent to T0)
 *   2 → M1 (left of Core — adjacent to T1)
 *   3 → B0 (bottom-right — adjacent to Core)
 *   4 → B1 (bottom, below M1/Core gap — adjacent to M1)
 *   5+ → columns extending left: top, mid, bottom per column
 *
 *           [T2] [T1] [T0]
 *     [M2]  [M1] [Core] [Add]
 *           [B2] [B1] [B0]
 *
 * Returns arrays in render order (leftmost first).
 */
function distributeNodes(nodes: NodeResponse[]) {
  const top: NodeResponse[] = [];
  const mid: NodeResponse[] = [];
  const bot: NodeResponse[] = [];

  nodes.forEach((node, i) => {
    if (i === 0) top.push(node);       // T0
    else if (i === 1) top.push(node);  // T1 — adjacent to T0
    else if (i === 2) mid.push(node);  // M1 — adjacent to T1
    else if (i === 3) bot.push(node);  // B0 — adjacent to Core
    else if (i === 4) bot.push(node);  // B1 — adjacent to M1 & B0
    else {
      const pos = (i - 5) % 3;
      if (pos === 0) top.push(node);   // T(n)
      else if (pos === 1) mid.push(node); // M(n)
      else bot.push(node);              // B(n)
    }
  });

  return {
    topRow: top.reverse(),
    midRow: mid.reverse(),
    botRow: bot.reverse(),
  };
}

const Cluster = ({ summaryCards, nodes, isLoading, clusterConnectionInfo, clusterID }: Props) => {
  const cards = summaryCards.length > 0 ? summaryCards : FALLBACK_CARDS;
  const displayNodes = nodes;
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [activeSheet, setActiveSheet] = useState<SheetTarget | null>(null);
  const clusterRef = useRef<HTMLDivElement>(null);

  const { topRow, midRow, botRow } = distributeNodes(displayNodes);

  // Center the cluster in the viewport on mount / when nodes change.
  useEffect(() => {
    const el = clusterRef.current;
    if (!el) return;
    const overflow = el.scrollWidth - el.clientWidth;
    if (overflow > 0) {
      el.scrollLeft = overflow; // nodes extend left, so scroll right to keep Core visible
    }
  }, [nodes.length]);

  return (
    <section className={styles.root}>
      <SummaryCards cards={cards} isLoading={isLoading} />

      <div className={styles.cluster} ref={clusterRef}>
        <div className={styles.clusterInner}>
          {/* Top offset row */}
          {topRow.length > 0 && (
            <div className={`${styles.hexRow} ${styles.offsetRow}`}>
              {topRow.map((node, i) => (
                <NodeHex key={node.id} node={node} delay={`${0.06 + i * 0.04}s`} clusterConnectionInfo={clusterConnectionInfo} clusterID={clusterID} />
              ))}
            </div>
          )}

          {/* Middle row: [...nodes] [Core] [Add Node] */}
          <div className={styles.hexRow}>
            {midRow.map((node, i) => (
              <NodeHex key={node.id} node={node} delay={`${0.06 + i * 0.04}s`} clusterConnectionInfo={clusterConnectionInfo} clusterID={clusterID} />
            ))}
            <div
              className={styles.hexCell}
              style={{ "--delay": "0s" } as React.CSSProperties}
            >
              <svg viewBox="0 0 468 540" className={styles.hexBg}>
                <path d={HEX_PATH} fill="#F9C000" />
              </svg>
              <div className={styles.hexContent}>
                <span className={styles.coreName}>Core</span>
              </div>
            </div>
            <div
              onClick={() => setShowCreatePopup(true)}
              className={`${styles.hexCell} ${styles.addNode}`}
              style={{ "--delay": "0.14s" } as React.CSSProperties}
            >
              <svg viewBox="0 0 468 540" className={styles.hexBg}>
                <path d={HEX_PATH} fill="#D4D8DC" />
              </svg>
              <div className={styles.hexContent}>
                <svg className={styles.plusIcon} viewBox="0 0 24 24" fill="none">
                  <line x1="12" y1="5" x2="12" y2="19" stroke="#9BA3AB" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="5" y1="12" x2="19" y2="12" stroke="#9BA3AB" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom offset row */}
          {botRow.length > 0 && (
            <div className={`${styles.hexRow} ${styles.offsetRow}`}>
              {botRow.map((node, i) => (
                <NodeHex key={node.id} node={node} delay={`${0.06 + i * 0.04}s`} clusterConnectionInfo={clusterConnectionInfo} clusterID={clusterID} />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateNodePopup
        isOpen={showCreatePopup || activeSheet === "createNode"}
        onClose={() => { setShowCreatePopup(false); setActiveSheet(null); }}
      />

      {activeSheet === "addKnowledge" && (
        <div className={styles.sheetOverlay} onClick={() => setActiveSheet(null)}>
          <div className={styles.sheetPlaceholder} onClick={(e) => e.stopPropagation()}>
            <h2>Add Knowledge</h2>
            <p>Knowledge creation coming soon.</p>
            <button onClick={() => setActiveSheet(null)}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Cluster;
