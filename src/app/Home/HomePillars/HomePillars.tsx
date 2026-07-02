import CheckCircle from "@assets/icons/check-circle.svg?react";
import styles from "./HomePillars.module.scss";

const PILLARS = [
  {
    eyebrow: "Trust",
    title: "Know when to trust it.",
    body: "Every response is scored for value, trust, and accuracy, and checked against your sources of truth — so hallucinations get caught before they ship.",
    tag: "Value · Trust · Accuracy",
  },
  {
    eyebrow: "Security",
    title: "Encrypted & yours.",
    body: "End-to-end encryption with a zero-knowledge server, mutual-TLS between every node, and a local-first option — your data never has to leave your walls.",
    tag: "E2EE · ZKP · At rest encryption",
  },
  {
    eyebrow: "Governance",
    title: "Audit-ready by default.",
    body: "Tamper-evident audit trails and a policy engine are baked in — every action logged, every rule enforced, no compliance suite to bolt on later.",
    tag: "SOC-2 · GDPR-ready · RBAC",
  },
  {
    eyebrow: "Ownership",
    title: "Own the whole stack.",
    body: "Pure Swift, no Python, any open model, deploy local → cloud → on-prem. Your models, your data, your infrastructure — and no per-token lock-in.",
    tag: "No Python needed · no lock-in",
  },
];

const HomePillars = () => (
  <section className={styles.root} data-section="pillars">
    <div className={styles.header}>
      <h2 className={styles.title}>
        A proper foundation, <span>essentially</span>.
      </h2>
      <p className={styles.subtitle}>
        Four things every AI stack should give you. ButteryAI has them all and much more.
      </p>
    </div>

    <div className={styles.grid}>
      {PILLARS.map((p) => (
        <article key={p.eyebrow} className={styles.card}>
          <span className={styles.eyebrow}>{p.eyebrow}</span>
          <h3 className={styles.cardTitle}>{p.title}</h3>
          <p className={styles.cardBody}>{p.body}</p>
          <CheckCircle className={styles.check} />
          <span className={styles.tag}>{p.tag}</span>
        </article>
      ))}
    </div>

    <p className={styles.note}>
      And many more features, such as continuous learning, auto-knowledge extraction, distributed architecture for
      limitless scaling, simple and easy deployment beyond local, continuous conversation, and much more.
    </p>
  </section>
);

export default HomePillars;
