import { useMemo, useState, useEffect, useRef } from "react";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import styles from "./HomeHero.module.scss";

const LOGO_COLOR = "#F9C000";
const ROWS = 3;
const COLS = 14;

// Diagonal color sequence (repeats as needed, starting with light blue to align with logo)
const DIAGONAL_COLORS = [
  "#31AFF5",
  "#288ED2",
  "#755CBA",
  "#D12A89",
  "#D22839",
  "#22908C",
];

const HomeHero = () => {
  const [phase, setPhase] = useState<"loading" | "transitioning" | "complete">("loading");
  const rootRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const logoStartPos = useRef<{ top: number; left: number; width: number } | null>(null);

  const centerCol = Math.floor(COLS / 2);
  const centerRow = Math.floor(ROWS / 2);
  const logoCol = centerCol - 1;

  const hexagons = useMemo(() => {
    const grid: {
      row: number;
      col: number;
      color: string;
      isLogo: boolean;
      position: "left" | "logo" | "right";
      delay: number;
    }[] = [];

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const isLogo = row === centerRow && col === logoCol;
        const distance = Math.abs(row - centerRow) + Math.abs(col - centerCol);

        let position: "left" | "logo" | "right";
        if (isLogo) {
          position = "logo";
        } else if (col >= centerCol) {
          position = "right";
        } else {
          position = "left";
        }

        // Determine color based on diagonal position (accounting for honeycomb offset on odd rows)
        let color: string;
        if (isLogo) {
          color = LOGO_COLOR;
        } else {
          // Odd rows are shifted right, so adjust diagonal calculation
          const rowOffset = Math.floor(row / 2);
          const diagonal = col - rowOffset;
          // Handle negative values with proper modulo
          const diagonalIndex = ((diagonal % DIAGONAL_COLORS.length) + DIAGONAL_COLORS.length) % DIAGONAL_COLORS.length;
          color = DIAGONAL_COLORS[diagonalIndex];
        }

        grid.push({
          row,
          col,
          color,
          isLogo,
          position,
          delay: distance * 0.05,
        });
      }
    }
    return grid;
  }, [centerCol, centerRow, logoCol]);

  useEffect(() => {
    // Start transition after initial grid animation completes
    const transitionDelay = setTimeout(() => {
      setPhase("transitioning");
    }, 1500);

    // Mark complete after transition finishes
    const completeDelay = setTimeout(() => {
      setPhase("complete");
    }, 2100);

    return () => {
      clearTimeout(transitionDelay);
      clearTimeout(completeDelay);
    };
  }, []);

  // Scroll-linked animation for logo - only active after initial animation completes
  useEffect(() => {
    if (phase !== "complete") return;

    // Capture logo's starting position once
    if (!logoStartPos.current && logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
      logoStartPos.current = {
        top: rect.top,
        left: rect.left + rect.width / 2,
        width: rect.width,
      };
    }

    const handleScroll = () => {
      if (!rootRef.current || !logoStartPos.current || !logoRef.current || !textRef.current) return;

      const heroHeight = rootRef.current.offsetHeight;
      const scrollY = window.scrollY;
      // Progress from 0 to 1 - complete transition in 1/3 of hero height for faster animation
      const progress = Math.min(Math.max(scrollY / (heroHeight / 3), 0), 1);

      // Don't apply any style until user starts scrolling
      if (progress === 0) {
        logoRef.current.style.transform = "";
        textRef.current.style.transform = "";
        return;
      }

      // Parallax effect for text - higher value = text moves slower relative to scroll
      const baseYOffset = -60.5;
      const textParallax = scrollY * 0.75;
      textRef.current.style.transform = `translate(-50%, ${baseYOffset + textParallax}px)`;

      const startPos = logoStartPos.current;

      // The CSS transform moves logo up by one row height: -(hexHeight * 0.75 + gap)
      const cssTransformOffset = -(startPos.width * (242 / 210) * 0.75 + 16);

      const endTop = -60;
      const endScale = 0.5;

      const endTransformY = endTop - startPos.top + cssTransformOffset;
      const currentTranslateY = cssTransformOffset + (endTransformY - cssTransformOffset) * progress;
      const currentScale = 1 - (1 - endScale) * progress;

      logoRef.current.style.transform = `translateY(${currentTranslateY}px) scale(${currentScale})`;
      logoRef.current.style.zIndex = "100";
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [phase]);

  return (
    <main className={styles.root} ref={rootRef}>
      <div className={`${styles.gridContainer} ${styles[phase]}`}>
        {hexagons.map(({ row, col, color, isLogo, position, delay }) => (
          <div
            key={`${row}-${col}`}
            className={`
              ${styles.hexagon}
              ${isLogo ? styles.logoHex : ""}
              ${position === "right" ? styles.rightHex : ""}
              ${position === "left" ? styles.leftHex : ""}
              ${row % 2 === 1 ? styles.oddRow : ""}
            `}
            ref={isLogo ? logoRef : undefined}
            style={{
              "--row": row,
              "--col": col,
              "--delay": `${delay}s`,
            } as React.CSSProperties}
          >
            {!isLogo && (
              <svg viewBox="0 0 468 540" className={styles.hexSvg}>
                <path
                  d="M273 22
                     L427 112
                     Q468 135 468 180
                     L468 360
                     Q468 405 427 428
                     L273 518
                     Q234 540 195 518
                     L41 428
                     Q0 405 0 360
                     L0 180
                     Q0 135 41 112
                     L195 22
                     Q234 0 273 22
                     Z"
                  fill={color}
                />
              </svg>
            )}
            {isLogo && (
              <>
                <svg viewBox="0 0 468 540" className={`${styles.hexSvg} ${styles.logoHexSvg}`}>
                  <path
                    d="M273 22
                       L427 112
                       Q468 135 468 180
                       L468 360
                       Q468 405 427 428
                       L273 518
                       Q234 540 195 518
                       L41 428
                       Q0 405 0 360
                       L0 180
                       Q0 135 41 112
                       L195 22
                       Q234 0 273 22
                       Z"
                    fill={color}
                  />
                </svg>
                <img src={butteryaiLogo} alt="ButteryAI" className={styles.logo} />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Text content - appears after transition */}
      <div ref={textRef} className={`${styles.textSection} ${styles[phase]}`}>
        <h1 className={styles.title}>Buttery AI</h1>
        <h2 className={styles.subtitle}>Buttery Smooth AI Development</h2>
        <p className={styles.description}>
          Build unbelievable AI and the tech stack like never before with everything you need, like enterprise-grade
          security, workflows, and governance.
        </p>
      </div>

      {/* Start button - stays fixed */}
      <button className={`${styles.startButton} ${styles[phase]}`}>Start</button>
    </main>
  );
};

export default HomeHero;
