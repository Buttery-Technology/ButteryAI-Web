import type { WorkflowStepResponse, UpdateStepRequest } from "../../../../types/workflow";
import styles from "../StepConfigPanel.module.scss";

interface Props {
  step: WorkflowStepResponse;
  onUpdate: (data: UpdateStepRequest) => Promise<void>;
}

export const NodeSelectionConfig = ({ step, onUpdate }: Props) => {
  return (
    <>
      <div className={styles.field}>
        <label className={styles.label}>Node ID</label>
        <input
          className={styles.input}
          value={step.nodeID ?? ""}
          onChange={async (e) => {
            await onUpdate({ nodeID: e.target.value || undefined });
          }}
          placeholder="Select a node..."
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Max Retries</label>
        <input
          className={styles.input}
          type="number"
          min="0"
          value={step.maxRetries}
          onChange={async (e) => {
            await onUpdate({ maxRetries: parseInt(e.target.value) || 0 });
          }}
        />
      </div>
    </>
  );
};
