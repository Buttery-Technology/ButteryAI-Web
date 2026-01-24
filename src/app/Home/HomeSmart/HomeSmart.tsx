import { useEffect, useRef, useState } from "react";
import styles from "./HomeSmart.module.scss";
import CheckCircle from "@assets/icons/check-circle.svg?react";

const HomeSmart = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [synapseTarget, setSynapseTarget] = useState<{ x: number; y: number } | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const updateSynapseTarget = () => {
      if (!sectionRef.current) return;

      // Find all right hexagons (middle row = row 1)
      const rightHexagons = document.querySelectorAll('[data-hex-key^="1-"]');
      let targetHex: Element | null = null;

      // Find the first right hexagon in the middle row (col >= 7)
      rightHexagons.forEach((hex) => {
        const key = hex.getAttribute('data-hex-key');
        if (key) {
          const [, col] = key.split('-').map(Number);
          if (col >= 7 && !targetHex) {
            targetHex = hex;
          }
        }
      });

      if (targetHex) {
        const hexRect = targetHex.getBoundingClientRect();
        const sectionRect = sectionRef.current.getBoundingClientRect();

        // Calculate position relative to the connector lines SVG
        // SVG is at left: 700px, top: 280px relative to section
        const svgLeft = 700;
        const svgTop = 280;

        // Get the LEFT EDGE of the hexagon (leading edge) relative to section
        const hexLeftEdgeX = hexRect.left - sectionRect.left;
        const hexCenterY = hexRect.top + hexRect.height / 2 - sectionRect.top;

        // Convert to SVG coordinates (SVG viewBox is 600x300, actual size is 450x300)
        const svgScaleX = 600 / 450;
        const svgScaleY = 300 / 300;

        const targetX = (hexLeftEdgeX - svgLeft) * svgScaleX;
        const targetY = (hexCenterY - svgTop) * svgScaleY;

        setSynapseTarget({ x: targetX, y: targetY });
      }

      // Check if section is in view
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const inView = sectionRect.top < window.innerHeight * 0.8 && sectionRect.bottom > window.innerHeight * 0.2;
      setIsInView(inView);
    };

    updateSynapseTarget();
    window.addEventListener('scroll', updateSynapseTarget, { passive: true });
    window.addEventListener('resize', updateSynapseTarget, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateSynapseTarget);
      window.removeEventListener('resize', updateSynapseTarget);
    };
  }, []);

  // Calculate synapse path and elements based on target
  const lineEndX = 540;
  const lineEndY = 150;
  const targetX = synapseTarget?.x ?? 580;
  const targetY = synapseTarget?.y ?? 150;

  // Create a curved path from line end to hexagon
  const controlX = lineEndX + (targetX - lineEndX) * 0.5;
  const controlY = lineEndY;

  const synapsePath = `M${lineEndX} ${lineEndY} Q${controlX} ${controlY} ${targetX} ${targetY}`;

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
          {/* Gradient for the electrical arc */}
          <linearGradient id="electricGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#288ED2" stopOpacity="0.3"/>
            <stop offset="50%" stopColor="#31AFF5" stopOpacity="1"/>
            <stop offset="100%" stopColor="#755CBA" stopOpacity="0.8"/>
          </linearGradient>
        </defs>

        {/* Line going up-right */}
        <path d="M0 150 Q300 150 500 50" stroke="#8D8D8D" strokeWidth="10" strokeLinecap="round" fill="none"/>
        {/* Line going down-right */}
        <path d="M0 150 Q300 150 500 250" stroke="#8D8D8D" strokeWidth="10" strokeLinecap="round" fill="none"/>

        {/* Middle line - base */}
        <path d="M0 150 Q280 150 540 150" stroke="#8D8D8D" strokeWidth="10" strokeLinecap="round" fill="none"/>

        {/* Synapse connection extension - animated electrical arc */}
        <g className={`${styles.synapseGroup} ${isInView ? styles.active : ''}`}>
          {/* Main extending line with glow */}
          <path
            className={styles.synapseLine}
            d={synapsePath}
            stroke="url(#electricGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            filter="url(#synapseGlow)"
          />

          {/* Traveling energy pulse along the line */}
          <circle
            className={styles.travelingPulse}
            r="4"
            fill="#31AFF5"
            filter="url(#pulseGlow)"
          >
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              path={synapsePath}
            />
          </circle>

          {/* Second traveling pulse (offset) */}
          <circle
            className={styles.travelingPulse2}
            r="3"
            fill="#755CBA"
            filter="url(#synapseGlow)"
          >
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              path={synapsePath}
              begin="0.5s"
            />
          </circle>

          {/* Pulsing endpoint node at hexagon */}
          <circle
            className={styles.synapseNode}
            cx={targetX}
            cy={targetY}
            r="8"
            fill="#31AFF5"
            filter="url(#pulseGlow)"
          />

          {/* Outer pulse ring at hexagon */}
          <circle
            className={styles.pulseRing}
            cx={targetX}
            cy={targetY}
            r="12"
            fill="none"
            stroke="#31AFF5"
            strokeWidth="2"
            filter="url(#synapseGlow)"
            style={{ transformOrigin: `${targetX}px ${targetY}px` }}
          />

          {/* Secondary pulse ring */}
          <circle
            className={styles.pulseRing2}
            cx={targetX}
            cy={targetY}
            r="16"
            fill="none"
            stroke="#755CBA"
            strokeWidth="1"
            filter="url(#synapseGlow)"
            style={{ transformOrigin: `${targetX}px ${targetY}px` }}
          />
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

      <h1 className={styles.title}>Smart Orchestration</h1>
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
