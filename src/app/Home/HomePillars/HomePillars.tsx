import CheckCircle from "@assets/icons/check-circle.svg?react";
import styles from "./HomePillars.module.scss";

const PILLARS = [
  {
    eyebrow: "Control",
    title: "You set the rules.",
    body: "Pick the models, the knowledge and what each specialist is allowed to do. Your policies apply to every request.",
    tag: "Models · Knowledge · Policies",
  },
  {
    eyebrow: "Transparency",
    title: "See every step.",
    body: "Every route, score and retry is on the record. You always know why an answer came out the way it did.",
    tag: "Routes · Scores · Retries",
  },
  {
    eyebrow: "Efficiency",
    title: "Less to run.",
    body: "One system instead of a pile of tools. Each job goes to the specialist that fits it, so nothing does more work than it needs to.",
    tag: "One system · Smart routing",
  },
  {
    eyebrow: "Better answers",
    title: "Answers that hold up.",
    body: "Specialists answer from your own sources, not a guess, and each one gets sharper the more it works.",
    tag: "Scored · Retried · Re-routed",
  },
];

const HomePillars = () => (
  <section className={styles.root} data-section="pillars">
    <div className={styles.header}>
      <h2 className={styles.title}>
        What one system <span>gets you</span>.
      </h2>
      <p className={styles.subtitle}>
        Collapse the stack and you get more control, more transparency, more efficiency and better answers.
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
      Security and governance come standard: encryption, access roles, policies and a record of every step. SOC 2 —
      coming 2027.
    </p>
  </section>
);

export default HomePillars;
