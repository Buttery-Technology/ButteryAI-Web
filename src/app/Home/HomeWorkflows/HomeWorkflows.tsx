import styles from "./HomeWorkflows.module.scss";
import WorkflowDiagram from "./workflow-diagram.svg?react";

const HomeWorkflows = () => (
  <section className={styles.root} data-section="workflows">
    <div className={styles.content}>
      <h1 className={styles.title}>Workflows that actually work</h1>
      <p className={styles.description}>
        <span className={styles.highlight}>ButteryWorkflows</span> are the easiest way to built complex AI functionality
        that can run all the time or concurrently with other workflows.
      </p>
    </div>
    <div className={styles.diagramContainer}>
      <WorkflowDiagram className={styles.diagram} />
    </div>
  </section>
);

export default HomeWorkflows;
