import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Connection,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { WorkflowStepResponse, CreateStepRequest, UpdateStepRequest, WorkflowStepType } from "../../../types/workflow";
import { useCanvasState } from "./useCanvasState";
import { useAutoLayout } from "./useAutoLayout";
import { TriggerNode } from "./nodes/TriggerNode";
import { StepNode } from "./nodes/StepNode";
import { ConditionalNode } from "./nodes/ConditionalNode";
import { AddStepNode } from "./nodes/AddStepNode";
import { NodeStepNode } from "./nodes/NodeStepNode";
import { WorkflowEdge } from "./edges/WorkflowEdge";
import { ConditionalEdge } from "./edges/ConditionalEdge";
import { AddStepEdge } from "./edges/AddStepEdge";
import { StepConfigPanel } from "../Panels/StepConfigPanel";
import { NodePickerPopup } from "./NodePickerPopup";
import { nodeRegistry, registerSvgIcon, stepTypes } from "./nodes/nodeRegistry";
import PromptIcon from "@assets/icons/prompt.svg?react";
import TransformIcon from "@assets/icons/transform.svg?react";
import QuestionmarkIcon from "@assets/icons/questionmark.svg?react";
import LoopIcon from "@assets/icons/loop.svg?react";
import ParallelIcon from "@assets/icons/parallel.svg?react";
import NetworkIcon from "@assets/icons/network.svg?react";
import ClockIcon from "@assets/icons/clock.svg?react";
import AggregateIcon from "@assets/icons/aggregate.svg?react";
import HexagonNodeIcon from "@assets/icons/hexagon-node.svg?react";
import styles from "./WorkflowCanvas.module.scss";

registerSvgIcon("promptExecution", PromptIcon);
registerSvgIcon("dataTransformation", TransformIcon);
registerSvgIcon("conditional", QuestionmarkIcon);
registerSvgIcon("loop", LoopIcon);
registerSvgIcon("parallel", ParallelIcon);
registerSvgIcon("apiCall", NetworkIcon);
registerSvgIcon("delay", ClockIcon);
registerSvgIcon("aggregation", AggregateIcon);
registerSvgIcon("nodeSelection", HexagonNodeIcon);

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  step: StepNode,
  conditional: ConditionalNode,
  nodeStep: NodeStepNode,
  addStep: AddStepNode,
};

const edgeTypes: EdgeTypes = {
  workflow: WorkflowEdge,
  conditional: ConditionalEdge,
  addStep: AddStepEdge,
};

interface Props {
  workflowID?: string;
  steps: WorkflowStepResponse[];
  addStep: (data: CreateStepRequest) => Promise<string | null>;
  updateStep: (stepID: string, data: UpdateStepRequest) => Promise<boolean>;
  deleteStep: (stepID: string) => Promise<boolean>;
  isLoading: boolean;
}

const STEP_PADDING = 40;

function resolveOverlap(
  pos: { x: number; y: number },
  existingNodes: { position: { x: number; y: number }; type?: string }[],
  newType?: string
): { x: number; y: number } {
  const newW = newType === "nodeStep" ? 300 : 150;
  const newH = newType === "nodeStep" ? 120 : 140;

  let { x, y } = pos;
  let attempts = 0;

  while (attempts < 20) {
    let hasOverlap = false;
    for (const n of existingNodes) {
      const nw = n.type === "nodeStep" ? 300 : n.type === "addStep" ? 42 : 150;
      const nh = n.type === "nodeStep" ? 120 : n.type === "addStep" ? 42 : 140;

      const overlapX = x < n.position.x + nw + STEP_PADDING && x + newW + STEP_PADDING > n.position.x;
      const overlapY = y < n.position.y + nh + STEP_PADDING && y + newH + STEP_PADDING > n.position.y;

      if (overlapX && overlapY) {
        // Shift right of the overlapping node
        x = n.position.x + nw + STEP_PADDING;
        hasOverlap = true;
        break;
      }
    }
    if (!hasOverlap) break;
    attempts++;
  }

  return { x, y };
}

function getSavedPositions(steps: WorkflowStepResponse[]): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {};
  for (const step of steps) {
    const pos = step.canvasPosition;
    if (pos && typeof pos.x === "number" && typeof pos.y === "number") {
      positions[step.id] = pos;
    }
  }
  return positions;
}

/**
 * Rank step types based on the source step context.
 * Returns { type, promoted, demoted } for each step type, sorted by relevance.
 */
function getRankedStepTypes(
  sourceStepType: WorkflowStepType | null,
  allSteps: WorkflowStepResponse[]
): { type: WorkflowStepType; promoted: boolean; demoted: boolean }[] {
  const hasParallelUpstream = allSteps.some((s) => s.stepType === "parallel");

  const scores: Record<string, number> = {};
  for (const t of stepTypes) scores[t] = 0;

  // Promote aggregation after parallel
  if (sourceStepType === "parallel") {
    scores["aggregation"] += 10;
  }

  // Demote aggregation if no parallel exists anywhere
  if (!hasParallelUpstream) {
    scores["aggregation"] -= 5;
  }

  // Demote a second aggregation after aggregation
  if (sourceStepType === "aggregation") {
    scores["aggregation"] -= 5;
  }

  // Delay is rarely the first step
  if (!sourceStepType) {
    scores["delay"] -= 3;
  }

  // Prompt and API Call are common next steps — slight boost
  scores["promptExecution"] += 1;
  scores["apiCall"] += 1;

  const sorted = stepTypes
    .map((type) => ({
      type,
      score: scores[type],
      promoted: scores[type] >= 5,
      demoted: scores[type] <= -3,
    }))
    .sort((a, b) => b.score - a.score);

  return sorted;
}

function CanvasInner({ steps, addStep, updateStep, deleteStep, isLoading }: Props) {
  const { nodes: rawNodes, edges: rawEdges } = useCanvasState(steps);
  const { getLayoutedElements } = useAutoLayout();
  const localPositions = useRef<Record<string, { x: number; y: number }>>({});

  const layouted = useMemo(() => {
    const result = getLayoutedElements(rawNodes, rawEdges);
    const saved = getSavedPositions(steps);
    // Merge: local drag positions take priority over server-saved positions
    const merged = { ...saved, ...localPositions.current };
    if (Object.keys(merged).length > 0) {
      result.nodes = result.nodes.map((n) =>
        merged[n.id] ? { ...n, position: merged[n.id] } : n
      );
    }
    // Resolve overlaps for nodes without saved positions against nodes that have them
    const nodesWithPositions = result.nodes.filter((n) => merged[n.id] && n.type !== "addStep");
    if (nodesWithPositions.length > 0) {
      result.nodes = result.nodes.map((n) => {
        if (merged[n.id] || n.type === "addStep") return n;
        const resolved = resolveOverlap(n.position, nodesWithPositions, n.type);
        return resolved.x !== n.position.x || resolved.y !== n.position.y
          ? { ...n, position: resolved }
          : n;
      });
    }

    // Recompute __add position based on final node positions (after saved overrides)
    const addIdx = result.nodes.findIndex((n) => n.type === "addStep");
    if (addIdx !== -1) {
      const others = result.nodes.filter((n) => n.type !== "addStep");
      if (others.length > 0) {
        let maxRight = 0;
        let minY = Infinity;
        let maxY = -Infinity;
        for (const n of others) {
          const w = n.type === "nodeStep" ? 300 : 150;
          const h = n.type === "nodeStep" ? 120 : 140;
          const right = n.position.x + w;
          if (right > maxRight) maxRight = right;
          if (n.position.y < minY) minY = n.position.y;
          if (n.position.y + h > maxY) maxY = n.position.y + h;
        }
        result.nodes[addIdx] = {
          ...result.nodes[addIdx],
          position: { x: maxRight + 120, y: (minY + maxY) / 2 - 21 },
        };
      }
    }
    return result;
  }, [rawNodes, rawEdges, getLayoutedElements, steps]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layouted.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layouted.edges);
  const [selectedStep, setSelectedStep] = useState<WorkflowStepResponse | null>(null);
  const [panelPos, setPanelPos] = useState<{ x: number; y: number } | null>(null);
  const [showAddMenu, setShowAddMenu] = useState<{ x: number; y: number } | null>(null);
  const [showNodePicker, setShowNodePicker] = useState<{ x: number; y: number } | null>(null);
  const [handlePreview, setHandlePreview] = useState<{
    flowX: number; flowY: number; // handle position in flow coords
    mouseX: number; mouseY: number; // cursor in screen coords
    sourceNodeId: string;
    sourceHandleId?: string;
  } | null>(null);
  const pendingConnection = useRef<{ sourceNodeId: string; sourceHandleId?: string } | null>(null);
  const skipNextPaneClick = useRef(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, flowToScreenPosition } = useReactFlow();

  // Node dimensions used in layout (must match useAutoLayout)
  const NODE_W: Record<string, number> = { step: 130, conditional: 130, trigger: 130, nodeStep: 300, addStep: 42 };
  const NODE_H: Record<string, number> = { step: 110, conditional: 110, trigger: 110, nodeStep: 120, addStep: 42 };

  // Compute free source handles with their flow-space positions
  const freeHandles = useMemo(() => {
    const occupied = new Set<string>();
    for (const edge of edges) {
      occupied.add(edge.sourceHandle ? `${edge.source}:${edge.sourceHandle}` : edge.source);
    }

    const handles: { key: string; nodeId: string; handleId?: string; flowX: number; flowY: number }[] = [];
    for (const node of nodes) {
      if (node.id === "__add") continue;
      const w = NODE_W[node.type ?? "step"] ?? 130;
      const h = NODE_H[node.type ?? "step"] ?? 110;

      if (node.type === "conditional") {
        if (!occupied.has(`${node.id}:true`)) {
          handles.push({ key: `${node.id}:true`, nodeId: node.id, handleId: "true", flowX: node.position.x + w, flowY: node.position.y + h * 0.35 });
        }
        if (!occupied.has(`${node.id}:false`)) {
          handles.push({ key: `${node.id}:false`, nodeId: node.id, handleId: "false", flowX: node.position.x + w, flowY: node.position.y + h * 0.65 });
        }
      } else {
        if (!occupied.has(node.id)) {
          handles.push({ key: node.id, nodeId: node.id, flowX: node.position.x + w, flowY: node.position.y + h / 2 });
        }
      }
    }
    return handles;
  }, [nodes, edges]);

  const HOVER_RADIUS = 30;
  const DISMISS_RADIUS = 200;

  const onWrapperMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (showAddMenu || showNodePicker || panelPos) return;

      if (handlePreview) {
        // Recompute handle screen position from flow coords (survives zoom/pan)
        const screen = flowToScreenPosition({ x: handlePreview.flowX, y: handlePreview.flowY });
        const dx = e.clientX - screen.x;
        const dy = e.clientY - screen.y;
        if (Math.sqrt(dx * dx + dy * dy) > DISMISS_RADIUS) {
          setHandlePreview(null);
          return;
        }
        setHandlePreview((prev) =>
          prev ? { ...prev, mouseX: e.clientX, mouseY: e.clientY } : null
        );
        return;
      }

      // Check proximity to free source handles using computed positions
      for (const handle of freeHandles) {
        const screen = flowToScreenPosition({ x: handle.flowX, y: handle.flowY });
        const dx = e.clientX - screen.x;
        const dy = e.clientY - screen.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= HOVER_RADIUS) {
          setHandlePreview({
            flowX: handle.flowX,
            flowY: handle.flowY,
            mouseX: e.clientX,
            mouseY: e.clientY,
            sourceNodeId: handle.nodeId,
            sourceHandleId: handle.handleId,
          });
          return;
        }
      }
    },
    [handlePreview, freeHandles, flowToScreenPosition, showAddMenu, showNodePicker, panelPos]
  );

  // Attach native capture-phase listeners so we get events even over ReactFlow internals
  const onWrapperMouseMoveRef = useRef(onWrapperMouseMove);
  onWrapperMouseMoveRef.current = onWrapperMouseMove;
  const handlePreviewRef = useRef(handlePreview);
  handlePreviewRef.current = handlePreview;

  useEffect(() => {
    const el = reactFlowWrapper.current;
    if (!el) return;
    const moveHandler = (e: MouseEvent) => onWrapperMouseMoveRef.current(e as unknown as React.MouseEvent);
    const clickHandler = (e: MouseEvent) => {
      const preview = handlePreviewRef.current;
      if (!preview) return;
      // Intercept click while preview is showing — open add menu
      e.stopPropagation();
      e.preventDefault();
      skipNextPaneClick.current = true;
      pendingConnection.current = {
        sourceNodeId: preview.sourceNodeId,
        sourceHandleId: preview.sourceHandleId,
      };
      setShowAddMenu({ x: e.clientX, y: e.clientY });
      setHandlePreview(null);
    };
    el.addEventListener("mousemove", moveHandler, { capture: true });
    el.addEventListener("click", clickHandler, { capture: true });
    return () => {
      el.removeEventListener("mousemove", moveHandler, { capture: true });
      el.removeEventListener("click", clickHandler, { capture: true });
    };
  // Re-run when isLoading changes so ref is available after loading completes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [layouted, setNodes, setEdges]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        selected: selectedStep ? n.id === selectedStep.id : false,
      }))
    );
  }, [selectedStep, setNodes]);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: { id: string }) => {
      if (node.id === "__trigger") return;
      if (node.id === "__add") {
        setShowAddMenu({ x: _event.clientX, y: _event.clientY });
        return;
      }
      setShowAddMenu(null);
      // Select step for keyboard delete (panel only opens on double-click/right-click)
      const step = steps.find((s) => s.id === node.id);
      if (step) {
        setSelectedStep(step);
        setPanelPos(null);
      }
    },
    [steps]
  );

  const openStepPanel = useCallback(
    (event: React.MouseEvent, node: { id: string }) => {
      if (node.id === "__trigger" || node.id === "__add") return;
      event.preventDefault();
      const step = steps.find((s) => s.id === node.id);
      if (step) {
        const wrapperRect = reactFlowWrapper.current?.getBoundingClientRect();
        const x = event.clientX - (wrapperRect?.left ?? 0);
        const y = event.clientY - (wrapperRect?.top ?? 0);
        setPanelPos({ x, y });
        setSelectedStep(step);
        setHandlePreview(null);
      }
    },
    [steps]
  );

  const handleAddStep = useCallback(
    async (stepType: WorkflowStepType) => {
      const conn = pendingConnection.current;
      const menuPos = showAddMenu;

      if (stepType === "nodeSelection") {
        setShowAddMenu(null);
        setShowNodePicker(menuPos);
        return;
      }
      setShowAddMenu(null);
      const meta = nodeRegistry[stepType];
      const maxOrder = steps.reduce((max, s) => Math.max(max, s.order), 0);

      const request: CreateStepRequest = {
        name: meta?.label ?? stepType,
        stepType,
        order: maxOrder + 1,
        dependsOn: conn ? [conn.sourceNodeId] : undefined,
      };

      // Store condition branch info if connecting from a conditional handle
      if (conn?.sourceHandleId) {
        const sourceStep = steps.find((s) => s.id === conn.sourceNodeId);
        if (sourceStep?.stepType === "conditional") {
          request.configuration = {
            conditionBranch: { [conn.sourceNodeId]: conn.sourceHandleId },
          };
        }
      }

      // Save canvas position if placed from handle preview, resolving overlaps
      if (conn && menuPos) {
        const rawPos = screenToFlowPosition({ x: menuPos.x, y: menuPos.y });
        const flowPos = resolveOverlap(rawPos, nodes, (stepType as string) === "nodeSelection" ? "nodeStep" : "step");
        request.canvasPosition = flowPos;
      }

      const newStepId = await addStep(request);

      // Also save local position so it doesn't snap
      if (conn && menuPos && newStepId) {
        const rawPos = screenToFlowPosition({ x: menuPos.x, y: menuPos.y });
        const flowPos = resolveOverlap(rawPos, nodes, (stepType as string) === "nodeSelection" ? "nodeStep" : "step");
        localPositions.current[newStepId] = flowPos;
      }

      pendingConnection.current = null;
    },
    [steps, addStep, showAddMenu, screenToFlowPosition]
  );

  const onConnect = useCallback(
    async (connection: Connection) => {
      const { source, target, sourceHandle } = connection;
      if (!source || !target || target === "__add" || target === "__trigger") return;

      const targetStep = steps.find((s) => s.id === target);
      if (!targetStep) return;

      const currentDeps = targetStep.dependsOn ?? [];
      if (currentDeps.includes(source)) return;

      const updates: UpdateStepRequest = { dependsOn: [...currentDeps, source] };

      // Store the branch handle if connecting from a conditional node
      const sourceStep = steps.find((s) => s.id === source);
      if (sourceStep?.stepType === "conditional" && sourceHandle) {
        const existingConfig = (targetStep.configuration ?? {}) as Record<string, unknown>;
        const existingBranches = (existingConfig.conditionBranch ?? {}) as Record<string, string>;
        updates.configuration = {
          ...existingConfig,
          conditionBranch: { ...existingBranches, [source]: sourceHandle },
        };
      }

      await updateStep(target, updates);
    },
    [steps, updateStep]
  );

  const onDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault();
      const stepType = event.dataTransfer.getData("application/workflow-step-type") as WorkflowStepType;
      if (!stepType) return;

      if (stepType === "nodeSelection") {
        setShowNodePicker({ x: event.clientX, y: event.clientY });
        return;
      }

      const meta = nodeRegistry[stepType];
      const maxOrder = steps.reduce((max, s) => Math.max(max, s.order), 0);

      await addStep({
        name: meta?.label ?? stepType,
        stepType,
        order: maxOrder + 1,
      });
    },
    [steps, addStep]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: { id: string; position: { x: number; y: number } }) => {
      // Store locally first so layout recalculations don't snap back
      localPositions.current[node.id] = node.position;
      const step = steps.find((s) => s.id === node.id);
      if (!step) return;
      updateStep(node.id, {
        canvasPosition: node.position,
      });
    },
    [steps, updateStep]
  );

  const onKeyDown = useCallback(
    async (event: React.KeyboardEvent) => {
      const tag = (event.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedStep) {
          await deleteStep(selectedStep.id);
          setSelectedStep(null);
        }
      }
    },
    [selectedStep, deleteStep]
  );

  if (isLoading) {
    return <div className={styles.loading}>Loading workflow...</div>;
  }

  return (
    <div className={styles.root} ref={reactFlowWrapper} onKeyDown={onKeyDown} tabIndex={0}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={() => {
          if (skipNextPaneClick.current) {
            skipNextPaneClick.current = false;
            return;
          }
          setShowAddMenu(null);
          setShowNodePicker(null);
          setSelectedStep(null);
          setPanelPos(null);
          setHandlePreview(null);
          pendingConnection.current = null;
        }}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={openStepPanel}
        onNodeContextMenu={openStepPanel}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{ animated: false }}
        deleteKeyCode={null}
      >
        <Background gap={20} size={1} color="#f1f5f9" />
        <Controls showInteractive={false} />
      </ReactFlow>
      {showAddMenu && (() => {
        // Determine source step for contextual ranking
        const conn = pendingConnection.current;
        const sourceStep = conn
          ? steps.find((s) => s.id === conn.sourceNodeId)
          : steps.length > 0
            ? [...steps].sort((a, b) => b.order - a.order)[0]
            : null;
        const ranked = getRankedStepTypes(sourceStep?.stepType ?? null, steps);

        return (
          <div
            className={styles.addMenu}
            style={{ left: showAddMenu.x, top: showAddMenu.y }}
          >
            {ranked.map(({ type, promoted, demoted }) => {
              const meta = nodeRegistry[type];
              const Icon = meta.SvgIcon;
              return (
                <button
                  key={type}
                  className={`${styles.addMenuItem}${promoted ? ` ${styles.promoted}` : ""}${demoted ? ` ${styles.demoted}` : ""}`}
                  onClick={() => handleAddStep(type)}
                >
                  <span className={styles.addMenuIcon}>
                    {Icon ? <Icon /> : meta.icon}
                  </span>
                  {meta.label}
                  {promoted && <span className={styles.suggestedBadge}>Suggested</span>}
                </button>
              );
            })}
          </div>
        );
      })()}
      {showNodePicker && (
        <NodePickerPopup
          position={showNodePicker}
          onSelect={async (node) => {
            const conn = pendingConnection.current;
            setShowNodePicker(null);
            const maxOrder = steps.reduce((max, s) => Math.max(max, s.order), 0);
            const request: CreateStepRequest = {
              name: node.name,
              stepType: "nodeSelection",
              order: maxOrder + 1,
              nodeID: node.id,
              dependsOn: conn ? [conn.sourceNodeId] : undefined,
            };
            if (conn?.sourceHandleId) {
              const sourceStep = steps.find((s) => s.id === conn.sourceNodeId);
              if (sourceStep?.stepType === "conditional") {
                request.configuration = {
                  conditionBranch: { [conn.sourceNodeId]: conn.sourceHandleId },
                };
              }
            }
            await addStep(request);
            pendingConnection.current = null;
          }}
          onClose={() => { setShowNodePicker(null); pendingConnection.current = null; }}
        />
      )}
      {selectedStep && panelPos && (
        <StepConfigPanel
          step={selectedStep}
          position={panelPos}
          onUpdate={async (data) => {
            await updateStep(selectedStep.id, data);
            const updated = steps.find((s) => s.id === selectedStep.id);
            if (updated) setSelectedStep({ ...updated, ...data } as WorkflowStepResponse);
          }}
          onClose={() => { setSelectedStep(null); setPanelPos(null); }}
          onDelete={async () => {
            await deleteStep(selectedStep.id);
            setSelectedStep(null);
            setPanelPos(null);
          }}
        />
      )}
      {handlePreview && (() => {
        const diamondSize = 28;
        const half = diamondSize / 2;
        // Diamond offset below-right of cursor (near pointer tip)
        const diaX = handlePreview.mouseX + 8;
        const diaY = handlePreview.mouseY + 8;
        const diaCenterY = diaY + half;
        // End the line at the diamond's left edge, not center, so line doesn't bleed through
        const lineEndX = diaX;
        const lineEndY = diaCenterY;
        // Recompute handle screen position from flow coords each render
        const startScreen = flowToScreenPosition({ x: handlePreview.flowX, y: handlePreview.flowY });
        const startX = startScreen.x;
        const startY = startScreen.y;
        const dx = lineEndX - startX;
        const cp = Math.min(Math.abs(dx) * 0.5, 80);
        const path = `M ${startX} ${startY} C ${startX + cp} ${startY}, ${lineEndX - cp} ${lineEndY}, ${lineEndX} ${lineEndY}`;
        const gradId = "preview-grad";
        return (
          <>
            <svg
              style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 25 }}
            >
              <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8d8d8d" />
                  <stop offset="100%" stopColor="#cccccc" />
                </linearGradient>
              </defs>
              <path
                d={path}
                fill="none"
                stroke={`url(#${gradId})`}
                strokeWidth={6}
                strokeLinecap="round"
              />
            </svg>
            <div
              className={styles.previewAddButton}
              style={{
                position: "fixed",
                left: diaX,
                top: diaY,
                width: diamondSize,
                height: diamondSize,
                zIndex: 26,
                pointerEvents: "none",
              }}
            >
              <svg width={diamondSize} height={diamondSize} viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.14453 25.084C0.726562 23.666 0.0117188 22.207 0 20.707C0 19.207 0.703125 17.748 2.10938 16.3301L16.3301 2.12695C17.7363 0.708984 19.1895 0.00585937 20.6895 0.0175781C22.2012 0.0292969 23.666 0.744141 25.084 2.16211L39.2344 16.3125C40.6523 17.7305 41.3613 19.1953 41.3613 20.707C41.373 22.207 40.6699 23.6602 39.252 25.0664L25.0664 39.2695C23.6484 40.6875 22.1895 41.3906 20.6895 41.3789C19.1895 41.3789 17.7246 40.6641 16.2949 39.2344L2.14453 25.084ZM12.0762 20.707C12.0762 21.293 12.2695 21.7852 12.6562 22.1836C13.0547 22.5703 13.5469 22.7637 14.1328 22.7637H18.6328V27.2637C18.6328 27.8496 18.8262 28.3359 19.2129 28.7227C19.5996 29.1094 20.0918 29.3027 20.6895 29.3027C21.2871 29.3027 21.7793 29.1094 22.166 28.7227C22.5645 28.3359 22.7637 27.8496 22.7637 27.2637V22.7637H27.2812C27.8672 22.7637 28.3535 22.5703 28.7402 22.1836C29.127 21.7852 29.3203 21.293 29.3203 20.707C29.3203 20.0977 29.127 19.5996 28.7402 19.2129C28.3535 18.8145 27.8672 18.6152 27.2812 18.6152H22.7637V14.1152C22.7637 13.5293 22.5645 13.043 22.166 12.6562C21.7793 12.2578 21.2871 12.0586 20.6895 12.0586C20.0918 12.0586 19.5996 12.2578 19.2129 12.6562C18.8262 13.043 18.6328 13.5293 18.6328 14.1152V18.6152H14.1328C13.5469 18.6152 13.0547 18.8145 12.6562 19.2129C12.2695 19.5996 12.0762 20.0977 12.0762 20.707Z" fill="#CCCCCC"/>
              </svg>
            </div>
          </>
        );
      })()}
    </div>
  );
}

export function WorkflowCanvas(props: Props) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
}
