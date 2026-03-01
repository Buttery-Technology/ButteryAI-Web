import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import Hive from "@assets/icons/hive.svg?react";
import Chat from "@assets/icons/chat.svg?react";
// import Metrics from "@assets/icons/metrics.svg?react";
import Settings from "@assets/icons/settings.svg?react";
import styles from "./Menu.module.scss";

type Tabs = "Hive" | "Chat" | /* "Training" | */ "Settings";

export const Menu = () => {
  const [tabName, setTabName] = useState<Tabs>("Hive");

  return (
    <header className={styles.root}>
      <Link to="" className={styles.link}>
        <img src={butteryaiLogo} alt="ButteryAI" />
      </Link>
      <h1 className={styles.title}>ButteryAI</h1>
      <div className={styles.wrapper}>
        <p className={styles.status}>Online</p>
        <p className={styles.plan}>Pro</p>
      </div>
      <ul className={styles.tabList}>
        <li>
          <NavLink
            to="/dashboard"
            onClick={() => setTabName("Hive")}
            className={tabName === "Hive" ? styles.active : ""}
          >
            <Hive />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/chat"
            onClick={() => setTabName("Chat")}
            className={tabName === "Chat" ? styles.active : ""}
          >
            <Chat />
          </NavLink>
        </li>
        {/* <li>
          <NavLink
            to="/dashboard/training"
            onClick={() => setTabName("Training")}
            className={tabName === "Training" ? styles.active : ""}
          >
            <Metrics />
          </NavLink>
        </li> */}
        <li>
          <NavLink
            to="/dashboard/settings"
            onClick={() => setTabName("Settings")}
            className={tabName === "Settings" ? styles.active : ""}
          >
            <Settings />
          </NavLink>
        </li>
      </ul>
      <p className={styles.tabName}>{tabName}</p>
    </header>
  );
};

export default Menu;
