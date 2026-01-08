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
        {/* Running rabbit icon */}
        <svg className={styles.efficiencyIcon} viewBox="0 0 24 24" fill="white">
          <path d="M18.5 8.5c1.5-1 2.5-2.5 2.5-4 0-.5-.5-1-1-1s-1.5.5-2 1c-.5-.5-1.5-1-2-1s-1 .5-1 1c0 1.5 1 3 2.5 4h-4c-2 0-3.5 1-4.5 2.5L7 9c-.5-1-1.5-1.5-2.5-1.5S2 8.5 2 10c0 2 2 4 4.5 4H8l-1.5 3c-.5 1 0 2 1 2.5.5.5 1.5.5 2-.5l2-3h3l1 2c.5 1 1.5 1.5 2.5 1 1-.5 1.5-1.5 1-2.5l-1.5-3c1-.5 2-1.5 2-3 0-1-.5-2-1.5-2h-4z"/>
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
