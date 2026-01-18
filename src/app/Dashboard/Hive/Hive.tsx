import { Link } from "react-router-dom";
import HiveSample from "@assets/images/hive-sample.svg?react";
import { Chat } from "../Chat";
import styles from "./Hive.module.scss";

const Hive = () => (
  <section className={styles.root}>
    <ul className={styles.cards}>
      <li>
        <h2>Value</h2>
        <h3>92</h3>
        <p>This metric is your current value in the Hive.</p>
      </li>
      <li>
        <h2>Trust</h2>
        <h3>Excellent</h3>
        <p>Trust has a {">"}96% stable metric.</p>
      </li>
      <li>
        <h2>Bias</h2>
        <h3>Great</h3>
        <p>Bias has been hovering around ~3%.</p>
      </li>
      <li>
        <h2>Accuracy</h2>
        <h3>Needs Work</h3>
        <p>Accuracy is down to 85% since 01/01 at 4:21pmEST.</p>
      </li>
      <li>
        <h2>Coin</h2>
        <h3 className={styles.gradient}>1,029</h3>
        <p>Current value of your accumulated coin.</p>
      </li>
      <li>
        <h2>Profit</h2>
        <h3>147%</h3>
        <p>The percentage of training completed.</p>
      </li>
      <li>
        <h2>Subscriptions</h2>
        <h3>3</h3>
        <p>Subscriptions acquired.</p>
      </li>
      <li>
        <h2>Notifications</h2>
        <h3>8</h3>
        <p>Messages and notifications.</p>
      </li>
    </ul>
    <div className={styles.imgWrapper}>
      <HiveSample className={styles.hiveSample} />
      <Link to="/node/overview" className={styles.link1} />
      <Link to="/node/new" className={styles.link2} />
    </div>
    <Chat />
  </section>
);

export default Hive;
