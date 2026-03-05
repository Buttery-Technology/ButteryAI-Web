import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useUserContext } from "@hooks";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import Cluster from "@assets/icons/cluster.svg?react";
import Chat from "@assets/icons/chat.svg?react";
// import Metrics from "@assets/icons/metrics.svg?react";
import Settings from "@assets/icons/settings.svg?react";
import styles from "./Menu.module.scss";

type Tabs = "Dashboard" | "Chat" | /* "Training" | */ "Settings";

export const Menu = () => {
  const [tabName, setTabName] = useState<Tabs>("Dashboard");
  const { user } = useUserContext();

  const isOnline = user?.isOnline ?? false;
  const firstName = user?.name?.split(" ")[0];

  return (
    <header className={styles.root}>
      <Link to="/dashboard" className={styles.link}>
        <img src={butteryaiLogo} alt="ButteryAI" />
      </Link>
      <h1 className={styles.title}>{firstName ? `Hi, ${firstName}` : "ButteryAI"}</h1>
      <div className={styles.wrapper}>
        <p className={styles.status}>{isOnline ? "Online" : "Offline"}</p>
        <p className={styles.plan}>{user?.plan ?? "Pro"}</p>
      </div>
      <ul className={styles.tabList}>
        <li>
          <NavLink
            to="/dashboard"
            onClick={() => setTabName("Dashboard")}
            className={tabName === "Dashboard" ? styles.active : ""}
          >
            <Cluster />
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
