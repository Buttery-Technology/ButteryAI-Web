import butteryaiLogo from "@assets/logos/ButteryAI-Logo-no-melting.svg";
import styles from "./HomeEngines.module.scss";

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l7 2.5V11c0 4.2-3 7-7 8.2C8 18 5 15.2 5 11V5.5L12 3z" />
    <circle cx="12" cy="10" r="1.4" />
    <path d="M12 11.4V14" />
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

const GaugeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 15a7.5 7.5 0 0 1 15 0" />
    <path d="M12 15l4-3" />
    <path d="M4.5 15h15" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

const FLOW = [
  { key: "sec", name: "Security & Trust", desc: "Screens the request before anything runs", color: "#d1495b", Icon: ShieldIcon },
  { key: "route", name: "Routing Engine", desc: "On-device, cloud, or split", color: "#288ed2", Icon: RouteIcon },
  { key: "mgmt", name: "Management Engine", desc: "Plans, calls tools, runs your nodes", color: "#755cba", Icon: LayersIcon },
  {
    key: "eval",
    name: "Evaluation",
    desc: "Scores value, trust & confidence",
    color: "#22908c",
    Icon: GaugeIcon,
    chips: ["KnowledgeIntelligence", "TrustIntelligence", "Epistemic"],
  },
  { key: "enc", name: "Encrypt & audit", desc: "Signs, encrypts, logs the answer", color: "#0f9b81", Icon: LockIcon },
];

const HomeEngines = () => (
  <section className={styles.root} data-section="engines">
    <div className={styles.header}>
      <h2 className={styles.title}>
        Powered by <span>DAIS</span> — not a wrapper.
      </h2>
      <p className={styles.subtitle}>
        ButteryAI runs on DAIS, our distributed AI system. Every request flows through its intelligence engines —
        routed, orchestrated, evaluated, and encrypted — before you ever see an answer.
      </p>
    </div>

    {/* Product layer */}
    <div className={styles.product}>
      <img src={butteryaiLogo} alt="" className={styles.productLogo} />
      <div className={styles.productText}>
        <div className={styles.productName}>ButteryAI</div>
        <div className={styles.productTag}>The platform you build, chat, and deploy on</div>
      </div>
      <div className={styles.productChips}>
        {["Chat", "Workflows", "Nodes", "SDK"].map((c) => (
          <span key={c} className={styles.productChip}>
            {c}
          </span>
        ))}
      </div>
    </div>

    <div className={styles.bridge}>
      <span className={styles.bridgeLabel}>powered by DAIS</span>
      <span className={styles.bridgeArrow} />
    </div>

    {/* Engine layer */}
    <div className={styles.dais}>
      <span className={styles.daisTag}>DAIS · Distributed AI System</span>
      <div className={styles.scroll}>
        <div className={styles.pipeline}>
          <span className={styles.packet} />
          <div className={styles.endLabel}>Request</div>
          <span className={styles.link} />

          {FLOW.map((node, i) => (
            <div className={styles.step} key={node.key}>
              <div className={styles.stage}>
                <span className={styles.badge} style={{ backgroundColor: node.color }}>
                  <node.Icon />
                </span>
                <span className={styles.name}>{node.name}</span>
                <span className={styles.desc}>{node.desc}</span>
                {node.chips && (
                  <span className={styles.chips}>
                    {node.chips.map((chip) => (
                      <span key={chip} className={styles.chip}>
                        {chip}
                      </span>
                    ))}
                  </span>
                )}
              </div>
              {i < FLOW.length - 1 && <span className={styles.link} />}
            </div>
          ))}

          <span className={styles.link} />
          <div className={`${styles.endLabel} ${styles.endGreen}`}>Trusted answer ✓</div>
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
