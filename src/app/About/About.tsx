import { Link, useNavigate } from "react-router-dom";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import { HomeTeam } from "../Home/HomeTeam";
import { HomeFooter } from "../Home/HomeFooter";
import styles from "./About.module.scss";

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <nav className={styles.topbar}>
        <Link to="/" className={styles.brand}>
          <img src={butteryaiLogo} alt="ButteryAI" />
        </Link>
        <div className={styles.navLinks}>
          <Link to="/pricing">Pricing</Link>
          <Link to="/login">Log in</Link>
          <button type="button" className={styles.navCta} onClick={() => navigate("/waiting-list")}>
            Start building
          </button>
        </div>
      </nav>

      <header className={styles.hero}>
        <p className={styles.eyebrow}>About</p>
        <h1 className={styles.title}>
          We&apos;re building AI you can trust — <span>and own</span>.
        </h1>
        <div className={styles.lede}>
          <p>
            ButteryAI started from a simple frustration: most AI tools can&apos;t tell you whether their output is
            right, where your data went, or who&apos;s accountable when something breaks.
          </p>
          <p>
            So we built the whole stack differently — pure Swift, local-first, with every response scored for accuracy,
            encrypted end-to-end, and fully audited. Our proprietary DAIS technology lets anyone compose a distributed
            AI system and deploy it anywhere, from a laptop to on-prem, without giving up control.
          </p>
        </div>
      </header>

      <HomeTeam />
      <HomeFooter />
    </>
  );
};

export default About;
