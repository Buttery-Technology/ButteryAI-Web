import { LinkButton } from "@global";
import butteryai from "@assets/logos/butteryai.png";
import styles from "./HomeHero.module.scss";

const HomeHero = () => (
  <main className={styles.root}>
    <img src={butteryai} alt="ButteryAI" className={styles.butteryAI} />
    <h1 className={styles.title}>Buttery smooth AI Development</h1>
    <p className={styles.intro}>
      Build unbelievable AI and the tech stack like never before with everything you need, like enterprise-grade
      security, workflows, and governance.
    </p>
    <p className={styles.intro}>
      ButteryAI gives you the foundation and tools to craft AI that is trustworthy, scalable, and easy-to-work with.
      And, through our marketplace, you can sell your AI building blocks to help others build off your idea.
    </p>
    <LinkButton to="/login" hasBackground>
      Start
    </LinkButton>
  </main>
);

export default HomeHero;
