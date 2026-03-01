import { Link } from "react-router-dom";
import butteryai from "@assets/logos/ButteryAI-Logo.svg";
import styles from "./Header.module.scss";

const Header = () => (
  <header className={styles.root}>
    <Link to="/" className={styles.link}>
      <img src={butteryai} alt="ButteryAI" />
    </Link>
    <h1 className={styles.title}>
      <span>Welcome</span> to the Buttery AI.
    </h1>
    <p className={styles.subtitle}>Let's create something awesome together!</p>
  </header>
);

export default Header;
