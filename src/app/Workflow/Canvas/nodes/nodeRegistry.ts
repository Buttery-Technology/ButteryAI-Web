import type { WorkflowStepType } from "../../../../types/workflow";
import type { FC, SVGProps } from "react";

export interface NodeMeta {
  label: string;
  icon: string;
  color: string;
  SvgIcon?: FC<SVGProps<SVGSVGElement>>;
}

// Lazily populated — call initNodeRegistry() once at module load
export const nodeRegistry: Record<WorkflowStepType, NodeMeta> = {
  promptExecution: { label: "Prompt", icon: "P", color: "#6366f1" },
  dataTransformation: { label: "Transform", icon: "T", color: "#0891b2" },
  conditional: { label: "Condition", icon: "?", color: "#f59e0b" },
  loop: { label: "Loop", icon: "L", color: "#8b5cf6" },
  parallel: { label: "Parallel", icon: "||", color: "#ec4899" },
  apiCall: { label: "API Call", icon: "A", color: "#10b981" },
  delay: { label: "Delay", icon: "D", color: "#6b7280" },
  aggregation: { label: "Aggregate", icon: "Σ", color: "#f97316" },
  nodeSelection: { label: "Node", icon: "N", color: "#288ed2" },
};

export const stepTypes = Object.keys(nodeRegistry) as WorkflowStepType[];

export function registerSvgIcon(type: WorkflowStepType, SvgIcon: FC<SVGProps<SVGSVGElement>>) {
  nodeRegistry[type].SvgIcon = SvgIcon;
}
