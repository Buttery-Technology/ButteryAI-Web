import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { nodeRegistry } from "./nodeRegistry";
import styles from "./Nodes.module.scss";

export type ConditionalNodeData = {
  label: string;
  stepId: string;
  condition?: string;
};

export function ConditionalNode({ data, selected }: NodeProps<Node<ConditionalNodeData>>) {
  const meta = nodeRegistry["conditional"];
  const SvgIcon = meta?.SvgIcon;

  return (
    <div className={`${styles.conditionalNode} ${selected ? styles.selected : ""}`}>
      <div className={styles.stepCard}>
        <Handle type="target" position={Position.Left} className={styles.handle} />
        {SvgIcon ? (
          <SvgIcon width="44" height="44" style={{ color: "#000" }} />
        ) : (
          <div className={styles.stepIcon} style={{ backgroundColor: meta?.color ?? "#f59e0b" }}>?</div>
        )}
        <Handle
          type="source"
          position={Position.Right}
          id="true"
          className={styles.handleTrue}
          style={{ top: "35%" }}
        >
          <span className={styles.handleLabel}>t</span>
        </Handle>
        <Handle
          type="source"
          position={Position.Right}
          id="false"
          className={styles.handleFalse}
          style={{ top: "65%" }}
        >
          <span className={styles.handleLabel}>f</span>
        </Handle>
      </div>
      <span className={styles.stepLabel}>{data.label}</span>
    </div>
  );
}
