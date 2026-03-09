import { useMemo } from "react";
import type { Node, Edge } from "@xyflow/react";
import type { WorkflowStepResponse } from "../../../types/workflow";
import type { TriggerNodeData } from "./nodes/TriggerNode";
import type { StepNodeData } from "./nodes/StepNode";
import type { ConditionalNodeData } from "./nodes/ConditionalNode";
import type { AddStepNodeData } from "./nodes/AddStepNode";
import type { NodeStepNodeData } from "./nodes/NodeStepNode";

type CanvasNode = Node<TriggerNodeData | StepNodeData | ConditionalNodeData | NodeStepNodeData | AddStepNodeData>;

export function useCanvasState(steps: WorkflowStepResponse[]) {
  return useMemo(() => {
    const sorted = [...steps].sort((a, b) => a.order - b.order);
    const nodes: CanvasNode[] = [];
    const edges: Edge[] = [];

    // Add trigger node
    nodes.push({
      id: "__trigger",
      type: "trigger",
      position: { x: 0, y: 0 },
      data: { label: "Receive Input" },
      draggable: false,
    });

    // Add step nodes
    sorted.forEach((step) => {
      const isConditional = step.stepType === "conditional";
      const isNodeStep = step.stepType === "nodeSelection";

      if (isNodeStep) {
        nodes.push({
          id: step.id,
          type: "nodeStep",
          position: { x: 0, y: 0 },
          data: { label: step.name, stepId: step.id, nodeID: step.nodeID, description: step.description },
        });
      } else {
        nodes.push({
          id: step.id,
          type: isConditional ? "conditional" : "step",
          position: { x: 0, y: 0 },
          data: isConditional
            ? { label: step.name, stepId: step.id, condition: step.condition }
            : { label: step.name, stepType: step.stepType, stepId: step.id, description: step.description },
        });
      }
    });

    // Add "add step" node at the end
    nodes.push({
      id: "__add",
      type: "addStep",
      position: { x: 0, y: 0 },
      data: { label: "Add Step" },
    });

    // Track how many edges have come from each conditional's handles
    const conditionalEdgeCount: Record<string, number> = {};

    // Build edges from dependsOn or sequential order
    sorted.forEach((step, i) => {
      if (step.dependsOn && step.dependsOn.length > 0) {
        step.dependsOn.forEach((depId) => {
          const depStep = sorted.find((s) => s.id === depId);
          const isConditionalSource = depStep?.stepType === "conditional";

          // Check if the target step has an explicit branch stored in config
          const branch = (step.configuration?.conditionBranch as Record<string, string>)?.[depId];
          let sourceHandle: string | undefined;
          if (isConditionalSource) {
            if (branch) {
              sourceHandle = branch;
            } else {
              // Auto-assign: first connection = true, second = false
              const count = conditionalEdgeCount[depId] ?? 0;
              sourceHandle = count === 0 ? "true" : "false";
              conditionalEdgeCount[depId] = count + 1;
            }
          }

          edges.push({
            id: `e-${depId}-${step.id}`,
            source: depId,
            target: step.id,
            type: isConditionalSource ? "conditional" : "workflow",
            sourceHandle,
          });
        });
      } else if (i === 0) {
        // First step connects to trigger
        edges.push({
          id: `e-trigger-${step.id}`,
          source: "__trigger",
          target: step.id,
          type: "workflow",
        });
      } else {
        // Sequential fallback
        const prev = sorted[i - 1];
        const isConditionalSource = prev.stepType === "conditional";

        let sourceHandle: string | undefined;
        if (isConditionalSource) {
          const count = conditionalEdgeCount[prev.id] ?? 0;
          sourceHandle = count === 0 ? "true" : "false";
          conditionalEdgeCount[prev.id] = count + 1;
        }

        edges.push({
          id: `e-${prev.id}-${step.id}`,
          source: prev.id,
          target: step.id,
          type: isConditionalSource ? "conditional" : "workflow",
          sourceHandle,
        });
      }
    });

    // Connect last step (or trigger if no steps) to add node
    const lastNode = sorted.length > 0 ? sorted[sorted.length - 1] : null;
    edges.push({
      id: "e-last-add",
      source: lastNode ? lastNode.id : "__trigger",
      target: "__add",
      type: "addStep",
    });

    return { nodes, edges };
  }, [steps]);
}
