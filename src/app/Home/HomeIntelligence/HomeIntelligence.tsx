import styles from "./HomeIntelligence.module.scss";

const CARDS = [
  {
    eyebrow: "Your knowledge",
    title: "Built from what you know.",
    body: "Give each specialist your documents, data and rules. It answers from your sources and stays in its lane.",
  },
  {
    eyebrow: "Any model",
    title: "Bring almost any model.",
    body: "Use the model that fits the job, in the cloud or on your own hardware. Swap it anytime. The specialist keeps what it knows.",
  },
  {
    eyebrow: "Always learning",
    title: "Gets smarter over time.",
    body: "Every answer is scored, and each specialist learns from what worked and what didn't.",
  },
  {
    eyebrow: "Publish & share",
    title: "Share them securely.",
    body: "Publish a specialist to your team or beyond, and put other teams' specialists to work. You decide who can use it and what it can touch.",
  },
];

const HomeIntelligence = () => (
  <section className={styles.root} data-section="specialists">
    <div className={styles.header}>
      <h2 className={styles.title}>
        Build an AI specialist for <span>every job</span>.
      </h2>
      <p className={styles.subtitle}>
        One general model can&apos;t be the expert at everything. Specialists can. Build one for contracts, one for
        support, one for sales, each with exactly what its job needs.
      </p>
      <p className={styles.lede}>Pick a model. Add your knowledge and rules. Publish.</p>
    </div>

    <div className={styles.grid}>
      {CARDS.map((c) => (
        <article key={c.eyebrow} className={styles.card}>
          <span className={styles.eyebrow}>{c.eyebrow}</span>
          <h3 className={styles.cardTitle}>{c.title}</h3>
          <p className={styles.cardBody}>{c.body}</p>
        </article>
      ))}
    </div>
  </section>
);

export default HomeIntelligence;
