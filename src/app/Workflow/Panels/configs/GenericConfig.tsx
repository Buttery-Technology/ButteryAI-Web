import { useState } from "react";
import type { WorkflowStepResponse, UpdateStepRequest } from "../../../../types/workflow";
import styles from "../StepConfigPanel.module.scss";

interface Props {
  step: WorkflowStepResponse;
  onUpdate: (data: UpdateStepRequest) => Promise<void>;
}

// Keys managed programmatically that shouldn't appear in the raw JSON editor
const MANAGED_KEYS = ["conditionBranch"];

function filterManaged(config: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  if (!config) return undefined;
  const filtered = Object.fromEntries(
    Object.entries(config).filter(([k]) => !MANAGED_KEYS.includes(k))
  );
  return Object.keys(filtered).length > 0 ? filtered : undefined;
}

export const GenericConfig = ({ step, onUpdate }: Props) => {
  const displayConfig = filterManaged(step.configuration);
  const [configJson, setConfigJson] = useState(
    displayConfig ? JSON.stringify(displayConfig, null, 2) : ""
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  const save = async () => {
    if (!configJson.trim()) {
      await onUpdate({ configuration: undefined });
      setJsonError(null);
      return;
    }
    try {
      const parsed = JSON.parse(configJson);
      // Preserve programmatically managed keys
      const managed = Object.fromEntries(
        Object.entries(step.configuration ?? {}).filter(([k]) => MANAGED_KEYS.includes(k))
      );
      await onUpdate({ configuration: { ...managed, ...parsed } });
      setJsonError(null);
    } catch {
      setJsonError("Invalid JSON");
    }
  };

  return (
    <>
      <div className={styles.field}>
        <label className={styles.label}>Configuration (JSON)</label>
        <textarea
          className={styles.textarea}
          value={configJson}
          onChange={(e) => setConfigJson(e.target.value)}
          onBlur={save}
          rows={6}
          placeholder="{}"
          style={jsonError ? { borderColor: "#ef4444" } : undefined}
        />
        {jsonError && <span style={{ color: "#ef4444", fontSize: 11 }}>{jsonError}</span>}
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
