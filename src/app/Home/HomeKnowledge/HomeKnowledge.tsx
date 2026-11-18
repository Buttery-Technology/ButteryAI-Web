import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import { prefersReducedMotion, useInView } from "../shared";
import styles from "./HomeKnowledge.module.scss";

type Kind = "doc" | "page" | "scan";
type Tone = "good" | "warn" | "bad";

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

const FILES = ["M7 2.8h5.4l3 3V14H7z", "M12.2 2.9v3.1h3.1", "M4.6 6.2v10.9h8.2"];
const FUNNEL = ["M3.2 4h13.6l-5.3 6.2v5.6l-3-1.6v-4z"];
const LOOKUP = [
  "M10.4 17H4.2V3h6.4l3.2 3.2v2.4",
  "M10.4 3.1v3.2h3.3",
  "M13.4 10.6a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8z",
  "M15.5 15.5l2.1 2.1",
];
const GAUGE = ["M3 14a7 7 0 0 1 14 0", "M10 14l3.4-3.8", "M10 12.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"];
const FADE = ["M2.8 5.8l5 5 3-3 6.2 6.2", "M17 9.7V14h-4.3"];
const LOCK = ["M4.8 8.8h10.4v8.4H4.8z", "M7 8.8V6.4a3 3 0 0 1 6 0v2.4", "M10 12v1.6"];

const TEXT_FILE = ["M4.5 2.5h4.6L11.8 5.2v8.3H4.5z", "M9 2.6v2.8h2.7", "M6.6 8.4h3M6.6 10.8h3"];
const FOLDER = ["M2.5 4.4h3.6l1.4 1.5h6v6.6h-11z"];
const LESS = ["M2.3 3.8l3 3 1.5-1.5 2.9 2.9", "M9.7 5.6v2.6H7.1"];
const SOURCE_ICON: Record<Kind, string[]> = {
  doc: ["M3.3 1.8h3.5l2 2v6.4H3.3z", "M4.9 6.3h2.3M4.9 8.1h2.3"],
  page: [
    "M6 1.8a4.2 4.2 0 1 0 0 8.4 4.2 4.2 0 0 0 0-8.4z",
    "M1.9 6h8.2",
    "M6 1.8C7.1 3 7.6 4.4 7.6 6S7.1 9 6 10.2C4.9 9 4.4 7.6 4.4 6S4.9 3 6 1.8z",
  ],
  scan: ["M2 4V2.4h1.6M8.4 2.4H10V4M10 8v1.6H8.4M3.6 9.6H2V8", "M3.8 6h4.4"],
};

const NOTES: { text: string; flag?: { text: string; tone: "warn" | "bad"; delay: number } }[] = [
  { text: "Refund window is 30 days" },
  { text: "Support: weekdays, 9 to 5" },
  { text: "Returns: old warehouse address", flag: { text: "out of date?", tone: "warn", delay: 0.95 } },
  { text: "Invoices: card or bank transfer" },
  { text: "" },
  { text: "Refunds up to 60 days, no receipt", flag: { text: "contradicts line 1", tone: "bad", delay: 1.2 } },
];

const FACTS: { fact: string; source: string; kind: Kind; uses: number; level: number; weak?: boolean }[] = [
  {
    fact: "Refunds are accepted within 30 days of delivery.",
    source: "Refund policy 2026.pdf",
    kind: "doc",
    uses: 1284,
    level: 94,
  },
  { fact: "Support is open on weekdays, 9 to 5.", source: "Support handbook.docx", kind: "doc", uses: 962, level: 91 },
  { fact: "Returns go to the returns center.", source: "Help center: Returns", kind: "page", uses: 418, level: 88 },
  {
    fact: "Invoices can be paid by card or bank transfer.",
    source: "Scanned invoice.pdf",
    kind: "scan",
    uses: 237,
    level: 90,
  },
  { fact: "Refunds are accepted up to 60 days.", source: "Old FAQ draft.docx", kind: "doc", uses: 31, level: 60, weak: true },
];

const WEAK = FACTS.findIndex((f) => f.weak);
const WEAK_TICKS = [2, 4, 6];
const WEAK_LEVELS = [42, 24, 12];
const HEALTHY_ORDER = [0, 1, 2, 0, 3, 1, 2, 0, 1, 3];
const WOBBLE = [2, -3, 1, 3, -2, -1, 3, -3, 2, -2, 1, -1];
const TICK_MS = 1400;
const FIRST_MS = 2400;
const RESUME_MS = 900;

type Live = { uses: number[]; levels: number[]; hits: number[]; faded: boolean };

const startState = (): Live => ({
  uses: FACTS.map((f) => f.uses),
  levels: FACTS.map((f) => f.level),
  hits: FACTS.map(() => 0),
  faded: false,
});

const endState = (): Live => ({
  ...startState(),
  levels: FACTS.map((f) => (f.weak ? WEAK_LEVELS[WEAK_LEVELS.length - 1] : f.level)),
  faded: true,
});

const advance = (s: Live, n: number): Live => {
  const drop = WEAK_TICKS.indexOf(n);
  const h = n - 1 - WEAK_TICKS.filter((t) => t < n).length;
  const row = drop >= 0 ? WEAK : HEALTHY_ORDER[h % HEALTHY_ORDER.length];
  const level =
    drop >= 0 ? WEAK_LEVELS[drop] : Math.min(97, Math.max(85, s.levels[row] + WOBBLE[h % WOBBLE.length]));
  return {
    uses: s.uses.map((v, i) => (i === row ? v + 1 : v)),
    levels: s.levels.map((v, i) => (i === row ? level : v)),
    hits: s.hits.map((v, i) => (i === row ? v + 1 : v)),
    faded: s.faded || drop === WEAK_TICKS.length - 1,
  };
};

const toneOf = (weak: boolean, level: number): Tone => (!weak ? "good" : level >= 50 ? "warn" : "bad");

const POINTS = [
  { title: "Bring any document", text: "PDFs, scans, Office files and whole folders.", icon: FILES },
  {
    title: "Only what’s needed",
    text: "Each answer pulls just the pieces it needs, not the whole pile.",
    icon: FUNNEL,
  },
  {
    title: "Every fact has a source",
    text: "Each fact records where it came from, and you can look it up any time.",
    icon: LOOKUP,
  },
  {
    title: "Scored every time it’s used",
    text: "Each time a source feeds an answer, our real-time metric system scores the answer and updates the source’s usage and reliability on the spot.",
    icon: GAUGE,
  },
  {
    title: "Weak sources fade out",
    text: "Sources earn their reliability score from how their answers scored. Ones that keep scoring badly get used less.",
    icon: FADE,
  },
  {
    title: "Yours to keep",
    text: "Encrypted, and stored where ButteryAI runs. Copy it, back it up or delete it.",
    icon: LOCK,
  },
];

const SUMMARY =
  "Example: in most AI tools today, a plain knowledge.txt file says the refund window is 30 days in one line and 60 days in another, with nothing to say where either came from. With ButteryAI, the same facts each carry a source tag, a count of how often they have been used and a reliability meter that updates as their answers are scored. The 60-day line comes from Old FAQ draft.docx; its reliability falls and it is marked fading out.";

const Lights = () => (
  <span className={styles.lights}>
    <span />
    <span />
    <span />
  </span>
);

const Notes = () => (
  <div className={styles.window}>
    <div className={styles.bar}>
      <Lights />
      <span className={styles.crumb}>
        <Icon d={TEXT_FILE} viewBox="0 0 16 16" className={styles.fileIcon} />
        <span className={styles.crumbText}>knowledge.txt</span>
      </span>
    </div>
    <div className={styles.text}>
      {NOTES.map((line, i) => (
        <p key={i} className={styles.textLine}>
          {line.text}
          {line.flag && (
            <span className={styles.flag} data-tone={line.flag.tone} style={at(line.flag.delay)}>
              <span className={styles.flagDot} />
              {line.flag.text}
            </span>
          )}
        </p>
      ))}
      <p className={styles.textLine}>
        <span className={styles.caret} />
      </p>
    </div>
  </div>
);

const Knowledge = ({ live, weakRef }: { live: Live; weakRef: RefObject<HTMLLIElement | null> }) => (
  <div className={styles.window}>
    <div className={styles.bar}>
      <Lights />
      <span className={styles.crumb}>
        <img className={styles.logo} src={butteryaiLogo} alt="" />
        <span className={styles.brand}>ButteryAI</span>
        <Icon className={styles.chevron} d={["M4.5 2.5 8 6l-3.5 3.5"]} viewBox="0 0 12 12" />
        <span className={styles.crumbText}>Knowledge</span>
      </span>
      <span className={styles.live}>
        <span className={styles.liveDot} />
        Live
      </span>
    </div>
    <div className={styles.kb} data-ticking={on(live.hits.some((h) => h > 0))}>
      <span className={styles.group}>
        <Icon d={FOLDER} viewBox="0 0 16 16" />
        Customer support
      </span>
      <ul className={styles.facts}>
        {FACTS.map((f, i) => (
          <li
            key={f.source}
            ref={f.weak ? weakRef : undefined}
            className={styles.fact}
            data-tone={toneOf(!!f.weak, live.levels[i])}
            data-faded={on(!!f.weak && live.faded)}
            style={at(0.45 + i * 0.12)}
          >
            <span className={styles.factText}>{f.fact}</span>
            <span className={styles.meta}>
              <span className={styles.source}>
                <span className={styles.tag} style={at(0.9 + i * 0.16)}>
                  <Icon d={SOURCE_ICON[f.kind]} viewBox="0 0 12 12" />
                  {f.source}
                </span>
                {f.weak && (
                  <span className={styles.less}>
                    <Icon d={LESS} viewBox="0 0 12 12" />
                    Fading out
                  </span>
                )}
              </span>
              <span className={styles.usage}>
                Used{" "}
                <b key={live.hits[i]} className={styles.count} data-hit={on(live.hits[i] > 0)}>
                  {live.uses[i].toLocaleString("en-US")}
                </b>{" "}
                times
              </span>
              <span className={styles.meter}>
                <span className={styles.meterLabel}>Reliability</span>
                <span className={styles.track}>
                  <i style={{ "--v": live.levels[i] / 100 } as CSSProperties} />
                </span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const HomeKnowledge = () => {
  const [reduced] = useState(prefersReducedMotion);
  const [ref, revealed] = useInView<HTMLDivElement>();
  const [liveRef, onScreen] = useInView<HTMLLIElement>("0px 0px -20% 0px", false);
  const [live, setLive] = useState<Live>(() => (reduced ? endState() : startState()));
  const tickRef = useRef(0);
  const revealedAt = useRef(0);
  const running = !reduced && revealed && onScreen;

  useEffect(() => {
    if (revealed) revealedAt.current = performance.now();
  }, [revealed]);

  useEffect(() => {
    if (!running) return;
    let interval = 0;
    const tick = () => {
      const n = ++tickRef.current;
      setLive((s) => advance(s, n));
    };
    const sinceReveal = performance.now() - revealedAt.current;
    const wait = tickRef.current ? RESUME_MS : Math.max(RESUME_MS, FIRST_MS - sinceReveal);
    const timeout = window.setTimeout(() => {
      tick();
      interval = window.setInterval(tick, TICK_MS);
    }, wait);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [running]);

  return (
    <section className={styles.root} data-section="knowledge" id="knowledge">
      <div className={styles.header}>
        <span className={styles.eyebrow}>Knowledge</span>
        <h2 className={styles.title}>
          Knowledge that <span>knows its sources</span>.
        </h2>
        <p className={styles.subtitle}>
          Most AI tools keep what they know in a plain text file. The model reads all of it, nothing says where a fact
          came from, and a bad source keeps showing up in answers. ButteryAI scores your knowledge in real time, every
          time it’s used.
        </p>
      </div>

      <div ref={ref} className={styles.layout} data-play={on(revealed || reduced)}>
        <div className={styles.visual} data-live={on(running)} aria-hidden="true">
          <div className={`${styles.col} ${styles.rise}`} style={at(0)}>
            <span className={styles.caption}>Most AI tools today</span>
            <Notes />
          </div>
          <div className={`${styles.col} ${styles.rise}`} style={at(0.15)}>
            <span className={styles.caption} data-tone="brand">
              With ButteryAI
            </span>
            <Knowledge live={live} weakRef={liveRef} />
          </div>
        </div>
        <p className={styles.srOnly}>{SUMMARY}</p>

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

export default HomeKnowledge;
