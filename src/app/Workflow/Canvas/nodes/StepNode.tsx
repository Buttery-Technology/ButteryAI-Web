import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { WorkflowStepType } from "../../../../types/workflow";
import { nodeRegistry } from "./nodeRegistry";
import styles from "./Nodes.module.scss";

export type StepNodeData = {
  label: string;
  stepType: WorkflowStepType;
  stepId: string;
  description?: string;
};

export function StepNode({ data, selected }: NodeProps<Node<StepNodeData>>) {
  const meta = nodeRegistry[data.stepType];
  const SvgIcon = meta?.SvgIcon;

  return (
    <div className={`${styles.stepNode} ${selected ? styles.selected : ""}`}>
      <div className={styles.stepCard}>
        <Handle type="target" position={Position.Left} className={styles.handle} />
        {SvgIcon ? (
          <SvgIcon width="44" height="44" style={{ color: "#000" }} />
        ) : (
          <div className={styles.stepIcon} style={{ backgroundColor: meta?.color ?? "#6b7280" }}>
            {meta?.icon ?? "?"}
          </div>
        )}
        <Handle type="source" position={Position.Right} className={styles.handle} />
      </div>
      <span className={styles.stepLabel}>{data.label}</span>
    </div>
  );
}
