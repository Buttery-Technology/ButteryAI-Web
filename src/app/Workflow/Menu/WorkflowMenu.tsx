import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { WorkflowResponse } from "../../../types/workflow";
import ArrowLeft from "@assets/icons/arrow-left.svg?react";
import PencilIcon from "@assets/icons/pencil.svg?react";
import ListBulletIcon from "@assets/icons/list-bullet.svg?react";
import GearIcon from "@assets/icons/gear.svg?react";
import styles from "./WorkflowMenu.module.scss";

interface Props {
  workflow: WorkflowResponse | null;
  onUpdateName: (name: string) => Promise<void>;
}

const tabs = [
  { id: "editor", label: "Editor", suffix: "" },
  { id: "list", label: "List", suffix: "/list" },
  { id: "settings", label: "Settings", suffix: "/settings" },
] as const;

const tabIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  editor: PencilIcon,
  list: ListBulletIcon,
  settings: GearIcon,
};

export const WorkflowMenu = ({ workflow, onUpdateName }: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [name, setName] = useState(workflow?.name ?? "");

  // Determine base path (e.g. /workflow/<id>)
  const basePath = pathname.replace(/\/(list|settings)$/, "");

  const activeTab = pathname.endsWith("/list")
    ? "list"
    : pathname.endsWith("/settings")
      ? "settings"
      : "editor";

  useEffect(() => {
    if (workflow?.name) setName(workflow.name);
  }, [workflow?.name]);

  const handleBlur = async () => {
    const trimmed = name.trim() || "Untitled Workflow";
    setName(trimmed);
    if (trimmed !== workflow?.name) {
      await onUpdateName(trimmed);
    }
  };

  return (
    <header className={styles.root}>
      <div className={styles.titleRow}>
        <button className={styles.back} onClick={() => navigate("/dashboard/workflows")} aria-label="Back">
          <ArrowLeft />
        </button>
        <input
          className={styles.nameInput}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          placeholder="Untitled Workflow"
        />
      </div>
      <ul className={styles.tabList}>
        {tabs.map((tab, i) => {
          const Icon = tabIcons[tab.id];
          const isActive = activeTab === tab.id;
          return (
            <li key={tab.id}>
              {i > 0 && <span className={styles.divider}>|</span>}
              <button
                className={isActive ? styles.active : styles.tabBtn}
                onClick={() => navigate(basePath + tab.suffix)}
              >
                <Icon />
              </button>
            </li>
          );
        })}
      </ul>
      <p className={styles.tabName}>{tabs.find((t) => t.id === activeTab)?.label ?? "Editor"}</p>
    </header>
  );
};

export default WorkflowMenu;
