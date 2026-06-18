import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

const EDGE_STROKE = "#2563eb";
const EDGE_WIDTH = 2.5;

export function BlueprintSmoothEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
}: EdgeProps) {
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      path={path}
      className="bp-edge-visible"
      style={{
        stroke: EDGE_STROKE,
        strokeWidth: EDGE_WIDTH,
        ...style,
      }}
    />
  );
}
