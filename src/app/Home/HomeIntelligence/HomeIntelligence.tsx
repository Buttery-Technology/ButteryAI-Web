import styles from "./HomeIntelligence.module.scss";

const CARDS = [
  {
    eyebrow: "Sources of truth",
    title: "Knowledge you control.",
    body: "Curate the facts your AI must answer from — owned by you, not baked into a black box.",
  },
  {
    eyebrow: "Grounded answers",
    title: "Real evaluation you'll appreciate.",
    body: "Responses are checked against your knowledge, so accuracy is provable, not hopeful.",
  },
  {
    eyebrow: "Swap models freely",
    title: "Model agnostic.",
    body: "Your intelligence outlives any single model — upgrade the engine, keep the knowledge.",
  },
  {
    eyebrow: "Compounds over time",
    title: "Real learning.",
    body: "Every scored interaction sharpens the system. It gets better the more you use it.",
  },
];

const HomeIntelligence = () => (
  <section className={styles.root} data-section="intelligence">
    <div className={styles.header}>
      <h2 className={styles.title}>
        Think outside the <span>model</span>.
      </h2>
      <p className={styles.subtitle}>True intelligence that just works.</p>
      <p className={styles.lede}>
        Knowledge, experience, and skills live outside the AI as your source of truth — the foundation that makes every
        answer verifiable and every model swappable.
      </p>
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
