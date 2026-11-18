import type { CSSProperties } from "react";
import { openEnterpriseEmail } from "@common/contact";
import { useInView } from "../shared";
import styles from "./HomeEnterprise.module.scss";

type Plan = "keep" | "fold" | "retire";

const at = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

const Icon = ({ d, viewBox, className }: { d: readonly string[]; viewBox: string; className?: string }) => (
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

const LAYERS = ["M12 3.5 20.5 8 12 12.5 3.5 8z", "M3.5 12 12 16.5 20.5 12", "M3.5 16 12 20.5 20.5 16"];

const OFFERINGS = [
  {
    title: "Optimize your existing stack",
    text: "We review the tools you run today, keep what works and fold the rest into ButteryAI, so your team runs one system instead of a tangle.",
    icon: LAYERS,
  },
  {
    title: "Engineering services",
    text: "Our engineers build alongside yours: AI specialists, integrations with your systems and the evals that show they work.",
    icon: ["M8.5 7 3.5 12l5 5", "M15.5 7l5 5-5 5", "M13.6 4.6 10.4 19.4"],
  },
  {
    title: "From first specialist to launch",
    text: "We help you get your first specialists to market, then keep improving them after go-live.",
    icon: ["M5.5 20.5V4", "M5.5 4.5h12.3l-2.6 4.2 2.6 4.2H5.5"],
  },
];

const PLAN: Record<Plan, { label: string; icon: string[] }> = {
  keep: { label: "Keep", icon: ["M2.8 6.2 5 8.4l4.2-4.6"] },
  fold: { label: "Fold in", icon: ["M2.6 2.8v1.6c0 1.6 1.3 2.9 2.9 2.9h4", "M7.6 5.3l2 2-2 2"] },
  retire: { label: "Retire", icon: ["M3.3 6h5.4"] },
};

const TOOLS: { name: string; plan: Plan; icon: string[] }[] = [
  {
    name: "Model APIs",
    plan: "keep",
    icon: ["M8 1.9l5.3 3v6.2L8 14.1l-5.3-3V4.9z", "M2.7 4.9 8 7.9l5.3-3", "M8 7.9v6.2"],
  },
  {
    name: "Vector database",
    plan: "keep",
    icon: [
      "M2.9 4.1c0-1.1 2.3-2 5.1-2s5.1.9 5.1 2-2.3 2-5.1 2-5.1-.9-5.1-2z",
      "M2.9 4.1v7.8c0 1.1 2.3 2 5.1 2s5.1-.9 5.1-2V4.1",
      "M2.9 8c0 1.1 2.3 2 5.1 2s5.1-.9 5.1-2",
    ],
  },
  {
    name: "Orchestration framework",
    plan: "fold",
    icon: [
      "M8 2.1a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z",
      "M4 10.7a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z",
      "M12 10.7a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z",
      "M8 5.3v2.3M4 10.7V9.2c0-.9.7-1.6 1.6-1.6h4.8c.9 0 1.6.7 1.6 1.6v1.5",
    ],
  },
  {
    name: "Eval scripts",
    plan: "fold",
    icon: ["M2.4 3.3h11.2v9.4H2.4z", "M5 6.6l1.8 1.5L5 9.6", "M8.6 9.6h2.4"],
  },
  {
    name: "Monitoring dashboards",
    plan: "fold",
    icon: ["M2.2 13h11.6", "M3.4 10.2l3-3.2 2.4 2 3.8-4.4"],
  },
  {
    name: "Glue code",
    plan: "retire",
    icon: [
      "M6.9 9.1a2.5 2.5 0 0 0 3.5 0l2-2a2.5 2.5 0 0 0-3.5-3.5l-.6.6",
      "M9.1 6.9a2.5 2.5 0 0 0-3.5 0l-2 2a2.5 2.5 0 0 0 3.5 3.5l.6-.6",
    ],
  },
];

const TEAM = [
  "M6 7.4a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6z",
  "M1.9 13.2c.4-2.1 2-3.4 4.1-3.4s3.7 1.3 4.1 3.4",
  "M10.6 2.9a2.3 2.3 0 0 1 0 4.4",
  "M12 9.9c1.2.4 2 1.6 2.2 3.3",
];

const PANEL_BASE = 0.25;

const StackReview = () => {
  const [ref, inView] = useInView<HTMLElement>("0px 0px -30% 0px");

  return (
    <figure ref={ref} className={`${styles.panel} ${styles.rise}`} data-play={inView ? "1" : "0"}>
      <figcaption className={styles.panelHead}>
        <span className={styles.headIcon}>
          <Icon d={LAYERS} viewBox="0 0 24 24" />
        </span>
        <span className={styles.headText}>
          <span className={styles.headTitle}>Stack review</span>
          <span className={styles.headSub}>Your tools today, mapped to ButteryAI</span>
        </span>
      </figcaption>
      <ul className={styles.tools}>
        {TOOLS.map((t, i) => (
          <li key={t.name} className={`${styles.tool} ${styles.reveal}`} style={at(PANEL_BASE + i * 0.05)}>
            <Icon d={t.icon} viewBox="0 0 16 16" className={styles.toolIcon} />
            <span className={styles.toolName}>{t.name}</span>
            <span className={styles.srOnly}>: </span>
            <span
              className={`${styles.chip} ${styles.pop}`}
              data-plan={t.plan}
              style={at(PANEL_BASE + 0.25 + i * 0.07)}
            >
              <Icon d={PLAN[t.plan].icon} viewBox="0 0 12 12" />
              {PLAN[t.plan].label}
            </span>
          </li>
        ))}
      </ul>
      <div className={`${styles.support} ${styles.reveal}`} style={at(PANEL_BASE + 0.6)}>
        <Icon d={TEAM} viewBox="0 0 16 16" className={styles.supportIcon} />
        <span className={styles.supportText}>
          <span className={styles.supportName}>Engineering support</span>
          <span className={styles.srOnly}>: </span>
          <span className={styles.team}>
            <span className={styles.teamDot} aria-hidden="true" />
            Your Buttery team
          </span>
        </span>
      </div>
    </figure>
  );
};

const HomeEnterprise = () => {
  const [ref, inView] = useInView<HTMLUListElement>();

  return (
    <section id="enterprise" className={styles.root} data-section="enterprise">
      <header className={styles.header}>
        <span className={styles.eyebrow}>For Enterprise</span>
        <h2 className={styles.title}>
          We help you <span>get to market</span>.
        </h2>
        <p className={styles.subtitle}>
          ButteryAI runs in your cloud or on your own hardware. Our engineers work with your team to tune the stack you
          already have and ship your AI specialists.
        </p>
      </header>

      <div className={styles.body}>
        <ul ref={ref} className={styles.offerings} data-play={inView ? "1" : "0"}>
          {OFFERINGS.map((o, i) => (
            <li key={o.title} className={`${styles.offering} ${styles.rise}`} style={at(i * 0.12)}>
              <span className={styles.offeringIcon}>
                <Icon d={o.icon} viewBox="0 0 24 24" />
              </span>
              <div className={styles.offeringText}>
                <h3 className={styles.offeringTitle}>{o.title}</h3>
                <p className={styles.offeringBody}>{o.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <StackReview />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.btnPrimary} onClick={openEnterpriseEmail}>
          Talk to sales
        </button>
      </div>
    </section>
  );
};

export default HomeEnterprise;
