import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAPIKeys } from "@hooks";
import { SummaryCards } from "@common";
import { BUTTERY_API_URL } from "../../../api";
import { useNodeKnowledge } from "../../../hooks/useNodeKnowledge";
import type { NetworkInfo, APIKeyRole, SummaryCard, NodeAction, NodeResponse, NodeAIModel, NodeExtension } from "../../../types/api";
import ModelDetailSheet from "./ModelDetailSheet";
import ExtensionDetailSheet from "./ExtensionDetailSheet";
import KnowledgeWizard from "./KnowledgeWizard";
import Power from "@assets/icons/power.svg?react";
import Diagnostics from "@assets/icons/diagnostics.svg?react";
import Share from "@assets/icons/share.svg?react";
import styles from "./Settings.module.scss";

const actionIconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  power: Power,
  diagnostics: Diagnostics,
  share: Share,
};

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
  aiModel?: NodeAIModel | null;
  nodeExtension?: NodeExtension | null;
  isLoadingDetail?: boolean;
  onRefetch?: () => void;
}

const EXPIRATION_OPTIONS = [
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "1 year", value: 365 },
  { label: "Never", value: null },
] as const;

const Settings = ({ node, clusterConnectionInfo, clusterID, valueCards = [], trustCards = [], actions = [], aiModel, nodeExtension, isLoadingDetail, onRefetch }: Props) => {
  const navigate = useNavigate();
  const { keys, newKey, fetchKeys, createKey, clearNewKey } = useAPIKeys();
  const [activeSheet, setActiveSheet] = useState<string | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState<NodeAction | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [modelSheetOpen, setModelSheetOpen] = useState(false);
  const [extensionSheetOpen, setExtensionSheetOpen] = useState(false);

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


  // Knowledge
  const nodeId = node?.id;
  const { items: knowledge, isLoading: knowledgeLoading, error: knowledgeError, fetchKnowledge, addKnowledge, removeKnowledge } = useNodeKnowledge(nodeId);

  const [showKnowledgeWizard, setShowKnowledgeWizard] = useState(false);

  useEffect(() => {
    if (nodeId) fetchKnowledge();
  }, [nodeId, fetchKnowledge]);

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

  const handleKnowledgeSubmit = useCallback(async (
    files: { file: File; name: string; description: string; dataType: string }[],
  ): Promise<boolean> => {
    let allSucceeded = true;
    for (const entry of files) {
      const base64 = await fileToBase64(entry.file);
      const success = await addKnowledge({
        name: entry.name,
        description: entry.description,
        underlyingDataType: entry.dataType,
        underlyingData: base64,
      });
      if (!success) allSucceeded = false;
    }
    return allSucceeded;
  }, [addKnowledge]);

  return (
    <section className={styles.root}>
      {/* AI Model section */}
      <div className={styles.section}>
        <strong>AI Model</strong>
        <p>The AI model and extension this node uses for inference.</p>
        <div className={styles.modelGrid}>
          {aiModel ? (
            <div className={styles.modelCard} onClick={() => setModelSheetOpen(true)}>
              <h2>{aiModel.owner}</h2>
              <h3>{aiModel.name}</h3>
              <p>{aiModel.functionMode === "remote" ? "Remote" : "Local"}</p>
            </div>
          ) : isLoadingDetail ? (
            <div className={styles.modelCard}>
              <h2>Loading...</h2>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span>No model configured</span>
              <p>Set up an AI model extension to get started.</p>
            </div>
          )}
          {nodeExtension ? (
            <div className={styles.modelCard} onClick={() => setExtensionSheetOpen(true)}>
              <h2>Extension</h2>
              <h3>{nodeExtension.name}</h3>
              <p>{nodeExtension.description}</p>
            </div>
          ) : !isLoadingDetail && !aiModel && null}
        </div>
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
            aria-label="Add knowledge"
            onClick={() => setShowKnowledgeWizard(true)}
          />
        </div>

        {valueCards.length > 0 && <SummaryCards cards={valueCards} isLoading={isLoadingDetail} />}

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

      {/* Model detail sheet */}
      {modelSheetOpen && aiModel && node?.id && (
        <ModelDetailSheet
          model={aiModel}
          nodeId={node.id}
          onClose={() => setModelSheetOpen(false)}
          onSaved={() => onRefetch?.()}
        />
      )}

      {/* Extension detail sheet */}
      {extensionSheetOpen && nodeExtension && node?.id && (
        <ExtensionDetailSheet
          extension={nodeExtension}
          nodeId={node.id}
          onClose={() => setExtensionSheetOpen(false)}
          onSaved={() => onRefetch?.()}
        />
      )}

      {/* Knowledge wizard */}
      {showKnowledgeWizard && (
        <KnowledgeWizard
          onClose={() => setShowKnowledgeWizard(false)}
          onSubmit={handleKnowledgeSubmit}
        />
      )}
    </section>
  );
};

export default Settings;
