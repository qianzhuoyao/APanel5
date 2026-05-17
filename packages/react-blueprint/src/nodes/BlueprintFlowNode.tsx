import type { NodeProps } from "@xyflow/react";

import { useBlueprintNodeSelect } from "../BlueprintCanvasContext";
import type { BlueprintFlowNodeData } from "../types";
import { BlueprintNodeShell } from "./BlueprintNodeShell";

export function BlueprintFlowNode({ id, data }: NodeProps) {
  const nodeData = data as BlueprintFlowNodeData;
  const onSelect = useBlueprintNodeSelect();

  return (
    <BlueprintNodeShell
      nodeId={id}
      label={nodeData.label}
      meta="蓝图"
      variant="blueprint"
      selected={Boolean(nodeData.isSelected)}
      onSelect={onSelect}
    />
  );
}
