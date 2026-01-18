import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import dashboardLogo from "@assets/logos/dashboard-logo.png";
import ArrowLeft from "@assets/icons/arrow-left.svg?react";
import Hive from "@assets/icons/hive.svg?react";
import Settings from "@assets/icons/settings.svg?react";
import Metrics from "@assets/icons/metrics.svg?react";
import styles from "./Menu.module.scss";

type Tabs = "Overview" | "Settings" | "Metrics";

export const Menu = () => {
  const [tabName, setTabName] = useState<Tabs>("Overview");

  return (
    <header className={styles.root}>
      <Link to="/node/overview" className={styles.link}>
        <img src={dashboardLogo} alt="ButteryAI" />
      </Link>
      <h1 className={styles.title}>
        Med-PaLM2 Node
        <Link to="/dashboard/hive" className={styles.arrowLeft}>
          <ArrowLeft />
        </Link>
      </h1>
      <div className={styles.wrapper}>
        <p className={styles.status}>Offline</p>
        <p className={styles.plan}>Pro</p>
      </div>
      <ul className={styles.detailsMenu}>
        <li>
          <button>Power Cycle…</button>
        </li>
        <li>
          <button>Diagnostics</button>
        </li>
        <li>
          <button>Notifications</button>
        </li>
        <li>
          <button>Security</button>
        </li>
      </ul>
      <ul className={styles.tabList}>
        <li>
          <NavLink
            to="/node/overview"
            onClick={() => setTabName("Overview")}
            className={tabName === "Overview" ? styles.active : ""}
          >
            <Hive />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/node/settings"
            onClick={() => setTabName("Settings")}
            className={tabName === "Settings" ? styles.active : ""}
          >
            <Settings />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/node/metrics"
            onClick={() => setTabName("Metrics")}
            className={tabName === "Metrics" ? styles.active : ""}
          >
            <Metrics />
          </NavLink>
        </li>
      </ul>
      <p className={styles.tabName}>{tabName}</p>
    </header>
  );
};

export default Menu;
