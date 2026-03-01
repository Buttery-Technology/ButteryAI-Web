import { useUserContext } from "@hooks";
import type { SummaryCard } from "../../../types/api";
import styles from "./Settings.module.scss";

interface Props {
  summaryCards: SummaryCard[];
}

const Settings = ({ summaryCards }: Props) => {
  const { signOut } = useUserContext();

  // Extract key metrics from summary cards when available
  const valueCard = summaryCards.find((c) => c.header === "Value");
  const trustCard = summaryCards.find((c) => c.header === "Trust");

  return (
  <section className={styles.root}>
    <strong>Universal Value System</strong>
    <p>{valueCard ? `${valueCard.title} Value Score` : "1.3M Values"}</p>
    <ul className={styles.infoCards}>
      <li>
        <h2>Summary</h2>
        <h3>{valueCard?.title ?? "—"}</h3>
        <p>{valueCard?.description ?? "Waiting for cluster data..."}</p>
      </li>
      <li>
        <h2>Value</h2>
        <h3>{valueCard?.title ?? "—"}</h3>
        <p>This metric is how well these values are consumed in the Cluster.</p>
      </li>
      <li>
        <h2>Security</h2>
        <h3>Stable</h3>
        <p>No incidents or intrusions detected.</p>
      </li>
      <li>
        <h2>Activity</h2>
        <h3>—</h3>
        <p>User activity data not yet available from the server.</p>
      </li>
    </ul>
    <strong>Trusted Advisor System</strong>
    <p>{trustCard ? `${trustCard.title} Trust Score` : "10K Advisors"}</p>
    <ul className={styles.infoCards}>
      <li>
        <h2>Summary</h2>
        <h3>{trustCard?.title ?? "—"}</h3>
        <p>{trustCard?.description ?? "Waiting for cluster data..."}</p>
      </li>
      <li>
        <h2>Value</h2>
        <h3>{trustCard?.title ?? "—"}</h3>
        <p>This metric is how well the advisors perform in the Cluster.</p>
      </li>
      <li>
        <h2>Security</h2>
        <h3>Stable</h3>
        <p>No incidents or intrusions detected.</p>
      </li>
      <li>
        <h2>Activity</h2>
        <h3>—</h3>
        <p>User activity data not yet available from the server.</p>
      </li>
    </ul>
    <strong>Extensions</strong>
    <p>...</p>

    <button className={styles.logoutButton} onClick={signOut}>
      Log out
    </button>
  </section>
  );
};

export default Settings;
