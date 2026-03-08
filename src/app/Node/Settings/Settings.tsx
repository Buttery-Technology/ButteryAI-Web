import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAPIKeys } from "@hooks";
import { SummaryCards } from "@common";
import { BUTTERY_API_URL, GET_AI_MODELS } from "../../../api";
import { useNodeKnowledge } from "../../../hooks/useNodeKnowledge";
import type { NetworkInfo, APIKeyRole, SummaryCard, NodeAction, NodeResponse } from "../../../types/api";
import Power from "@assets/icons/power.svg?react";
import Diagnostics from "@assets/icons/diagnostics.svg?react";
import Share from "@assets/icons/share.svg?react";
import styles from "./Settings.module.scss";

const actionIconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  power: Power,
  diagnostics: Diagnostics,
  share: Share,
};

interface AIModel {
  id: string;
  name: string;
  description?: string;
}

const DATA_TYPE_LABELS: Record<string, string> = {
  document: "Document",
  image: "Image",
  audio: "Audio",
  video: "Video",
  file: "File",
  link: "Link",
};

interface Props {
  node?: NodeResponse | null;
  clusterConnectionInfo?: NetworkInfo;
  clusterID?: string;
  valueCards?: SummaryCard[];
  trustCards?: SummaryCard[];
  actions?: NodeAction[];
  isLoadingDetail?: boolean;
}

const EXPIRATION_OPTIONS = [
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "1 year", value: 365 },
  { label: "Never", value: null },
] as const;

const Settings = ({ node, clusterConnectionInfo, clusterID, valueCards = [], trustCards = [], actions = [], isLoadingDetail }: Props) => {
  const navigate = useNavigate();
  const { keys, newKey, fetchKeys, createKey, clearNewKey } = useAPIKeys();
  const [activeSheet, setActiveSheet] = useState<string | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState<NodeAction | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Action handlers
  const executeApiAction = useCallback(async (target: string) => {
    setActionLoading(true);
    try {
      await fetch(BUTTERY_API_URL + target, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // TODO: surface error to user
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleAction = useCallback((action: NodeAction) => {
    switch (action.actionType) {
      case "api":
        executeApiAction(action.actionTarget);
        break;
      case "navigate":
        navigate(action.actionTarget);
        break;
      case "sheet":
        setActiveSheet(action.actionTarget);
        break;
      case "external":
        window.open(action.actionTarget, "_blank");
        break;
      case "confirm":
        setPendingConfirm(action);
        break;
    }
  }, [navigate, executeApiAction]);

  const handleConfirm = useCallback(() => {
    if (!pendingConfirm) return;
    executeApiAction(pendingConfirm.actionTarget);
    setPendingConfirm(null);
  }, [pendingConfirm, executeApiAction]);

  // Connection / API keys
  const [showKeyForm, setShowKeyForm] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [keyExpiration, setKeyExpiration] = useState<number | null>(90);
  const [keyCopied, setKeyCopied] = useState(false);

  useEffect(() => {
    if (clusterID) fetchKeys(clusterID);
  }, [clusterID]);

  const endpoint = clusterConnectionInfo
    ? `${clusterConnectionInfo.ipAddress}:${clusterConnectionInfo.port}`
    : null;

  const handleGenerateKey = async (e: FormEvent) => {
    e.preventDefault();
    if (!keyName.trim() || !clusterID) return;
    const result = await createKey(keyName.trim(), clusterID, "basic" as APIKeyRole, keyExpiration);
    if (result) {
      setKeyName("");
      setKeyExpiration(90);
      setShowKeyForm(false);
    }
  };

  const handleCopyKey = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  const activeKey = keys.length > 0 ? keys[0] : null;

  // AI Models
  const [models, setModels] = useState<AIModel[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setModelsLoading(true);
      try {
        const { url, options } = GET_AI_MODELS();
        const res = await fetch(url, options);
        if (res.ok) {
          const data = await res.json();
          setModels(data.models ?? []);
        }
      } catch {
        // Non-blocking
      } finally {
        setModelsLoading(false);
      }
    })();
  }, []);

  // Knowledge
  const nodeId = node?.id;
  const { items: knowledge, isLoading: knowledgeLoading, error: knowledgeError, fetchKnowledge, addKnowledge, removeKnowledge } = useNodeKnowledge(nodeId);

  const [showUpload, setShowUpload] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (nodeId) fetchKnowledge();
  }, [nodeId, fetchKnowledge]);

  const inferDataType = (file: File): string => {
    const mime = file.type;
    if (mime.startsWith("image/")) return "image";
    if (mime.startsWith("audio/")) return "audio";
    if (mime.startsWith("video/")) return "video";
    if (mime === "application/pdf" || mime.includes("document") || mime.includes("text")) return "document";
    return "file";
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setUploadFile(file);
    if (file && !uploadName) {
      setUploadName(file.name.replace(/\.[^.]+$/, ""));
    }
  };

  const handleUploadSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadName.trim() || isUploading) return;

    setIsUploading(true);
    try {
      const base64 = await fileToBase64(uploadFile);
      const dataType = inferDataType(uploadFile);
      const success = await addKnowledge({
        name: uploadName.trim(),
        description: uploadDescription.trim(),
        underlyingDataType: dataType,
        underlyingData: base64,
      });
      if (success) {
        setUploadName("");
        setUploadDescription("");
        setUploadFile(null);
        setShowUpload(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } finally {
      setIsUploading(false);
    }
  }, [uploadFile, uploadName, uploadDescription, isUploading, addKnowledge]);

  return (
    <section className={styles.root}>
      {/* AI Model section */}
      <div className={styles.section}>
        <strong>AI Model</strong>
        <p>Select the AI model this node uses for inference.</p>
        {modelsLoading ? (
          <p className={styles.muted}>Loading models...</p>
        ) : models.length > 0 ? (
          <div className={styles.modelGrid}>
            {models.map((model) => (
              <div key={model.id} className={styles.modelCard}>
                <span className={styles.modelName}>{model.name}</span>
                {model.description && <span className={styles.modelDescription}>{model.description}</span>}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <span>No models available</span>
            <p>Set up an AI model extension to get started.</p>
          </div>
        )}
      </div>

      {/* Training section */}
      <div className={styles.section}>
        <strong>Training</strong>
        <p>Fine-tune the AI model with custom training data.</p>
        <div className={styles.comingSoon}>
          <span>Coming Soon</span>
          <p>Training allows you to fine-tune your node's model with your own data for better, more specialized responses.</p>
        </div>
      </div>

      {/* Knowledge section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <strong>Knowledge engine</strong>
            <p>Manage this node's knowledge base and see how it delivers value.</p>
          </div>
          <button
            className={styles.plusButton}
            type="button"
            aria-label={showUpload ? "Cancel" : "Add knowledge"}
            onClick={() => setShowUpload(!showUpload)}
          />
        </div>

        {valueCards.length > 0 && <SummaryCards cards={valueCards} isLoading={isLoadingDetail} />}

        {showUpload && (
          <form className={styles.uploadForm} onSubmit={handleUploadSubmit}>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <input
              type="text"
              placeholder="Name"
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              required
              className={styles.textInput}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
              className={styles.textInput}
            />
            <button
              type="submit"
              className={styles.uploadButton}
              disabled={!uploadFile || !uploadName.trim() || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </form>
        )}

        {knowledgeError && <p className={styles.error}>{knowledgeError}</p>}

        {knowledgeLoading ? (
          <p className={styles.muted}>Loading knowledge...</p>
        ) : knowledge.length > 0 ? (
          <ul className={styles.knowledgeList}>
            {knowledge.map((item) => (
              <li key={item.knowledgeID} className={styles.knowledgeItem}>
                <div className={styles.knowledgeInfo}>
                  <span className={styles.knowledgeName}>{item.name}</span>
                  <span className={styles.knowledgeMeta}>
                    {DATA_TYPE_LABELS[item.underlyingDataType] ?? item.underlyingDataType}
                    {item.categories.length > 0 && ` · ${item.categories.join(", ")}`}
                  </span>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => removeKnowledge(item.knowledgeID)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* Connection section */}
      {(endpoint || clusterID) && (
        <div className={styles.section}>
          <strong>Connection</strong>
          <p>Connect to this node using the endpoint and API key below.</p>

          {endpoint && (
            <div className={styles.connectionRow}>
              <span className={styles.connectionLabel}>Endpoint</span>
              <code className={styles.connectionValue}>{endpoint}</code>
            </div>
          )}

          {newKey ? (
            <div className={styles.newKeyDisplay}>
              <p className={styles.keyWarning}>Copy this key now. It will not be shown again.</p>
              <div className={styles.keyRow}>
                <code className={styles.keyCode}>{newKey.rawKey}</code>
                <button className={styles.copyButton} onClick={() => handleCopyKey(newKey.rawKey)}>
                  {keyCopied ? "Copied" : "Copy"}
                </button>
              </div>
              <button className={styles.dismissKeyButton} onClick={clearNewKey}>Dismiss</button>
            </div>
          ) : activeKey ? (
            <div className={styles.connectionRow}>
              <span className={styles.connectionLabel}>API Key</span>
              <code className={styles.connectionValue}>{activeKey.keyPrefix}•••••••••</code>
            </div>
          ) : showKeyForm ? (
            <form className={styles.keyForm} onSubmit={handleGenerateKey}>
              <input
                type="text"
                placeholder="Key name (e.g. CI Pipeline)"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                required
                className={styles.keyInput}
              />
              <select
                value={keyExpiration === null ? "never" : String(keyExpiration)}
                onChange={(e) => setKeyExpiration(e.target.value === "never" ? null : Number(e.target.value))}
                className={styles.keySelect}
              >
                {EXPIRATION_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.value === null ? "never" : opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button type="submit" className={styles.generateButton} disabled={!keyName.trim()}>Generate</button>
              <button type="button" className={styles.cancelButton} onClick={() => setShowKeyForm(false)}>Cancel</button>
            </form>
          ) : (
            <div className={styles.connectionRow}>
              <span className={styles.connectionLabel}>API Key</span>
              <button className={styles.generateApiKeyButton} onClick={() => setShowKeyForm(true)}>
                Generate API Key
              </button>
            </div>
          )}
        </div>
      )}

      {/* Trust engine */}
      {trustCards.length > 0 && (
        <div className={styles.section}>
          <strong>Trust engine</strong>
          <p>Trust, accuracy, and security metrics for this node.</p>
          <SummaryCards cards={trustCards} isLoading={isLoadingDetail} />
        </div>
      )}

      {/* Actions section */}
      {actions.length > 0 && (
        <div className={styles.section}>
          <strong>Actions</strong>
          <p>Manage and control this node.</p>
          <div className={styles.actions}>
            {[...actions].sort((a, b) => a.order - b.order).map((action) => {
              const Icon = actionIconMap[action.icon];
              return (
                <button
                  key={action.id}
                  className={`${styles.actionButton} ${action.isDestructive ? styles.destructive : ""}`}
                  onClick={() => handleAction(action)}
                  disabled={actionLoading}
                >
                  {Icon && <Icon />}
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation dialog */}
      {pendingConfirm && (
        <div className={styles.overlay} onClick={() => setPendingConfirm(null)}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h2>{pendingConfirm.label}</h2>
            <p>{pendingConfirm.confirmMessage}</p>
            <div className={styles.dialogActions}>
              <button className={styles.cancelButton} onClick={() => setPendingConfirm(null)}>Cancel</button>
              <button
                className={`${styles.confirmButton} ${pendingConfirm.isDestructive ? styles.destructive : ""}`}
                onClick={handleConfirm}
                disabled={actionLoading}
              >
                {actionLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sheet overlay */}
      {activeSheet && (
        <div className={styles.overlay} onClick={() => setActiveSheet(null)}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h2>{activeSheet === "shareNode" ? "Share Node" : activeSheet}</h2>
            <p>Coming soon.</p>
            <button className={styles.cancelButton} onClick={() => setActiveSheet(null)}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Settings;
