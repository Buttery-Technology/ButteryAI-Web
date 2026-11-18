import { useState, type CSSProperties, type RefObject } from "react";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import { prefersReducedMotion, useInView } from "../shared";
import SpecialistMark from "../HomeShared/SpecialistMark";
import { useStageLoop } from "../HomeShared/useStageLoop";
import styles from "./HomeEvaluation.module.scss";

type Status = "hidden" | "checking" | "caught" | "retry" | "passed";

const TIMING = [700, 900, 1100, 1000, 1100, 1100, 1300, 1100];
const HOLD = 3400;

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

const STATUS: Record<Exclude<Status, "hidden">, { label: string; d: string[] }> = {
  checking: { label: "Checking", d: ["M2.6 8.6a3.4 3.4 0 0 1 6.8 0M6 8.6l1.7-2.1"] },
  caught: { label: "Caught", d: ["M6 2.9v3.9M6 9.1v.1"] },
  retry: { label: "Retried", d: ["M9.1 6.2A3.1 3.1 0 1 1 8.2 4M8.6 1.9v2.3H6.3"] },
  passed: { label: "Passed", d: ["M2.8 6.2 5 8.4l4.2-4.6"] },
};
const ORDER: Exclude<Status, "hidden">[] = ["checking", "caught", "retry", "passed"];

const CHECKS: { name: string; yours?: boolean; must?: boolean }[] = [
  { name: "Stays on topic" },
  { name: "Clear, friendly tone" },
  { name: "Quotes the current price list", yours: true },
  { name: "Discounts over 15% need a sales lead", yours: true, must: true },
];

const PLUS = ["M6 2.5v7M2.5 6h7"];
const PRICE = ["M3.3 1.8h3.5l2 2v6.4H3.3z", "M4.9 6.3h2.3M4.9 8.1h2.3"];
const ALERT = ["M8 1.6a6.4 6.4 0 1 0 0 12.8A6.4 6.4 0 0 0 8 1.6z", "M8 4.9v3.5M8 11v.1"];
const TARGET = ["M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14z", "M10 6.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8z", "M10 9.6v.8"];
const SHIELD = ["M10 2.4l6 2.3v4.7c0 3.9-2.6 6.7-6 8.2-3.4-1.5-6-4.3-6-8.2V4.7z", "M7.4 10l1.8 1.8 3.4-3.6"];
const GROW = ["M3 15.5l4.2-4.4 3 3 6-6.4", "M12.4 7.7h3.8v3.8"];
const SLIDERS = ["M3.5 6h13M3.5 14h13", "M7.5 3.8v4.4M12.5 11.8v4.4"];

const POINTS = [
  {
    title: "Held to your standard",
    text: "Answers are scored on your rules, prices and policies, not just a generic checklist.",
    icon: TARGET,
  },
  {
    title: "Caught before anyone sees it",
    text: "Anything under your bar is retried or re-routed first.",
    icon: SHIELD,
  },
  {
    title: "Better at your work",
    text: "Every score feeds our real-time metric system, so specialists improve at what matters to you.",
    icon: GROW,
  },
  {
    title: "Change it anytime",
    text: "When a policy changes, update the check. The next answer is scored the new way.",
    icon: SLIDERS,
  },
];

const SUMMARY =
  "Example: the Sales Specialist’s evaluation settings. Two built-in checks, stays on topic and clear, friendly tone, are joined by two of your own: quotes the current price list, and discounts over 15% need a sales lead, which must pass. The bar is raised to strict. A customer asks for 20% off a two-year plan. The draft says yes. The built-in checks pass it, but your checks catch it, and the specialist retries. The new answer offers 15% off and says the sales lead has been asked about going further, quoting Price list 2026, and passes your checks.";

const builtInFor = (s: number): Status => (s < 4 ? "hidden" : s === 4 ? "checking" : "passed");
const yoursFor = (s: number): Status =>
  s < 4 ? "hidden" : s <= 5 ? "checking" : s === 6 ? "caught" : s === 7 ? "retry" : "passed";

const Chips = ({ status }: { status: Status }) => (
  <span className={styles.chips}>
    {ORDER.map((k) => (
      <span key={k} className={styles.chip} data-tone={k} data-on={on(status === k)}>
        <Icon d={STATUS[k].d} viewBox="0 0 12 12" />
        {STATUS[k].label}
      </span>
    ))}
  </span>
);

const Settings = ({ s }: { s: number }) => (
  <div className={styles.settings}>
    <span className={styles.paneLabel}>Scored on</span>
    <ul className={styles.checks}>
      {CHECKS.map((c, i) => {
        const shown = !c.yours || s >= i - 1;
        const tone = c.must && s >= 6 ? (s >= 8 ? "good" : "bad") : "none";
        return (
          <li key={c.name} className={styles.check} data-shown={on(shown)} data-tone={tone}>
            <span className={styles.toggle} data-on={on(shown)} />
            <span className={styles.checkText}>
              <span className={styles.checkName}>{c.name}</span>
              <span className={styles.tags}>
                <span className={styles.tag} data-tone={c.yours ? "yours" : "builtin"}>
                  {c.yours ? "Yours" : "Built in"}
                </span>
                {c.must && (
                  <span className={styles.tag} data-tone="must">
                    Must pass
                  </span>
                )}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
    <span className={styles.add} data-pressed={on(s === 1)}>
      <Icon d={PLUS} viewBox="0 0 12 12" />
      Add a check
    </span>
    <div className={styles.bar2} data-strict={on(s >= 2)}>
      <span className={styles.barHead}>
        <span className={styles.barLabel}>The bar</span>
        <span className={styles.barValue}>
          <span>Balanced</span>
          <span>Strict</span>
        </span>
      </span>
      <span className={styles.track}>
        <i />
        <b />
      </span>
    </div>
  </div>
);

const Answer = ({ s, answerRef }: { s: number; answerRef: RefObject<HTMLDivElement | null> }) => {
  const builtIn = builtInFor(s);
  const yours = yoursFor(s);
  return (
    <div ref={answerRef} className={styles.answer}>
      <span className={styles.paneLabel}>Live answer</span>
      <p className={styles.request} data-on={on(s >= 3)}>
        <span className={styles.from}>Customer</span>
        Can you do 20% off if we sign for two years?
      </p>
      <div className={styles.reply} data-on={on(s >= 4)}>
        <SpecialistMark name="Sales" className={styles.mark} />
        <span className={styles.replyBody}>
          <span className={styles.who}>Sales Specialist</span>
          <span className={styles.swap}>
            <span className={styles.draft} data-state={yours}>
              Yes, we can do <span className={styles.flagged}>20% off</span> on a two-year plan.
            </span>
            <span className={styles.final} data-on={on(s >= 8)}>
              We can do <b>15% off</b> on a two-year plan. I’ve asked our sales lead about going further.
            </span>
          </span>
        </span>
      </div>
      <div className={styles.scores} data-on={on(s >= 4)}>
        <span className={styles.score}>
          <span className={styles.scoreName}>Built-in checks</span>
          <Chips status={builtIn} />
        </span>
        <span className={styles.score} data-yours="1">
          <span className={styles.scoreName}>Your checks</span>
          <Chips status={yours} />
        </span>
        <span className={styles.swap}>
          <span className={styles.note} data-tone="caught" data-on={on(s === 6)}>
            Discounts over 15% need a sales lead.
          </span>
          <span className={styles.note} data-tone="retry" data-on={on(s === 7)}>
            Sent back with your rule.
          </span>
          <span className={styles.source} data-on={on(s >= 8)}>
            <Icon d={PRICE} viewBox="0 0 12 12" />
            Price list 2026
          </span>
        </span>
      </div>
    </div>
  );
};

const HomeEvaluation = () => {
  const [reduced] = useState(prefersReducedMotion);
  const [ref, revealed] = useInView<HTMLDivElement>();
  const [loopRef, inView] = useInView<HTMLDivElement>("0px 0px -20% 0px", false);
  const s = useStageLoop(TIMING, HOLD, revealed && inView, reduced);
  const play = revealed || reduced;

  return (
    <section className={styles.root} data-section="evaluation" id="evaluation">
      <div className={styles.header}>
        <span className={styles.eyebrow}>Custom evaluation</span>
        <h2 className={styles.title}>
          You decide <span>what good looks like</span>.
        </h2>
        <p className={styles.subtitle}>
          Generic checks only catch generic mistakes. Your business has its own rules: the discounts you can offer, the
          price list to quote, the tone to use. Choose what each specialist is scored on and how high the bar is.
        </p>
      </div>

      <div ref={ref} className={styles.layout} data-play={on(play)}>
        <div className={`${styles.window} ${styles.rise}`} aria-hidden="true" data-s={s}>
          <div className={styles.bar}>
            <span className={styles.lights}>
              <span />
              <span />
              <span />
            </span>
            <span className={styles.crumb}>
              <img className={styles.logo} src={butteryaiLogo} alt="" />
              <span className={styles.brand}>ButteryAI</span>
              <Icon className={styles.chevron} d={["M4.5 2.5 8 6l-3.5 3.5"]} viewBox="0 0 12 12" />
              <span className={`${styles.crumbText} ${styles.wideOnly}`}>Sales Specialist</span>
              <Icon className={`${styles.chevron} ${styles.wideOnly}`} d={["M4.5 2.5 8 6l-3.5 3.5"]} viewBox="0 0 12 12" />
              <span className={styles.crumbText}>Evaluation</span>
            </span>
          </div>
          <div className={styles.panes}>
            <Settings s={s} />
            <Answer s={s} answerRef={loopRef} />
          </div>
        </div>
        <p className={styles.srOnly}>{SUMMARY}</p>

        <p className={styles.tension} data-on={on(s >= 6)}>
          <Icon className={styles.tensionIcon} d={ALERT} viewBox="0 0 16 16" />
          Built-in checks alone would have sent the 20% offer.
        </p>

        <ul className={styles.points}>
          {POINTS.map((p, i) => (
            <li key={p.title} className={`${styles.point} ${styles.reveal}`} style={at(0.3 + i * 0.1)}>
              <span className={styles.pointIcon}>
                <Icon d={p.icon} />
              </span>
              <p className={styles.pointText}>
                <b>{p.title}</b> {p.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HomeEvaluation;
