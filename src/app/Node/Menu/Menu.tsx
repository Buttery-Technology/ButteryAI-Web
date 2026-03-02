import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import ArrowLeft from "@assets/icons/arrow-left.svg?react";
import Power from "@assets/icons/power.svg?react";
import Diagnostics from "@assets/icons/diagnostics.svg?react";
import Share from "@assets/icons/share.svg?react";
import Cluster from "@assets/icons/cluster.svg?react";
import Settings from "@assets/icons/settings.svg?react";
import Metrics from "@assets/icons/metrics.svg?react";
import type { NodeResponse } from "../../../types/api";
import styles from "./Menu.module.scss";

type Tabs = "Overview" | "Settings" | "Metrics";

interface Props {
  node: NodeResponse | null;
  isLoading: boolean;
  nodeId: string | undefined;
}

export const Menu = ({ node, isLoading, nodeId }: Props) => {
  const [tabName, setTabName] = useState<Tabs>("Overview");

  const basePath = nodeId ? `/node/${nodeId}` : "/node";

  return (
    <header className={styles.root}>
      <Link to="/dashboard" className={styles.link}>
        <img src={butteryaiLogo} alt="ButteryAI" />
      </Link>
      <h1 className={styles.title}>
        {isLoading ? "Loading..." : (node?.name ?? "Node")}
        <Link to="/dashboard" className={styles.arrowLeft}>
          <ArrowLeft />
        </Link>
      </h1>
      <div className={styles.wrapper}>
        <p className={node?.isOnline ? styles.statusOnline : styles.statusOffline}>{node?.isOnline ? "Online" : "Offline"}</p>
        <p className={styles.plan}>Pro</p>
      </div>
      <div className={styles.controlBar}>
        <button aria-label="Power Cycle">
          <Power />
        </button>
        <button aria-label="Diagnostics">
          <Diagnostics />
        </button>
        <button aria-label="Share">
          <Share />
        </button>
      </div>
      <ul className={styles.tabList}>
        <li>
          <NavLink
            to={`${basePath}/overview`}
            onClick={() => setTabName("Overview")}
            className={tabName === "Overview" ? styles.active : ""}
          >
            <Cluster />
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`${basePath}/settings`}
            onClick={() => setTabName("Settings")}
            className={tabName === "Settings" ? styles.active : ""}
          >
            <Settings />
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`${basePath}/metrics`}
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
