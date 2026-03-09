import { useState } from "react";
import type { WorkflowStepResponse, UpdateStepRequest } from "../../../../types/workflow";
import styles from "../StepConfigPanel.module.scss";

interface Props {
  step: WorkflowStepResponse;
  onUpdate: (data: UpdateStepRequest) => Promise<void>;
}

export const ConditionalConfig = ({ step, onUpdate }: Props) => {
  const [condition, setCondition] = useState(step.condition ?? "");

  return (
    <>
      <div className={styles.field}>
        <label className={styles.label}>Condition Expression</label>
        <textarea
          className={styles.textarea}
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          onBlur={async () => {
            if (condition !== step.condition) {
              await onUpdate({ condition });
            }
          }}
          rows={3}
          placeholder='e.g. output.score > 0.8'
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Continue on Error</label>
        <select
          className={styles.input}
          value={step.continueOnError ? "yes" : "no"}
          onChange={async (e) => {
            await onUpdate({ continueOnError: e.target.value === "yes" });
          }}
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>
    </>
  );
};
