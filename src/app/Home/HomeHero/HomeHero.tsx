import { useNavigate } from "react-router-dom";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import styles from "./HomeHero.module.scss";

const HomeHero = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.root} data-section="hero">
      <div className={styles.inner}>
        <img src={butteryaiLogo} alt="ButteryAI" className={styles.logo} />

        <h1 className={styles.title}>
          Build AI you can trust <span>and own</span>
        </h1>
        <p className={styles.subtitle}>
          Spin up an intelligent AI system locally, deploy it anywhere, and own the whole stack.
        </p>
        <p className={styles.lede}>
          Every response is scored for accuracy, encrypted end-to-end, and fully audited — so you ship with confidence
          instead of crossing your fingers.
        </p>

        <div className={styles.actions}>
          <button type="button" className={styles.btnPrimary} onClick={() => navigate("/waiting-list")}>
            Start building
          </button>
          <button type="button" className={styles.btnGhost} onClick={() => navigate("/waiting-list")}>
            For Enterprise
          </button>
        </div>
        <p className={styles.micro}>No Python · No lock-in · Runs local, on-prem, or cloud</p>

        {/* Product window — replaces the placeholder screenshot */}
        <div className={styles.window} aria-hidden="true">
          <div className={styles.titlebar}>
            <span className={styles.dots}>
              <i className={styles.r} />
              <i className={styles.y} />
              <i className={styles.g} />
            </span>
            <span className={styles.cluster}>
              Community Cluster <span className={styles.tag}>Local ▾</span>
            </span>
            <span className={styles.spacer} />
          </div>
          <div className={styles.chat}>
            <div className={styles.bubbleUser}>what&apos;s our Q3 refund policy?</div>
            <div className={styles.bubbleAi}>
              Refunds are issued within <b>30 days</b> of purchase for unused plans, processed back to the original
              payment method. This is grounded in your <b>Policy Knowledge Base</b> (source: billing-policy v4) — not the
              model&apos;s guess.
            </div>
          </div>
          <div className={styles.metrics}>
            <span className={styles.history}>⟲ Show history</span>
            <span className={styles.metric}>
              <em>Value</em>
              <b className={styles.bl}>100%</b>
            </span>
            <span className={styles.metric}>
              <em>Trust</em>
              <b className={styles.good}>92%</b>
            </span>
            <span className={styles.metric}>
              <em>Accuracy</em>
              <b className={styles.good}>96%</b>
            </span>
            <span className={styles.metric}>
              <em>Audit</em>
              <b className={styles.good}>✓</b>
            </span>
            <span className={styles.metric}>
              <em>Trail</em>
              <b className={styles.bl}>⧉</b>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
