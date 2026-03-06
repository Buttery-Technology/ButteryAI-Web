import { useEffect, useState } from "react";
import type { ExtensionTemplate } from "../../../../types/api";
import { SAVE_USER_EXTENSION_CONFIG } from "../../../../api";
import { ExtensionLogo } from "../ExtensionLogo";
import ArrowLeft from "@assets/icons/arrow-left.svg?react";
import styles from "./SetUpExtensionForm.module.scss";

interface SetUpExtensionFormProps {
  template: ExtensionTemplate;
  onBack: () => void;
  onClose: () => void;
  onFinish: () => void;
}

const SetUpExtensionForm = ({ template, onBack, onClose, onFinish }: SetUpExtensionFormProps) => {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of template.fields) {
      initial[field.key] = "";
    }
    return initial;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [shiftHeld, setShiftHeld] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key === "Shift") setShiftHeld(true); };
    const up = (e: KeyboardEvent) => { if (e.key === "Shift") setShiftHeld(false); };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      const data: Record<string, string> = { provider: template.provider };
      for (const [key, value] of Object.entries(values)) {
        if (value) {
          data[key] = value;
        }
      }
      const { url, options } = SAVE_USER_EXTENSION_CONFIG(data as Parameters<typeof SAVE_USER_EXTENSION_CONFIG>[0]);
      await fetch(url, options);
      onFinish();
    } catch {
      // Allow retry on failure
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          <button
            className={styles.backButton}
            onClick={shiftHeld ? onClose : onBack}
            type="button"
            aria-label={shiftHeld ? "Close" : "Back"}
          >
            {shiftHeld ? <span className={styles.closeIcon}>&times;</span> : <ArrowLeft />}
          </button>
          Set up your extension
        </h1>
        <p className={styles.subtitle}>
          Customize this extension with important information and we'll do the rest.
        </p>

        <div className={styles.formContent}>
          <div className={styles.providerInfo}>
            <ExtensionLogo logoUrl={template.logoUrl} />
            <span className={styles.providerName}>{template.name}</span>
          </div>

          <div className={styles.form}>
            {template.fields.map((field) => (
              <div key={field.key} className={styles.fieldGroup}>
                <label className={field.isRequired ? styles.labelRequired : styles.label}>
                  {field.label}
                  {field.isRequired && <span className={styles.requiredStar}> *</span>}
                </label>
                <p className={styles.fieldDescription}>
                  {field.description}
                </p>
                <input
                  className={styles.input}
                  type="text"
                  placeholder={field.placeholder}
                  value={values[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  required={field.isRequired}
                />
              </div>
            ))}
          </div>

          <div className={styles.finishRow}>
            <button
              className={styles.finishButton}
              onClick={handleFinish}
              disabled={isSaving}
              type="button"
            >
              {isSaving ? "Saving..." : "Finish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetUpExtensionForm;
