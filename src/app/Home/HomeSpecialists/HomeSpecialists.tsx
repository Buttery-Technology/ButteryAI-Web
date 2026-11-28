import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { prefersReducedMotion, useInView } from "../shared";
import { SPECIALISTS as PALETTE } from "../HomeShared/specialists";
import styles from "./HomeSpecialists.module.scss";

type Kind = "general" | "specialists";
type Pt = { x: number; y: number };
type Geo = { w: number; h: number; from: Pt[]; into: Pt[]; outOf: Pt[]; to: Pt[] };

const HEX_ICON = "M12 1.8 20.83 6.9v10.2L12 22.2l-8.83-5.1V6.9z";

const JOBS = [
  { ask: "Review this contract", short: "Review contract", name: "Contracts", ...PALETTE.Contracts },
  { ask: "Forecast Q3 cash", short: "Forecast cash", name: "Finance", ...PALETTE.Finance },
  { ask: "Answer a support ticket", short: "Answer ticket", name: "Support", ...PALETTE.Support },
  {
    ask: "Screen a candidate",
    short: "Screen candidate",
    name: "HR",
    color: "#D9701F",
    glyph: ["M12 7.4a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2z", "M8.3 16.6c.5-2.1 1.9-3.2 3.7-3.2s3.2 1.1 3.7 3.2"],
  },
];

const GENERAL_TAGS = ["Generic", "Unchecked", "Generic", "Unchecked"];

const GENERAL = [
  "Knows a little about everything.",
  "Handles every job the same way, simple or hard.",
  "Hard to check. Hard to govern.",
];

const SPECIALISTS = [
  "Know their jobs deeply. Sharper answers.",
  "Do only the work each job needs. Less waste.",
  "One clear job each. Easy to check and govern.",
];

const TIMING: Record<Kind, { start: (i: number) => number; travel: number; hold: number; cycle: number }> = {
  general: { start: (i) => i * 1.5, travel: 0.6, hold: 0.3, cycle: 6.6 },
  specialists: { start: (i) => i * 0.12, travel: 0.55, hold: 0.2, cycle: 3.3 },
};

const LEAD = 0.4;
const SPENT = "#a3afb8";

const shift = (p: Pt, dx: number): Pt => ({ x: p.x + dx, y: p.y });

const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const curve = (a: Pt, b: Pt) => {
  const dx = (b.x - a.x) * 0.5;
  return `M${a.x} ${a.y}C${a.x + dx} ${a.y} ${b.x - dx} ${b.y} ${b.x} ${b.y}`;
};

const along = (a: Pt, b: Pt, p: number): Pt => {
  const dx = (b.x - a.x) * 0.5;
  const c1 = a.x + dx;
  const c2 = b.x - dx;
  const m = 1 - p;
  return {
    x: m * m * m * a.x + 3 * m * m * p * c1 + 3 * m * p * p * c2 + p * p * p * b.x,
    y: m * m * m * a.y + 3 * m * m * p * a.y + 3 * m * p * p * b.y + p * p * p * b.y,
  };
};

const Paths = ({ d }: { d: readonly string[] }) => (
  <>
    {d.map((p) => (
      <path key={p} d={p} />
    ))}
  </>
);

const Mini = ({ d }: { d: string }) => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const TAG_ICON: Record<string, string> = {
  Generic: "M3.2 6h5.6",
  Unchecked: "M6 2.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2z",
  Checked: "M2.8 6.2 5 8.4l4.2-4.6",
};

const Flow = ({ kind, revealed, active }: { kind: Kind; revealed: boolean; active: boolean }) => {
  const general = kind === "general";
  const [geo, setGeo] = useState<Geo | null>(null);
  const [boxRef, looping] = useInView<HTMLDivElement>("0px", false);
  const running = active && looping;
  const geoRef = useRef<Geo | null>(null);
  const reqRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const inRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const outRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const nodeRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const rel = (el: HTMLElement | null | undefined, side: "l" | "r"): Pt => {
      if (!el || !el.offsetParent) return { x: 0, y: 0 };
      let x = 0;
      let y = 0;
      let n: HTMLElement | null = el;
      while (n && n !== box) {
        x += n.offsetLeft;
        y += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      return { x: Math.round(x + (side === "r" ? el.offsetWidth : 0)), y: Math.round(y + el.offsetHeight / 2) };
    };
    const measure = () => {
      const rows = JOBS.map((_, i) => i);
      const exit = (i: number) => {
        const name = outRefs.current[i];
        return name && name.offsetParent ? name : inRefs.current[i];
      };
      const from = rows.map((i) => shift(rel(reqRefs.current[i], "r"), 2));
      const to = rows.map((i) => shift(rel(tagRefs.current[i], "l"), -4));
      const next: Geo = {
        w: box.offsetWidth,
        h: box.offsetHeight,
        from,
        into: rows.map((i) =>
          general ? shift(rel(nodeRef.current, "l"), -2) : { x: rel(inRefs.current[i], "l").x, y: from[i].y },
        ),
        outOf: rows.map((i) =>
          general ? shift(rel(nodeRef.current, "r"), 2) : { x: rel(exit(i), "r").x + 9, y: to[i].y },
        ),
        to,
      };
      geoRef.current = next;
      setGeo((prev) => (prev && JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    measure();
    let alive = true;
    document.fonts?.ready.then(() => alive && measure());
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    [...reqRefs.current, ...outRefs.current, ...tagRefs.current].forEach((el) => el && ro.observe(el));
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, [general, boxRef]);

  useEffect(() => {
    const box = boxRef.current;
    if (!running || !box) return;
    const T = TIMING[kind];
    const dots = dotRefs.current;
    const reqs = reqRefs.current;
    const hexes = inRefs.current;
    const tags = tagRefs.current;
    const node = nodeRef.current;
    const lit = JOBS.map(() => false);
    const busy = JOBS.map(() => false);
    const shown = JOBS.map(() => "");
    const tint = JOBS.map(() => "");
    const lastCycle = JOBS.map(() => -1);
    let raf = 0;
    let origin = 0;
    let hiddenAt = 0;

    const setAttr = (el: HTMLElement | null | undefined, key: string, on: boolean) => {
      if (el && el.dataset[key] !== (on ? "1" : "0")) el.dataset[key] = on ? "1" : "0";
    };

    const tick = (now: number) => {
      if (!origin) origin = now;
      const g = geoRef.current;
      const t = (now - origin) / 1000 - LEAD;
      const cyc = t < 0 ? -1 : Math.floor(t / T.cycle);
      const local = t - cyc * T.cycle;
      let nodeBusy = false;
      JOBS.forEach((job, i) => {
        const dot = dots[i];
        const u = cyc < 0 ? -1 : local - T.start(i);
        const end = 2 * T.travel + T.hold;
        let pos: Pt | null = null;
        let color = job.color;
        if (g && u >= 0 && u < T.travel) {
          pos = along(g.from[i], g.into[i], inOut(u / T.travel));
        } else if (g && u >= T.travel + T.hold && u < end) {
          pos = along(g.outOf[i], g.to[i], inOut((u - T.travel - T.hold) / T.travel));
          if (general) color = SPENT;
        }
        const working = u >= 0 && u < end;
        if (working !== lit[i]) {
          lit[i] = working;
          setAttr(reqs[i], "live", working);
        }
        const inside = u >= T.travel && u < T.travel + T.hold;
        if (general) nodeBusy = nodeBusy || inside;
        else if (inside !== busy[i]) {
          busy[i] = inside;
          setAttr(hexes[i], "busy", inside);
        }
        if (dot) {
          const vis = pos ? "1" : "0";
          if (shown[i] !== vis) {
            shown[i] = vis;
            dot.style.opacity = vis;
          }
          if (pos) dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
          if (tint[i] !== color) {
            tint[i] = color;
            dot.style.backgroundColor = color;
          }
        }
        if (u >= end && lastCycle[i] !== cyc) {
          lastCycle[i] = cyc;
          const out = tags[i];
          if (out) {
            out.dataset.on = "1";
            out.animate?.([{ transform: "scale(1.1)" }, { transform: "none" }], { duration: 420, easing: "ease-out" });
          }
        }
      });
      if (general) setAttr(node, "busy", nodeBusy);
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        hiddenAt = performance.now();
      } else if (!raf) {
        if (origin && hiddenAt) origin += performance.now() - hiddenAt;
        raf = requestAnimationFrame(tick);
      }
    };

    box.dataset.loop = "1";
    if (!document.hidden) raf = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      box.dataset.loop = "0";
      dots.forEach((d) => d && (d.style.opacity = "0"));
      reqs.forEach((el) => setAttr(el, "live", false));
      hexes.forEach((el) => setAttr(el, "busy", false));
      setAttr(node, "busy", false);
    };
  }, [running, kind, general, boxRef]);

  return (
    <div
      ref={boxRef}
      className={styles.diagram}
      data-kind={kind}
      data-play={revealed ? "1" : "0"}
      aria-hidden="true"
    >
      {geo && (
        <svg className={styles.wires} width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`}>
          {JOBS.map((job, i) => (
            <g key={job.name} stroke={general ? undefined : job.color}>
              <path d={curve(geo.from[i], geo.into[i])} />
              <path d={curve(geo.outOf[i], geo.to[i])} />
            </g>
          ))}
        </svg>
      )}

      {JOBS.map((job, i) => (
        <span
          key={job.name}
          ref={(el) => {
            reqRefs.current[i] = el;
          }}
          className={styles.req}
          style={{ "--row": i + 1, "--c": job.color, "--c-soft": `${job.color}2e`, "--d": `${i * 0.06}s` } as CSSProperties}
        >
          <i className={styles.reqDot} />
          <span className={styles.long}>{job.ask}</span>
          <span className={styles.short}>{job.short}</span>
        </span>
      ))}

      {general ? (
        <span className={styles.hub}>
          <span ref={nodeRef} className={styles.node}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3.6 19.3 7.8v8.4L12 20.4l-7.3-4.2V7.8z" />
              <path d="M4.7 7.8 12 12l7.3-4.2M12 12v8.4" />
            </svg>
          </span>
          <span className={styles.hubLabel}>General model</span>
        </span>
      ) : (
        JOBS.map((job, i) => (
          <span
            key={job.name}
            className={styles.spec}
            style={{ "--row": i + 1, "--c": job.color, "--d": `${0.18 + i * 0.06}s` } as CSSProperties}
          >
            <span
              ref={(el) => {
                inRefs.current[i] = el;
              }}
              className={styles.hexWrap}
            >
              <svg className={styles.hex} viewBox="0 0 24 24">
                <path d={HEX_ICON} fill={job.color} stroke={job.color} strokeWidth="2.4" strokeLinejoin="round" />
                <g fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <Paths d={job.glyph} />
                </g>
              </svg>
            </span>
            <span
              ref={(el) => {
                outRefs.current[i] = el;
              }}
              className={styles.specName}
            >
              {job.name}
            </span>
          </span>
        ))
      )}

      {JOBS.map((job, i) => {
        const label = general ? GENERAL_TAGS[i] : "Checked";
        return (
          <span
            key={job.name}
            ref={(el) => {
              tagRefs.current[i] = el;
            }}
            className={styles.tag}
            data-tone={general ? "gray" : "green"}
            style={{ "--row": i + 1 } as CSSProperties}
          >
            <Mini d={TAG_ICON[label]} />
            {label}
          </span>
        );
      })}

      {JOBS.map((job, i) => (
        <span
          key={job.name}
          ref={(el) => {
            dotRefs.current[i] = el;
          }}
          className={styles.dot}
        />
      ))}
    </div>
  );
};

const HomeSpecialists = () => {
  const [reduced] = useState(prefersReducedMotion);
  const [revealRef, revealed] = useInView<HTMLDivElement>();
  const active = !reduced && revealed;

  return (
    <section className={styles.root} data-section="specialists" id="specialists">
      <div className={styles.header}>
        <span className={styles.eyebrow}>The specialist difference</span>
        <h2 className={styles.title}>
          A specialist for <span>every job</span>.
        </h2>
        <p className={styles.subtitle}>
          Most companies run every job through one general model. It’s fine at a lot and great at little. Great teams
          don’t work that way. They’re built from specialists. Your AI should be too.
        </p>
      </div>

      <div ref={revealRef} className={styles.compare} data-play={revealed || reduced ? "1" : "0"}>
        <article className={styles.side} data-kind="general">
          <h3 className={styles.sideTitle}>One general model</h3>
          <Flow kind="general" revealed={revealed || reduced} active={active} />
          <p className={styles.srOnly}>
            Example: contract, cash forecast, support and hiring requests all wait in one queue for a single general
            model, and every answer comes back generic and unchecked.
          </p>
          <ul className={styles.list}>
            {GENERAL.map((line, i) => (
              <li key={line} className={styles.line} style={{ "--d": `${0.5 + i * 0.08}s` } as CSSProperties}>
                <span className={styles.marker} aria-hidden="true">
                  <span className={styles.dash} />
                </span>
                {line}
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.side} data-kind="specialists">
          <h3 className={styles.sideTitle}>AI specialists</h3>
          <Flow kind="specialists" revealed={revealed || reduced} active={active} />
          <p className={styles.srOnly}>
            Example: each request goes straight to its own specialist, Contracts, Finance, Support or HR, and every
            answer comes back checked.
          </p>
          <ul className={styles.list}>
            {SPECIALISTS.map((line, i) => (
              <li key={line} className={styles.line} style={{ "--d": `${0.5 + i * 0.08}s` } as CSSProperties}>
                <span className={styles.marker} aria-hidden="true">
                  <svg className={styles.check} viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="10" />
                    <path d="M6 10.2l2.6 2.6L14 7.4" />
                  </svg>
                </span>
                {line}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
};

export default HomeSpecialists;
