import styles from "./HomeDesign.module.scss";

const HomeDesign = () => (
  <section className={styles.root}>
    <div className={styles.content}>
      <h1 className={styles.title}>Uniquely simple design</h1>
      <p>
        ButteryAI is designed to be easy-to-use so you can focus on the important stuff. ButteryAI uses color code
        status to quickly understand how an AI node is performing and quick look cards for high level information at a
        glance.
      </p>
      <p>Example summary cards</p>
      <ul>
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
      </ul>
      <ul>
        <li>
          <h2>Glanceable Highlights</h2>
          <p>
            ButteryAI shows you important information highlights so you can quickly see how it’s performing and what
            needs your attention.
          </p>
        </li>
        <li>
          <h2>Simple and easy</h2>
          <p>
            ButteryAI is designed to abstract as much complexity as possible so it’s easy-to-use but allow you
            complexity when you need it.
          </p>
        </li>
      </ul>
    </div>
    <div>Color code status image</div>
  </section>
);

export default HomeDesign;
