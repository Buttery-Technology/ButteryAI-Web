import { useState } from "react";
import type { WorkflowStepResponse, UpdateStepRequest } from "../../../../types/workflow";
import styles from "../StepConfigPanel.module.scss";

interface Props {
  step: WorkflowStepResponse;
  onUpdate: (data: UpdateStepRequest) => Promise<void>;
}

export const PromptExecutionConfig = ({ step, onUpdate }: Props) => {
  const config = (step.configuration ?? {}) as Record<string, unknown>;
  const [prompt, setPrompt] = useState((config.prompt as string) ?? "");
  const [temperature, setTemperature] = useState((config.temperature as number) ?? 0.7);

  const save = async () => {
    await onUpdate({
      configuration: { ...config, prompt, temperature },
    });
  };

  return (
    <>
      <div className={styles.field}>
        <label className={styles.label}>Prompt Template</label>
        <textarea
          className={styles.textarea}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onBlur={save}
          rows={4}
          placeholder="Enter prompt template..."
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Temperature ({temperature})</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          onMouseUp={save}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Timeout (seconds)</label>
        <input
          className={styles.input}
          type="number"
          value={step.timeoutSeconds ?? ""}
          onChange={async (e) => {
            const val = e.target.value ? parseInt(e.target.value) : undefined;
            await onUpdate({ timeoutSeconds: val });
          }}
          placeholder="No timeout"
        />
      </div>
    </>
  );
};
