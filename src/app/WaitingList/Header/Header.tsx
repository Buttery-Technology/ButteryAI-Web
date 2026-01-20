import { Link } from "react-router-dom";
import butteryai from "@assets/logos/ButteryAI-Logo.svg";
import styles from "./Header.module.scss";

const Header = () => (
  <header className={styles.root}>
    <Link to="/" className={styles.logoLink}>
      <img src={butteryai} alt="ButteryAI" className={styles.logo} />
    </Link>
    <div className={styles.titleRow}>
      <Link to="/" className={styles.backLink} aria-label="Go back">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="#637684"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
      <h1 className={styles.title}>
        Request <span className={styles.gradient}>exclusive</span> access to Buttery AI.
      </h1>
    </div>
    <p className={styles.subtitle}>
      We're accepting requests to see what we've been cooking. Let's check your access.
    </p>
  </header>
);

export default Header;
