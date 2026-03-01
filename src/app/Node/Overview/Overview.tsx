import Activity from "@assets/images/activity.svg?react";
import Energy from "@assets/images/energy-node.svg?react";
import { Chat } from "../../Dashboard/Chat";
import type { NodeResponse, NodeHistoryEntry } from "../../../types/api";
import styles from "./Overview.module.scss";

interface Props {
  node: NodeResponse | null;
  history: NodeHistoryEntry[];
  isLoading: boolean;
}

function gradeLabel(value: number): string {
  if (value >= 90) return "Excellent";
  if (value >= 75) return "Great";
  if (value >= 60) return "Good";
  if (value >= 40) return "Needs Work";
  return "Low";
}

function biasLabel(value: number): string {
  // Bias: lower is better, value is 0-100 scale where 100 = no bias
  const biasPercent = 100 - value;
  if (biasPercent <= 5) return "Excellent";
  if (biasPercent <= 10) return "Good";
  if (biasPercent <= 25) return "Fair";
  return "Needs Work";
}

const Overview = ({ node, history, isLoading }: Props) => {
  const grade = node?.grade;
  const hasGrade = grade && grade.overallScore.status === "defined";

  // Derive interaction stats from history
  const totalInteractions = history.length;
  const queries = history.filter((h) => h.type === "querySent" || h.type === "querySucceeded" || h.type === "queryFailed");
  const corrections = history.filter((h) => h.type === "queryFailed");

  return (
    <section className={styles.root}>
      <strong>Activity</strong>
      <Activity className={styles.activity} />
      <strong>Systems</strong>
      <p className={styles.description}>
        {hasGrade
          ? "System metrics from the latest grade evaluation for this node."
          : "Waiting for grade evaluation data..."}
      </p>
      <ul className={styles.cards}>
        <li>
          <strong>Energy</strong>
          <h2>{hasGrade ? gradeLabel(grade.overallScore.value) : (isLoading ? "—" : "N/A")}</h2>
          <p>{hasGrade ? `Overall score: ${grade.overallScore.value.toFixed(0)}%` : "Not yet evaluated."}</p>
        </li>
        <li>
          <strong>Trust</strong>
          <h2>{hasGrade ? gradeLabel(grade.trust.value) : (isLoading ? "—" : "N/A")}</h2>
          <p>
            {hasGrade ? (
              <><strong>{grade.trust.value.toFixed(0)}%</strong> overall trust score.</>
            ) : "Not yet evaluated."}
          </p>
        </li>
        <li>
          <strong>Bias</strong>
          <h2>{hasGrade ? biasLabel(grade.bias.value) : (isLoading ? "—" : "N/A")}</h2>
          <p>{hasGrade ? `~ ${(100 - grade.bias.value).toFixed(0)}% bias detected.` : "Not yet evaluated."}</p>
        </li>
        <li>
          <strong>Accuracy</strong>
          <h2>{hasGrade ? gradeLabel(grade.accuracy.value) : (isLoading ? "—" : "N/A")}</h2>
          <p>{hasGrade ? `${grade.accuracy.value.toFixed(0)}% accuracy score.` : "Not yet evaluated."}</p>
        </li>
      </ul>
      <strong>Interactions</strong>
      <ul className={`${styles.cards} ${styles.interactions}`}>
        <li>
          <strong>Summary</strong>
          <h2>{totalInteractions > 0 ? totalInteractions.toLocaleString() : "—"}</h2>
          <p>
            <strong>{queries.length}</strong> queries recorded.
          </p>
        </li>
        <li>
          <strong>Audit Certificates</strong>
          <h2>—</h2>
          <p>Audit data not yet available from the server.</p>
        </li>
        <li>
          <strong>Corrections</strong>
          <h2>{corrections.length > 0 ? corrections.length : "—"}</h2>
          <p>
            <strong>{corrections.length}</strong> failed queries detected.
          </p>
        </li>
        <li>
          <strong>Data Updates</strong>
          <h2>—</h2>
          <p>Update tracking not yet available from the server.</p>
        </li>
      </ul>
      <strong>Energy</strong>
      <Energy className={styles.energy} />
      <Chat />
    </section>
  );
};

export default Overview;
