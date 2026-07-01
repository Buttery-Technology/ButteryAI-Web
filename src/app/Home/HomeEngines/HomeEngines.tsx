import styles from "./HomeEngines.module.scss";

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H8l-4 3V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />
  </svg>
);

const RouteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="12" r="2.2" />
    <circle cx="18" cy="6" r="2.2" />
    <circle cx="18" cy="18" r="2.2" />
    <path d="M8.2 12H13l3-4.5" />
    <path d="M13 12l3 4.5" />
  </svg>
);

const LayersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 3 7.5 12 12l9-4.5L12 3z" />
    <path d="M3 12.5 12 17l9-4.5" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l7 2.5V11c0 4.2-3 7-7 8.2C8 18 5 15.2 5 11V5.5L12 3z" />
    <path d="M9 11.5l2 2 4-4" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.2 4.2L19 7" />
  </svg>
);

const HomeEngines = () => (
  <section className={styles.root} data-section="engines">
    <div className={styles.header}>
      <h2 className={styles.title}>
        Not a wrapper. A stack of intelligence <span>engines</span>.
      </h2>
      <p className={styles.subtitle}>
        Most AI platforms wrap someone else&apos;s model. ButteryAI runs its own — here&apos;s what happens on every
        query.
      </p>
    </div>

    <div className={styles.scroll}>
      <div className={styles.pipeline}>
        <div className={styles.stage}>
          <div className={`${styles.io} ${styles.ioStart}`}>
            <ChatIcon />
          </div>
          <div className={styles.label}>Your prompt</div>
          <div className={styles.caption}>A question or task</div>
        </div>

        <span className={styles.link} />

        <div className={styles.stage}>
          <div className={`${styles.hex} ${styles.hexBlue}`}>
            <RouteIcon />
          </div>
          <div className={styles.label}>
            Routing Engine <span className={styles.tag}>DAIS</span>
          </div>
          <div className={styles.caption}>Runs it on-device, cloud, or split</div>
        </div>

        <span className={styles.link} />

        <div className={styles.stage}>
          <div className={`${styles.hex} ${styles.hexPurple}`}>
            <LayersIcon />
          </div>
          <div className={styles.label}>
            Management Engine <span className={styles.tag}>DAIS</span>
          </div>
          <div className={styles.caption}>Plans, calls tools, verifies outputs</div>
        </div>

        <span className={styles.link} />

        <div className={`${styles.stage} ${styles.stageWide}`}>
          <div className={`${styles.hex} ${styles.hexTeal}`}>
            <ShieldCheckIcon />
          </div>
          <div className={styles.label}>Evaluation</div>
          <div className={styles.caption}>Scores value, trust &amp; confidence</div>
          <div className={styles.chips}>
            <span className={styles.chip}>
              KnowledgeIntelligence <em>UVS</em>
            </span>
            <span className={styles.chip}>
              TrustIntelligence <em>TAS</em>
            </span>
            <span className={styles.chip}>
              Epistemic <em>SwiftEpisteme</em>
            </span>
          </div>
        </div>

        <span className={styles.link} />

        <div className={styles.stage}>
          <div className={`${styles.io} ${styles.ioEnd}`}>
            <CheckIcon />
          </div>
          <div className={styles.label}>Trusted answer</div>
          <div className={styles.caption}>Verified, scored, audited</div>
        </div>
      </div>
    </div>

    <p className={styles.loop}>
      <span className={styles.loopIcon}>↻</span>
      Every scored interaction feeds back — the system gets more accurate over time.
    </p>
  </section>
);

export default HomeEngines;
