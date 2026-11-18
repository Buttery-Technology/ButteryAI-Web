import { useEffect, useState, type ReactNode } from "react";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import { HEX_PATH, HEX_VIEWBOX, SPECIALISTS, prefersReducedMotion, useInView } from "../shared";
import styles from "./HomeStakes.module.scss";

const BEAT_AT = [400, 1900, 2500, 3800, 5400, 6900, 7900];
const FINAL = BEAT_AT.length;

const CONTRACTS = SPECIALISTS[0];

type Tone = "routed" | "scored" | "caught" | "retry" | "trusted" | "source";

const CHIP_ICON: Record<Tone, string[]> = {
  routed: ["M2.5 6h6.2M6 3.4 8.6 6 6 8.6"],
  scored: ["M2.6 8.6a3.4 3.4 0 0 1 6.8 0M6 8.6l1.7-2.1"],
  caught: ["M6 2.9v3.9M6 9.1v.1"],
  retry: ["M9.1 6.2A3.1 3.1 0 1 1 8.2 4M8.6 1.9v2.3H6.3"],
  trusted: ["M2.8 6.2 5 8.4l4.2-4.6"],
  source: ["M3.3 1.8h3.5l2 2v6.4H3.3z", "M4.9 6.3h2.3M4.9 8.1h2.3"],
};

const STEPS = [
  { label: "Routed", caption: "Sent to the specialist that fits" },
  { label: "Checked", caption: "Scored against your sources" },
  { label: "Retried", caption: "Sent back with new guidance" },
  { label: "Trusted", caption: "Only then does anyone see it" },
];

const PROOF = [
  {
    tone: "scored",
    lead: "Tracked and scored.",
    text: "Every answer, as it happens.",
    icon: ["M2 10.5h3.4l2-5.2 3.6 9.4 2-5.4H18"],
  },
  {
    tone: "caught",
    lead: "Hallucinations caught.",
    text: "Claims your sources don’t back up get flagged.",
    icon: ["M5 17.4V3.4", "M5 4h9.4l-2.3 3.7 2.3 3.7H5"],
  },
  {
    tone: "retry",
    lead: "Retried or re-routed.",
    text: "Weak answers go back with new guidance, or to a better-fit specialist.",
    icon: [
      "M2.5 10h5c2 0 2.6-.8 3.6-2.6L12 6h5M7.5 10c2 0 2.6.8 3.6 2.6L12 14h5",
      "M14.6 3.6 17 6l-2.4 2.4M14.6 11.6 17 14l-2.4 2.4",
    ],
  },
] as const;

const activeStep = (beat: number) => {
  if (beat >= 7) return 4;
  if (beat >= 6) return 3;
  if (beat >= 5) return 2;
  if (beat >= 2) return 1;
  if (beat >= 1) return 0;
  return -1;
};

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

const Chip = ({ tone, on, children }: { tone: Tone; on?: boolean; children: ReactNode }) => (
  <span className={styles.chip} data-tone={tone} data-on={on === false ? "0" : "1"}>
    <Icon d={CHIP_ICON[tone]} viewBox="0 0 12 12" />
    {children}
  </span>
);

const HexMark = ({ className }: { className: string }) => (
  <svg className={className} viewBox={HEX_VIEWBOX} aria-hidden="true">
    <path d={HEX_PATH} fill={CONTRACTS.color} />
    <g
      transform="translate(33 18) scale(1.4) translate(-12.1 -12)"
      fill="none"
      stroke="#fff"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.3 7h3.5l2.1 2.1V17H9.3z" />
      <path d="M11 12.2h2.2M11 14.5h2.2" />
    </g>
  </svg>
);

const HomeStakes = () => {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [run, setRun] = useState(0);
  const [beat, setBeat] = useState(() => (prefersReducedMotion() ? FINAL : 0));

  useEffect(() => {
    if (!inView) return;
    if (run === 0 && prefersReducedMotion()) return;
    const timers = BEAT_AT.map((t, i) => window.setTimeout(() => setBeat(i + 1), t));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, run]);

  const replay = () => {
    if (prefersReducedMotion()) return;
    setBeat(0);
    setRun((r) => r + 1);
  };

  const on = (n: number) => (beat >= n ? "1" : "0");
  const step = activeStep(beat);
  const flagged = beat >= 4;

  return (
    <section className={styles.root} data-section="catch">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Why it matters</p>
        <h2 className={styles.title}>
          General AI sounds sure, <span>even when it’s wrong</span>.
        </h2>
        <p className={styles.subtitle}>
          A confident wrong answer in a contract, a quote or a support reply costs real money. ButteryAI checks every
          answer against your sources before anyone sees it, and fixes the ones that don’t hold up.
        </p>
      </header>

      <div className={styles.demo}>
        <ol className={styles.rail} aria-hidden="true">
          {STEPS.map((s, i) => {
            const state = i < step ? "done" : i === step ? "active" : "pending";
            return (
              <li
                key={s.label}
                className={styles.step}
                data-state={state}
                data-alert={i === 1 && beat === 4 ? "1" : "0"}
                data-last={i === STEPS.length - 1 ? "1" : "0"}
              >
                {i < STEPS.length - 1 && <span className={styles.link} />}
                <span className={styles.marker}>
                  <span className={styles.num}>{i + 1}</span>
                  <span className={styles.ring} />
                  <span className={styles.fill}>
                    <Icon d={CHIP_ICON.trusted} viewBox="0 0 12 12" />
                  </span>
                </span>
                <span className={styles.stepText}>
                  <span className={styles.stepLabel}>{s.label}</span>
                  <span className={styles.stepCaption}>{s.caption}</span>
                </span>
              </li>
            );
          })}
        </ol>

        <div ref={ref} className={styles.stage}>
          <div className={styles.window}>
            <div className={styles.bar}>
              <span className={styles.lights} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className={styles.crumb} aria-hidden="true">
                <img className={styles.logo} src={butteryaiLogo} alt="" />
                <span className={styles.brand}>ButteryAI</span>
                <Icon className={styles.chevron} d={["M4.5 2.5 8 6l-3.5 3.5"]} viewBox="0 0 12 12" />
                <span className={styles.crumbSpec}>Contracts Specialist</span>
              </span>
              <button type="button" className={styles.replay} onClick={replay} aria-label="Replay the example">
                <Icon d={["M4.2 10a5.8 5.8 0 1 0 1.9-4.3", "M4 3.4v3.4h3.4"]} viewBox="0 0 20 20" />
                Replay
              </button>
            </div>

            <div className={styles.chat} aria-hidden="true">
              <p className={styles.question}>How much notice do we give to end the supply agreement?</p>

              <div className={styles.answer}>
                <span className={styles.avatarCol} data-on={on(1)}>
                  <HexMark className={styles.avatar} />
                  <span className={styles.line} />
                </span>

                <div className={styles.body}>
                  <div className={styles.meta} data-on={on(1)}>
                    <HexMark className={styles.metaHex} />
                    <span className={styles.who}>{CONTRACTS.name} Specialist</span>
                    <Chip tone="routed">Routed</Chip>
                  </div>

                  <div className={styles.draft} data-dim={on(5)}>
                    <div className={styles.draftSlot}>
                      <span className={styles.typing} data-on={beat === 1 ? "1" : "0"}>
                        <span />
                        <span />
                        <span />
                      </span>
                      <p className={styles.bubble} data-on={on(2)}>
                        <span className={styles.strike} data-on={on(5)}>
                          You need to give{" "}
                          <span className={styles.mark} data-on={on(4)}>
                            30 days’ notice
                          </span>
                          .
                        </span>
                        <span className={styles.scan} data-on={beat === 3 ? "1" : "0"} />
                      </p>
                    </div>
                    <div className={styles.status}>
                      <Chip key={flagged ? "caught" : "scored"} tone={flagged ? "caught" : "scored"} on={beat >= 3}>
                        {flagged ? "Flagged" : "Checking"}
                      </Chip>
                      <span className={styles.note} data-on={on(4)}>
                        No source backs this up.
                      </span>
                    </div>
                  </div>

                  <div className={styles.status} data-row="retry">
                    <Chip tone="retry" on={beat >= 5}>
                      Retried
                    </Chip>
                    <span className={styles.note} data-on={on(5)}>
                      New guidance: quote the termination clause.
                    </span>
                  </div>

                  <div className={styles.final} data-on={on(6)} data-trusted={on(7)}>
                    <p className={styles.finalText}>
                      You need to give <b>60 days’ notice</b>.
                    </p>
                    <div className={styles.sources}>
                      <Chip tone="source">Supply Agreement §9.2</Chip>
                      <Chip tone="trusted" on={beat >= 7}>
                        Trusted
                      </Chip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className={styles.tension}>
          <Icon
            className={styles.tensionIcon}
            d={["M8 1.6a6.4 6.4 0 1 0 0 12.8A6.4 6.4 0 0 0 8 1.6z", "M8 4.9v3.5M8 11v.1"]}
            viewBox="0 0 16 16"
          />
          Without the check, the 30-day answer is the one your team acts on.
        </p>

        <p className={styles.srOnly}>
          Example: asked how much notice ends the supply agreement, the Contracts Specialist’s first draft said 30
          days’ notice. ButteryAI flagged it because no source backs it up, sent it back with new guidance to quote the
          termination clause, and returned 60 days’ notice, sourced to Supply Agreement §9.2 and marked trusted.
        </p>
      </div>

      <ul className={styles.proof}>
        {PROOF.map((p) => (
          <li key={p.lead} className={styles.point}>
            <span className={styles.pointIcon} data-tone={p.tone}>
              <Icon d={p.icon} viewBox="0 0 20 20" />
            </span>
            <p className={styles.pointText}>
              <b>{p.lead}</b> {p.text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HomeStakes;
