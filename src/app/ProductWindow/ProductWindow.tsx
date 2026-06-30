import { ReactNode } from "react";
import styles from "./ProductWindow.module.scss";

export type ProductMetric = { label: string; value: string; tone?: "good" | "blue" };

type Props = {
  clusterName: string;
  userMessage: string;
  metrics: ProductMetric[];
  children: ReactNode;
};

const ProductWindow = ({ clusterName, userMessage, metrics, children }: Props) => (
  <div className={styles.window} aria-hidden="true">
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
    <div className={styles.chat}>
      <div className={styles.bubbleUser}>{userMessage}</div>
      <div className={styles.bubbleAi}>{children}</div>
    </div>
    <div className={styles.metrics}>
      <span className={styles.history}>⟲ Show history</span>
      {metrics.map((m) => (
        <span className={styles.metric} key={m.label}>
          <em>{m.label}</em>
          <b className={m.tone === "blue" ? styles.bl : styles.good}>{m.value}</b>
        </span>
      ))}
    </div>
  </div>
);

export default ProductWindow;
