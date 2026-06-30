import { ReactNode } from "react";
import styles from "./ProductWindow.module.scss";

export type ProductMetric = { label: string; value: string; tone?: "good" | "blue" | "muted" };

type Props = {
  clusterName: string;
  userMessage: string;
  metrics: ProductMetric[];
  children: ReactNode;
};

const InfoDot = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9.2" />
    <path d="M12 11v5" />
    <path d="M12 7.8v.01" />
  </svg>
);

const ProductWindow = ({ clusterName, userMessage, metrics, children }: Props) => (
  <div className={styles.window} aria-hidden="true">
    <div className={styles.header}>
      <span className={styles.line} />
      <span className={styles.headTitle}>
        {clusterName} <InfoDot className={styles.infoDot} />
      </span>
      <span className={styles.line} />
    </div>
    <div className={styles.resetRow}>
      <span className={styles.reset}>↻</span>
    </div>

    <div className={styles.chat}>
      <div className={styles.bubbleUser}>{userMessage}</div>
      <div className={styles.bubbleAi}>{children}</div>
    </div>

    <div className={styles.metrics}>
      {metrics.map((m) => (
        <b key={m.label} className={styles[m.tone ?? "muted"]}>
          {m.value}
        </b>
      ))}
      <InfoDot className={styles.infoDot} />
    </div>
  </div>
);

export default ProductWindow;
