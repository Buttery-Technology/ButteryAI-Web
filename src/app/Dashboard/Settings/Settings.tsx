import styles from "./Settings.module.scss";

const Settings = () => (
  <section className={styles.root}>
    <strong>Universal Value System</strong>
    <p>1.3M Values</p>
    <ul className={styles.infoCards}>
      <li>
        <h2>Summary</h2>
        <h3>1.3M</h3>
        <p>
          <strong>1.3M</strong> total. <strong>+62</strong> in last 24 hr. <strong>+88 {"<"} 15m.</strong>
        </p>
      </li>
      <li>
        <h2>Value</h2>
        <h3>92</h3>
        <p>This metric is how well these values are consumed in the Hive.</p>
      </li>
      <li>
        <h2>Security</h2>
        <h3>Stable</h3>
        <p>No incidents or intrusions detected.</p>
      </li>
      <li>
        <h2>Activity</h2>
        <h3>10+ users</h3>
        <p>
          There have been <strong>12</strong> users contributing to UVS in the last <strong>~15m</strong>.
        </p>
      </li>
    </ul>
    <strong>Trusted Advisor System</strong>
    <p>10K Advisors</p>
    <ul className={styles.infoCards}>
      <li>
        <h2>Summary</h2>
        <h3>10K</h3>
        <p>
          <strong>10K</strong> total. <strong>+62</strong> in last 24 hr. <strong>+8 {"<"} 15m</strong>.{" "}
          <strong>-10 {"<"} 15m</strong>.
        </p>
      </li>
      <li>
        <h2>Value</h2>
        <h3>98</h3>
        <p>This metric is how well the advisors perform in the Hive.</p>
      </li>
      <li>
        <h2>Security</h2>
        <h3>Stable</h3>
        <p>No incidents or intrusions detected.</p>
      </li>
      <li>
        <h2>Activity</h2>
        <h3>10+ users</h3>
        <p>
          There have been <strong>12</strong> users contributing to UVS in the last <strong>~15m</strong>.
        </p>
      </li>
    </ul>
    <strong>Extensions</strong>
    <p>...</p>
    <br />
  </section>
);

export default Settings;
