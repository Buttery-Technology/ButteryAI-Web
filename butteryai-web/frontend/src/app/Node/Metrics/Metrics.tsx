import { ReactComponent as Energy } from "../../../assets/images/energy.svg";
import { ReactComponent as Trust } from "../../../assets/images/trust.svg";
import { ReactComponent as Heatmap } from "../../../assets/images/heatmap.svg";
import styles from "./Metrics.module.scss";

const Metrics = () => (
  <section className={styles.root}>
    <strong>Energy</strong>
    <Energy />
    <strong>Trust</strong>
    <ul className={styles.cards}>
      <li>
        <h2>Overall</h2>
        <h3>98%</h3>
        <p>This node has an exceptional trust record.</p>
      </li>
      <li>
        <h2>Last 24h</h2>
        <h3>45%</h3>
        <p>Please investigate this as this is a very low number.</p>
      </li>
    </ul>
    <Trust />
    <strong>IMDA</strong>
    <Heatmap />
    <p className={styles.heatmapDescription}>Data reuse heatmap</p>
  </section>
);

export default Metrics;
