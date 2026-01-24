import { useEffect, useRef, useState } from "react";
import styles from "./HomeSmart.module.scss";
import CheckCircle from "@assets/icons/check-circle.svg?react";

interface HexTarget {
  x: number;
  y: number;
}

const HomeSmart = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [middleTarget, setMiddleTarget] = useState<HexTarget | null>(null);
  const [topTarget, setTopTarget] = useState<HexTarget | null>(null);
  const [bottomTarget, setBottomTarget] = useState<HexTarget | null>(null);
  const [isInView, setIsInView] = useState(false);

  // SVG positioning constants
  const svgLeft = 700;
  const svgTop = 280;
  const svgScaleX = 600 / 450;
  const svgScaleY = 300 / 300;

  useEffect(() => {
    const findHexagon = (row: number, minCol: number): Element | null => {
      const hexagons = document.querySelectorAll(`[data-hex-key^="${row}-"]`);
      let targetHex: Element | null = null;

      hexagons.forEach((hex) => {
        const key = hex.getAttribute('data-hex-key');
        if (key) {
          const [, col] = key.split('-').map(Number);
          if (col >= minCol && !targetHex) {
            targetHex = hex;
          }
        }
      });

      return targetHex;
    };

    const updateTargets = () => {
      if (!sectionRef.current) return;

      const sectionRect = sectionRef.current.getBoundingClientRect();

      // Find middle row hexagon (row 1, first right hexagon col >= 7)
      const middleHex = findHexagon(1, 7);
      if (middleHex) {
        const hexRect = middleHex.getBoundingClientRect();
        // Left edge of hexagon
        const hexLeftEdgeX = hexRect.left - sectionRect.left;
        const hexCenterY = hexRect.top + hexRect.height / 2 - sectionRect.top;

        setMiddleTarget({
          x: (hexLeftEdgeX - svgLeft) * svgScaleX,
          y: (hexCenterY - svgTop) * svgScaleY
        });
      }

      // Find top row hexagon (row 0, first right hexagon col >= 7)
      const topHex = findHexagon(0, 7);
      if (topHex) {
        const hexRect = topHex.getBoundingClientRect();
        // Inside edge (bottom-left area of the hexagon) - offset from left edge and toward bottom
        const hexInsideX = hexRect.left - sectionRect.left + hexRect.width * 0.15;
        const hexInsideY = hexRect.top + hexRect.height * 0.7 - sectionRect.top;

        setTopTarget({
          x: (hexInsideX - svgLeft) * svgScaleX,
          y: (hexInsideY - svgTop) * svgScaleY
        });
      }

      // Find bottom row hexagon (row 2, first right hexagon col >= 7)
      const bottomHex = findHexagon(2, 7);
      if (bottomHex) {
        const hexRect = bottomHex.getBoundingClientRect();
        // Inside edge (upper-left angled edge facing the middle hexagons)
        // Move into the hexagon more to hit the inner edge
        const hexInsideX = hexRect.left - sectionRect.left + hexRect.width * 0.25;
        const hexInsideY = hexRect.top + hexRect.height * 0.2 - sectionRect.top;

        setBottomTarget({
          x: (hexInsideX - svgLeft) * svgScaleX,
          y: (hexInsideY - svgTop) * svgScaleY
        });
      }

      // Check if title is in view (more restrictive than whole section)
      let inView = false;
      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        // Title must be visible in the viewport
        inView = titleRect.top < window.innerHeight && titleRect.bottom > 0;
      } else {
        // Fallback to section check
        inView = sectionRect.top < window.innerHeight * 0.8 && sectionRect.bottom > window.innerHeight * 0.2;
      }

      setIsInView(inView);
    };

    updateTargets();
    window.addEventListener('scroll', updateTargets, { passive: true });
    window.addEventListener('resize', updateTargets, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateTargets);
      window.removeEventListener('resize', updateTargets);
    };
  }, []);

  // Origin point for all lines
  const originX = 0;
  const originY = 150;

  // Middle line - target coordinates
  const middleTargetX = middleTarget?.x ?? 600;
  const middleTargetY = middleTarget?.y ?? 150;

  // Middle line: smooth curve from origin to hexagon
  // Use cubic bezier for smoother curve - control points create a natural horizontal-to-target flow
  const middleCtrl1X = originX + (middleTargetX - originX) * 0.6;
  const middleCtrl1Y = originY;
  const middleCtrl2X = originX + (middleTargetX - originX) * 0.8;
  const middleCtrl2Y = middleTargetY;
  const middleFullPath = `M${originX} ${originY} C${middleCtrl1X} ${middleCtrl1Y} ${middleCtrl2X} ${middleCtrl2Y} ${middleTargetX} ${middleTargetY}`;

  // Top line - target coordinates
  const topTargetX = topTarget?.x ?? 600;
  const topTargetY = topTarget?.y ?? 50;

  // Calculate the angle to the target for proper curve alignment
  const deltaX = topTargetX - originX;
  const deltaY = topTargetY - originY;

  // Top line: smooth curve that flows directly toward the hexagon
  // First control point: start horizontal, then curve
  const topCtrl1X = originX + deltaX * 0.4;
  const topCtrl1Y = originY + deltaY * 0.1; // Slight upward bias early
  // Second control point: align with the direction to the target
  const topCtrl2X = originX + deltaX * 0.7;
  const topCtrl2Y = originY + deltaY * 0.7; // Approach target angle
  const topFullPath = `M${originX} ${originY} C${topCtrl1X} ${topCtrl1Y} ${topCtrl2X} ${topCtrl2Y} ${topTargetX} ${topTargetY}`;

  // Bottom line - target coordinates
  const bottomTargetX = bottomTarget?.x ?? 600;
  const bottomTargetY = bottomTarget?.y ?? 250;

  // Calculate the delta to the bottom target
  const bottomDeltaX = bottomTargetX - originX;
  const bottomDeltaY = bottomTargetY - originY;

  // Bottom line: smooth curve that flows directly toward the bottom hexagon
  const bottomCtrl1X = originX + bottomDeltaX * 0.4;
  const bottomCtrl1Y = originY + bottomDeltaY * 0.1; // Slight downward bias early
  const bottomCtrl2X = originX + bottomDeltaX * 0.7;
  const bottomCtrl2Y = originY + bottomDeltaY * 0.7; // Approach target angle
  const bottomFullPath = `M${originX} ${originY} C${bottomCtrl1X} ${bottomCtrl1Y} ${bottomCtrl2X} ${bottomCtrl2Y} ${bottomTargetX} ${bottomTargetY}`;

  return (
    <section className={styles.root} ref={sectionRef}>
      {/* Connector lines from content to hexagons */}
      <svg className={styles.connectorLines} viewBox="0 0 600 300" fill="none">
        <defs>
          {/* Glow filter for synapse effect */}
          <filter id="synapseGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          {/* Stronger glow for the pulse */}
          <filter id="pulseGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Main container - only visible when in view */}
        <g className={`${styles.linesContainer} ${isInView ? styles.visible : ''}`}>
          {/* Traveling pulses to top hexagon */}
          <circle
            className={styles.travelingPulse}
            r="6"
            fill="#31AFF5"
            filter="url(#pulseGlow)"
          >
            <animateMotion
              dur="1.8s"
              repeatCount="indefinite"
              path={topFullPath}
            />
          </circle>
          <circle
            className={styles.travelingPulse2}
            r="4"
            fill="#755CBA"
            filter="url(#synapseGlow)"
          >
            <animateMotion
              dur="1.8s"
              repeatCount="indefinite"
              path={topFullPath}
              begin="0.9s"
            />
          </circle>

          {/* Traveling pulses to middle hexagon */}
          <circle
            className={styles.travelingPulse}
            r="6"
            fill="#31AFF5"
            filter="url(#pulseGlow)"
          >
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              path={middleFullPath}
            />
          </circle>
          <circle
            className={styles.travelingPulse2}
            r="4"
            fill="#755CBA"
            filter="url(#synapseGlow)"
          >
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              path={middleFullPath}
              begin="0.75s"
            />
          </circle>

          {/* Traveling pulses to bottom hexagon */}
          <circle
            className={styles.travelingPulse}
            r="6"
            fill="#31AFF5"
            filter="url(#pulseGlow)"
          >
            <animateMotion
              dur="1.8s"
              repeatCount="indefinite"
              path={bottomFullPath}
            />
          </circle>
          <circle
            className={styles.travelingPulse2}
            r="4"
            fill="#755CBA"
            filter="url(#synapseGlow)"
          >
            <animateMotion
              dur="1.8s"
              repeatCount="indefinite"
              path={bottomFullPath}
              begin="0.9s"
            />
          </circle>
        </g>
      </svg>
    <div className={styles.content}>
      <div className={styles.hexIcon}>
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
            fill="#288ED2"
          />
        </svg>
        <svg className={styles.orchestrationIcon} viewBox="0 0 100 100" fill="none">
          {/* Honeycomb pattern of donut circles */}
          {/* Top row */}
          <circle cx="35" cy="22" r="10" stroke="white" strokeWidth="8" fill="none" />
          <circle cx="65" cy="22" r="10" stroke="white" strokeWidth="8" fill="none" />
          {/* Middle row */}
          <circle cx="20" cy="50" r="10" stroke="white" strokeWidth="8" fill="none" />
          <circle cx="50" cy="50" r="10" stroke="white" strokeWidth="8" fill="none" />
          <circle cx="80" cy="50" r="10" stroke="white" strokeWidth="8" fill="none" />
          {/* Bottom row */}
          <circle cx="35" cy="78" r="10" stroke="white" strokeWidth="8" fill="none" />
          <circle cx="65" cy="78" r="10" stroke="white" strokeWidth="8" fill="none" />
        </svg>
      </div>

      <h1 className={styles.title} ref={titleRef}>Smart Orchestration</h1>
      <p className={styles.description}>
        ButteryAI can intelligently orchestrate across multiple AI models simultaneously. Leverage workflows and
        extensions to take your orchestration to the next level. ButteryAI is built upon a patented distributed
        architecture that requires no additional overhead and <strong>no token loss</strong> - I say that again,{" "}
        <strong>no token loss</strong>.
      </p>

      <div className={styles.features}>
        <div className={styles.card}>
          <h2>No Token Loss</h2>
          <p>
            ButteryAI's unique architecture and technology come with no token loss. Build your AI with confidence.
          </p>
          <CheckCircle className={styles.checkIcon} />
        </div>
        <div className={styles.card}>
          <h2>Smart Distribution</h2>
          <p>
            ButteryAI's intelligent distributed technology means you can orchestrate between an infinite number of AI
            nodes. Use your imagination.
          </p>
          <CheckCircle className={styles.checkIcon} />
        </div>
        <div className={styles.card}>
          <h2>Connective Tissue</h2>
          <p>
            ButteryAI is the only platform that allows you to have unified orchestration between AI systems, thereby
            removing any technical overhead.
          </p>
          <CheckCircle className={styles.checkIcon} />
        </div>
      </div>
    </div>
  </section>
  );
};

export default HomeSmart;
