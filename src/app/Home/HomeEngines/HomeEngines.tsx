import butteryaiLogo from "@assets/logos/ButteryAI-Logo-no-melting.svg";
import styles from "./HomeEngines.module.scss";

const INPUTS = ["User", "Terminal", "SDK", "App"];
const OUTPUTS = ["Trusted answer", "Audit trail", "Live metrics", "Encrypted E2E"];
const ENGINES = ["Routing Engine", "Management Engine", "KnowledgeIntelligence", "TrustIntelligence", "Epistemic"];

const HomeEngines = () => (
  <section className={styles.root} data-section="engines">
    <div className={styles.header}>
      <h2 className={styles.title}>
        Not a wrapper. A stack of intelligence <span>engines</span>.
      </h2>
      <p className={styles.subtitle}>
        Every request runs inside your DAIS system — routed, orchestrated, evaluated, and encrypted before you ever see
        an answer.
      </p>
    </div>

    <div className={styles.scroll}>
      <div className={styles.diagram}>
        <div className={styles.side}>
          <div className={styles.sideLabel}>Connect from</div>
          <ul className={styles.sideList}>
            {INPUTS.map((item) => (
              <li key={item}>
                <span className={styles.dotIn} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <span className={styles.flow}>
          <span className={styles.packet} />
        </span>

        <div className={styles.dais}>
          <span className={styles.daisTag}>Your DAIS system</span>
          <div className={styles.daisInner}>
            <div className={styles.gate}>
              <span className={styles.gateTitle}>Security check</span>
              <span className={styles.gateSub}>Trust evaluation</span>
            </div>

            <span className={styles.mini} />

            <div className={styles.core}>
              <span className={styles.halo} />
              <img src={butteryaiLogo} alt="" className={styles.hive} />
              <span className={styles.coreLabel}>Cortex + nodes</span>
              <div className={styles.engineChips}>
                {ENGINES.map((engine) => (
                  <span key={engine} className={styles.engineChip}>
                    {engine}
                  </span>
                ))}
              </div>
            </div>

            <span className={styles.mini} />

            <div className={styles.gate}>
              <span className={styles.gateTitle}>Output evaluation</span>
              <span className={styles.gateSub}>Encryption</span>
            </div>
          </div>
        </div>

        <span className={styles.flow}>
          <span className={`${styles.packet} ${styles.packetDelay}`} />
        </span>

        <div className={styles.side}>
          <div className={styles.sideLabel}>You get</div>
          <ul className={styles.sideList}>
            {OUTPUTS.map((item) => (
              <li key={item}>
                <span className={styles.dotOut} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    <p className={styles.loop}>
      <span className={styles.loopIcon}>↻</span>
      Every scored interaction feeds back — DAIS gets more accurate over time.
    </p>
  </section>
);

export default HomeEngines;
