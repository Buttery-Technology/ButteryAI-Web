import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { GET_AI_MODELS } from "../../../api";
import { useNodeKnowledge } from "../../../hooks/useNodeKnowledge";
import type { NodeResponse } from "../../../types/api";
import styles from "./Customize.module.scss";

interface Props {
  node: NodeResponse | null;
}

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

const Customize = ({ node }: Props) => {
  const nodeId = node?.id;
  const { items: knowledge, isLoading: knowledgeLoading, error: knowledgeError, fetchKnowledge, addKnowledge, removeKnowledge } = useNodeKnowledge(nodeId);

  // AI Models
  const [models, setModels] = useState<AIModel[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);

  // Upload form
  const [showUpload, setShowUpload] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (nodeId) fetchKnowledge();
  }, [nodeId, fetchKnowledge]);

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
        // Strip the data URL prefix (e.g. "data:application/pdf;base64,")
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
          <p className={styles.muted}>No models available. Set up an AI model extension first.</p>
        )}
      </div>

      {/* Knowledge section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <strong>Knowledge</strong>
            <p>Upload documents, images, or files to improve this node's responses.</p>
          </div>
          <button className={styles.addButton} onClick={() => setShowUpload(!showUpload)}>
            {showUpload ? "Cancel" : "Add Knowledge"}
          </button>
        </div>

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
        ) : !showUpload ? (
          <p className={styles.muted}>No knowledge added yet. Upload files to improve this node's responses.</p>
        ) : null}
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
    </section>
  );
};

export { Customize };
export default Customize;
