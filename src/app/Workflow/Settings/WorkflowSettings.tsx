import { useState, useEffect } from "react";
import type { WorkflowResponse, UpdateWorkflowRequest, WorkflowTriggerType, WorkflowStatus } from "../../../types/workflow";
import styles from "./WorkflowSettings.module.scss";

interface Props {
  workflow: WorkflowResponse | null;
  updateWorkflow: (data: UpdateWorkflowRequest) => Promise<boolean>;
  isLoading: boolean;
}

export const WorkflowSettings = ({ workflow, updateWorkflow, isLoading }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerType, setTriggerType] = useState<WorkflowTriggerType>("manual");
  const [status, setStatus] = useState<WorkflowStatus>("draft");
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (workflow) {
      setName(workflow.name);
      setDescription(workflow.description ?? "");
      setTriggerType(workflow.triggerType);
      setStatus(workflow.status);
      setIsEnabled(workflow.isEnabled);
    }
  }, [workflow]);

  const handleSave = async (field: string, value: unknown) => {
    await updateWorkflow({ [field]: value } as UpdateWorkflowRequest);
  };

  if (isLoading || !workflow) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Workflow Settings</h2>
      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Name</label>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => name !== workflow.name && handleSave("name", name)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => description !== workflow.description && handleSave("description", description)}
            rows={3}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Trigger Type</label>
          <select
            className={styles.input}
            value={triggerType}
            onChange={(e) => {
              const val = e.target.value as WorkflowTriggerType;
              setTriggerType(val);
              handleSave("triggerType", val);
            }}
          >
            <option value="manual">Manual</option>
            <option value="scheduled">Scheduled</option>
            <option value="eventBased">Event Based</option>
            <option value="apiCall">API Call</option>
            <option value="messageReceived">Message Received</option>
            <option value="queryReceived">Query Received</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <select
            className={styles.input}
            value={status}
            onChange={(e) => {
              const val = e.target.value as WorkflowStatus;
              setStatus(val);
              handleSave("status", val);
            }}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className={styles.toggleField}>
          <label className={styles.label}>Enabled</label>
          <button
            className={`${styles.toggle} ${isEnabled ? styles.on : ""}`}
            onClick={() => {
              setIsEnabled(!isEnabled);
              handleSave("isEnabled", !isEnabled);
            }}
          >
            <span className={styles.toggleKnob} />
          </button>
        </div>
        <div className={styles.info}>
          <span className={styles.infoLabel}>Version</span>
          <span>{workflow.version}</span>
        </div>
        <div className={styles.info}>
          <span className={styles.infoLabel}>Access</span>
          <span>{workflow.access}</span>
        </div>
        <div className={styles.info}>
          <span className={styles.infoLabel}>Steps</span>
          <span>{workflow.stepCount}</span>
        </div>
      </div>
    </div>
  );
};
