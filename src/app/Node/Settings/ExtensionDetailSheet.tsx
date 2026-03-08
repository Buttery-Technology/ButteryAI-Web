import { FormEvent, useEffect, useState } from "react";
import { UPDATE_NODE_EXTENSION } from "../../../api";
import type { NodeExtension } from "../../../types/api";
import Xmark from "@assets/icons/xmark.svg?react";
import CheckmarkCircle from "@assets/icons/checkmark-circle.svg?react";
import styles from "./Settings.module.scss";

const FUNCTION_TYPE_LABELS: Record<string, string> = {
  aiModel: "AI Model",
  all: "All",
  storage: "Storage",
  analytics: "Analytics",
  advancedMetrics: "Advanced Metrics",
  mcp: "MCP",
};

const CRUD_LABELS: Record<string, string> = {
  create: "Create",
  read: "Read",
  update: "Update",
  delete: "Delete",
};

interface Props {
  extension: NodeExtension;
  nodeId: string;
  onClose: () => void;
  onSaved: () => void;
}

const ExtensionDetailSheet = ({ extension: ext, nodeId, onClose, onSaved }: Props) => {
  const mainFunc = ext.mainFunction;
  const [endpoint, setEndpoint] = useState(mainFunc?.endpoint ?? "");
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = {};
    if (endpoint !== (mainFunc?.endpoint ?? "")) payload.mainFunctionEndpoint = endpoint;
    if (apiKey.length > 0) payload.mainFunctionApiKey = apiKey;

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    try {
      const { url, options } = UPDATE_NODE_EXTENSION(nodeId, payload);
      const res = await fetch(url, options);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "Failed to update extension");
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheetDialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.sheetHeader}>
          <button className={styles.sheetClose} onClick={onClose} type="button" aria-label="Close"><Xmark /></button>
          <h2 className={styles.sheetTitle}>{ext.name}</h2>
        </div>
        <p className={styles.sheetSubtitle}>{ext.description}</p>

        <form onSubmit={handleSave} className={styles.sheetForm}>
          {/* Setup status */}
          <div className={styles.sheetRow}>
            <span className={styles.sheetLabel}>Status</span>
            <span className={`${styles.badge} ${ext.isFullySetUp ? styles.badgeGreen : styles.badgeYellow}`}>
              {ext.isFullySetUp ? "Set up" : "Setup incomplete"}
            </span>
          </div>

          {/* Main function info */}
          {mainFunc && (
            <>
              <div className={styles.sheetRow}>
                <span className={styles.sheetLabel}>Type</span>
                <span className={styles.badge}>
                  {FUNCTION_TYPE_LABELS[mainFunc.type] ?? mainFunc.type}
                </span>
              </div>

              <div className={styles.sheetRow}>
                <span className={styles.sheetLabel}>API key</span>
                {mainFunc.hasApiKey ? (
                  <span className={styles.checkmarkStatus}><CheckmarkCircle /> Configured</span>
                ) : (
                  <span className={`${styles.badge} ${styles.badgeYellow}`}>Not set</span>
                )}
              </div>

              {mainFunc.supportedCRUDTypes.length > 0 && (
                <div className={styles.sheetRow}>
                  <span className={styles.sheetLabel}>Operations</span>
                  <div className={styles.badgeGroup}>
                    {mainFunc.supportedCRUDTypes.map((type) => (
                      <span key={type} className={`${styles.badge} ${styles.badgeBlue}`}>
                        {CRUD_LABELS[type] ?? type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Supported functions */}
          {ext.supportedFunctions.length > 0 && (
            <div className={styles.sheetField}>
              <label className={styles.sheetLabel}>Additional functions</label>
              {ext.supportedFunctions.map((func, i) => (
                <div key={i} className={styles.functionRow}>
                  <span className={`${styles.badge} ${styles.badgeBlue}`}>
                    {FUNCTION_TYPE_LABELS[func.type] ?? func.type}
                  </span>
                  <code className={styles.connectionValue}>{func.endpoint || "No endpoint"}</code>
                  <span className={`${styles.badge} ${func.hasApiKey ? styles.badgeGreen : styles.badgeMuted}`}>
                    {func.hasApiKey ? "Key set" : "No key"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Editable fields */}
          <div className={styles.sheetField}>
            <label className={styles.sheetLabel}>Endpoint</label>
            <input
              type="url"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="https://api.example.com"
              className={styles.sheetInput}
            />
          </div>

          <div className={styles.sheetField}>
            <label className={styles.sheetLabel}>API key</label>
            <p className={styles.sheetHint}>Write-only. Enter a new key to update. Leave blank to keep current.</p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={mainFunc?.hasApiKey ? "Configured \u2014 enter new value to update" : "Enter API key"}
              className={styles.sheetInput}
              autoComplete="off"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.sheetActions}>
            <button type="submit" className={styles.saveButton} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExtensionDetailSheet;
