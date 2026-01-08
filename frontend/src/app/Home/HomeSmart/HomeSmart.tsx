import styles from "./HomeSmart.module.scss";
import CheckCircle from "@assets/icons/check-circle.svg?react";

const HomeSmart = () => (
  <section className={styles.root}>
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

      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Smart Orchestration</h1>
        <svg className={styles.titleUnderline} viewBox="0 0 426 34" fill="none" preserveAspectRatio="none">
          <path d="M5 5C5 5 129.567 27.305 212.681 28.769C310.974 30.5 420.797 11.241 420.797 11.241" stroke="#FFD74D" strokeWidth="10" strokeLinecap="round"/>
        </svg>
      </div>
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

export default HomeSmart;
