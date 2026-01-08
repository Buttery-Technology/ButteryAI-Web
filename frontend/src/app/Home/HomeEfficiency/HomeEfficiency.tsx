import styles from "./HomeEfficiency.module.scss";
import CheckCircle from "@assets/icons/check-circle.svg?react";

const HomeEfficiency = () => (
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
            fill="#22908C"
          />
        </svg>
        {/* Rabbit/hare icon (SF Symbol 􀓎) */}
        <svg className={styles.efficiencyIcon} viewBox="0 0 100 80" fill="none">
          {/* Rabbit body running right */}
          <ellipse cx="45" cy="50" rx="28" ry="18" fill="white"/>
          {/* Head */}
          <ellipse cx="75" cy="42" rx="14" ry="12" fill="white"/>
          {/* Long ear back */}
          <path d="M68 30 Q62 8 70 5 Q78 8 74 30" fill="white"/>
          {/* Long ear front */}
          <path d="M78 32 Q75 12 82 8 Q90 12 84 32" fill="white"/>
          {/* Back legs */}
          <ellipse cx="22" cy="58" rx="12" ry="8" fill="white"/>
          {/* Front legs */}
          <ellipse cx="60" cy="62" rx="6" ry="4" fill="white"/>
          {/* Tail */}
          <circle cx="12" cy="48" r="6" fill="white"/>
          {/* Eye */}
          <circle cx="80" cy="40" r="2.5" fill="#22908C"/>
        </svg>
      </div>

      <h1 className={styles.title}>Increase Efficiency & Output</h1>
      <p className={styles.description}>
        ButteryAI makes it easier for you and your team to build exceptional AI functionality at scale. With ButteryAI's
        intelligent engines, value and knowledge stores, and integrated tooling and integrations, your team can increase
        efficiency and output with building AI functionality. Make your team better, today.
      </p>

      <div className={styles.features}>
        <div className={styles.card}>
          <h2>Easy-to-use System</h2>
          <p>
            ButteryAI is built to take the complexity out of building AI so anyone can build an effective team and build
            great AI products.
          </p>
          <CheckCircle className={styles.checkIcon} />
        </div>
        <div className={styles.card}>
          <h2>Productivity</h2>
          <p>
            ButteryAI gives you the canvas for your team to be productive. A unification of toolings allows you to focus
            more time on execution and less on bloat.
          </p>
          <CheckCircle className={styles.checkIcon} />
        </div>
      </div>
    </div>
  </section>
);

export default HomeEfficiency;
