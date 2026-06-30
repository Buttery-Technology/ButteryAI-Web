import { useNavigate } from "react-router-dom";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import { ProductWindow } from "../../ProductWindow";
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

        {/* Product window — reused on the about page too */}
        <div className={styles.windowWrap}>
          <ProductWindow
            clusterName="Customer Support"
            userMessage="what's our Q3 refund policy?"
            metrics={[
              { label: "Value", value: "100%", tone: "blue" },
              { label: "Trust", value: "92%" },
              { label: "Accuracy", value: "96%" },
              { label: "Audit", value: "✓" },
              { label: "Trail", value: "⧉", tone: "blue" },
            ]}
          >
            Refunds are issued within <b>30 days</b> of purchase for unused plans, processed back to the original payment
            method. This is grounded in your <b>Policy Knowledge Base</b> (source: billing-policy v4) — not the
            model&apos;s guess.
          </ProductWindow>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
