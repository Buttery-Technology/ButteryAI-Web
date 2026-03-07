import { Link, NavLink, useLocation } from "react-router-dom";
import { useUserContext } from "@hooks";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import ArrowLeft from "@assets/icons/arrow-left.svg?react";
import Cluster from "@assets/icons/cluster.svg?react";
import Settings from "@assets/icons/settings.svg?react";
// import Metrics from "@assets/icons/metrics.svg?react";
import type { NodeResponse } from "../../../types/api";
import styles from "./Menu.module.scss";

function useActiveTab(): string {
  const { pathname } = useLocation();
  if (pathname.endsWith("/settings")) return "Settings";
  return "Overview";
}

interface Props {
  node: NodeResponse | null;
  isLoading: boolean;
  nodeName: string | undefined;
}

export const Menu = ({ node, isLoading, nodeName }: Props) => {
  const { user } = useUserContext();
  const tabName = useActiveTab();

  const basePath = nodeName ? `/node/${encodeURIComponent(nodeName)}` : "/node";

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
        <p className={styles.plan}>{user?.plan ?? "\u2014"}</p>
      </div>
      <ul className={styles.tabList}>
        <li>
          <NavLink
            to={`${basePath}/overview`}
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <Cluster />
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`${basePath}/settings`}
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <Settings />
          </NavLink>
        </li>
        {/* <li>
          <NavLink
            to={`${basePath}/metrics`}
            onClick={() => setTabName("Metrics")}
            className={tabName === "Metrics" ? styles.active : ""}
          >
            <Metrics />
          </NavLink>
        </li> */}
      </ul>
      <p className={styles.tabName}>{tabName}</p>
    </header>
  );
};

export default Menu;
