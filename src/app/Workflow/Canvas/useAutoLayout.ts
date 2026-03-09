import { useCallback } from "react";
import dagre from "dagre";
import type { Node, Edge } from "@xyflow/react";

const NODE_WIDTH = 150;
const NODE_HEIGHT = 140;
const NODE_STEP_WIDTH = 300;
const NODE_STEP_HEIGHT = 120;
const ADD_WIDTH = 42;
const ADD_GAP = 120;

function getNodeSize(type?: string) {
  if (type === "addStep") return { w: ADD_WIDTH, h: ADD_WIDTH };
  if (type === "nodeStep") return { w: NODE_STEP_WIDTH, h: NODE_STEP_HEIGHT };
  return { w: NODE_WIDTH, h: NODE_HEIGHT };
}

export function useAutoLayout() {
  const getLayoutedElements = useCallback(
    (nodes: Node[], edges: Edge[]): { nodes: Node[]; edges: Edge[] } => {
      const g = new dagre.graphlib.Graph();
      g.setDefaultEdgeLabel(() => ({}));
      g.setGraph({ rankdir: "LR", nodesep: 80, ranksep: 120 });

      // Exclude the __add node from dagre — we'll position it manually
      const stepNodes = nodes.filter((n) => n.type !== "addStep");
      const stepEdges = edges.filter((e) => e.target !== "__add" && e.source !== "__add");

      stepNodes.forEach((node) => {
        const { w, h } = getNodeSize(node.type);
        g.setNode(node.id, { width: w, height: h });
      });

      stepEdges.forEach((edge) => {
        g.setEdge(edge.source, edge.target);
      });

      dagre.layout(g);

      // Layout step nodes from dagre
      let maxRight = 0;
      let minY = Infinity;
      let maxY = -Infinity;

      const layoutedNodes = stepNodes.map((node) => {
        const dagreNode = g.node(node.id);
        const { w, h } = getNodeSize(node.type);
        const x = dagreNode.x - w / 2;
        const y = dagreNode.y - h / 2;

        const right = x + w;
        if (right > maxRight) maxRight = right;
        if (y < minY) minY = y;
        if (y + h > maxY) maxY = y + h;

        return { ...node, position: { x, y } };
      });

      // Position __add node: to the right of all nodes, vertically centered
      const addNode = nodes.find((n) => n.type === "addStep");
      if (addNode) {
        const centerY = (minY + maxY) / 2 - ADD_WIDTH / 2;
        layoutedNodes.push({
          ...addNode,
          position: {
            x: maxRight + ADD_GAP,
            y: centerY,
          },
        });
      }

      return { nodes: layoutedNodes, edges };
    },
    []
  );

  return { getLayoutedElements };
}
