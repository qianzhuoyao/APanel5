import type { NodeProps } from "@xyflow/react";

import { useBlueprintNodeSelect } from "../BlueprintCanvasContext";
import type { BlueprintFlowNodeData } from "../types";
import { BlueprintNodeShell } from "./BlueprintNodeShell";

export function LogicFlowNode({ id, data }: NodeProps) {
  const nodeData = data as BlueprintFlowNodeData;
  const onSelect = useBlueprintNodeSelect();

  return (
    <BlueprintNodeShell
      nodeId={id}
      label={nodeData.label}
      meta={nodeData.nodeType}
      variant="logic"
      selected={Boolean(nodeData.isSelected)}
      onSelect={onSelect}
    />
  );
}
