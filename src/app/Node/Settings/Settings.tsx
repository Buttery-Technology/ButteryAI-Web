import Power from "@assets/icons/power.svg?react";
import Diagnostics from "@assets/icons/diagnostics.svg?react";
import Share from "@assets/icons/share.svg?react";
import styles from "./Settings.module.scss";

const Settings = () => {
  return (
    <section className={styles.root}>
      <strong>Actions</strong>
      <p>Manage and control this node.</p>
      <div className={styles.actions}>
        <button className={styles.actionButton}>
          <Power />
          <span>Power Cycle</span>
        </button>
        <button className={styles.actionButton}>
          <Diagnostics />
          <span>Diagnostics</span>
        </button>
        <button className={styles.actionButton}>
          <Share />
          <span>Share</span>
        </button>
      </div>
    </section>
  );
};

export default Settings;
