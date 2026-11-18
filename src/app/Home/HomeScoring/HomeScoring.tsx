import { useState, type CSSProperties, type ReactNode } from "react";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import { prefersReducedMotion, useInView } from "../shared";
import SpecialistMark from "../HomeShared/SpecialistMark";
import { useStageLoop } from "../HomeShared/useStageLoop";
import type { SpecialistName } from "../HomeShared/specialists";
import styles from "./HomeScoring.module.scss";

type Tone = "gray" | "red" | "blue" | "green";
type TagKey = "steady" | "slipping" | "recovered" | "improving";

const TIMING = [900, 1100, 1200, 1300, 1300, 1400, 1300];
const HOLD = 3400;
const CLIP_RIGHT = ["42%", "34%", "28%", "20%", "16%", "13%", "3%", "3%"];
const HEAD_Y = ["29.5%", "31%", "32.5%", "75%", "73.5%", "72.5%", "21.5%", "21.5%"];
const SCORED_TODAY = [18402, 18406, 18411, 18417, 18420, 18426, 18431, 18437];
const PING_ROW = [-1, 1, 2, 0, 1, 2, 0, 1];

const HISTORY = "0,13 6,13.8 12,12.4 18,13.2 24,12 30,12.8 36,11.6 42,12.5 48,11.4 54,12.2 58,11.8";
const RECENT = "58,11.8 66,12.4 72,13 80,30 84,29.4 87,29 97,8.6";

const PULSE = ["M1.5 6h2.2l1.3-3.2 2 6.4 1.3-3.2h2.2"];
const DOWN = ["M2 3.5l3.2 3.2 2-2L10 7.5", "M10 4.8v2.7H7.3"];
const UP = ["M2 8.5l3.2-3.2 2 2L10 4.5", "M7.3 4.5H10v2.7"];
const ROUTE = ["M2.2 6h6.6M6.6 3.6 9 6 6.6 8.4"];
const CHECK = ["M2.8 6.2 5 8.4l4.2-4.6"];
const FLAT = ["M2 6h8"];

const EVENTS: { tone: Tone; label: string; icon: string[]; text: string }[] = [
  { tone: "gray", label: "Scoring", icon: PULSE, text: "Each billing answer is scored and added to this line." },
  { tone: "red", label: "Slipping", icon: DOWN, text: "Billing answers dip right after the new billing policy." },
  { tone: "blue", label: "Routing updated", icon: ROUTE, text: "Billing questions now go to Finance. It scores best." },
  { tone: "green", label: "Back on track", icon: CHECK, text: "Billing answers score well again, now with Finance." },
];

const TAGS: Record<TagKey, { tone: Tone; label: string; icon: string[] }> = {
  steady: { tone: "gray", label: "Steady", icon: FLAT },
  slipping: { tone: "red", label: "Slipping", icon: DOWN },
  recovered: { tone: "green", label: "Recovered", icon: CHECK },
  improving: { tone: "green", label: "Improving", icon: UP },
};

const ROWS: { label: string; who: SpecialistName; line?: string; end?: string; tags: TagKey[] }[] = [
  { label: "Billing questions", who: "Support", tags: ["steady", "slipping", "recovered"] },
  {
    label: "Order tracking",
    who: "Support",
    line: "0,21 12.5,19 25,22 37.5,20 50,21 62.5,19 75,20.5 87.5,19.5 96,20",
    end: "50%",
    tags: ["steady"],
  },
  {
    label: "Market updates",
    who: "Research",
    line: "0,30 12.5,28 25,27 37.5,24 50,22.5 62.5,20 75,17.5 87.5,15 96,13",
    end: "32.5%",
    tags: ["improving"],
  },
];

const POINTS = [
  {
    title: "Metrics at every level",
    text: "Scores roll up live by specialist, kind of work, route and knowledge source.",
    color: "#288ed2",
    icon: ["M4 19.5h16", "M7 16v-5", "M12 16V6.5", "M17 16v-8"],
  },
  {
    title: "No quarterly surprises",
    text: "After a policy update, new documents or a model swap, you see what’s slipping the day it starts.",
    color: "#d22839",
    icon: ["M3 7l6 6 4-4 8 8", "M21 12.5V17h-4.5"],
  },
  {
    title: "Routing that learns",
    text: "Each kind of work goes to the specialist that scores best on it. When the results change, the route does too.",
    color: "#755cba",
    icon: [
      "M3 12h5c2.4 0 3.1-1 4.3-3.1L13.5 7H20",
      "M8 12c2.4 0 3.1 1 4.3 3.1L13.5 17H20",
      "M17.5 4.5 20 7l-2.5 2.5",
      "M17.5 14.5 20 17l-2.5 2.5",
    ],
  },
  {
    title: "No eval pipeline to build",
    text: "Live metrics come built in. No scoring code to write, no answers to spot-check by hand.",
    color: "#0f9b81",
    icon: ["M8.5 8 4.5 12l4 4", "M15.5 8l4 4-4 4"],
  },
];

const on = (v: boolean) => (v ? "1" : "0");
const tone = (s: number): Tone => (s <= 2 ? "blue" : s <= 5 ? "red" : "green");
const billingTag = (s: number): TagKey => (s < 3 ? "steady" : s < 6 ? "slipping" : "recovered");
const eventOf = (s: number) => (s <= 2 ? 0 : s <= 4 ? 1 : s === 5 ? 2 : 3);
const pointOf = (s: number) => (s <= 2 ? 0 : s <= 4 ? 1 : s <= 6 ? 2 : 3);

const Icon = ({ d, viewBox = "0 0 24 24", className }: { d: string[]; viewBox?: string; className?: string }) => (
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

const Tag = ({ k, active }: { k: TagKey; active?: boolean }) => (
  <span className={styles.tag} data-tone={TAGS[k].tone} data-on={on(active !== false)}>
    <Icon d={TAGS[k].icon} viewBox="0 0 12 12" />
    {TAGS[k].label}
  </span>
);

const Line = ({ points, className, children }: { points: string; className: string; children?: ReactNode }) => (
  <svg
    className={className}
    viewBox="0 0 100 40"
    preserveAspectRatio="none"
    fill="none"
    stroke="url(#hs-live-grad)"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
    <polyline points={points} vectorEffect="non-scaling-stroke" />
  </svg>
);

const HomeScoring = () => {
  const [reduced] = useState(prefersReducedMotion);
  const [revealRef, revealed] = useInView<HTMLDivElement>();
  const [loopRef, inView] = useInView<HTMLDivElement>("0px 0px -20% 0px", false);
  const active = revealed && inView;
  const s = useStageLoop(TIMING, HOLD, active, reduced);

  const point = reduced ? -1 : pointOf(s);
  const event = eventOf(s);
  const moved = on(s >= 5);
  const ping = (i: number) => PING_ROW[s] === i && active && !reduced && <i key={s} className={styles.ping} />;

  return (
    <section className={styles.root} data-section="scoring" id="technology">
      <div className={styles.header}>
        <span className={styles.eyebrow}>Our core technology</span>
        <h2 className={styles.title}>
          Scored on every answer, <span>not just once before launch</span>.
        </h2>
        <p className={styles.subtitle}>
          A test before launch is a snapshot. It goes stale as your policies, documents and models change. Our
          real-time metric system scores every answer, action and route while your AI specialists work. You see
          what’s working and what’s slipping, and routing follows the results.
        </p>
      </div>

      <div ref={revealRef} className={styles.body} data-play={on(revealed || reduced)}>
        <div className={styles.stage}>
          <div
            className={styles.panel}
            aria-hidden="true"
            data-s={s}
            data-loop={on(active && !reduced)}
            style={{ "--r": CLIP_RIGHT[s], "--y": HEAD_Y[s] } as CSSProperties}
          >
            <div className={styles.bar}>
              <span className={styles.lights}>
                <span />
                <span />
                <span />
              </span>
              <img className={styles.logo} src={butteryaiLogo} alt="" />
              <span className={styles.brand}>ButteryAI</span>
              <Icon className={styles.chevron} d={["M4.5 2.5 8 6l-3.5 3.5"]} viewBox="0 0 12 12" />
              <span className={styles.crumb}>Metrics</span>
              <span className={styles.live}>
                <span className={styles.liveDot} />
                Live
              </span>
            </div>

            <div className={styles.toolbar}>
              <span className={styles.tabs}>
                <span className={styles.tab} data-on="1">
                  Kind of work
                  <Icon className={styles.tabChevron} d={["M3 4.5 6 7.5l3-3"]} viewBox="0 0 12 12" />
                </span>
                <span className={styles.tab}>Specialist</span>
                <span className={styles.tab}>Route</span>
                <span className={styles.tab}>Source</span>
              </span>
              <span className={styles.count}>
                <b key={s}>{SCORED_TODAY[s].toLocaleString("en-US")}</b> scored today
              </span>
            </div>

            <div className={styles.chart}>
              <div className={styles.chartHead}>
                <span className={styles.kind}>Billing questions</span>
                <span className={styles.by}>
                  <span className={styles.byLabel}>Answered by</span>
                  <span className={`${styles.marks} ${styles.headMarks}`} data-moved={moved}>
                    <SpecialistMark name="Support" className={styles.mark} />
                    <SpecialistMark name="Finance" className={styles.mark} />
                  </span>
                  <span className={styles.who} data-moved={moved}>
                    <span>Support Specialist</span>
                    <span>Finance Specialist</span>
                  </span>
                </span>
              </div>

              <div className={styles.plot}>
                <span className={styles.test} />
                <span className={styles.testDot} />
                <span className={styles.testLabel}>
                  Test before launch
                  <span className={styles.fine} data-on={on(s >= 4)}>
                    Still looks fine
                  </span>
                </span>
                <span className={styles.marker} data-on={on(s >= 2)} />
                <Line points={HISTORY} className={styles.history}>
                  <defs>
                    <linearGradient id="hs-live-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0">
                      <stop offset="0" stopColor="#288ed2" />
                      <stop offset="0.72" stopColor="#288ed2" />
                      <stop offset="0.72" stopColor="#d22839" />
                      <stop offset="0.87" stopColor="#d22839" />
                      <stop offset="0.87" stopColor="#0f9b81" />
                      <stop offset="1" stopColor="#0f9b81" />
                    </linearGradient>
                  </defs>
                </Line>
                <Line points={RECENT} className={styles.recent} />
                <span className={styles.head} data-tone={tone(s)} />
              </div>

              <div className={styles.axis}>
                <span className={styles.launch}>Launch</span>
                <span className={styles.policy} data-on={on(s >= 2)}>
                  New billing policy
                </span>
                <span className={styles.now}>Now</span>
              </div>
            </div>

            <div ref={loopRef} className={styles.events}>
              {EVENTS.map((e, i) => (
                <span key={e.label} className={styles.event} data-on={on(event === i)}>
                  <span className={styles.tag} data-tone={e.tone}>
                    <Icon d={e.icon} viewBox="0 0 12 12" />
                    {e.label}
                  </span>
                  <span className={styles.etext}>{e.text}</span>
                </span>
              ))}
            </div>

            <div className={styles.kinds}>
              <span className={styles.kindsLabel}>By kind of work</span>
              <ul className={styles.rows}>
                {ROWS.map((row, i) => (
                  <li key={row.label} className={styles.row} data-sel={on(i === 0)}>
                    <span className={`${styles.marks} ${styles.rowMarks}`} data-moved={i === 0 ? moved : "0"}>
                      <SpecialistMark name={row.who} className={styles.mark} />
                      {i === 0 && <SpecialistMark name="Finance" className={styles.mark} />}
                    </span>
                    <span className={styles.rowLabel}>{row.label}</span>
                    <div className={styles.spark}>
                      {row.line ? (
                        <>
                          <Line points={row.line} className={styles.sparkLine} />
                          <span className={styles.dot} style={{ top: row.end }}>
                            {ping(i)}
                          </span>
                        </>
                      ) : (
                        <>
                          <Line points={HISTORY} className={styles.history} />
                          <Line points={RECENT} className={styles.recent} />
                          <span className={`${styles.head} ${styles.headSm}`} data-tone={tone(s)}>
                            {ping(i)}
                          </span>
                        </>
                      )}
                    </div>
                    <span className={styles.rowTags}>
                      {row.tags.map((k) => (
                        <Tag key={k} k={k} active={i === 0 ? billingTag(s) === k : true} />
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className={styles.srOnly}>
            Example: a live Metrics view in ButteryAI, shown by kind of work, with tabs to view it by specialist, route
            or source, and a running count of answers scored today. A trend line tracks how billing answers score from
            launch to now, next to a flat dashed line for the test run before launch. Right after a new billing policy,
            the live line dips and billing questions are marked slipping, while the test before launch still looks
            fine. From then on, billing questions go to the Finance Specialist, which scores best on them, instead of
            the Support Specialist, and the line climbs back on track. Below, order tracking with the Support
            Specialist holds steady and market updates with the Research Specialist keep improving.
          </p>
        </div>

        <ul className={styles.points}>
          {POINTS.map((item, i) => (
            <li
              key={item.title}
              className={styles.point}
              data-state={point === i ? "active" : "idle"}
              style={{ "--c": item.color, "--c-soft": `${item.color}1f`, "--d": `${0.1 + i * 0.08}s` } as CSSProperties}
            >
              <span className={styles.pointIcon}>
                <Icon d={item.icon} />
              </span>
              <div className={styles.pointText}>
                <h3 className={styles.pointTitle}>{item.title}</h3>
                <p className={styles.pointBody}>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HomeScoring;
