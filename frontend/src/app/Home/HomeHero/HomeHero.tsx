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
  const [initialDimensions, setInitialDimensions] = useState<{ height: number; width: number } | null>(null);
  const [dragState, setDragState] = useState<{ key: string; offsetX: number; offsetY: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const rootRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const logoStartPos = useRef<{ top: number; left: number; width: number } | null>(null);
  const lastScrollY = useRef(window.scrollY);

  // Capture initial viewport dimensions once on mount - prevents resize issues
  useEffect(() => {
    setInitialDimensions({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  }, []);

  // Calculate hexagon transforms based on initial viewport width
  const getHexTransform = (position: "left" | "logo" | "right") => {
    if (!initialDimensions || phase === "loading") return undefined;

    const hexWidth = 210; // $hex-width
    const minClearance = 320; // $min-hex-clearance

    if (position === "right") {
      const translateX = Math.max(minClearance, initialDimensions.width / 2 - hexWidth * 2.5);
      return `translateX(${translateX}px)`;
    } else if (position === "left") {
      const translateX = Math.min(-minClearance, -initialDimensions.width / 2 + hexWidth * 2.5);
      return `translateX(${translateX}px)`;
    }
    return undefined;
  };

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

  // Scroll-linked animation for logo and hexagons - active after initial animation completes
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
      if (!rootRef.current || !logoStartPos.current || !logoRef.current) return;

      // Only update if scrollY actually changed (ignores resize-triggered scroll events)
      const scrollY = window.scrollY;
      if (scrollY === lastScrollY.current) return;
      lastScrollY.current = scrollY;

      const heroHeight = rootRef.current.offsetHeight;
      // Progress from 0 to 1 - complete transition in 1/3 of hero height for faster animation
      const progress = Math.min(Math.max(scrollY / (heroHeight / 3), 0), 1);

      // Don't apply any style until user starts scrolling
      if (progress === 0) {
        logoRef.current.style.transform = "";
        return;
      }

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

      // Calculate hexagon spread based on scroll into next-gen section
      // Start spreading earlier so hexagons move as section comes into view
      const spreadStart = heroHeight * 0.2;
      const spreadEnd = heroHeight * 0.7;
      const spreadProgress = Math.min(Math.max((scrollY - spreadStart) / (spreadEnd - spreadStart), 0), 1);

      // Additional horizontal offset for hexagons (max 150px extra spread)
      const additionalSpread = spreadProgress * 150;

      // Apply to all hexagon elements
      const leftHexes = rootRef.current.querySelectorAll(`.${styles.leftHex}`) as NodeListOf<HTMLElement>;
      const rightHexes = rootRef.current.querySelectorAll(`.${styles.rightHex}`) as NodeListOf<HTMLElement>;

      leftHexes.forEach((hex) => {
        const baseTransform = hex.dataset.baseTransform || hex.style.transform || '';
        if (!hex.dataset.baseTransform && hex.style.transform) {
          hex.dataset.baseTransform = hex.style.transform;
        }
        if (additionalSpread > 0) {
          hex.style.transform = `${baseTransform} translateX(${-additionalSpread}px)`;
        }
      });

      rightHexes.forEach((hex) => {
        const baseTransform = hex.dataset.baseTransform || hex.style.transform || '';
        if (!hex.dataset.baseTransform && hex.style.transform) {
          hex.dataset.baseTransform = hex.style.transform;
        }
        if (additionalSpread > 0) {
          hex.style.transform = `${baseTransform} translateX(${additionalSpread}px)`;
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [phase]);

  // Drag handlers for hexagons
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    setDragState({ key, offsetX: 0, offsetY: 0 });
    setDragOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (!dragState || !dragStartPos.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartPos.current) return;
      setDragOffset({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y,
      });
    };

    const handleMouseUp = () => {
      setDragState(null);
      setDragOffset({ x: 0, y: 0 });
      dragStartPos.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState]);

  return (
    <main
      className={styles.root}
      ref={rootRef}
      style={initialDimensions ? { minHeight: initialDimensions.height } : undefined}
    >
      <div
        className={`${styles.gridContainer} ${styles[phase]}`}
        style={initialDimensions && phase !== "loading" ? {
          left: initialDimensions.width / 2,
          top: initialDimensions.height / 2,
        } : undefined}
      >
        {hexagons.map(({ row, col, color, isLogo, position, delay }) => {
          const hexTransform = getHexTransform(position);
          const hexKey = `${row}-${col}`;
          const isDragging = dragState?.key === hexKey;
          return (
          <div
            key={hexKey}
            data-hex-key={hexKey}
            draggable={false}
            className={`
              ${styles.hexagon}
              ${isLogo ? styles.logoHex : ""}
              ${position === "right" ? styles.rightHex : ""}
              ${position === "left" ? styles.leftHex : ""}
              ${row % 2 === 1 ? styles.oddRow : ""}
              ${isDragging ? styles.dragging : ""}
            `}
            ref={isLogo ? logoRef : undefined}
            onMouseDown={(e) => handleMouseDown(e, hexKey)}
            onDragStart={(e) => e.preventDefault()}
            style={{
              "--row": row,
              "--col": col,
              "--delay": `${delay}s`,
              "--hex-color": color,
              ...(hexTransform && { transform: hexTransform }),
            } as React.CSSProperties}
          >
            {!isLogo && (
              <div
                className={styles.hexDragWrapper}
                style={{ transform: isDragging ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` : 'translate(0, 0)' }}
              >
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
              </div>
            )}
            {isLogo && (
              <div style={{ transform: isDragging ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` : 'translate(0, 0)', transition: isDragging ? 'none' : 'transform 0.4s ease-out' }}>
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
              </div>
            )}
          </div>
        );
        })}
      </div>

      {/* Text content - appears after transition */}
      <div className={`${styles.textSection} ${styles[phase]}`}>
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
