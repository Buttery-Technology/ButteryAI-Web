import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useUserContext } from "@hooks";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import Cluster from "@assets/icons/cluster.svg?react";
import Chat from "@assets/icons/chat.svg?react";
// import Metrics from "@assets/icons/metrics.svg?react";
import Settings from "@assets/icons/settings.svg?react";
import type { ClusterStatus } from "../../../types/api";
import styles from "./Menu.module.scss";

type Tabs = "Cluster" | "Chat" | /* "Training" | */ "Settings";

interface Props {
  clusterStatus: ClusterStatus | null;
}

export const Menu = ({ clusterStatus }: Props) => {
  const [tabName, setTabName] = useState<Tabs>("Cluster");
  const { user } = useUserContext();

  const isOnline = user?.isOnline ?? false;
  const clusterName = clusterStatus?.status === "online" ? clusterStatus.cluster.name : null;

  return (
    <header className={styles.root}>
      <Link to="/dashboard" className={styles.link}>
        <img src={butteryaiLogo} alt="ButteryAI" />
      </Link>
      <h1 className={styles.title}>{clusterName ?? "ButteryAI"}</h1>
      <div className={styles.wrapper}>
        <p className={styles.status}>{isOnline ? "Online" : "Offline"}</p>
        <p className={styles.plan}>{user?.plan ?? "Pro"}</p>
      </div>
      <ul className={styles.tabList}>
        <li>
          <NavLink
            to="/dashboard"
            onClick={() => setTabName("Cluster")}
            className={tabName === "Cluster" ? styles.active : ""}
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
