import styles from "./HomeEfficiency.module.scss";

const HomeEfficiency = () => (
  <section className={styles.root}>
    <div className={styles.content}>
      <h1 className={styles.title}>Increase Efficiency & Output</h1>
      <p>
        ButteryAI makes it easier for you and your team to build exceptional AI functionality at scale. With ButteryAI's
        intelligent engines, value and knowledge stores, and integrated tooling and integrations, your team can increase
        efficiency and output with building AI functionality. Make your team better, today.
      </p>
      <ul>
        <li>
          <h2>Easy-to-use System</h2>
          <p>
            ButteryAI is built to take the complexity out of building AI so anyone can build an effective team and build
            great AI products.
          </p>
        </li>
        <li>
          <h2>Productivity</h2>
          <p>
            ButteryAI gives you the canvas for your team to be productive. A unification of toolings allows you to focus
            more time on execution and less on bloat.
          </p>
        </li>
      </ul>
    </div>
  </section>
);

export default HomeEfficiency;
