import { useState } from "react";
import type { WorkflowStepResponse, CreateStepRequest, UpdateStepRequest } from "../../../types/workflow";
import { nodeRegistry } from "../Canvas/nodes/nodeRegistry";
import styles from "./WorkflowList.module.scss";

interface Props {
  steps: WorkflowStepResponse[];
  addStep: (data: CreateStepRequest) => Promise<string | null>;
  updateStep: (stepID: string, data: UpdateStepRequest) => Promise<boolean>;
  deleteStep: (stepID: string) => Promise<boolean>;
  isLoading: boolean;
}

export const WorkflowList = ({ steps, addStep, updateStep, deleteStep, isLoading }: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const sorted = [...steps].sort((a, b) => a.order - b.order);

  const handleAdd = async () => {
    await addStep({
      name: "New Step",
      stepType: "promptExecution",
      order: (sorted[sorted.length - 1]?.order ?? 0) + 1,
    });
  };

  const handleStartEdit = (step: WorkflowStepResponse) => {
    setEditingId(step.id);
    setEditName(step.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (editName.trim()) {
      await updateStep(id, { name: editName.trim() });
    }
    setEditingId(null);
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>Steps ({sorted.length})</h2>
        <button className={styles.addBtn} onClick={handleAdd}>+ Add Step</button>
      </div>
      {sorted.length === 0 ? (
        <p className={styles.empty}>No steps yet. Add one to get started.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Type</th>
              <th>Retries</th>
              <th>Timeout</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((step) => {
              const meta = nodeRegistry[step.stepType];
              return (
                <tr key={step.id}>
                  <td className={styles.order}>{step.order}</td>
                  <td>
                    {editingId === step.id ? (
                      <input
                        className={styles.editInput}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => handleSaveEdit(step.id)}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(step.id)}
                        autoFocus
                      />
                    ) : (
                      <span className={styles.name} onDoubleClick={() => handleStartEdit(step)}>
                        {step.name}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={styles.typeBadge} style={{ backgroundColor: meta?.color ?? "#6b7280" }}>
                      {meta?.label ?? step.stepType}
                    </span>
                  </td>
                  <td className={styles.numeric}>{step.maxRetries}</td>
                  <td className={styles.numeric}>{step.timeoutSeconds ? `${step.timeoutSeconds}s` : "\u2014"}</td>
                  <td>
                    <button className={styles.deleteRowBtn} onClick={() => deleteStep(step.id)} aria-label="Delete">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
