import type { CSSProperties, ReactNode } from "react";
import { HEX_PATH, HEX_VIEWBOX, SPECIALISTS, useInView } from "../shared";
import styles from "./HomeAssurance.module.scss";

const at = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

const Glyph = ({ d, viewBox = "0 0 16 16", className }: { d: string[]; viewBox?: string; className?: string }) => (
  <svg
    className={className}
    viewBox={viewBox}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {d.map((p) => (
      <path key={p} d={p} />
    ))}
  </svg>
);

const CHECK = ["M2.8 6.2 5 8.4l4.2-4.6"];
const CLOCK = ["M6 1.9a4.1 4.1 0 1 0 0 8.2 4.1 4.1 0 0 0 0-8.2z", "M6 3.9V6l1.4.9"];
const DOC = ["M4.5 2.5h4.6L11.8 5.2v8.3H4.5z", "M9 2.6v2.8h2.7", "M6.6 8.4h3M6.6 10.8h3"];
const PEN = ["M10.4 3.1l2.5 2.5-7.1 7.1-3.1.6.6-3.1z", "M9.1 4.4l2.5 2.5"];
const SEND = ["M13.4 2.6 7.3 8.7", "M13.4 2.6 9.6 13.4 7.3 8.7 2.6 6.4z"];
const CONTRACT_GLYPH = ["M9.3 7h3.5l2.1 2.1V17H9.3z", "M11 12.2h2.2M11 14.5h2.2"];

const CONTRACTS = SPECIALISTS[0];

const PERMISSIONS = [
  { action: "Read contracts", icon: DOC, allowed: true },
  { action: "Draft replies", icon: PEN, allowed: true },
  { action: "Send email", icon: SEND, allowed: false },
];

const SAFEGUARDS = ["Encryption", "Access roles", "Policies", "Audit record"];

const ContractsMark = () => (
  <svg className={styles.mark} viewBox={HEX_VIEWBOX} aria-hidden="true">
    <path d={HEX_PATH} fill={CONTRACTS.color} />
    <g
      transform="matrix(1.57 0 0 1.57 14.16 -0.84)"
      fill="none"
      stroke="#fff"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {CONTRACT_GLYPH.map((p) => (
        <path key={p} d={p} vectorEffect="non-scaling-stroke" />
      ))}
    </g>
  </svg>
);

const ControlVisual = ({ base }: { base: number }) => (
  <div className={styles.panelCard}>
    <div className={styles.panelHead}>
      <ContractsMark />
      <span className={styles.headText}>
        <span className={styles.headTitle}>Contracts Specialist</span>
        <span className={styles.headSub}>Permissions</span>
      </span>
    </div>
    <ul className={styles.rules}>
      {PERMISSIONS.map((p, i) => (
        <li key={p.action} className={`${styles.rule} ${styles.reveal}`} style={at(base + 0.25 + i * 0.22)}>
          <Glyph d={p.icon} className={styles.ruleIcon} />
          <span className={styles.ruleName}>{p.action}</span>
          <span
            className={`${styles.chip} ${styles.pop}`}
            data-tone={p.allowed ? "allowed" : "approval"}
            style={at(base + 0.45 + i * 0.22 + (p.allowed ? 0 : 0.25))}
          >
            <Glyph d={p.allowed ? CHECK : CLOCK} viewBox="0 0 12 12" />
            {p.allowed ? "Allowed" : "Needs approval"}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const SecurityVisual = ({ base }: { base: number }) => (
  <div className={`${styles.panelCard} ${styles.secure}`}>
    <div className={styles.shieldWrap}>
      <span className={`${styles.ring} ${styles.grow}`} style={{ ...at(base + 0.1), "--s": "84px" } as CSSProperties} />
      <svg className={`${styles.shield} ${styles.pop}`} style={at(base)} viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient id="assurance-shield" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3ea4e6" />
            <stop offset="1" stopColor="#2283c4" />
          </linearGradient>
        </defs>
        <path
          d="M22.6 5.1c.9-.4 1.9-.4 2.8 0L37.5 9.6c1 .4 1.5 1.3 1.5 2.3v9.4c0 9.1-6 16.5-15 20.2-9-3.7-15-11.1-15-20.2v-9.4c0-1 .5-1.9 1.5-2.3z"
          fill="url(#assurance-shield)"
        />
        <rect x="17.6" y="21.2" width="12.8" height="9.6" rx="2.2" fill="#fff" />
        <path d="M20.4 21.2v-2.6a3.6 3.6 0 0 1 7.2 0v2.6" fill="none" stroke="#fff" strokeWidth="2.2" />
        <path d="M24 24.6v2.6" stroke="#2283c4" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
    <ul className={styles.pills}>
      {SAFEGUARDS.map((s, i) => (
        <li key={s} className={`${styles.pill} ${styles.reveal}`} style={at(base + 0.4 + i * 0.12)}>
          <Glyph d={CHECK} viewBox="0 0 12 12" />
          {s}
        </li>
      ))}
    </ul>
    <span className={`${styles.soc} ${styles.reveal}`} style={at(base + 1)}>
      SOC 2 — coming 2027
    </span>
  </div>
);

const COLUMNS: { eyebrow: string; title: string; text: string; summary: string; visual: (base: number) => ReactNode }[] = [
  {
    eyebrow: "Control",
    title: "You set the rules.",
    text: "Choose the models, the knowledge and what each specialist can do. Your policies apply to every request.",
    summary:
      "Example: the Contracts Specialist is allowed to read contracts and draft replies, and sending email needs approval.",
    visual: (base) => <ControlVisual base={base} />,
  },
  {
    eyebrow: "Security",
    title: "Secure by default.",
    text: "Encryption, access roles, policies and a record of every step, built in.",
    summary: "Built in: encryption, access roles, policies and an audit record. SOC 2 — coming 2027.",
    visual: (base) => <SecurityVisual base={base} />,
  },
];

const HomeAssurance = () => {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <section className={styles.root} data-section="assurance">
      <div className={styles.header}>
        <span className={styles.eyebrow}>Control and trust</span>
        <h2 className={styles.title}>
          Your rules. Your record. <span>Your call.</span>
        </h2>
        <p className={styles.subtitle}>
          Security and governance come standard, so you can put AI specialists in front of your team and your customers
          with confidence.
        </p>
      </div>

      <div ref={ref} className={styles.grid} data-play={inView ? "1" : "0"}>
        {COLUMNS.map((c, i) => (
          <article key={c.eyebrow} className={styles.card} style={at(i * 0.12)}>
            <div className={styles.visual} aria-hidden="true">
              {c.visual(0.35 + i * 0.12)}
            </div>
            <p className={styles.srOnly}>{c.summary}</p>
            <div className={styles.body}>
              <span className={styles.cardEyebrow}>{c.eyebrow}</span>
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <p className={styles.cardText}>{c.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HomeAssurance;
