import { LinkButton } from "@global";
import butteryai from "@assets/logos/butteryai.png";
import melting from "@assets/images/melting-footer.svg";
import styles from "./HomeFooter.module.scss";

const HomeFooter = () => (
  <div className={styles.root}>
    <div className={styles.wrapper}>
      <img src={butteryai} alt="ButteryAI" className={styles.butteryAI} />
      <h1 className={styles.title}>
        <span>Join</span> ButteryAI today!
      </h1>
      <div className={styles.buttons}>
        <LinkButton to="/login">Login</LinkButton>
        <LinkButton to="/login" hasBackground>
          Get started for free
        </LinkButton>
      </div>
    </div>
    <img src={melting} alt="Melting" className={styles.melting} />
    <p className={styles.copyright}>© 2024 Buttery Technology Inc.</p>
  </div>
);

export default HomeFooter;
