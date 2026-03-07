import { Link, NavLink, useLocation } from "react-router-dom";
import { useUserContext } from "@hooks";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import Cluster from "@assets/icons/cluster.svg?react";
import Chat from "@assets/icons/chat.svg?react";
// import Metrics from "@assets/icons/metrics.svg?react";
import Settings from "@assets/icons/settings.svg?react";
import styles from "./Menu.module.scss";

function useActiveTab(): string {
  const { pathname } = useLocation();
  if (pathname.startsWith("/dashboard/chat")) return "Chat";
  if (pathname.startsWith("/dashboard/settings") || pathname.startsWith("/dashboard/api-keys")) return "Settings";
  return "Dashboard";
}

export const Menu = () => {
  const { user } = useUserContext();
  const tabName = useActiveTab();

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
            end
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <Cluster />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/chat"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <Chat />
          </NavLink>
        </li>
        {/* <li>
          <NavLink
            to="/dashboard/training"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <Metrics />
          </NavLink>
        </li> */}
        <li>
          <NavLink
            to="/dashboard/settings"
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
