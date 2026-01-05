import { useMemo, useState, useEffect } from "react";
import butteryaiLogo from "@assets/logos/butteryai.png";
import styles from "./HomeHero.module.scss";

const COLORS = ["#288ED2", "#22908C", "#755CBA", "#D12A89"];
const LOGO_COLOR = "#FFD74D";
const ROWS = 3;
const COLS = 14;

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

const HomeHero = () => {
  const [phase, setPhase] = useState<"loading" | "transitioning" | "complete">("loading");

  const centerCol = Math.floor(COLS / 2);
  const centerRow = Math.floor(ROWS / 2);

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
        const isLogo = row === centerRow && col === centerCol - 1;
        const distance = Math.abs(row - centerRow) + Math.abs(col - centerCol);

        let position: "left" | "logo" | "right";
        if (isLogo) {
          position = "logo";
        } else if (col >= centerCol) {
          position = "right";
        } else {
          position = "left";
        }

        grid.push({
          row,
          col,
          color: isLogo ? LOGO_COLOR : getRandomColor(),
          isLogo,
          position,
          delay: distance * 0.05,
        });
      }
    }
    return grid;
  }, [centerCol, centerRow]);

  useEffect(() => {
    // Start transition after initial grid animation completes
    const transitionDelay = setTimeout(() => {
      setPhase("transitioning");
    }, 1500);

    // Mark complete after transition finishes
    const completeDelay = setTimeout(() => {
      setPhase("complete");
    }, 2500);

    return () => {
      clearTimeout(transitionDelay);
      clearTimeout(completeDelay);
    };
  }, []);

  return (
    <main className={styles.root}>
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
            style={{
              "--row": row,
              "--col": col,
              "--delay": `${delay}s`,
            } as React.CSSProperties}
          >
            <svg viewBox="0 0 468 540" className={styles.hexSvg}>
              <path
                d="M286 30
                   L416 105
                   Q468 135 468 195
                   L468 345
                   Q468 405 416 435
                   L286 510
                   Q234 540 182 510
                   L52 435
                   Q0 405 0 345
                   L0 195
                   Q0 135 52 105
                   L182 30
                   Q234 0 286 30
                   Z"
                fill={color}
              />
            </svg>
            {isLogo && (
              <img src={butteryaiLogo} alt="ButteryAI" className={styles.logo} />
            )}
          </div>
        ))}
      </div>

      {/* Text content - appears after transition */}
      <div className={`${styles.textSection} ${styles[phase]}`}>
        <h1 className={styles.title}>ButteryAI</h1>
        <h2 className={styles.subtitle}>Buttery Smooth AI Development</h2>
        <p className={styles.description}>
          Build unbelievable AI and the tech stack like never before with everything you need, like enterprise-grade
          security, workflows, and governance.
        </p>
      </div>
    </main>
  );
};

export default HomeHero;
