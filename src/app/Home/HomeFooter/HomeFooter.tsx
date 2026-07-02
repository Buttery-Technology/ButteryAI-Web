import { Link, useNavigate } from "react-router-dom";
import { openEnterpriseEmail } from "@common/contact";
import styles from "./HomeFooter.module.scss";

const HomeFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className={styles.root} data-section="footer">
      <h2 className={styles.title}>Build AI you can trust — and own.</h2>
      <p className={styles.subtitle}>
        Start building locally in minutes. Bring your team when you&apos;re ready.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.btnPrimary} onClick={() => navigate("/waiting-list")}>
          Start building
        </button>
        <button type="button" className={styles.btnSecondary} onClick={openEnterpriseEmail}>
          Talk to us about enterprise
        </button>
      </div>

      <div className={styles.bottomRow}>
        <span>
          © {new Date().getFullYear()}{" "}
          <a href="https://buttery.technology" target="_blank" rel="noreferrer">
            Buttery Technology, Inc.
          </a>
        </span>
        <Link to="/pricing">Pricing</Link>
        <Link to="/about">About</Link>
        <a href="#">Terms of Service</a>
        <a href="#">Privacy Policy</a>
      </div>
    </footer>
  );
};

export default HomeFooter;
