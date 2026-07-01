import type { FC } from "react";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo-no-melting.svg";
import CheckCircle from "@assets/icons/check-circle.svg?react";
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

const LightbulbIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 18h5" />
    <path d="M10 21h4" />
    <path d="M12 2.5a6.5 6.5 0 0 0-4 11.6c.7.6 1.1 1.4 1.2 2.4l.05.5h5.5l.05-.5c.1-1 .5-1.8 1.2-2.4A6.5 6.5 0 0 0 12 2.5z" />
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

type Step = {
  key: string;
  name: string;
  desc: string;
  color: string;
  Icon: FC;
  darkIcon?: boolean;
  chips?: string[];
  node?: { head: string; parallel: string[]; bits: { label: string | null; text: string }[] };
};

const STEPS: Step[] = [
  {
    key: "sec",
    name: "Screen & govern",
    desc: "Checks for threats and enforces your policies — allow, deny, or require approval — before anything runs.",
    color: "#d1495b",
    Icon: ShieldIcon,
  },
  {
    key: "route",
    name: "Understand the request",
    desc: "Works out what you're asking, decides which nodes should handle it, and pulls in any relevant knowledge and context.",
    color: "#f9c000",
    Icon: LightbulbIcon,
    darkIcon: true,
  },
  {
    key: "mgmt",
    name: "Plan the work",
    desc: "Breaks the task into steps, calls the right tools, and coordinates the run across nodes.",
    color: "#755cba",
    Icon: LayersIcon,
  },
  {
    key: "node",
    name: "Run across nodes",
    desc: "Dispatches to one — or many — specialized nodes at once.",
    color: "#288ed2",
    Icon: RouteIcon,
    node: {
      head: "Nodes run in parallel",
      parallel: ["Node 1", "Node 2", "Node n"],
      bits: [
        { label: null, text: "Each node adds its own intelligence, knowledge & context" },
        { label: "LLM", text: "and runs a model — local (GGUF) or remote (OpenAI, Anthropic, Gemini, etc)" },
      ],
    },
  },
  {
    key: "eval",
    name: "Evaluate & decide",
    desc: "Scores the answer for value, trust, and confidence — and reruns any step that didn't meet the bar before you see it.",
    color: "#22908c",
    Icon: GaugeIcon,
    chips: ["KnowledgeIntelligence", "TrustIntelligence", "Confidence"],
  },
];

const ADVANTAGES = [
  "No token loss",
  "End-to-end encryption",
  "Tamper-evident audit trail",
  "Governance & policy engine",
  "Fast & efficient — pure Swift",
  "Runs local, cloud, or on-prem",
  "Model agnostic",
  "Custom evaluations",
  "Auto-learning",
];

const HomeEngines = () => (
  <section className={styles.root} data-section="engines">
    <div className={styles.header}>
      <h2 className={styles.title}>
        Powered by <span>DAIS</span> — not a wrapper.
      </h2>
      <p className={styles.subtitle}>
        ButteryAI runs on DAIS, our distributed AI system. Here&apos;s what happens to every request — screened,
        understood, planned, run across nodes, and evaluated — all encrypted and audited end to end.
      </p>
    </div>

    <div className={styles.advCards}>
      {ADVANTAGES.map((adv) => (
        <div key={adv} className={styles.advCard}>
          <CheckCircle className={styles.advCheck} />
          <span>{adv}</span>
        </div>
      ))}
    </div>

    <div className={styles.diagram}>
      <div className={styles.product}>
        <div className={styles.productHead}>
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

        <div className={styles.dais}>
          <span className={styles.daisTag}>DAIS · Distributed AI System</span>

          <div className={styles.timeline}>
            <span className={styles.packet} />
            {STEPS.map((step) => (
              <div className={styles.item} key={step.key}>
                <span
                  className={`${styles.badge} ${step.darkIcon ? styles.badgeDark : ""}`}
                  style={{ backgroundColor: step.color }}
                >
                  <step.Icon />
                </span>
                <div className={styles.itemText}>
                  <span className={styles.name}>{step.name}</span>
                  <span className={styles.desc}>{step.desc}</span>
                  {step.chips && (
                    <div className={styles.chips}>
                      {step.chips.map((chip) => (
                        <span key={chip} className={styles.chip}>
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                  {step.node && (
                    <div className={styles.nodePanel}>
                      <div className={styles.nodePanelHead}>{step.node.head}</div>
                      <div className={styles.nodeParallel}>
                        {step.node.parallel.map((n) => (
                          <span key={n} className={styles.nodeHexChip}>
                            {n}
                          </span>
                        ))}
                      </div>
                      {step.node.bits.map((bit) => (
                        <div className={styles.nodeBit} key={bit.text}>
                          {bit.label ? (
                            <span className={styles.nodeChip}>{bit.label}</span>
                          ) : (
                            <span className={styles.nodeDot} />
                          )}
                          <span>{bit.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Encryption + audit blanket the whole pipeline */}
          <div className={styles.encBand}>
            <span className={styles.encIcon}>
              <LockIcon />
            </span>
            <span>
              <b>Encrypted end-to-end</b> and written to a <b>tamper-evident audit trail</b> — across every step above.
            </span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.loopCard}>
      <span className={styles.loopIcon}>↻</span>
      <span>
        Every scored interaction feeds back — <b>DAIS gets more accurate over time.</b>
      </span>
    </div>
  </section>
);

export default HomeEngines;
