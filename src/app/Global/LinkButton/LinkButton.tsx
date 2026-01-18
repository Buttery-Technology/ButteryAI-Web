import { Link } from "react-router-dom";
import type { LinkButtonProps } from "./LinkButton.types";
import styles from "./LinkButton.module.scss";

const LinkButton = ({ to, className, hasBackground = false, children }: LinkButtonProps) => (
  <Link to={to} className={`${hasBackground ? styles.hasBackground : styles.noBackground} ${className}`}>
    {children}
  </Link>
);

export default LinkButton;
