import styles from "./HomeEngines.module.scss";

const ENGINES = [
  {
    name: "Routing Engine",
    tag: "DAIS",
    desc: "Decides where each query runs — on-device, in the cloud, or split — for the best accuracy, latency, and cost.",
  },
  {
    name: "Management Engine",
    tag: "DAIS",
    desc: "The orchestration brain: plans multi-step actions, calls tools, and verifies outputs before they ever touch your data.",
  },
  {
    name: "KnowledgeIntelligence",
    tag: "UVS",
    desc: "Recognizes which knowledge is relevant, scores it by value and trust, and persists what's worth remembering.",
  },
  {
    name: "TrustIntelligence",
    tag: "TAS",
    desc: "Maintains live trust scores for every user, model, node, and source, so the system's judgment sharpens with use.",
  },
  {
    name: "Epistemic verification",
    tag: "SwiftEpisteme",
    desc: "Knows what it knows — returning confident, tentative, or uncertain instead of confident nonsense.",
  },
];

const HomeEngines = () => (
  <section className={styles.root} data-section="engines">
    <div className={styles.header}>
      <h2 className={styles.title}>
        Not a wrapper. A stack of intelligence <span>engines</span>.
      </h2>
      <p className={styles.subtitle}>Most AI platforms wrap someone else&apos;s model. ButteryAI runs its own.</p>
    </div>

    <div className={styles.list}>
      {ENGINES.map((engine) => (
        <div key={engine.name} className={styles.row}>
          <div className={styles.head}>
            <span className={styles.name}>{engine.name}</span>
            <span className={styles.tag}>{engine.tag}</span>
          </div>
          <p className={styles.desc}>{engine.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default HomeEngines;
