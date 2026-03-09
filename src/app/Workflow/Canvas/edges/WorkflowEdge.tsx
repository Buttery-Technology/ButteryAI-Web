import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";

export function WorkflowEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return <BaseEdge {...props} path={edgePath} style={{ stroke: "#8d8d8d", strokeWidth: 6 }} />;
}
