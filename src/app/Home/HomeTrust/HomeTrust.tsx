import CheckCircle from "@assets/icons/check-circle.svg?react";
import styles from "./HomeTrust.module.scss";

const TRACE = [
  { label: "Routed", meta: "Contracts Specialist", tag: "Best fit", tone: "audit" },
  { label: "First draft", meta: "Said 30 days' notice. No source backs it up.", tag: "Flagged", tone: "warn" },
  { label: "Retry", meta: "New guidance: quote the termination clause", tag: "Retried", tone: "audit" },
  { label: "Final answer", meta: "60 days' notice, Supply Agreement §9.2", tag: "Trusted ✓", tone: "enc" },
] as const;

const HomeTrust = () => (
  <section className={styles.root} data-section="trust">
    <div className={styles.grid}>
      <div>
        <h2 className={styles.title}>
          Better answers, <span>in real time</span>.
        </h2>
        <p className={styles.kicker}>Every answer gets a second look.</p>
        <p className={styles.body}>
          ButteryAI tracks what your AI does and says. It evaluates every answer and updates our real-time metric
          system as it goes. That&apos;s how it catches hallucinations and makes answers better.
        </p>

        <div className={styles.list}>
          <div className={styles.item}>
            <CheckCircle className={styles.check} />
            <span>
              <b>Tracked and scored.</b> Every answer, as it happens, not sampled later.
            </span>
          </div>
          <div className={styles.item}>
            <CheckCircle className={styles.check} />
            <span>
              <b>Hallucinations caught.</b> Claims your sources don&apos;t back up get flagged before anyone sees them.
            </span>
          </div>
          <div className={styles.item}>
            <CheckCircle className={styles.check} />
            <span>
              <b>Retried or re-routed.</b> A weak answer goes back with new guidance, or to a better-fit specialist.
            </span>
          </div>
        </div>
      </div>

      <div className={styles.panel}>
        <p className={styles.panelTitle}>Inside one answer</p>

        {TRACE.map((row) => (
          <div key={row.label} className={styles.miniCard}>
            <div>
              <p className={styles.miniLabel}>{row.label}</p>
              <p className={styles.miniMeta}>{row.meta}</p>
            </div>
            <span className={`${styles.tag} ${styles[row.tone]}`}>{row.tag}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HomeTrust;
