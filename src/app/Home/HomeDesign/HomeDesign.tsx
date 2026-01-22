import styles from "./HomeDesign.module.scss";
import CheckCircle from "@assets/icons/check-circle.svg?react";
import ColorCodeStatus from "./color-code-status.svg?react";
import ExpandIcon from "./expand-icon.svg?react";

const metricCards = [
  {
    id: "value",
    title: "Value",
    value: "92",
    description: "This metric is your current value in the Hive.",
    status: "good" as const,
  },
  {
    id: "trust",
    title: "Trust",
    value: "Excellent",
    description: "Trust has a >96% stable metric.",
    status: "good" as const,
  },
  {
    id: "bias",
    title: "Bias",
    value: "Great",
    description: "Bias has been hovering around ~3%.",
    status: "good" as const,
  },
  {
    id: "accuracy",
    title: "Accuracy",
    value: "Needs work",
    description: "Accuracy is down to 85% since 01/01 at 4:21pmEST.",
    status: "warning" as const,
  },
];

const featureCards = [
  {
    id: "highlights",
    title: "Glanceable Highlights",
    description:
      "ButteryAI shows you important information highlights so you can quickly see how it's performing and what needs your attention.",
  },
  {
    id: "simple",
    title: "Simple and easy",
    description:
      "ButteryAI is designed to abstract as much complexity as possible so it's easy-to-use but allow you complexity when you need it.",
  },
];

const HomeDesign = () => (
  <section className={styles.root} data-section="design">
    <div className={styles.content}>
      <h1 className={styles.title}>Uniquely simple design</h1>
      <p className={styles.description}>
        ButteryAI is designed to be easy-to-use so you can focus on the important stuff. ButteryAI uses color code
        status to quickly understand how an AI node is performing and quick look cards for high level information at a
        glance.
      </p>

      <span className={styles.cardLabel}>Example summary cards</span>

      <div className={styles.metricCards}>
        {metricCards.map((card) => (
          <div key={card.id} className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span className={styles.metricTitle}>{card.title}</span>
              <ExpandIcon className={styles.metricIcon} />
            </div>
            <span className={`${styles.metricValue} ${styles[card.status]}`}>{card.value}</span>
            <p className={styles.metricDescription}>{card.description}</p>
          </div>
        ))}
      </div>

      <div className={styles.featureCards}>
        {featureCards.map((card) => (
          <div key={card.id} className={styles.featureCard}>
            <h2 className={styles.featureTitle}>{card.title}</h2>
            <p className={styles.featureDescription}>{card.description}</p>
            <CheckCircle className={styles.checkIcon} />
          </div>
        ))}
      </div>
    </div>

    <div className={styles.visualSection}>
      <ColorCodeStatus className={styles.colorCodeSvg} />
    </div>
  </section>
);

export default HomeDesign;
