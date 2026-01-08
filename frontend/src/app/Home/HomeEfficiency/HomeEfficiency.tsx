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
            fill="#755CBA"
          />
        </svg>
        {/* Rabbit/efficiency icon */}
        <svg className={styles.efficiencyIcon} viewBox="0 0 100 100" fill="none">
          <path
            d="M25 65 Q20 45 30 35 Q35 30 40 35 L45 45 Q50 40 55 45 L60 35 Q65 30 70 35 Q80 45 75 65 Q73 75 65 80 L35 80 Q27 75 25 65 Z"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="40" cy="55" r="3" fill="white" />
          <circle cx="60" cy="55" r="3" fill="white" />
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
