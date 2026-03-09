import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import styles from "./Nodes.module.scss";

export type NodeStepNodeData = {
  label: string;
  stepId: string;
  nodeID?: string;
  description?: string;
};

export function NodeStepNode({ data, selected }: NodeProps<Node<NodeStepNodeData>>) {
  return (
    <div className={`${styles.nodeStepNode} ${selected ? styles.selected : ""}`}>
      <div className={styles.nodeStepCard}>
        <Handle type="target" position={Position.Left} className={styles.handle} />
        <div className={styles.nodeStepIcon}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.268 1.5a3.464 3.464 0 0 1 3.464 0l11.856 6.846a3.464 3.464 0 0 1 1.732 3l0 13.308a3.464 3.464 0 0 1-1.732 3L19.732 34.5a3.464 3.464 0 0 1-3.464 0L4.412 27.654a3.464 3.464 0 0 1-1.732-3V11.346a3.464 3.464 0 0 1 1.732-3L16.268 1.5Z" fill="#000" />
          </svg>
        </div>
        <div className={styles.nodeStepText}>
          <span className={styles.nodeStepName}>{data.label}</span>
          <span className={styles.nodeStepSubtitle}>AI agent</span>
        </div>
        <Handle type="source" position={Position.Right} className={styles.handle} />
      </div>
    </div>
  );
}
