import { Link } from "react-router-dom";
import { scrollToEnterprise } from "../shared";
import { StackUntangle } from "./StackUntangle";
import styles from "./HomeHero.module.scss";

const HomeHero = () => (
  <section className={styles.root} data-section="hero">
    <div className={styles.inner}>
      <h1 className={styles.title}>
        <span>Untangle</span> your AI
      </h1>

      <div className={styles.visual}>
        <StackUntangle
          outro={
            <>
              <h2 className={styles.outroTitle}>
                Envision a future where <span>your AI is special</span>
              </h2>
              <p className={styles.outroText}>
                ButteryAI helps you build enterprise-grade AI systems that focus specialization where you have full
                control and can trust your AI.
              </p>
              <div className={styles.actions}>
                <Link to="/download" className={styles.btnPrimary}>
                  Start building
                </Link>
                <button type="button" className={styles.btnGhost} onClick={scrollToEnterprise}>
                  For Enterprise
                </button>
              </div>
            </>
          }
        />
      </div>
    </div>
  </section>
);

export default HomeHero;
