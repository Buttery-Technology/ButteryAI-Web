import Activity from "@assets/images/activity.svg?react";
import Energy from "@assets/images/energy-node.svg?react";
import { Chat } from "../../Dashboard/Chat";
import styles from "./Overview.module.scss";

const Overview = () => (
  <section className={styles.root}>
    <strong>Activity</strong>
    <Activity className={styles.activity} />
    <strong>Systems</strong>
    <p className={styles.description}>
      Overall systems are running good but the node is using a lot of energy. Perhaps running diagnostics can help
      figure out the culprits.
    </p>
    <ul className={styles.cards}>
      <li>
        <strong>Energy</strong>
        <h2>High</h2>
        <p>~94% usage in last ~6hrs.</p>
      </li>
      <li>
        <strong>Trust</strong>
        <h2>Great</h2>
        <p>
          <strong>98%</strong> overall. <strong>45%</strong> in last 24 hours.
        </p>
      </li>
      <li>
        <strong>Bias</strong>
        <h2>Good</h2>
        <p>~ 4% bias detected.</p>
      </li>
      <li>
        <strong>IMDA</strong>
        <h2>Good</h2>
        <p>Overall 65% reuse and positive trends.</p>
      </li>
    </ul>
    <strong>Interactions</strong>
    <ul className={`${styles.cards} ${styles.interactions}`}>
      <li>
        <strong>Summary</strong>
        <h2>1,033</h2>
        <p>
          <strong>421</strong> in last 24 hr.
          <br />
          <strong>33</strong> {"<"} 15m
        </p>
      </li>
      <li>
        <strong>Audit Certificates</strong>
        <h2>1,033</h2>
        <p>
          <strong>100%</strong> validated
          <br />
          <strong>2%</strong> need attention
        </p>
      </li>
      <li>
        <strong>Corrections</strong>
        <h2>17</h2>
        <p>
          <strong>2</strong> in last 24 hr.
          <br />
          <strong>1</strong> {"<"} 15m
        </p>
      </li>
      <li>
        <strong>Data Updates</strong>
        <h2>6</h2>
        <p>New data detected for system updates available.</p>
      </li>
    </ul>
    <strong>Energy</strong>
    <Energy className={styles.energy} />
    <Chat />
  </section>
);

export default Overview;
