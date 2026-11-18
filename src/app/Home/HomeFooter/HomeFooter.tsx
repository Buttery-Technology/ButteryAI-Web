import type { CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import { HEX_PATH, HEX_VIEWBOX, SPECIALISTS, scrollToEnterprise, useInView } from "../shared";
import styles from "./HomeFooter.module.scss";

type SpecialistName = (typeof SPECIALISTS)[number]["name"];

const GLYPHS: Record<SpecialistName, string[]> = {
  Contracts: ["M9.3 7h3.5l2.1 2.1V17H9.3z", "M11 12.2h2.2M11 14.5h2.2"],
  Support: [
    "M7.6 9.1c0-.8.6-1.4 1.4-1.4h6c.8 0 1.4.6 1.4 1.4v4c0 .8-.6 1.4-1.4 1.4h-3.5L9.2 16.4v-1.9h-.2c-.8 0-1.4-.6-1.4-1.4z",
  ],
  Research: ["M14.4 11.2a3.2 3.2 0 1 1-6.4 0 3.2 3.2 0 0 1 6.4 0z", "M13.6 13.6l2.6 2.6"],
  Finance: ["M8 16.4h8M9.6 14.4v-2.6M12 14.4V8.2M14.4 14.4v-4.2"],
  Sales: ["M7.6 15l3-3.1 2 2 3.8-4.3", "M13.6 9.6h2.8v2.8"],
};

const ROW = Math.sqrt(3) / 2;

const RING: { x: number; y: number; name: SpecialistName | null }[] = [
  { x: -0.5, y: -ROW, name: "Contracts" },
  { x: 0.5, y: -ROW, name: "Support" },
  { x: 1, y: 0, name: null },
  { x: 0.5, y: ROW, name: "Research" },
  { x: -0.5, y: ROW, name: "Finance" },
  { x: -1, y: 0, name: "Sales" },
];

const COLOR = Object.fromEntries(SPECIALISTS.map((s) => [s.name, s.color])) as Record<SpecialistName, string>;

const place = (x: number, y: number, d: number) => ({ "--x": x, "--y": y, "--d": `${d}s` }) as CSSProperties;

const Hex = ({ fill, className }: { fill?: string; className?: string }) => (
  <svg className={className} viewBox={HEX_VIEWBOX} aria-hidden="true">
    <path d={HEX_PATH} fill={fill} />
  </svg>
);

const Glyph = ({ d }: { d: string[] }) => (
  <svg
    className={styles.glyph}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {d.map((p) => (
      <path key={p} d={p} />
    ))}
  </svg>
);

const HomeFooter = () => {
  const [clusterRef, played] = useInView<HTMLDivElement>();
  const [ghostRef, ghostVisible] = useInView<HTMLDivElement>("0px", false);
  const { pathname } = useLocation();

  return (
    <footer className={styles.root} data-section="footer">
      <div className={styles.cta}>
        <div ref={clusterRef} className={styles.cluster} data-play={played ? "1" : "0"} aria-hidden="true">
          <div className={`${styles.hex} ${styles.center}`} style={place(0, 0, 0)}>
            <Hex className={styles.centerHex} />
            <img className={styles.logo} src={butteryaiLogo} alt="" />
          </div>
          {RING.map((slot, i) =>
            slot.name ? (
              <div key={slot.name} className={styles.hex} style={place(slot.x, slot.y, 0.18 + i * 0.08)}>
                <Hex fill={COLOR[slot.name]} />
                <Glyph d={GLYPHS[slot.name]} />
              </div>
            ) : (
              <div
                key="next"
                ref={ghostRef}
                className={`${styles.hex} ${styles.ghost}`}
                style={place(slot.x, slot.y, 0.18 + RING.length * 0.08)}
                data-live={ghostVisible ? "1" : "0"}
              >
                <div className={styles.ghostInner}>
                  <Hex className={styles.ghostHex} />
                  <svg className={styles.glyph} viewBox="0 0 24 24" aria-hidden="true">
                    <path className={styles.ghostPlus} d="M12 7.6v8.8M7.6 12h8.8" />
                  </svg>
                </div>
              </div>
            ),
          )}
        </div>

        <div className={styles.header}>
          <span className={styles.eyebrow}>The future of AI is specialized</span>
          <h2 className={styles.title}>
            Start with one AI specialist. <span>Grow your own AI tech stack.</span>
          </h2>
          <p className={styles.subtitle}>It’s super easy, almost fun. Bring your team when you’re ready.</p>
        </div>

        <div className={styles.actions}>
          <Link to="/download" className={styles.btnPrimary}>
            Start building
          </Link>
          {pathname === "/" ? (
            <button type="button" className={styles.btnGhost} onClick={scrollToEnterprise}>
              For Enterprise
            </button>
          ) : (
            <Link to="/#enterprise" className={styles.btnGhost}>
              For Enterprise
            </Link>
          )}
        </div>
      </div>

      <div className={styles.bottomRow}>
        <span>
          © {new Date().getFullYear()}{" "}
          <a href="https://buttery.technology" target="_blank" rel="noreferrer">
            Buttery Technology, Inc.
          </a>
        </span>
        <Link to="/pricing">Pricing</Link>
        <Link to="/about">About</Link>
        <a href="https://buttery.technology/terms" target="_blank" rel="noreferrer">
          Terms of Service
        </a>
        <a href="https://buttery.technology/privacy" target="_blank" rel="noreferrer">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default HomeFooter;
