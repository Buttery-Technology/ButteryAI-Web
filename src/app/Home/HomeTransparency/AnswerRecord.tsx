import type { CSSProperties } from "react";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import SpecialistMark from "../HomeShared/SpecialistMark";
import styles from "./AnswerRecord.module.scss";

const at = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

const Icon = ({ d, viewBox = "0 0 20 20", className }: { d: string[]; viewBox?: string; className?: string }) => (
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

const CHEVRON = ["M4.5 2.5 8 6l-3.5 3.5"];

const SOURCES = [
  { label: "Software budget.xlsx", d: ["M2.3 2.3h7.4v7.4H2.3z", "M2.3 4.9h7.4M2.3 7.3h7.4M5 4.9v4.8"] },
  { label: "Vendor invoices", d: ["M3.3 1.8h3.5l2 2v6.4H3.3z", "M4.9 6.3h2.3M4.9 8.1h2.3"] },
  { label: "Card transactions", d: ["M1.8 3.2h8.4v5.6H1.8z", "M1.8 5h8.4", "M3.4 7.2h1.8"] },
];

const ROWS = [
  {
    label: "Handled by",
    value: (
      <>
        <SpecialistMark name="Finance" className={styles.mark} />
        <span className={styles.strong}>Finance Specialist</span>
        <span className={`${styles.note} ${styles.wide}`}>Chosen because its budget answers score best</span>
      </>
    ),
  },
  {
    label: "Sources",
    value: SOURCES.map((s, i) => (
      <span key={s.label} className={`${styles.tag} ${styles.source}`} data-tone="blue" style={at(0.45 + i * 0.1)}>
        <Icon d={s.d} viewBox="0 0 12 12" />
        <span className={styles.tagText}>{s.label}</span>
      </span>
    )),
  },
  {
    label: "Score",
    value: (
      <>
        <span className={styles.meter}>
          <span />
        </span>
        <span className={styles.strong}>Strong</span>
        <span className={`${styles.note} ${styles.wide}`}>This score helps route the next budget question</span>
      </>
    ),
  },
  {
    label: "Retried",
    value: (
      <>
        <span className={styles.tag} data-tone="neutral">
          Once
        </span>
        <span className={styles.note}>The first draft left out pending invoices</span>
      </>
    ),
  },
  {
    label: "Re-routed",
    value: <span className={styles.note}>No</span>,
  },
  {
    label: "Changes",
    value: (
      <>
        <span className={styles.strong}>Updated software forecast</span>
        <span className={styles.note}>Waiting for approval</span>
      </>
    ),
  },
];

const AnswerRecord = ({ play }: { play: boolean }) => (
  <div className={styles.window} data-play={play ? "1" : "0"}>
    <div className={styles.bar}>
      <span className={styles.lights}>
        <span />
        <span />
        <span />
      </span>
      <img className={styles.logo} src={butteryaiLogo} alt="" />
      <span className={styles.brand}>ButteryAI</span>
      <Icon d={CHEVRON} viewBox="0 0 12 12" className={styles.chevron} />
      <span className={styles.crumb}>Answer record</span>
    </div>

    <div className={styles.body}>
      <div className={styles.top}>
        <span className={styles.label}>
          Asked by <span className={styles.labelMeta}>Operations lead</span>
        </span>
        <span className={styles.requestText}>Are we over budget on software this quarter?</span>
        <span className={`${styles.label} ${styles.answerLabel}`}>Answer</span>
        <span className={styles.answerText}>Yes, once pending invoices are counted.</span>
      </div>

      <dl>
        {ROWS.map((row, i) => (
          <div key={row.label} className={styles.row} style={at(0.2 + i * 0.08)}>
            <dt className={styles.dt}>{row.label}</dt>
            <dd className={styles.dd}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>

    <div className={styles.footer}>
      <span className={styles.footLabel}>Answers like this</span>
      <svg className={styles.trend} viewBox="0 0 88 24" fill="none">
        <path className={styles.trendLine} d="M2 20L14 17L26 18L38 13L50 14L62 9L74 8L86 4" pathLength={1} />
        <circle className={styles.trendDot} cx="86" cy="4" r="2.5" />
      </svg>
      <span className={styles.footStatus}>Scoring stronger over time</span>
    </div>
  </div>
);

export default AnswerRecord;
