import type { ComponentProps } from "react";
import styles from "./Button.module.scss";

type ButtonProps = ComponentProps<"button">;

const Button = ({ className, children, ...props }: ButtonProps) => {
  const classNames = [styles.button];
  if (className) classNames.push(className);
  const cls = classNames.join(" ");

  return (
    <button type="submit" className={cls} {...props}>
      {children}
    </button>
  );
};

export default Button;
