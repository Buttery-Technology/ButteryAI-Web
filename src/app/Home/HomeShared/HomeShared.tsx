import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { HEX_PATH, HEX_VIEWBOX, prefersReducedMotion, useInView } from "../shared";
import SpecialistMark from "./SpecialistMark";
import type { SpecialistName } from "./specialists";
import { useStageLoop } from "./useStageLoop";
import styles from "./HomeShared.module.scss";

type Tile = {
  name: SpecialistName;
  publisher: string;
  job: string;
  own: boolean;
  anim?: "publish" | "use";
};

const TILES: Tile[] = [
  { name: "Contracts", publisher: "Your team", job: "Reviews contracts and flags risky terms", own: true },
  { name: "Support", publisher: "Your team", job: "Answers customers from your help center", own: true, anim: "publish" },
  { name: "Research", publisher: "Partner", job: "Finds sources and summarizes them", own: false, anim: "use" },
  { name: "Finance", publisher: "Public", job: "Matches invoices to purchase orders", own: false },
  { name: "Sales", publisher: "Partner", job: "Drafts follow-ups after every call", own: false },
];

const STEPS = [1300, 380, 1300, 380] as const;
const HOLD = 3800;

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

const CHECK = ["M2.8 6.2 5 8.4l4.2-4.6"];
const SEARCH = ["M11.4 7.1a4.3 4.3 0 1 1-8.6 0 4.3 4.3 0 0 1 8.6 0z", "M10.2 10.2l3 3"];
const UPLOAD = ["M10 13V3.6M6.4 7.2 10 3.6l3.6 3.6", "M3.6 12.6v2.2c0 1 .8 1.8 1.8 1.8h9.2c1 0 1.8-.8 1.8-1.8v-2.2"];
const PLUS_GRID = ["M3.5 3.5h5v5h-5zM11.5 3.5h5v5h-5zM3.5 11.5h5v5h-5z", "M14 11.4v5.2M11.4 14h5.2"];
const SHIELD = ["M10 2.4l6 2.3v4.7c0 3.9-2.6 6.7-6 8.2-3.4-1.5-6-4.3-6-8.2V4.7z", "M7.4 10l1.8 1.8 3.4-3.6"];

const POINTS = [
  { title: "Publish", text: "Share a specialist with your team, your partners or everyone.", icon: UPLOAD },
  { title: "Use", text: "Find the specialist for the job and put it to work right away.", icon: PLUS_GRID },
  { title: "Stay secure", text: "Specialists run under your rules, and your data stays yours.", icon: SHIELD },
];

const SUMMARY =
  "Example specialist library: your team's Contracts Specialist is published, your Support Specialist goes from draft to published, and a partner's Research Specialist is added with one click. Finance and Sales specialists from partners and the public are ready to use.";

const Status = ({ tile, stage }: { tile: Tile; stage: number }) => {
  if (tile.anim === "publish") {
    const done = stage >= 2;
    return (
      <span className={styles.slot}>
        <span className={styles.slotState} data-on={on(!done)}>
          <span className={styles.chip} data-tone="draft">
            Draft
          </span>
          <span className={styles.publishBtn} data-press={on(stage === 1)}>
            Publish
          </span>
        </span>
        <span className={styles.slotState} data-on={on(done)}>
          <span className={styles.chip} data-tone="published">
            <Icon d={CHECK} viewBox="0 0 12 12" />
            Published
          </span>
        </span>
      </span>
    );
  }

  if (tile.own) {
    return (
      <span className={styles.chip} data-tone="published">
        <Icon d={CHECK} viewBox="0 0 12 12" />
        Published
      </span>
    );
  }

  const added = tile.anim === "use" && stage >= 4;
  return (
    <span className={styles.slot}>
      <span className={styles.slotState} data-on={on(!added)}>
        <span className={styles.useBtn} data-press={on(tile.anim === "use" && stage === 3)}>
          Use
        </span>
      </span>
      <span className={styles.slotState} data-on={on(added)}>
        <span className={styles.chip} data-tone="added">
          <Icon d={CHECK} viewBox="0 0 12 12" />
          Added
        </span>
      </span>
    </span>
  );
};

const Library = ({ stage }: { stage: number }) => (
  <div className={styles.window}>
    <div className={styles.head}>
      <span className={styles.headTitle}>Specialist library</span>
      <span className={styles.tabs}>
        <span className={styles.tab} data-on="1">
          All
        </span>
        <span className={styles.tab}>Yours</span>
        <span className={styles.tab}>Shared</span>
      </span>
      <span className={styles.search}>
        <Icon d={SEARCH} viewBox="0 0 16 16" />
        Find a specialist
      </span>
    </div>

    <div className={styles.tiles}>
      {TILES.map((t, i) => (
        <div
          key={t.name}
          className={`${styles.tile} ${styles.reveal}`}
          style={at(0.2 + i * 0.08)}
          data-active={on((t.anim === "publish" && stage >= 1 && stage <= 2) || (t.anim === "use" && stage >= 3))}
        >
          <div className={styles.tileTop}>
            <SpecialistMark name={t.name} className={styles.mark} />
            {t.own && <span className={styles.yours}>Yours</span>}
          </div>
          <span className={styles.tileName}>{t.name}</span>
          <span className={styles.publisher}>{t.publisher}</span>
          <span className={styles.job}>{t.job}</span>
          <div className={styles.tileFoot}>
            <Status tile={t} stage={stage} />
          </div>
        </div>
      ))}

      <div className={`${styles.tile} ${styles.ghost} ${styles.reveal}`} style={at(0.2 + TILES.length * 0.08)}>
        <div className={styles.tileTop}>
          <svg className={styles.ghostMark} viewBox={HEX_VIEWBOX} aria-hidden="true">
            <path d={HEX_PATH} />
            <path d="M33 12.6v10.8M27.6 18h10.8" />
          </svg>
        </div>
        <span className={styles.tileName}>New specialist</span>
        <span className={styles.publisher}>Build your own</span>
        <span className={styles.job}>Publish it to your team or beyond</span>
      </div>
    </div>
  </div>
);

const HomeShared = () => {
  const [reduced] = useState(prefersReducedMotion);
  const [revealRef, revealed] = useInView<HTMLDivElement>();
  const [loopRef, looping] = useInView<HTMLDivElement>("0px", false);
  const stage = useStageLoop(STEPS, HOLD, revealed && looping, reduced);

  return (
    <section className={styles.root} data-section="shared" id="shared">
      <header className={styles.header}>
        <div className={styles.eyebrowRow}>
          <span className={styles.eyebrow}>Where AI is going</span>
          <span id="shared-soon" className={styles.soon}>Coming soon</span>
        </div>
        <h2 className={styles.title} aria-describedby="shared-soon">
          Publish your specialists. <span>Use everyone else&apos;s.</span>
        </h2>
        <p className={styles.subtitle}>
          Companies publish the specialists they build and put each other&apos;s specialists to work. Every specialist runs
          inside ButteryAI, so your data stays protected and every answer is still scored.
        </p>
      </header>

      <div ref={revealRef} className={styles.stage} data-play={on(revealed || reduced)}>
        <div ref={loopRef} className={styles.visual} aria-hidden="true">
          <Library stage={stage} />
        </div>
        <p className={styles.srOnly}>{SUMMARY}</p>

        <div className={styles.side}>
          <ul className={styles.points}>
            {POINTS.map((p, i) => (
              <li key={p.title} className={styles.reveal} style={at(0.3 + i * 0.12)}>
                <div className={styles.pointHead}>
                  <Icon d={p.icon} className={styles.pointIcon} />
                  <h3 className={styles.pointTitle}>{p.title}</h3>
                </div>
                <p className={styles.pointText}>{p.text}</p>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <Link to="/download" className={styles.btnPrimary}>
              Start building
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeShared;
