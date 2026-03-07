import { type MutableRefObject, type ChangeEvent, type FormEvent } from "react";
import Send from "@assets/icons/send.svg?react";
import styles from "./Form.module.scss";

type FormProps = {
  inputValue: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  disabled?: boolean;
};

const Form = ({ inputValue, handleSubmit, handleChange, inputRef, disabled }: FormProps) => (
  <>
    <p className={styles.tip}>
      &quot;Give treatment suggestions for&hellip;&quot; or &quot;Why is node &quot;Symptom Summarizer&quot; not
      communicating with &quot;Diagnosis Analyzer&quot;?&quot;
    </p>
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Start typing anything..."
        value={inputValue}
        onChange={handleChange}
        required
        disabled={disabled}
        className={styles.input}
      />
      <button type="submit" className={styles.submitButton} disabled={!inputValue || disabled}>
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
