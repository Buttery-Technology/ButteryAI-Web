import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Xmark from "@assets/icons/xmark.svg?react";
import styles from "./KnowledgeWizard.module.scss";

const DATA_TYPE_LABELS: Record<string, string> = {
  document: "Document",
  image: "Image",
  audio: "Audio",
  video: "Video",
  file: "File",
  link: "Link",
};

interface FileEntry {
  file: File;
  name: string;
  dataType: string;
}

interface Props {
  onClose: () => void;
  onSubmit: (
    files: { file: File; name: string; description: string; dataType: string }[],
  ) => Promise<boolean>;
}

type Step = "intro" | "upload" | "use-case" | "confirm";

const STEPS: Step[] = ["intro", "upload", "use-case", "confirm"];

const inferDataType = (file: File): string => {
  const mime = file.type;
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("video/")) return "video";
  if (mime === "application/pdf" || mime.includes("document") || mime.includes("text")) return "document";
  return "file";
};

const KnowledgeWizard = ({ onClose, onSubmit }: Props) => {
  const [step, setStep] = useState<Step>("intro");
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [useCase, setUseCase] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parseResults, setParseResults] = useState<{ name: string; relevant: boolean; reason: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stepIndex = STEPS.indexOf(step);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleFilesSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    const entries: FileEntry[] = Array.from(selected).map((f) => ({
      file: f,
      name: f.name.replace(/\.[^.]+$/, ""),
      dataType: inferDataType(f),
    }));
    setFiles((prev) => [...prev, ...entries]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFileName = (index: number, name: string) => {
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, name } : f)));
  };

  const handleParseFiles = useCallback(async () => {
    setIsParsing(true);
    // Simulate parsing for relevancy — in the future this could call an API
    await new Promise((r) => setTimeout(r, 1200));
    const results = files.map((f) => ({
      name: f.name,
      relevant: true,
      reason: `File appears to be a valid ${DATA_TYPE_LABELS[f.dataType]?.toLowerCase() ?? "file"} for the described use case.`,
    }));
    setParseResults(results);
    setIsParsing(false);
  }, [files]);

  const canAdvance = useMemo(() => {
    switch (step) {
      case "intro":
        return true;
      case "upload":
        return files.length > 0;
      case "use-case":
        return useCase.trim().length > 0;
      case "confirm":
        return parseResults.length > 0 && !isSubmitting;
    }
  }, [step, files, useCase, parseResults, isSubmitting]);

  const goNext = useCallback(async () => {
    const idx = STEPS.indexOf(step);
    if (step === "use-case") {
      setStep("confirm");
      handleParseFiles();
    } else if (step === "confirm") {
      setIsSubmitting(true);
      const success = await onSubmit(
        files.map((f) => ({
          file: f.file,
          name: f.name,
          description: useCase.trim(),
          dataType: f.dataType,
        })),
      );
      setIsSubmitting(false);
      if (success) onClose();
    } else if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1]);
    }
  }, [step, files, useCase, handleParseFiles, onSubmit, onClose]);

  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <button className={styles.closeButton} onClick={onClose} type="button" aria-label="Close">
            <Xmark />
          </button>
          <h2 className={styles.title}>Add Knowledge</h2>
        </div>

        {/* Progress */}
        <div className={styles.progress}>
          {STEPS.map((s, i) => (
            <div key={s} className={`${styles.progressDot} ${i <= stepIndex ? styles.active : ""}`} />
          ))}
        </div>

        {/* Step content */}
        <div className={styles.content}>
          {step === "intro" && (
            <div className={styles.introStep}>
              <h3>Enhance your node with knowledge</h3>
              <p>
                Knowledge files give your node context about your domain, products, processes, or any
                information you want it to understand. This helps your node provide more accurate and
                relevant responses.
              </p>
              <p>
                You can upload documents, images, audio, and other files. We'll analyze them for
                relevancy and add them to your node's knowledge base.
              </p>
            </div>
          )}

          {step === "upload" && (
            <div className={styles.uploadStep}>
              <h3>Upload your files</h3>
              <p>Select one or more files to add to this node's knowledge base.</p>

              <button
                type="button"
                className={styles.selectFilesButton}
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFilesSelected}
                className={styles.hiddenInput}
              />

              {files.length > 0 && (
                <ul className={styles.fileList}>
                  {files.map((entry, i) => (
                    <li key={i} className={styles.fileItem}>
                      <div className={styles.fileInfo}>
                        <input
                          type="text"
                          value={entry.name}
                          onChange={(e) => updateFileName(i, e.target.value)}
                          className={styles.fileNameInput}
                        />
                        <span className={styles.fileMeta}>
                          {DATA_TYPE_LABELS[entry.dataType] ?? entry.dataType} &middot; {formatFileSize(entry.file.size)}
                        </span>
                      </div>
                      <button type="button" className={styles.removeFile} onClick={() => removeFile(i)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {step === "use-case" && (
            <div className={styles.useCaseStep}>
              <h3>What's the use case?</h3>
              <p>
                Describe how this knowledge will be used. This helps us understand the context and
                optimize how your node uses these files.
              </p>
              <textarea
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                placeholder="e.g. These are our product documentation files that the node should reference when answering customer questions..."
                className={styles.useCaseInput}
                rows={5}
              />
            </div>
          )}

          {step === "confirm" && (
            <div className={styles.confirmStep}>
              <h3>Review &amp; confirm</h3>
              {isParsing ? (
                <div className={styles.parsing}>
                  <div className={styles.spinner} />
                  <p>Analyzing files for relevancy...</p>
                </div>
              ) : (
                <>
                  <p>We analyzed your files. Review the results below and confirm to add them.</p>
                  <ul className={styles.resultList}>
                    {parseResults.map((result, i) => (
                      <li key={i} className={styles.resultItem}>
                        <div className={styles.resultHeader}>
                          <span className={`${styles.relevancyBadge} ${result.relevant ? styles.relevant : styles.notRelevant}`}>
                            {result.relevant ? "Relevant" : "Low relevancy"}
                          </span>
                          <span className={styles.resultName}>{result.name}</span>
                        </div>
                        <p className={styles.resultReason}>{result.reason}</p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          {stepIndex > 0 && (
            <button type="button" className={styles.backButton} onClick={goBack} disabled={isSubmitting}>
              Back
            </button>
          )}
          <button
            type="button"
            className={styles.nextButton}
            onClick={goNext}
            disabled={!canAdvance || isParsing}
          >
            {step === "confirm"
              ? isSubmitting
                ? "Adding..."
                : "Confirm & Add"
              : step === "use-case"
                ? "Analyze Files"
                : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeWizard;
