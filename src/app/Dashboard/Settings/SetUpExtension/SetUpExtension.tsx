import { useEffect, useState } from "react";
import type { ExtensionTemplate } from "../../../../types/api";
import { ExtensionLogo } from "../ExtensionLogo";
import ArrowLeft from "@assets/icons/arrow-left.svg?react";
import styles from "./SetUpExtension.module.scss";

interface SetUpExtensionProps {
  templates: ExtensionTemplate[];
  onSelect: (template: ExtensionTemplate) => void;
  onClose: () => void;
}

const SetUpExtension = ({ templates, onSelect, onClose }: SetUpExtensionProps) => {
  const [shiftHeld, setShiftHeld] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key === "Shift") setShiftHeld(true); };
    const up = (e: KeyboardEvent) => { if (e.key === "Shift") setShiftHeld(false); };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          <button
            className={styles.backButton}
            onClick={onClose}
            type="button"
            aria-label={shiftHeld ? "Close" : "Back"}
          >
            {shiftHeld ? <span className={styles.closeIcon}>&times;</span> : <ArrowLeft />}
          </button>
          Set up an extension
        </h1>
        <p className={styles.subtitle}>
          Find the option that best meets your needs and select continue. We're adding more and more options so check back for more.
        </p>

        <div className={styles.grid}>
          {templates.map((template) => (
            <div key={template.id} className={styles.card}>
              <ExtensionLogo logoUrl={template.logoUrl} size={36} />
              <span className={styles.provider}>{template.name}</span>
              <h2 className={styles.tagline}>{template.tagline}</h2>
              <p className={styles.description}>{template.description}</p>
              <button
                className={styles.continueButton}
                onClick={() => onSelect(template)}
                type="button"
              >
                Continue
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SetUpExtension;
