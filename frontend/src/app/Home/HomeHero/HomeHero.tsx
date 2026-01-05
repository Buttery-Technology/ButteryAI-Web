import { useMemo } from "react";
import butteryaiLogo from "@assets/logos/butteryai.png";
import styles from "./HomeHero.module.scss";

const COLORS = ["#288ED2", "#22908C", "#755CBA", "#D12A89"];
const LOGO_COLOR = "#FFD74D";
const ROWS = 3;
const COLS = 14;

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

const HomeHero = () => {
  const hexagons = useMemo(() => {
    const grid: { row: number; col: number; color: string; isCenter: boolean; delay: number }[] = [];
    const centerRow = Math.floor(ROWS / 2);
    const centerCol = Math.floor(COLS / 2);

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const isCenter = row === centerRow && (col === centerCol || col === centerCol - 1);
        const distance = Math.abs(row - centerRow) + Math.abs(col - centerCol);

        grid.push({
          row,
          col,
          color: isCenter && col === centerCol - 1 ? LOGO_COLOR : getRandomColor(),
          isCenter: isCenter && col === centerCol - 1,
          delay: distance * 0.05,
        });
      }
    }
    return grid;
  }, []);

  return (
    <main className={styles.root}>
      <div className={styles.grid}>
        {hexagons.map(({ row, col, color, isCenter, delay }) => (
          <div
            key={`${row}-${col}`}
            className={`${styles.hexagon} ${isCenter ? styles.center : ""} ${row % 2 === 1 ? styles.oddRow : ""}`}
            style={{
              "--row": row,
              "--col": col,
              "--color": color,
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
            {isCenter && (
              <img
                src={butteryaiLogo}
                alt="ButteryAI"
                className={styles.logo}
              />
            )}
          </div>
        ))}
      </div>
    </main>
  );
};

export default HomeHero;
