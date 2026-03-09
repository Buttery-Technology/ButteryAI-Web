import { useState } from "react";
import type { WorkflowStepResponse, UpdateStepRequest } from "../../../../types/workflow";
import styles from "../StepConfigPanel.module.scss";

interface Props {
  step: WorkflowStepResponse;
  onUpdate: (data: UpdateStepRequest) => Promise<void>;
}

export const ApiCallConfig = ({ step, onUpdate }: Props) => {
  const config = (step.configuration ?? {}) as Record<string, unknown>;
  const [url, setUrl] = useState((config.url as string) ?? "");
  const [method, setMethod] = useState((config.method as string) ?? "GET");
  const [body, setBody] = useState((config.body as string) ?? "");

  const save = async () => {
    await onUpdate({
      configuration: { ...config, url, method, body },
    });
  };

  return (
    <>
      <div className={styles.field}>
        <label className={styles.label}>Method</label>
        <select className={styles.input} value={method} onChange={(e) => setMethod(e.target.value)} onBlur={save}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>URL</label>
        <input
          className={styles.input}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={save}
          placeholder="https://api.example.com/endpoint"
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Body (JSON)</label>
        <textarea
          className={styles.textarea}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onBlur={save}
          rows={4}
          placeholder="{}"
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
