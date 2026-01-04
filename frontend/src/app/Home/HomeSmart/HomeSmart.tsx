import { LinkButton } from "@global";
import styles from "./HomeSmart.module.scss";

const HomeSmart = () => (
  <section className={styles.root}>
    <div className={styles.content}>
      <h1 className={styles.title}>Smart Orchestration</h1>
      <p>
        ButteryAI can intelligently orchestrate across multiple AI models simultaneously. Leverage workflows and
        extensions to take your orchestration to the next level. ButteryAI is built upon a patented distributed
        architecture that requires no additional overhead and no token loss - I say that again, no token loss.
      </p>
      <LinkButton to="/login" hasBackground>
        Start
      </LinkButton>
    </div>
  </section>
);

export default HomeSmart;
