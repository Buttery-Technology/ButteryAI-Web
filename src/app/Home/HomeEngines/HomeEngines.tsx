import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, FC, ReactNode } from "react";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import { HEX_PATH, HEX_VIEWBOX, SPECIALISTS, prefersReducedMotion, useInView } from "../shared";
import styles from "./HomeEngines.module.scss";

const Icon = ({ children, sw = 1.8 }: { children: ReactNode; sw?: number }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const ShieldIcon = () => (
  <Icon>
    <path d="M12 3l7 2.5V11c0 4.2-3 7-7 8.2C8 18 5 15.2 5 11V5.5L12 3z" />
    <path d="M9 11.2l2.1 2.1 3.9-4.1" />
  </Icon>
);

const LayersIcon = () => (
  <Icon>
    <path d="M12 3 3 7.5 12 12l9-4.5L12 3z" />
    <path d="M3 12.5 12 17l9-4.5" />
  </Icon>
);

const RouteIcon = () => (
  <Icon>
    <circle cx="6" cy="12" r="2.2" />
    <circle cx="18" cy="6" r="2.2" />
    <circle cx="18" cy="18" r="2.2" />
    <path d="M8.2 12H13l3-4.5" />
    <path d="M13 12l3 4.5" />
  </Icon>
);

const PlayIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M10.2 8.9v6.2l5-3.1-5-3.1z" />
  </Icon>
);

const GaugeIcon = () => (
  <Icon>
    <path d="M4.5 15a7.5 7.5 0 0 1 15 0" />
    <path d="M12 15l4-3" />
    <path d="M4.5 15h15" />
  </Icon>
);

const LockIcon = () => (
  <Icon>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    <path d="M12 14.6v2" />
  </Icon>
);

const LoopIcon = () => (
  <Icon>
    <path d="M19.5 9.5A7.8 7.8 0 0 0 5.6 7.4" />
    <path d="M5.2 3.8v3.9h3.9" />
    <path d="M4.5 14.5a7.8 7.8 0 0 0 13.9 2.1" />
    <path d="M18.8 20.2v-3.9h-3.9" />
  </Icon>
);

const MiniIcon = ({ d }: { d: string }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const D = {
  routed: "M2.5 6h6.2M6 3.4 8.6 6 6 8.6",
  scored: "M2.6 8.6a3.4 3.4 0 0 1 6.8 0M6 8.6l1.7-2.1",
  retry: "M9.1 6.2A3.1 3.1 0 1 1 8.2 4M8.6 1.9v2.3H6.3",
  trusted: "M2.8 6.2 5 8.4l4.2-4.6",
  tracked: "M1.8 6.4h2l1.3-2.9 1.8 5 1.3-2.1h2",
  improved: "M2.4 8.6 5 6l1.7 1.6 3-3.3M7.6 4.3h2.1v2.1",
};

type Tone = "routed" | "scored" | "trusted" | "retry";
type Chip = { label: string; tone: Tone; d: string };

type Station = {
  key: string;
  name: string;
  desc: string;
  color: string;
  Icon: FC;
  dark?: boolean;
  kind: "chips" | "plan" | "run";
  chips?: Chip[];
};

const STATIONS: Station[] = [
  {
    key: "screen",
    name: "Screen it",
    desc: "Checks each request against your policies.",
    color: "#d1495b",
    Icon: ShieldIcon,
    kind: "chips",
    chips: [{ label: "Within policy", tone: "trusted", d: D.trusted }],
  },
  {
    key: "route",
    name: "Route it",
    desc: "Sends it to the right specialist with the knowledge it needs.",
    color: "#f9c000",
    Icon: RouteIcon,
    dark: true,
    kind: "chips",
    chips: [{ label: "Routed", tone: "routed", d: D.routed }],
  },
  {
    key: "plan",
    name: "Plan it",
    desc: "Breaks the work into steps and calls the right tools.",
    color: "#755cba",
    Icon: LayersIcon,
    kind: "plan",
  },
  {
    key: "run",
    name: "Run it",
    desc: "Runs one specialist, or several at once.",
    color: "#288ed2",
    Icon: PlayIcon,
    kind: "run",
  },
  {
    key: "check",
    name: "Check it",
    desc: "Scores every answer in our real-time metric system.",
    color: "#22908c",
    Icon: GaugeIcon,
    kind: "chips",
    chips: [
      { label: "Tracked", tone: "routed", d: D.tracked },
      { label: "Scored", tone: "scored", d: D.scored },
      { label: "Improved", tone: "trusted", d: D.improved },
    ],
  },
];

const RUNNERS = ["Contracts", "Support", "Sales"].map((name) => SPECIALISTS.find((s) => s.name === name)!);

const PRODUCT_CHIPS = ["Specialists", "Chat", "Workflows", "SDK"];

const RetryLabel = () => (
  <span>
    Weak answers are retried or <span className={styles.nowrap}>re-routed</span>
  </span>
);

const TRAVEL = 900;
const DWELL = 650;
const DWELL_RUN = 1150;
const DWELL_CHECK = 950;
const PAUSE = 3400;
const REST = 12;

type Pt = { x: number; y: number };
type Geo = { pts: Pt[]; w: number };

const HomeEngines = () => {
  const [reduced] = useState(prefersReducedMotion);
  const [phase, setPhase] = useState(reduced ? REST : 0);
  const [primed, setPrimed] = useState(reduced);
  const [clearing, setClearing] = useState(false);
  const [turns, setTurns] = useState(0);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [viewRef, inView] = useInView<HTMLDivElement>("0px 0px -18% 0px", false);
  const stationsRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const primedRef = useRef(reduced);
  const startedRef = useRef(false);

  useLayoutEffect(() => {
    const box = stationsRef.current;
    if (!box) return;
    const measure = () => {
      const b = box.getBoundingClientRect();
      const pts = nodeRefs.current.map((n) => {
        if (!n) return { x: 0, y: 0 };
        const r = n.getBoundingClientRect();
        return { x: Math.round(r.left + r.width / 2 - b.left), y: Math.round(r.top + r.height / 2 - b.top) };
      });
      const w = Math.round(b.width);
      setGeo((prev) =>
        prev && prev.w === w && prev.pts.every((p, i) => p.x === pts[i].x && p.y === pts[i].y) ? prev : { pts, w },
      );
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;
    if (!inView) {
      if (!startedRef.current) return;
      const id = window.setTimeout(() => {
        primedRef.current = true;
        setPrimed(true);
        setClearing(false);
        setPhase(REST);
      }, 0);
      return () => window.clearTimeout(id);
    }
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms));
    };
    const cycle = (fresh: boolean) => {
      let t = 0;
      if (!fresh) {
        setClearing(true);
        at(420, () => setPhase(0));
        at(480, () => setClearing(false));
        t = 540;
      }
      const steps = [
        TRAVEL,
        DWELL,
        TRAVEL,
        DWELL,
        TRAVEL,
        DWELL,
        TRAVEL,
        DWELL_RUN,
        TRAVEL,
        DWELL_CHECK,
        TRAVEL + 200,
      ];
      at(t, () => {
        startedRef.current = true;
        setPhase(1);
      });
      steps.forEach((dur, i) => {
        t += dur;
        const next = i + 2;
        at(t, () => {
          setPhase(next);
          if (next === REST) {
            primedRef.current = true;
            setPrimed(true);
            setTurns((n) => n + 1);
          }
        });
      });
      at(t + PAUSE, () => cycle(false));
    };
    if (primedRef.current) {
      at(900, () => cycle(false));
    } else {
      at(250, () => cycle(true));
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [inView, reduced]);

  const pos = phase === 0 ? -1 : phase >= 11 ? 5 : Math.floor((phase - 1) / 2);
  const active = phase >= 2 && phase <= 10 && phase % 2 === 0 ? (phase - 2) / 2 : -1;
  const reached = primed ? 5 : phase >= 2 ? Math.min(5, Math.floor(phase / 2)) : 0;
  const drawn = primed || phase >= 11;
  const running = phase >= 8;

  let packet: Pt | null = null;
  if (geo && geo.pts.length === 5) {
    const vertical = Math.abs(geo.pts[1].y - geo.pts[0].y) > 4;
    if (pos === -1) packet = vertical ? geo.pts[0] : { x: 0, y: geo.pts[0].y };
    else if (pos === 5) packet = vertical ? geo.pts[4] : { x: geo.w, y: geo.pts[4].y };
    else packet = geo.pts[pos];
  }
  const packetOn = phase >= 1 && phase <= 10;

  return (
    <section className={styles.root} data-section="engines">
      <div className={styles.header}>
        <span className={styles.eyebrow}>What ButteryAI handles</span>
        <h2 className={styles.title}>
          The AI tech stack, <span>collapsed into one system</span>.
        </h2>
        <p className={styles.subtitle}>
          Routing, knowledge, evals, guardrails and monitoring work as one. Every request runs through it automatically,
          so your team builds AI specialists instead of wiring tools together.
        </p>
      </div>

      <div className={styles.canvas} ref={viewRef}>
        <div className={styles.product}>
          <img src={butteryaiLogo} alt="" className={styles.productLogo} />
          <div className={styles.productText}>
            <span className={styles.productName}>ButteryAI</span>
            <span className={styles.productTag}>The operating system for AI specialists</span>
          </div>
          <div className={styles.productChips}>
            {PRODUCT_CHIPS.map((c) => (
              <span key={c} className={styles.productChip}>
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.pipeline} data-clearing={clearing ? "1" : "0"} data-running={running ? "1" : "0"}>
          <div className={styles.stations} ref={stationsRef}>
            <span className={styles.stubIn} data-fill={phase >= 1 ? "1" : "0"} aria-hidden="true">
              <span className={styles.fill} />
            </span>
            <span className={styles.stubOut} data-fill={phase >= 11 ? "1" : "0"} aria-hidden="true">
              <span className={styles.fill} />
            </span>

            {STATIONS.map((s, i) => {
              const next = STATIONS[i + 1];
              const vars = {
                "--c": s.color,
                "--c-soft": `${s.color}2e`,
                "--to": next ? next.color : s.color,
                "--row": i + 1,
              } as CSSProperties;
              return (
                <div
                  key={s.key}
                  className={styles.station}
                  style={vars}
                  data-lit={i < reached ? "1" : "0"}
                  data-active={active === i ? "1" : "0"}
                >
                  {next && (
                    <span className={styles.seg} data-fill={phase >= 2 * i + 3 ? "1" : "0"} aria-hidden="true">
                      <span className={styles.fill} />
                    </span>
                  )}
                  <span
                    className={styles.node}
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                  >
                    <span className={styles.badge} aria-hidden="true">
                      <span className={styles.badgeOff}>
                        <s.Icon />
                      </span>
                      <span className={`${styles.badgeOn} ${s.dark ? styles.badgeDark : ""}`}>
                        <s.Icon />
                      </span>
                    </span>
                  </span>
                  <div className={styles.card}>
                    <h3 className={styles.name}>{s.name}</h3>
                    <p className={styles.desc}>{s.desc}</p>
                    <div className={styles.foot}>
                      {s.kind === "chips" && (
                        <div className={styles.chips}>
                          {s.chips!.map((c, ci) => (
                            <span
                              key={c.label}
                              className={styles.chip}
                              data-tone={c.tone}
                              style={{ transitionDelay: `${ci * 140}ms` }}
                            >
                              <MiniIcon d={c.d} />
                              {c.label}
                            </span>
                          ))}
                        </div>
                      )}
                      {s.kind === "plan" && (
                        <div className={styles.plan} aria-hidden="true">
                          {[1, 2, 3].map((n) => (
                            <span key={n} className={styles.planStep}>
                              <span className={styles.planNum}>{n}</span>
                              <span className={styles.planFill} style={{ transitionDelay: `${(n - 1) * 170}ms` }}>
                                {n}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                      {s.kind === "run" && (
                        <ul className={styles.runners}>
                          {RUNNERS.map((r) => (
                            <li key={r.name} className={styles.runner} style={{ "--hex": r.color } as CSSProperties}>
                              <svg className={styles.hex} viewBox={HEX_VIEWBOX} aria-hidden="true">
                                <path d={HEX_PATH} className={styles.hexGhost} />
                                <path d={HEX_PATH} className={styles.hexFill} />
                              </svg>
                              <span className={styles.runnerName}>{r.name}</span>
                              <span className={styles.bar} aria-hidden="true">
                                <span className={styles.barFill} />
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {s.key === "check" && (
                        <span className={styles.retryNote}>
                          <MiniIcon d={D.retry} />
                          <RetryLabel />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className={styles.return} data-drawn={drawn ? "1" : "0"}>
              <span className={styles.returnClip} aria-hidden="true">
                <span className={styles.returnInner}>
                  <span className={styles.returnLine} />
                </span>
              </span>
              <svg className={styles.returnHead} viewBox="0 0 10 7" aria-hidden="true">
                <path d="M1 1l4 4.4L9 1" />
              </svg>
              <span className={styles.returnPill} data-pulse={primed && phase === 11 ? "1" : "0"}>
                <MiniIcon d={D.retry} />
                <RetryLabel />
              </span>
            </div>

            {packet && (
              <span
                className={styles.packet}
                data-on={packetOn ? "1" : "0"}
                data-jump={phase === 0 ? "1" : "0"}
                style={{ transform: `translate3d(${packet.x}px, ${packet.y}px, 0)` }}
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        <div className={styles.bands}>
          <div className={styles.band}>
            <span className={`${styles.bandIcon} ${styles.bandLock}`}>
              <LockIcon />
            </span>
            <p>
              <b>Encrypted and logged at every step,</b> so you can always see what happened.
            </p>
          </div>
          <div className={styles.band}>
            <span
              className={`${styles.bandIcon} ${styles.bandLoop}`}
              style={{ transform: `rotate(${turns * 360}deg)` }}
            >
              <LoopIcon />
            </span>
            <p>
              Every scored answer feeds back. <b>The more your specialists work, the smarter they get.</b>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeEngines;
