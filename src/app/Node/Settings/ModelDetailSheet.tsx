import { FormEvent, useEffect, useState } from "react";
import { UPDATE_NODE_AI_MODEL } from "../../../api";
import type { NodeAIModel } from "../../../types/api";
import Xmark from "@assets/icons/xmark.svg?react";
import styles from "./Settings.module.scss";

const QUERY_TYPE_LABELS: Record<string, string> = {
  text: "Text",
  image: "Image",
  audio: "Audio",
  video: "Video",
  file: "File",
  function: "Functions",
  tool_result: "Tool Results",
  thinking: "Thinking",
  all: "All",
  reference: "Reference",
  "search.web": "Web Search",
  "search.file": "File Search",
};

interface Props {
  model: NodeAIModel;
  nodeId: string;
  onClose: () => void;
  onSaved: () => void;
}

const ModelDetailSheet = ({ model, nodeId, onClose, onSaved }: Props) => {
  const [maxOutputTokens, setMaxOutputTokens] = useState(model.maxOutputTokens?.toString() ?? "");
  const [maxToolCalls, setMaxToolCalls] = useState(model.maxToolCalls?.toString() ?? "");
  const [baseEndpoint, setBaseEndpoint] = useState(model.baseEndpoint ?? "");
  const [headerUpdates, setHeaderUpdates] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleHeaderChange = (key: string, value: string) => {
    setHeaderUpdates((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = {};
    const tokens = parseInt(maxOutputTokens, 10);
    if (!isNaN(tokens) && tokens !== model.maxOutputTokens) payload.maxOutputTokens = tokens;
    const calls = parseInt(maxToolCalls, 10);
    if (!isNaN(calls) && calls !== model.maxToolCalls) payload.maxToolCalls = calls;
    if (model.functionMode === "remote" && baseEndpoint !== (model.baseEndpoint ?? "")) payload.baseEndpoint = baseEndpoint;

    const nonEmptyHeaders = Object.fromEntries(Object.entries(headerUpdates).filter(([, v]) => v.length > 0));
    if (Object.keys(nonEmptyHeaders).length > 0) payload.headers = nonEmptyHeaders;

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    try {
      const { url, options } = UPDATE_NODE_AI_MODEL(nodeId, payload);
      const res = await fetch(url, options);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "Failed to update model");
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const queryEntries = Object.entries(model.querySupport).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheetDialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.sheetHeader}>
          <button className={styles.sheetClose} onClick={onClose} type="button" aria-label="Close"><Xmark /></button>
          <h2 className={styles.sheetTitle}>{model.name}</h2>
        </div>
        <p className={styles.sheetSubtitle}>{model.owner}{model.family ? ` \u00B7 ${model.family}` : ""}</p>

        <form onSubmit={handleSave} className={styles.sheetForm}>
          {/* Status row */}
          <div className={styles.sheetRow}>
            <span className={styles.sheetLabel}>Mode</span>
            <span className={`${styles.badge} ${model.functionMode === "remote" ? styles.badgeBlue : styles.badgeGreen}`}>
              {model.functionMode === "remote" ? "Remote" : "Local"}
            </span>
          </div>

          {/* Query support */}
          {queryEntries.length > 0 && (
            <div className={styles.sheetRow}>
              <span className={styles.sheetLabel}>Capabilities</span>
              <div className={styles.badgeGroup}>
                {queryEntries.map(([type, supported]) => (
                  <span key={type} className={`${styles.badge} ${supported ? styles.badgeGreen : styles.badgeMuted}`}>
                    {QUERY_TYPE_LABELS[type] ?? type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Editable fields */}
          <div className={styles.sheetField}>
            <label className={styles.sheetLabel}>Max output tokens</label>
            <input
              type="number"
              value={maxOutputTokens}
              onChange={(e) => setMaxOutputTokens(e.target.value)}
              placeholder="Default"
              className={styles.sheetInput}
            />
          </div>

          <div className={styles.sheetField}>
            <label className={styles.sheetLabel}>Max tool calls</label>
            <input
              type="number"
              value={maxToolCalls}
              onChange={(e) => setMaxToolCalls(e.target.value)}
              placeholder="Default"
              className={styles.sheetInput}
            />
          </div>

          {model.functionMode === "remote" && (
            <>
              <div className={styles.sheetField}>
                <label className={styles.sheetLabel}>Base endpoint</label>
                <input
                  type="url"
                  value={baseEndpoint}
                  onChange={(e) => setBaseEndpoint(e.target.value)}
                  placeholder="https://api.example.com/v1"
                  className={styles.sheetInput}
                />
              </div>

              {model.headerKeys.length > 0 && (
                <div className={styles.sheetField}>
                  <label className={styles.sheetLabel}>Headers</label>
                  <p className={styles.sheetHint}>Values are write-only. Enter a new value to update.</p>
                  {model.headerKeys.map((key) => (
                    <div key={key} className={styles.headerRow}>
                      <span className={styles.headerKey}>{key}</span>
                      <input
                        type="password"
                        value={headerUpdates[key] ?? ""}
                        onChange={(e) => handleHeaderChange(key, e.target.value)}
                        placeholder="Configured"
                        className={styles.sheetInput}
                        autoComplete="off"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

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

export default ModelDetailSheet;
