import CheckCircle from "@assets/icons/check-circle.svg?react";
import styles from "./HomeTrust.module.scss";

const HomeTrust = () => (
  <section className={styles.root} data-section="trust">
    <div className={styles.grid}>
      <div>
        <h2 className={styles.title}>
          Know when to <span>trust</span> the output.
        </h2>
        <p className={styles.kicker}>Trust me, this is important.</p>
        <p className={styles.body}>
          Most AI can't tell you if it's right. ButteryAI scores every single response and checks it against your own
          sources of truth — so confidence is measured, not assumed.
        </p>

        <div className={styles.list}>
          <div className={styles.item}>
            <CheckCircle className={styles.check} />
            <span>
              <b>Value · Trust · Accuracy on every response.</b> Each answer is graded in real time, not sampled later.
            </span>
          </div>
          <div className={styles.item}>
            <CheckCircle className={styles.check} />
            <span>
              <b>Hallucinations caught at the source.</b> Outputs are fact-checked against your knowledge base before
              they reach a user.
            </span>
          </div>
          <div className={styles.item}>
            <CheckCircle className={styles.check} />
            <span>
              <b>Gets more accurate over time.</b> Every scored interaction tunes the system — your AI compounds instead
              of drifting.
            </span>
          </div>
        </div>
      </div>

      <div className={styles.panel}>
        <p className={styles.panelTitle}>Response evaluation</p>

        <div className={styles.bars}>
          <div className={styles.barRow}>
            <span className={styles.bn}>Value</span>
            <span className={styles.track}>
              <span className={styles.fill} style={{ width: "100%", background: "var(--buttery-blue)" }} />
            </span>
            <span className={styles.pct} style={{ color: "var(--buttery-blue)" }}>
              100
            </span>
          </div>
          <div className={styles.barRow}>
            <span className={styles.bn}>Trust</span>
            <span className={styles.track}>
              <span className={styles.fill} style={{ width: "92%", background: "var(--buttery-green)" }} />
            </span>
            <span className={styles.pct} style={{ color: "var(--buttery-green)" }}>
              92
            </span>
          </div>
          <div className={styles.barRow}>
            <span className={styles.bn}>Accuracy</span>
            <span className={styles.track}>
              <span className={styles.fill} style={{ width: "96%", background: "var(--buttery-green)" }} />
            </span>
            <span className={styles.pct} style={{ color: "var(--buttery-green)" }}>
              96
            </span>
          </div>
        </div>

        <div className={styles.miniCard}>
          <div>
            <p className={styles.miniLabel}>Confidence</p>
            <p className={styles.miniMeta}>strong evidence · grounded</p>
          </div>
          <span className={`${styles.tag} ${styles.enc}`}>Confident</span>
        </div>
        <div className={styles.miniCard}>
          <div>
            <p className={styles.miniLabel}>Hallucination check</p>
            <p className={styles.miniMeta}>matched billing-policy v4</p>
          </div>
          <span className={`${styles.tag} ${styles.audit}`}>Passed ✓</span>
        </div>
      </div>
    </div>
  </section>
);

export default HomeTrust;
