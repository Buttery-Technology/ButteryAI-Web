import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useUserContext } from "@hooks";

import dashboardLogo from "@assets/logos/dashboard-logo.png";
import Hive from "@assets/icons/hive.svg?react";
import Chat from "@assets/icons/chat.svg?react";
import Settings from "@assets/icons/settings.svg?react";

import styles from "./Menu.module.scss";

type Tabs = "Hive" | "Chat" | "Settings";

export const Menu = () => {
  const [tabName, setTabName] = useState<Tabs>("Hive");
  const { signOut } = useUserContext();

  return (
    <header className={styles.root}>
      <Link to="" className={styles.link}>
        <img src={dashboardLogo} alt="ButteryAI" />
      </Link>

      <h1 className={styles.title}>ButteryAI</h1>

      <div className={styles.wrapper}>
        <p className={styles.status}>Online</p>
        <p className={styles.plan}>Pro</p>
      </div>

      <ul className={styles.tabList}>
        <li>
          <NavLink
            to="/dashboard/hive"
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

      <button onClick={signOut} className={styles.signOut}>
        Sign Out
      </button>
    </header>
  );
};

export default Menu;
