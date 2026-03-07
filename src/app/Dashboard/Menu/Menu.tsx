import { Link, NavLink, useLocation } from "react-router-dom";
import { useUserContext } from "@hooks";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import Cluster from "@assets/icons/cluster.svg?react";
import Chat from "@assets/icons/chat.svg?react";
import Settings from "@assets/icons/settings.svg?react";
import type { DashboardTab } from "../../../types/api";
import styles from "./Menu.module.scss";

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  cluster: Cluster,
  chat: Chat,
  settings: Settings,
};

const defaultTabs: DashboardTab[] = [
  { id: "dashboard", label: "Dashboard", icon: "cluster", route: "/dashboard", order: 1 },
  { id: "settings", label: "Settings", icon: "settings", route: "/dashboard/settings", order: 10 },
];

function useActiveTab(tabs: DashboardTab[]): string {
  const { pathname } = useLocation();

  // Match the most specific route first (longer routes take priority)
  const sorted = [...tabs].sort((a, b) => b.route.length - a.route.length);
  for (const tab of sorted) {
    if (tab.route === "/dashboard" && pathname === "/dashboard") return tab.label;
    if (tab.route !== "/dashboard" && pathname.startsWith(tab.route)) return tab.label;
  }

  // Also check for settings sub-routes
  if (pathname.startsWith("/dashboard/api-keys")) {
    const settingsTab = tabs.find((t) => t.id === "settings");
    if (settingsTab) return settingsTab.label;
  }

  return tabs[0]?.label ?? "Dashboard";
}

interface Props {
  tabs?: DashboardTab[];
}

export const Menu = ({ tabs }: Props) => {
  const { user } = useUserContext();
  const activeTabs = tabs && tabs.length > 0 ? tabs : defaultTabs;
  const tabLabel = useActiveTab(activeTabs);

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
        {activeTabs.map((tab) => {
          const Icon = iconMap[tab.icon];
          const isExact = tab.route === "/dashboard";
          const isSettingsGroup = tab.id === "settings";

          return (
            <li key={tab.id}>
              <NavLink
                to={tab.route}
                end={isExact}
                className={isSettingsGroup ? (tabLabel === tab.label ? styles.active : "") : (({ isActive }) => (isActive ? styles.active : ""))}
              >
                {Icon && <Icon />}
              </NavLink>
            </li>
          );
        })}
      </ul>
      <p className={styles.tabName}>{tabLabel}</p>
    </header>
  );
};

export default Menu;
