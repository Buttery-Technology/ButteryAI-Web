import { type ChangeEvent, type FormEvent, type RefObject } from "react";
import { ReactComponent as Send } from "../../../../assets/icons/send.svg";
import styles from "./Form.module.scss";

type FormProps = {
  inputValue: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement | null>;
};

const Form = ({ inputValue, handleSubmit, handleChange, inputRef }: FormProps) => (
  <>
    <p className={styles.tip}>
      “Give treatment suggestions for…“ or “Why is node “Symptom Summarizer” not communicating with “Diagnosis
      Analyzer”?”
    </p>
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Start typing anything…"
        value={inputValue}
        onChange={handleChange}
        required
        autoFocus
        className={styles.input}
      />
      <button type="submit" className={styles.submitButton} disabled={!inputValue}>
        <Send />
      </button>
    </form>
    <div className={styles.actions}>
      <button>Summarize</button>
      <button>Node Action</button>
      <button>Customize Actions</button>
      <button>Settings</button>
      <button>More</button>
    </div>
  </>
);

export default Form;
