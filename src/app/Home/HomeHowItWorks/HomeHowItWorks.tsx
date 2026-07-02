import styles from "./HomeHowItWorks.module.scss";

const STEPS = [
  {
    number: "1",
    title: "Build nodes locally",
    body: "Compose specialized AI nodes — local models, RAG, or remote APIs — in the ButteryAI app. Work solo or with your team.",
  },
  {
    number: "2",
    title: "Orchestrate & evaluate",
    body: "The intelligence engine routes each query, scores every response for value, trust, and accuracy, and catches hallucinations before they ship.",
  },
  {
    number: "3",
    title: "Deploy anywhere",
    body: "Ship to local, cloud, Kubernetes, or fully on-prem — encrypted and audited by default. Same stack, your infrastructure.",
  },
];

const HomeHowItWorks = () => (
  <section className={styles.root} data-section="how-it-works">
    <div className={styles.header}>
      <h2 className={styles.title}>
        Do more, <span>quickly</span>.
      </h2>
      <p className={styles.subtitle}>From idea to deployed AI system in an afternoon</p>
      <p className={styles.note}>
        No glue code, no Python, no infra archaeology. Three steps from local build to production.
      </p>
    </div>

    <div className={styles.grid}>
      {STEPS.map((step) => (
        <article key={step.number} className={styles.card}>
          <span className={styles.number}>{step.number}</span>
          <h3 className={styles.cardTitle}>{step.title}</h3>
          <p className={styles.cardBody}>{step.body}</p>
        </article>
      ))}
    </div>
  </section>
);

export default HomeHowItWorks;
