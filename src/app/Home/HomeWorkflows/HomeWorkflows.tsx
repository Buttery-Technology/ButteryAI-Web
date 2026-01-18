import Workflow from "@assets/images/workflow.svg?react";
import styles from "./HomeWorkflows.module.scss";

const HomeWorkflows = () => (
  <section className={styles.root}>
    <div className={styles.content}>
      <h1 className={styles.title}>Workflows that actually work</h1>
      <p>
        <span>ButteryWorkflows</span> are the easiest way to built complex AI functionality that can run all the time or
        concurrently with other workflows.
      </p>
      <Workflow className={styles.image} />
    </div>
  </section>
);

export default HomeWorkflows;
