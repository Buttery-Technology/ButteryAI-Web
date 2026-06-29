import CheckCircle from "@assets/icons/check-circle.svg?react";
import styles from "./HomeGovernance.module.scss";

const HomeGovernance = () => (
  <section className={styles.root} data-section="governance">
    <div className={styles.grid}>
      <div>
        <h2 className={styles.title}>
          Audit-ready, <span>by default.</span>
        </h2>
        <p className={styles.kicker}>Full trace through every system.</p>
        <p className={styles.body}>
          Oversight isn't a paid add-on. Tamper-evident audit trails and a policy engine are baked in — so every action
          is accounted for and within bounds.
        </p>
        <div className={styles.list}>
          <div className={styles.item}>
            <CheckCircle className={styles.check} />
            <span>
              <b>Tamper-evident audit trail.</b> Hash-chained logs of every interaction — built for SOC 2 and GDPR
              reviews.
            </span>
          </div>
          <div className={styles.item}>
            <CheckCircle className={styles.check} />
            <span>
              <b>Policy engine.</b> Allow, deny, or require approval on cost, PII, and data classification —
              automatically.
            </span>
          </div>
          <div className={styles.item}>
            <CheckCircle className={styles.check} />
            <span>
              <b>Control and oversight, on by default.</b> Set the rules once; the system enforces them everywhere.
            </span>
          </div>
        </div>
      </div>

      <div className={styles.panel}>
        <p className={styles.panelTitle}>Policy activity</p>
        <div className={styles.miniCard}>
          <div>
            <p className={styles.miniLabel}>Query exceeds $10 cost cap</p>
            <p className={styles.miniMeta}>policy · cost-control</p>
          </div>
          <span className={`${styles.tag} ${styles.deny}`}>Denied</span>
        </div>
        <div className={styles.miniCard}>
          <div>
            <p className={styles.miniLabel}>Contains PII → external model</p>
            <p className={styles.miniMeta}>policy · data-classification</p>
          </div>
          <span className={`${styles.tag} ${styles.appr}`}>Approval</span>
        </div>
        <div className={styles.miniCard}>
          <div>
            <p className={styles.miniLabel}>Standard query · in policy</p>
            <p className={styles.miniMeta}>logged · hash 0x9f3a…</p>
          </div>
          <span className={`${styles.tag} ${styles.audit}`}>Logged ✓</span>
        </div>
      </div>
    </div>
  </section>
);

export default HomeGovernance;
