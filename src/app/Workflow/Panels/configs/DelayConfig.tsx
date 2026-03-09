import { useState } from "react";
import type { WorkflowStepResponse, UpdateStepRequest } from "../../../../types/workflow";
import styles from "../StepConfigPanel.module.scss";

interface Props {
  step: WorkflowStepResponse;
  onUpdate: (data: UpdateStepRequest) => Promise<void>;
}

export const DelayConfig = ({ step, onUpdate }: Props) => {
  const config = (step.configuration ?? {}) as Record<string, unknown>;
  const [duration, setDuration] = useState((config.durationSeconds as number) ?? 0);

  return (
    <div className={styles.field}>
      <label className={styles.label}>Duration (seconds)</label>
      <input
        className={styles.input}
        type="number"
        min="0"
        value={duration}
        onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
        onBlur={async () => {
          await onUpdate({
            configuration: { ...config, durationSeconds: duration },
          });
        }}
      />
    </div>
  );
};
