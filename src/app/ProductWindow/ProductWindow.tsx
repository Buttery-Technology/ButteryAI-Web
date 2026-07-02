import { ReactNode } from "react";
import styles from "./ProductWindow.module.scss";

export type ProductMetric = { label: string; value: string; tone?: "good" | "blue" | "muted" };

type Props = {
  clusterName: string;
  conversationTitle: string;
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

const ProductWindow = ({ clusterName, conversationTitle, userMessage, metrics, children }: Props) => (
  <div className={styles.window} aria-hidden="true">
    {/* App window chrome — cluster selector */}
    <div className={styles.titlebar}>
      <span className={styles.dots}>
        <i className={styles.r} />
        <i className={styles.y} />
        <i className={styles.g} />
      </span>
      <span className={styles.cluster}>
        {clusterName} <span className={styles.tag}>Local ▾</span>
      </span>
      <span className={styles.spacer} />
    </div>

    {/* Conversation section divider */}
    <div className={styles.section}>
      <span className={styles.line} />
      <span className={styles.sectionTitle}>
        {conversationTitle} <InfoDot className={styles.infoDot} />
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
