import styles from "./HomeWorkflows.module.scss";

const HomeWorkflows = () => (
  <section className={styles.root}>
    <div className={styles.content}>
      <h1 className={styles.title}>Workflows that actually work</h1>
      <p>
        ButteryWorkflows are the easiest way to built complex AI functionality that can run all the time or concurrently
        with other workflows.
      </p>
    </div>
  </section>
);

export default HomeWorkflows;
