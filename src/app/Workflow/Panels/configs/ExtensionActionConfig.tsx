import { useEffect, useState } from "react";
import { GET_USER_EXTENSION_CONFIGS } from "../../../../api";
import type { WorkflowStepResponse, UpdateStepRequest } from "../../../../types/workflow";
import styles from "../StepConfigPanel.module.scss";

interface UserExtConfig {
  provider: string;
  apiKey?: string;
  organizationID?: string;
  projectID?: string;
  createdAt?: string;
}

interface Props {
  step: WorkflowStepResponse;
  onUpdate: (data: UpdateStepRequest) => Promise<void>;
}

const PROVIDER_LABELS: Record<string, string> = {
  slack: "Slack",
  sendgrid: "SendGrid",
  twilio: "Twilio",
  webhook: "Webhook",
  aws: "AWS",
  google: "Google Cloud",
  openai: "OpenAI",
  anthropic: "Anthropic",
  tensorpool: "TensorPool",
};

export const ExtensionActionConfig = ({ step, onUpdate }: Props) => {
  const config = (step.configuration ?? {}) as Record<string, unknown>;
  const [configs, setConfigs] = useState<UserExtConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState((config.extensionProvider as string) ?? "");
  const [actionType, setActionType] = useState((config.actionType as string) ?? "send");
  const [payload, setPayload] = useState((config.payload as string) ?? "");

  useEffect(() => {
    (async () => {
      try {
        const { url, options } = GET_USER_EXTENSION_CONFIGS();
        const res = await fetch(url, options);
        if (res.ok) {
          const data = await res.json();
          setConfigs(data.configs ?? []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async (overrides?: Record<string, unknown>) => {
    await onUpdate({
      configuration: { ...config, extensionProvider: provider, actionType, payload, ...overrides },
    });
  };

  const messagingProviders = configs.filter((c) =>
    ["slack", "sendgrid", "twilio", "webhook"].includes(c.provider)
  );

  return (
    <>
      <div className={styles.field}>
        <label className={styles.label}>Extension</label>
        {loading ? (
          <p style={{ color: "#94a3b8", fontSize: 13 }}>Loading extensions...</p>
        ) : messagingProviders.length === 0 ? (
          <p style={{ color: "#94a3b8", fontSize: 13 }}>
            No action extensions configured. Set up Slack, SendGrid, Twilio, or Webhook in Settings.
          </p>
        ) : (
          <select
            className={styles.input}
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value);
              save({ extensionProvider: e.target.value });
            }}
          >
            <option value="">Select an extension...</option>
            {messagingProviders.map((c) => (
              <option key={c.provider} value={c.provider}>
                {PROVIDER_LABELS[c.provider] ?? c.provider}
              </option>
            ))}
          </select>
        )}
      </div>

      {provider === "slack" && (
        <div className={styles.field}>
          <label className={styles.label}>Message template</label>
          <textarea
            className={styles.textarea}
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            onBlur={() => save()}
            rows={4}
            placeholder="Workflow completed: {{result}}"
          />
          <span style={{ color: "#94a3b8", fontSize: 11 }}>
            Use {"{{variable}}"} to reference step outputs
          </span>
        </div>
      )}

      {provider === "sendgrid" && (
        <>
          <div className={styles.field}>
            <label className={styles.label}>To email</label>
            <input
              className={styles.input}
              value={(config.toEmail as string) ?? ""}
              onChange={(e) => save({ toEmail: e.target.value })}
              placeholder="recipient@example.com"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Subject</label>
            <input
              className={styles.input}
              value={(config.subject as string) ?? ""}
              onChange={(e) => save({ subject: e.target.value })}
              placeholder="Workflow notification"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Body template</label>
            <textarea
              className={styles.textarea}
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              onBlur={() => save()}
              rows={4}
              placeholder="Your workflow has completed with result: {{result}}"
            />
          </div>
        </>
      )}

      {provider === "twilio" && (
        <>
          <div className={styles.field}>
            <label className={styles.label}>To number</label>
            <input
              className={styles.input}
              value={(config.toNumber as string) ?? ""}
              onChange={(e) => save({ toNumber: e.target.value })}
              placeholder="+15551234567"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Message template</label>
            <textarea
              className={styles.textarea}
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              onBlur={() => save()}
              rows={3}
              placeholder="Alert: {{result}}"
            />
          </div>
        </>
      )}

      {provider === "webhook" && (
        <>
          <div className={styles.field}>
            <label className={styles.label}>HTTP method</label>
            <select
              className={styles.input}
              value={actionType}
              onChange={(e) => {
                setActionType(e.target.value);
                save({ actionType: e.target.value });
              }}
            >
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Payload template (JSON)</label>
            <textarea
              className={styles.textarea}
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              onBlur={() => save()}
              rows={4}
              placeholder={'{"event": "workflow_complete", "data": "{{result}}"}'}
            />
          </div>
        </>
      )}

      <div className={styles.field}>
        <label className={styles.label}>Continue on error</label>
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
