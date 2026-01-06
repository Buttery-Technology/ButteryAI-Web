import { LinkButton } from "@global";
import styles from "./HomeNextGen.module.scss";

const HomeNextGen = () => (
  <section className={styles.root}>
    <div className={styles.content}>
      <h1 className={styles.title}>Next-gen AI Intelligence</h1>
      <p className={styles.description}>
        ButteryAI is pioneering a new wave of AI intelligence called ButteryIntelligence. You can now create knowledge,
        experience, and skills that are used as sources-of-truth for the AI to use and lives separate from the AI model.
        This allows for AI to take the next frontier.
      </p>
      <ul className={styles.features}>
        <li>
          <h2>Scalable Intelligence</h2>
          <p>
            ButteryAI's intelligence engines are built for scale so they're automatically working in the background to
            manage and grow its intelligence.
          </p>
        </li>
        <li>
          <h2>Dynamic Context</h2>
          <p>
            ButteryAI is the first to offer dynamic knowledge that can then be injected into a model for better accuracy
            and context.
          </p>
        </li>
      </ul>
      <LinkButton to="/login" hasBackground>
        Start
      </LinkButton>
    </div>
  </section>
);

export default HomeNextGen;
