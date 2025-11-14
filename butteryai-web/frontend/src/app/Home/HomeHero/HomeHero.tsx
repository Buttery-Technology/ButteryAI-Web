import { LinkButton } from "../../Global/LinkButton";
import butteryai from "../../../assets/logos/butteryai.png";
import styles from "./HomeHero.module.scss";

const HomeHero = () => (
  <main className={styles.root}>
    <img src={butteryai} alt="ButteryAI" className={styles.butteryAI} />
    <h1 className={styles.title}>
      Disrupt the <span className={styles.greenish}>future</span> with the world’s first{" "}
      <span className={styles.blueish}>distributed AI</span> platform
    </h1>
    <p className={styles.intro}>
      Build, grow, or integrate AI into your business with ButteryAI so fast it’ll feel buttery smooth. ButteryAI is the
      only platform for both online and enterprise customers where transparency, privacy, and trust are metrics you can
      verify. Oh, and did we say it’s super fast? Yeah, it’s super fast.
    </p>
    <div className={styles.buttons}>
      <LinkButton to="/login">Login</LinkButton>
      <LinkButton to="/login" hasBackground>
        Get started for free
      </LinkButton>
    </div>
  </main>
);

export default HomeHero;
