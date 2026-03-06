import { useNavigate } from "react-router-dom";
import Cluster from "@assets/icons/cluster.svg?react";
import Settings from "@assets/icons/settings.svg?react";
import styles from "./FinishSetup.module.scss";

interface Props {
  nodeName: string;
}

const FinishSetup = ({ nodeName }: Props) => {
  const navigate = useNavigate();

  const settingsPath = `/node/${encodeURIComponent(nodeName)}/settings`;

  return (
    <section className={styles.root}>
      <p className={styles.heading}>Finish setup</p>
      <div className={styles.list}>
        <button
          className={styles.row}
          onClick={() => navigate(settingsPath)}
        >
          <span className={styles.icon}>
            <Cluster />
          </span>
          <span className={styles.label}>
            Customize the AI model, knowledge, and training data
          </span>
          <span className={styles.arrow}>›</span>
        </button>
        <button
          className={styles.row}
          onClick={() => navigate(settingsPath)}
        >
          <span className={styles.icon}>
            <Settings />
          </span>
          <span className={styles.label}>Customize the hosting</span>
          <span className={styles.arrow}>›</span>
        </button>
      </div>
    </section>
  );
};

export { FinishSetup };
export default FinishSetup;
