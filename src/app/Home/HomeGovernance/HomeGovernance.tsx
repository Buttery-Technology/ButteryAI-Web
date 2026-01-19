import { HexIcon } from "@common/icons";
import WhiteHouse from "@assets/icons/white-house.svg?react";
import styles from "./HomeGovernance.module.scss";

const HomeGovernance = () => (
  <section className={styles.root} data-section="governance">
    <div className={styles.content}>
      <HexIcon color="#6A52B1" icon={<WhiteHouse />} />
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
