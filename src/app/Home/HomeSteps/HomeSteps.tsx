import { useEffect, useRef, useState, type CSSProperties } from "react";
import { HEX_PATH, HEX_VIEWBOX, SPECIALISTS, prefersReducedMotion, useInView } from "../shared";
import styles from "./HomeSteps.module.scss";

const PROMPT = "Review supplier contracts and flag risky terms";
const CAPABILITIES = ["Read contracts", "Cite the clause", "Flag risky terms"];
const FILES = [
  { name: "Supply agreements.pdf", kind: "pdf" },
  { name: "Legal playbook.docx", kind: "doc" },
  { name: "Vendor list.xlsx", kind: "xls" },
] as const;
const ACCESS = [
  { team: "Legal", level: "Can use", status: "trusted", tone: "blue" },
  { team: "Sales", level: "Can use", status: "trusted", tone: "violet" },
  { team: "Partners", level: "Ask first", status: "routed", tone: "green" },
] as const;
const CONTRACTS = SPECIALISTS[0];

const STEPS = [
  {
    title: "Describe the job",
    text: "Say what the specialist is for and what it needs to do.",
    summary:
      "Example: typing “Review supplier contracts and flag risky terms” gives the specialist three capabilities: read contracts, cite the clause and flag risky terms.",
  },
  {
    title: "Give it what it knows",
    text: "Add your documents, data and rules. Pick the model that fits, in the cloud or on your own hardware, and swap it anytime.",
    summary:
      "Example: supply agreements, a legal playbook and a vendor list are added, the rule “Always quote the source” is on, and a best-fit model runs in the cloud or on your hardware.",
  },
  {
    title: "Publish and share",
    text: "Put it to work for your team, or share it beyond. You decide who uses it and what it can touch.",
    summary: "Example: the Contracts Specialist is published. Legal and Sales can use it, and Partners ask first.",
  },
];

const TYPE_START = 160;
const TYPE_STEP = 24;
const ENTER = 450;
const TIMELINE = [
  { at: [0, TYPE_START + PROMPT.length * TYPE_STEP + 140, TYPE_START + PROMPT.length * TYPE_STEP + 560], done: 2250 },
  { at: [0, 720, 1020, 1480], done: 1900 },
  { at: [0, 320], done: 950 },
];
const FINAL = TIMELINE.map((t) => t.at.length);

const on = (v: boolean) => (v ? "1" : "0");

const Icon = ({ d, viewBox, className, weight = 1.6 }: { d: string[]; viewBox: string; className?: string; weight?: number }) => (
  <svg
    className={className}
    viewBox={viewBox}
    fill="none"
    stroke="currentColor"
    strokeWidth={weight}
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
const SEND = ["M6 9.4V2.9M3.4 5.4 6 2.8l2.6 2.6"];
const UPLOAD = ["M8 10.2V3.2M5.3 5.8 8 3.1l2.7 2.7", "M3 10.4v1.4c0 .9.7 1.6 1.6 1.6h6.8c.9 0 1.6-.7 1.6-1.6v-1.4"];
const SHIELD = ["M10 2.4l6 2.3v4.7c0 3.9-2.6 6.7-6 8.2-3.4-1.5-6-4.3-6-8.2V4.7z", "M7.4 10l1.8 1.8 3.4-3.6"];
const CUBE = ["M10 2.6l6.4 3.7v7.4L10 17.4l-6.4-3.7V6.3z", "M3.6 6.3 10 10l6.4-3.7", "M10 10v7.4"];
const SWAP = ["M3 5.5h9.5M10 3l2.5 2.5L10 8", "M13 10.5H3.5M6 8l-2.5 2.5L6 13"];

const GhostHex = () => (
  <svg className={styles.ghostHex} viewBox={HEX_VIEWBOX} aria-hidden="true">
    <path d={HEX_PATH} />
    <path d="M33 12.8v10.4M27.8 18h10.4" />
  </svg>
);

const ContractsMark = () => (
  <svg className={styles.specMark} viewBox={HEX_VIEWBOX} aria-hidden="true">
    <path d={HEX_PATH} fill={CONTRACTS.color} />
    <g
      transform="translate(15 0) scale(1.5)"
      fill="none"
      stroke="#fff"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.3 7h3.5l2.1 2.1V17H9.3z" />
      <path d="M11 12.2h2.2M11 14.5h2.2" />
    </g>
  </svg>
);

const FileIcon = ({ kind }: { kind: "pdf" | "doc" | "xls" }) => (
  <svg className={styles.fileIcon} data-kind={kind} viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 1.8h5.1l3.3 3.3v8.3c0 .5-.4.8-.8.8H4c-.5 0-.8-.3-.8-.8V2.6c0-.5.3-.8.8-.8z" />
    <path d="M9.1 1.8v3.3h3.3" />
  </svg>
);

const Describe = ({ s, typed }: { s: number; typed: number }) => (
  <div className={styles.window}>
    <div className={styles.head}>
      <GhostHex />
      <span>New specialist</span>
    </div>
    <div className={styles.field} data-focus={on(s === 1)}>
      <span className={styles.fieldText}>
        {typed > 0 && PROMPT.slice(0, typed)}
        <span className={styles.caret} data-on={on(s === 1)} />
        {typed === 0 && <span className={styles.placeholder}>What should it do?</span>}
      </span>
      <span className={styles.send} data-ready={on(typed >= PROMPT.length)} data-sent={on(s >= 2)}>
        <Icon d={SEND} viewBox="0 0 12 12" weight={1.7} />
      </span>
    </div>
    <div className={styles.caps}>
      {CAPABILITIES.map((c, k) => (
        <span key={c} className={styles.cap} data-on={on(s >= 2)} style={{ "--k": k } as CSSProperties}>
          <Icon d={CHECK} viewBox="0 0 12 12" weight={1.7} />
          {c}
        </span>
      ))}
    </div>
  </div>
);

const Knowledge = ({ s }: { s: number }) => (
  <div className={styles.window}>
    <div className={styles.files}>
      <div className={styles.drop} data-gone={on(s >= 1)}>
        <Icon d={UPLOAD} viewBox="0 0 16 16" weight={1.5} />
        Drop files here
      </div>
      {FILES.map((f, k) => (
        <div key={f.name} className={styles.file} data-on={on(s >= 1)} style={{ "--k": k } as CSSProperties}>
          <FileIcon kind={f.kind} />
          <span className={styles.fileName}>{f.name}</span>
          <Icon d={CHECK} viewBox="0 0 12 12" className={styles.fileCheck} weight={1.7} />
        </div>
      ))}
    </div>
    <div className={styles.rule}>
      <Icon d={SHIELD} viewBox="0 0 20 20" className={styles.ruleIcon} weight={1.6} />
      <span className={styles.ruleText}>Always quote the source</span>
      <span className={styles.toggle} data-on={on(s >= 2)}>
        <span className={styles.knob} />
      </span>
    </div>
    <div className={styles.model} data-on={on(s >= 3)}>
      <span className={styles.modelMark}>
        <Icon d={CUBE} viewBox="0 0 20 20" weight={1.6} />
      </span>
      <span className={styles.modelText}>
        <span className={styles.modelName}>Best-fit model</span>
        <span className={styles.modelSub}>Cloud or your hardware</span>
      </span>
      <span className={styles.swap}>
        <Icon d={SWAP} viewBox="0 0 16 16" weight={1.5} />
      </span>
    </div>
  </div>
);

const Publish = ({ s }: { s: number }) => (
  <div className={styles.window}>
    <div className={styles.specHead}>
      <ContractsMark />
      <span className={styles.specInfo}>
        <span className={styles.specName}>{CONTRACTS.name} Specialist</span>
        <span className={styles.publish}>
          <span className={styles.publishBtn} data-press={on(s === 1)} data-gone={on(s >= 2)}>
            Publish
          </span>
          <span className={`${styles.chip} ${styles.published}`} data-status="trusted" data-on={on(s >= 2)}>
            <Icon d={CHECK} viewBox="0 0 12 12" weight={1.7} />
            Published
          </span>
        </span>
      </span>
    </div>
    <div className={styles.accessLabel}>Who can use it</div>
    <div className={styles.access}>
      {ACCESS.map((a, k) => (
        <div key={a.team} className={styles.row} style={{ "--k": k } as CSSProperties}>
          <span className={styles.skeleton} data-gone={on(s >= 2)}>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.rowContent} data-on={on(s >= 2)}>
            <span className={styles.avatar} data-tone={a.tone}>
              {a.team[0]}
            </span>
            <span className={styles.team}>{a.team}</span>
            <span className={styles.chip} data-status={a.status}>
              {a.level}
            </span>
          </span>
        </div>
      ))}
    </div>
  </div>
);

const HomeSteps = () => {
  const [reduced] = useState(prefersReducedMotion);
  const [stage, setStage] = useState<number[]>(() => (reduced ? FINAL : [0, 0, 0]));
  const [typed, setTyped] = useState(reduced ? PROMPT.length : 0);
  const [done, setDone] = useState<boolean[]>(() => [reduced, reduced, reduced]);
  const [ref0, in0] = useInView<HTMLLIElement>();
  const [ref1, in1] = useInView<HTMLLIElement>();
  const [ref2, in2] = useInView<HTMLLIElement>();
  const started = useRef([false, false, false]);
  const seenAt = useRef([0, 0, 0]);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (reduced) return;
    const seen = [in0, in1, in2];
    const now = performance.now();
    for (let i = 0; i < 3; i++) {
      if (seen[i] && !seenAt.current[i]) seenAt.current[i] = now;
      if (!seen[i] || started.current[i] || done[i]) continue;
      if (i > 0 && seen[i - 1] && !done[i - 1]) continue;
      started.current[i] = true;
      const base = Math.max(0, seenAt.current[i] + ENTER - now);
      const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, base + ms));
      TIMELINE[i].at.forEach((ms, k) =>
        later(ms, () => setStage((prev) => prev.map((v, j) => (j === i ? Math.max(v, k + 1) : v)))),
      );
      if (i === 0) {
        for (let c = 1; c <= PROMPT.length; c++) later(TYPE_START + c * TYPE_STEP, () => setTyped(c));
      }
      later(TIMELINE[i].done, () => setDone((prev) => prev.map((v, j) => v || j === i)));
    }
  }, [reduced, in0, in1, in2, done]);

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
      started.current = [false, false, false];
    },
    [],
  );

  const refs = [ref0, ref1, ref2];
  const seen = [in0, in1, in2];
  const ui = [<Describe key="d" s={stage[0]} typed={typed} />, <Knowledge key="k" s={stage[1]} />, <Publish key="p" s={stage[2]} />];

  return (
    <section className={styles.root} data-section="how">
      <header className={styles.header}>
        <span className={styles.eyebrow}>How it works</span>
        <h2 className={styles.title}>
          From idea to AI specialist, <span>in three steps</span>.
        </h2>
        <p className={styles.subtitle}>
          You bring the job and the knowledge. ButteryAI runs everything in between.
        </p>
      </header>

      <div className={styles.flow}>
        <ol className={styles.list}>
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              ref={refs[i]}
              className={styles.step}
              data-in={on(reduced || seen[i])}
              data-current={on(stage[i] >= 1 && !done[i])}
              style={{ "--i": i } as CSSProperties}
            >
              <div className={styles.panel} aria-hidden="true">
                {ui[i]}
              </div>
              <div className={styles.body}>
                <span className={styles.badge} data-on={on(stage[i] >= 1)} data-current={on(stage[i] >= 1 && !done[i])}>
                  {i + 1}
                </span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
                <p className={styles.srOnly}>{step.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HomeSteps;
