import styles from "./HomeNextGen.module.scss";
import CheckCircle from "@assets/icons/check-circle.svg?react";
import nextGenBrain from "@assets/images/next-gen-brain.png";

const HomeNextGen = () => (
  <section className={styles.root}>
    <div className={styles.content}>
      <img src={nextGenBrain} alt="Next-gen AI Intelligence" className={styles.icon} />
      <h1 className={styles.title}>Next-gen AI Intelligence</h1>
      <p className={styles.description}>
        ButteryAI is pioneering a new wave of AI intelligence called ButteryIntelligence. You can now create knowledge,
        experience, and skills that are used as sources-of-truth for the AI to use and lives separate from the AI model.
        This allows for AI to take the next frontier.
      </p>
      <div className={styles.features}>
        <div className={styles.card}>
          <h2>Scalable Intelligence</h2>
          <p>
            ButteryAI's intelligence engines are built for scale so they're automatically working in the background to
            manage and grow its intelligence.
          </p>
          <CheckCircle className={styles.checkIcon} />
        </div>
        <div className={styles.card}>
          <h2>Dynamic Context</h2>
          <p>
            ButteryAI is the first to offer dynamic knowledge that can then be injected into a model for better accuracy
            and context.
          </p>
          <CheckCircle className={styles.checkIcon} />
        </div>
      </div>
    </div>
  </section>
);

export default HomeNextGen;
