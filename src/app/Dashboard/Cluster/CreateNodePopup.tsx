import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CREATE_NODE,
  GET_CLUSTER,
  GET_AI_MODELS,
  GET_USER_EXTENSION_CONFIG,
  SAVE_USER_EXTENSION_CONFIG,
} from "../../../api";
import styles from "./CreateNodePopup.module.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type WizardStep = "compact" | "details" | "model" | "extension" | "knowledge";

interface AIModel {
  id: string;
  name: string;
  access: string;
  supportsAuditTrail: boolean;
  supportedInputs: string[];
  supportedOutputs: string[];
  averageRating: number;
  coinCost: number;
  priceCost: number;
}

interface ExtensionConfig {
  apiKey: string;
  organizationID: string;
  projectID: string;
  adminKey: string;
}

// Infer provider from model name
const inferProvider = (modelName: string): string => {
  const lower = modelName.toLowerCase();
  if (lower.includes("gpt") || lower.includes("openai") || lower.includes("dall")) return "openai";
  if (lower.includes("claude") || lower.includes("anthropic")) return "anthropic";
  if (lower.includes("llama") || lower.includes("meta")) return "meta";
  if (lower.includes("gemini") || lower.includes("google")) return "google";
  return "other";
};

const providerLabel = (provider: string): string => {
  const map: Record<string, string> = { openai: "OpenAI", anthropic: "Anthropic", meta: "Meta", google: "Google" };
  return map[provider] || provider;
};

const CreateNodePopup = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>("compact");
  const [name, setName] = useState("");
  const [functionality, setFunctionality] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Model picker state
  const [models, setModels] = useState<AIModel[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelSearch, setModelSearch] = useState("");
  const [_selectedModel, setSelectedModel] = useState<AIModel | null>(null);

  // Extension config state
  const [extensionConfig, setExtensionConfig] = useState<ExtensionConfig>({
    apiKey: "",
    organizationID: "",
    projectID: "",
    adminKey: "",
  });
  const [extensionProvider, setExtensionProvider] = useState("");
  const [extensionSaving, setExtensionSaving] = useState(false);

  // Knowledge state
  const [knowledgeFiles, setKnowledgeFiles] = useState<string[]>([]);
  const [knowledgeSearch, setKnowledgeSearch] = useState("");

  const popupRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && step === "compact") {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [isOpen, step]);

  useEffect(() => {
    if (!isOpen) {
      setStep("compact");
      setName("");
      setFunctionality("");
      setKeywords([]);
      setKeywordInput("");
      setError(null);
      setModels([]);
      setModelSearch("");
      setSelectedModel(null);
      setExtensionConfig({ apiKey: "", organizationID: "", projectID: "", adminKey: "" });
      setExtensionProvider("");
      setKnowledgeFiles([]);
      setKnowledgeSearch("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Fetch models when entering model step
  useEffect(() => {
    if (step === "model") {
      fetchModels();
    }
  }, [step]);

  const fetchModels = async (search?: string) => {
    setModelsLoading(true);
    try {
      const req = GET_AI_MODELS(search);
      const res = await fetch(req.url, req.options);
      if (res.ok) {
        const data = await res.json();
        setModels(data.models || []);
      }
    } catch {
      // Silently fail - will show empty state
    } finally {
      setModelsLoading(false);
    }
  };

  const handleModelSearchChange = (value: string) => {
    setModelSearch(value);
    fetchModels(value || undefined);
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = keywordInput.trim();
      if (value && !keywords.includes(value)) {
        setKeywords((prev) => [...prev, value]);
      }
      setKeywordInput("");
    } else if (e.key === "Backspace" && keywordInput === "" && keywords.length > 0) {
      setKeywords((prev) => prev.slice(0, -1));
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords((prev) => prev.filter((k) => k !== kw));
  };

  const handleCreate = async () => {
    setError(null);
    setIsCreating(true);
    try {
      const clusterReq = GET_CLUSTER();
      const clusterRes = await fetch(clusterReq.url, clusterReq.options);
      if (!clusterRes.ok) throw new Error("Could not load cluster.");
      const cluster = await clusterRes.json();
      const clusterID = cluster.clusterID;
      if (!clusterID) throw new Error("No cluster found.");

      const nodeReq = CREATE_NODE(name.trim() || "Unnamed Node", clusterID);
      const nodeRes = await fetch(nodeReq.url, nodeReq.options);
      if (!nodeRes.ok) {
        const body = await nodeRes.json().catch(() => null);
        throw new Error(body?.reason || "Failed to create node.");
      }
      const newNode = await nodeRes.json();
      onClose();
      navigate(`/node/${newNode.id}/overview`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleQuickSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleCreate();
  };

  // Extension: load existing config when opening
  const openExtensionForModel = async (model: AIModel) => {
    const provider = inferProvider(model.name);
    setSelectedModel(model);
    setExtensionProvider(provider);
    setExtensionConfig({ apiKey: "", organizationID: "", projectID: "", adminKey: "" });

    try {
      const req = GET_USER_EXTENSION_CONFIG(provider);
      const res = await fetch(req.url, req.options);
      if (res.ok) {
        const data = await res.json();
        setExtensionConfig({
          apiKey: data.apiKey || "",
          organizationID: data.organizationID || "",
          projectID: data.projectID || "",
          adminKey: data.adminKey || "",
        });
      }
    } catch {
      // No existing config - that's fine
    }

    setStep("extension");
  };

  const handleExtensionSave = async () => {
    setExtensionSaving(true);
    setError(null);
    try {
      const req = SAVE_USER_EXTENSION_CONFIG({
        provider: extensionProvider,
        apiKey: extensionConfig.apiKey || undefined,
        organizationID: extensionConfig.organizationID || undefined,
        projectID: extensionConfig.projectID || undefined,
        adminKey: extensionConfig.adminKey || undefined,
      });
      const res = await fetch(req.url, req.options);
      if (!res.ok) throw new Error("Failed to save extension config.");
      setStep("knowledge");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setExtensionSaving(false);
    }
  };

  const handleModelContinue = (model: AIModel) => {
    setSelectedModel(model);
    setStep("knowledge");
  };

  if (!isOpen) return null;

  const isExpanded = step !== "compact";

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div
        ref={popupRef}
        className={`${styles.popup} ${isExpanded ? styles.expanded : styles.compact}`}
      >
        {step === "compact" && (
          <div className={styles.compactInner}>
            <div className={styles.compactHeader}>
              <button className={styles.closeBtn} onClick={onClose}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#272d31" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
              <h2 className={styles.compactTitle}>Create node</h2>
              <button className={styles.expandBtn} onClick={() => setStep("details")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="#272d31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleQuickSubmit} className={styles.compactForm}>
              <div className={styles.compactInputWrapper}>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="What do you want to name your node?"
                  className={styles.compactInput}
                />
                <button
                  type="submit"
                  className={`${styles.compactSubmit} ${name.trim() ? styles.active : ""}`}
                  disabled={isCreating}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <p className={styles.compactHint}>
                This is a quick setup. You will be able to complete the setup later.
              </p>
            </form>
          </div>
        )}

        {step === "details" && (
          <div className={styles.expandedInner}>
            <div className={styles.expandedHeader}>
              <button className={styles.closeBtn} onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#637684" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
              <h1 className={styles.expandedTitle}>New AI Node</h1>
            </div>
            <div className={styles.expandedForm}>
              <div className={styles.fieldGroup}>
                <h3 className={styles.fieldLabel}>Give it a name</h3>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My AI Node"
                  className={styles.expandedInput}
                />
              </div>
              <div className={styles.fieldGroup}>
                <h3 className={styles.fieldLabel}>Tell us the main functionality goal of the AI</h3>
                <input
                  type="text"
                  value={functionality}
                  onChange={(e) => setFunctionality(e.target.value)}
                  placeholder="Conversational AI that generates questions based on a topic..."
                  className={styles.expandedInput}
                />
              </div>
              <div className={styles.fieldGroup}>
                <h3 className={styles.fieldLabel}>Functionality Keywords</h3>
                <div className={styles.keywordsInputWrapper}>
                  {keywords.map((kw) => (
                    <span key={kw} className={styles.keyword} onClick={() => removeKeyword(kw)}>
                      {kw}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={styles.keywordRemove}>
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleKeywordKeyDown}
                    placeholder={keywords.length === 0 ? "Type a keyword and press Enter..." : ""}
                    className={styles.keywordInput}
                  />
                </div>
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.expandedActions}>
                <button className={styles.skipBtn} onClick={handleCreate} disabled={isCreating}>
                  Skip &amp; Finish
                </button>
                <button className={styles.continueBtn} onClick={() => setStep("model")} disabled={isCreating}>
                  Continue Customizing
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "model" && (
          <div className={styles.expandedInner}>
            <div className={styles.expandedHeader}>
              <button className={styles.backBtn} onClick={() => setStep("details")}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="#637684" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <h1 className={styles.expandedTitle}>Select a model</h1>
            </div>
            <div className={styles.expandedForm}>
              <input
                type="text"
                value={modelSearch}
                onChange={(e) => handleModelSearchChange(e.target.value)}
                placeholder="Search for any public AI model..."
                className={styles.expandedInput}
              />
              {modelsLoading && <p className={styles.loadingText}>Loading models...</p>}
              {!modelsLoading && models.length === 0 && (
                <p className={styles.emptyText}>No models found. Models will appear here once they are added to the system.</p>
              )}
              <div className={styles.modelGrid}>
                {models.map((model) => {
                  const provider = inferProvider(model.name);
                  return (
                    <div key={model.id} className={styles.modelCard}>
                      <div className={styles.modelCardHeader}>
                        <span className={styles.modelProvider}>{providerLabel(provider)}</span>
                      </div>
                      <h3 className={styles.modelName}>{model.name}</h3>
                      <div className={styles.modelStats}>
                        <div className={styles.modelStat}>
                          <span className={styles.modelStatLabel}>Coin</span>
                          <span className={styles.modelStatValueGradient}>{model.coinCost}</span>
                        </div>
                        <div className={styles.modelStat}>
                          <span className={styles.modelStatLabel}>Value</span>
                          <span className={styles.modelStatValueYellow}>{Math.round(model.averageRating * 10)}</span>
                        </div>
                        <div className={styles.modelStat}>
                          <span className={styles.modelStatLabel}>Price</span>
                          <span className={styles.modelStatValue}>~ + {model.priceCost}</span>
                        </div>
                        <div className={styles.modelStat}>
                          <span className={styles.modelStatLabel}>Input</span>
                          <span className={styles.modelStatValue}>{model.supportedInputs.join(", ") || "—"}</span>
                        </div>
                        <div className={styles.modelStat}>
                          <span className={styles.modelStatLabel}>Output</span>
                          <span className={styles.modelStatValue}>{model.supportedOutputs.join(", ") || "—"}</span>
                        </div>
                        <div className={styles.modelStat}>
                          <span className={styles.modelStatLabel}>Audit</span>
                          <span className={model.supportsAuditTrail ? styles.modelStatValuePink : styles.modelStatValue}>
                            {model.supportsAuditTrail ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                      <div className={styles.modelCardActions}>
                        <button className={styles.modelCustomizeBtn} onClick={() => openExtensionForModel(model)}>
                          Customize
                        </button>
                        <button className={styles.modelContinueBtn} onClick={() => handleModelContinue(model)}>
                          Continue
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === "extension" && (
          <div className={styles.expandedInner}>
            <div className={styles.expandedHeader}>
              <button className={styles.backBtn} onClick={() => setStep("model")}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="#637684" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <h1 className={styles.expandedTitle}>Set up your extension</h1>
            </div>
            <p className={styles.extensionSubtitle}>
              Customize this extension with important information and we'll do the rest.
            </p>
            <div className={styles.expandedForm}>
              <div className={styles.extensionProviderHeader}>
                <span className={styles.extensionProviderName}>{providerLabel(extensionProvider)} Platform</span>
              </div>

              <div className={styles.extensionField}>
                <label className={styles.extensionLabel}>
                  API key <span className={styles.required}>*</span>
                </label>
                <p className={styles.extensionHint}>
                  This key will be used for API calls. This will use whatever permissions you have correlated with this API key. <em>This key is stored with encryption in a secure enclave.</em>
                </p>
                <input
                  type="text"
                  value={extensionConfig.apiKey}
                  onChange={(e) => setExtensionConfig((c) => ({ ...c, apiKey: e.target.value }))}
                  placeholder="sk-..."
                  className={styles.expandedInput}
                />
              </div>

              <div className={styles.extensionField}>
                <label className={styles.extensionLabel}>Organization ID</label>
                <p className={styles.extensionHint}>
                  If this API key is correlated with an organization, type the organization ID and we'll use in API calls. <em>This value is stored with encryption in a secure enclave.</em>
                </p>
                <input
                  type="text"
                  value={extensionConfig.organizationID}
                  onChange={(e) => setExtensionConfig((c) => ({ ...c, organizationID: e.target.value }))}
                  placeholder="org-..."
                  className={styles.expandedInput}
                />
              </div>

              <div className={styles.extensionField}>
                <label className={styles.extensionLabel}>Project ID</label>
                <p className={styles.extensionHint}>
                  If this API key is correlated with a specific project, type the project ID and we'll use in API calls. <em>This value is stored with encryption in a secure enclave.</em>
                </p>
                <input
                  type="text"
                  value={extensionConfig.projectID}
                  onChange={(e) => setExtensionConfig((c) => ({ ...c, projectID: e.target.value }))}
                  placeholder="proj-..."
                  className={styles.expandedInput}
                />
              </div>

              <div className={styles.extensionField}>
                <label className={styles.extensionLabel}>Admin key</label>
                <p className={styles.extensionHint}>
                  This key will be used for programmatic administration of your account. An example of this usage would be to update projects, billing, or other general administration. <em>This key is stored with encryption in a secure enclave.</em>
                </p>
                <input
                  type="text"
                  value={extensionConfig.adminKey}
                  onChange={(e) => setExtensionConfig((c) => ({ ...c, adminKey: e.target.value }))}
                  placeholder="sk-admin-..."
                  className={styles.expandedInput}
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <div className={styles.expandedActions}>
                <button className={styles.continueBtn} onClick={handleExtensionSave} disabled={extensionSaving}>
                  {extensionSaving ? "Saving..." : "Finish"}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "knowledge" && (
          <div className={styles.expandedInner}>
            <div className={styles.expandedHeader}>
              <button className={styles.backBtn} onClick={() => setStep("model")}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="#637684" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <h1 className={styles.expandedTitle}>Knowledge and Training</h1>
            </div>
            <p className={styles.knowledgeDescription}>
              Knowledge is used to help make the AI smarter and more accurate; this is just the starting point – over time ButteryIntelligence will automatically dynamically update the AI's knowledge, which you will be able to review. Training data is used to verify the AI for auditing and security, as well as also helping with keeping the AI accurate.
            </p>
            <div className={styles.expandedForm}>
              <input
                type="text"
                value={knowledgeSearch}
                onChange={(e) => setKnowledgeSearch(e.target.value)}
                placeholder="Search for public knowledge or training data..."
                className={styles.expandedInput}
              />

              {knowledgeFiles.map((file, i) => (
                <div key={i} className={styles.knowledgeFile}>
                  <div className={styles.knowledgeFileInfo}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#272d31" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="14,2 14,8 20,8" stroke="#272d31" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{file}</span>
                  </div>
                  <button
                    className={styles.knowledgeFileRemove}
                    onClick={() => setKnowledgeFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#ccc" strokeWidth="1.5" />
                      <path d="M15 9l-6 6M9 9l6 6" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}

              {error && <p className={styles.error}>{error}</p>}

              <div className={styles.expandedActions}>
                <button className={styles.continueBtn} onClick={handleCreate} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Continue"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateNodePopup;
