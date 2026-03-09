import { nodeRegistry, stepTypes } from "../nodes/nodeRegistry";
import type { WorkflowStepType } from "../../../../types/workflow";
import styles from "./CanvasToolbar.module.scss";

interface Props {
  onExecute?: () => void;
}

export const CanvasToolbar = ({ onExecute }: Props) => {
  const onDragStart = (e: React.DragEvent, stepType: WorkflowStepType) => {
    e.dataTransfer.setData("application/workflow-step-type", stepType);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Steps</span>
        <div className={styles.stepList}>
          {stepTypes.map((type) => {
            const meta = nodeRegistry[type];
            return (
              <div
                key={type}
                className={styles.stepItem}
                draggable
                onDragStart={(e) => onDragStart(e, type)}
              >
                <div className={styles.stepIcon} style={{ backgroundColor: meta.color }}>
                  {meta.icon}
                </div>
                <span>{meta.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      {onExecute && (
        <button className={styles.executeBtn} onClick={onExecute}>
          Run
        </button>
      )}
    </div>
  );
};
