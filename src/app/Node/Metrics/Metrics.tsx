import Energy from "@assets/images/energy.svg?react";
import Trust from "@assets/images/trust.svg?react";
import Heatmap from "@assets/images/heatmap.svg?react";
import type { NodeResponse } from "../../../types/api";
import styles from "./Metrics.module.scss";

interface Props {
  node: NodeResponse | null;
  isLoading: boolean;
}

const Metrics = ({ node, isLoading }: Props) => {
  const grade = node?.grade;
  const hasGrade = grade && grade.trust.status === "defined";

  const overallTrust = hasGrade ? `${grade.trust.value.toFixed(0)}%` : (isLoading ? "—" : "N/A");
  const accuracyValue = grade && grade.accuracy.status === "defined"
    ? `${grade.accuracy.value.toFixed(0)}%`
    : (isLoading ? "—" : "N/A");

  return (
    <section className={styles.root}>
      <strong>Energy</strong>
      <Energy />
      <strong>Trust</strong>
      <ul className={styles.cards}>
        <li>
          <h2>Overall</h2>
          <h3>{overallTrust}</h3>
          <p>{hasGrade ? "This node has an exceptional trust record." : "Waiting for evaluation data..."}</p>
        </li>
        <li>
          <h2>Accuracy</h2>
          <h3>{accuracyValue}</h3>
          <p>{grade?.accuracy.status === "defined" ? "Current accuracy measurement." : "Waiting for evaluation data..."}</p>
        </li>
      </ul>
      <Trust />
      <strong>IMDA</strong>
      <Heatmap />
      <p className={styles.heatmapDescription}>Data reuse heatmap</p>
    </section>
  );
};

export default Metrics;
