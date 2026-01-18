import type { ComponentProps } from "react";
import styles from "./Input.module.scss";

type InputProps = ComponentProps<"input"> & {
  error: string | null;
};

const Input = ({ type, name, placeholder, value, onChange, onBlur, error }: InputProps) => (
  <div>
    <input
      type={type}
      name={name}
      id={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={styles.input}
    />
    {error && <p className={styles.error}>{error}</p>}
  </div>
);

export default Input;
