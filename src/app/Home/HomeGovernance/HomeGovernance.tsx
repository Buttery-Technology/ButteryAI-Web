import WhiteHouse from "@assets/icons/white-house.svg?react";
import styles from "./HomeGovernance.module.scss";

const HomeGovernance = () => (
  <section className={styles.root} data-section="governance">
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
            fill="#6A52B1"
          />
        </svg>
        <WhiteHouse className={styles.governanceIcon} />
      </div>
      <h1 className={styles.title}>Integrated Governance</h1>
      <p>
        ButteryAI gives you deeply integrated governance by default. This gives you control and oversight like never
        before. Create policies, standards, and other essential governance tools to ensure your AI adheres to company
        policy.
      </p>
      <p>
        We believe AI should have transparency, be responsible, have privacy, and be ethical. And, we believe it’s the
        right of every AI startup to have this feature and not have to pay for a suite. This allows AI to develop fairly
        and openly for all companies and startups.
      </p>
    </div>
  </section>
);

export default HomeGovernance;
