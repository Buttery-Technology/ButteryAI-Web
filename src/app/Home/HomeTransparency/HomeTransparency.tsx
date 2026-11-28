import { useState, type CSSProperties } from "react";
import { prefersReducedMotion, useInView } from "../shared";
import AnswerRecord from "./AnswerRecord";
import styles from "./HomeTransparency.module.scss";

const at = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;
const on = (v: boolean) => (v ? "1" : "0");

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

const EYE = [
  "M1.8 10s3-5.6 8.2-5.6S18.2 10 18.2 10s-3 5.6-8.2 5.6S1.8 10 1.8 10z",
  "M10 7.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z",
];
const LAYERS = ["M10 2.8 17.2 6.4 10 10 2.8 6.4z", "M2.8 10 10 13.6 17.2 10", "M2.8 13.6 10 17.2l7.2-3.6"];
const RETRY = ["M16.2 8A6.6 6.6 0 0 0 4.4 6.2", "M4 3.2v3.3h3.3", "M3.8 12a6.6 6.6 0 0 0 11.8 1.8", "M16 16.8v-3.3h-3.3"];
const TREND = ["M2.8 14.6 7.6 9.8l3 3 6.6-6.6", "M12.8 6.2h4.4v4.4"];

const POINTS = [
  {
    title: "Open any answer",
    text: "See who asked, which specialist took the request and why ButteryAI routed it there.",
    icon: EYE,
  },
  {
    title: "Sources and scores",
    text: "Each record shows any sources an answer drew on, how it scored and what it changed or is still waiting on.",
    icon: LAYERS,
  },
  {
    title: "Caught, redone and recorded",
    text: "Our real-time metric system scores every answer, action and route. When it catches a weak answer or a hallucination, the specialist redoes the work before anyone sees it, and the record shows what was caught and why.",
    icon: RETRY,
  },
  {
    title: "Better over time",
    text: "Requests go to the specialists whose answers score best, and the knowledge behind weak answers gets used less. Every answer helps the next one.",
    icon: TREND,
  },
];

const SUMMARY =
  "Example: an answer record in ButteryAI. The operations lead asked, “Are we over budget on software this quarter?” The answer: yes, once pending invoices are counted. ButteryAI routed the question to the Finance Specialist because its budget answers score best. The answer drew on the software budget spreadsheet, vendor invoices and card transactions, and earned a strong score. That score helps route the next budget question. The answer was retried once because the first draft left out pending invoices, and it was not re-routed. An updated software forecast is waiting for approval. Answers like this keep scoring stronger over time.";

const HomeTransparency = () => {
  const [reduced] = useState(prefersReducedMotion);
  const [revealRef, revealed] = useInView<HTMLDivElement>();
  const play = revealed || reduced;

  return (
    <section
      className={styles.root}
      data-section="transparency"
      id="transparency"
      aria-labelledby="transparency-title"
    >
      <div className={styles.header}>
        <span className={styles.eyebrow}>Inside every answer</span>
        <h2 id="transparency-title" className={styles.title}>
          Revolutionary transparency, <span>answers you can trust</span>.
        </h2>
        <p className={styles.subtitle}>
          Every answer from your AI specialists leaves a record your team can open. Instead of trusting a black box,
          you see how each one came together, and every score feeds back in, so routing and sources keep improving.
        </p>
      </div>

      <div ref={revealRef} className={styles.layout} data-play={on(play)}>
        <div className={`${styles.visual} ${styles.rise}`} aria-hidden="true">
          <AnswerRecord play={play} />
        </div>
        <p className={styles.srOnly}>{SUMMARY}</p>

        <ul className={styles.points}>
          {POINTS.map((p, i) => (
            <li key={p.title} className={`${styles.point} ${styles.reveal}`} style={at(0.3 + i * 0.12)}>
              <span className={styles.pointIcon}>
                <Icon d={p.icon} />
              </span>
              <div className={styles.pointText}>
                <h3 className={styles.pointTitle}>{p.title}</h3>
                <p className={styles.pointBody}>{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HomeTransparency;
