import { Link } from "react-router-dom";
import honey from "../../../assets/logos/honey.png";
import styles from "./Header.module.scss";

const Header = () => (
  <header className={styles.root}>
    <Link to="/" className={styles.link}>
      <img src={honey} alt="ButteryAI" />
    </Link>
    <h1 className={styles.title}>
      <span>Welcome</span> to ButteryAI.
    </h1>
  </header>
);

export default Header;
