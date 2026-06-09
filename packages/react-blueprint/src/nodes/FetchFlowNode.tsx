import type { NodeProps } from "@xyflow/react";

import { resolveBlueprintNodeTypeLabel } from "../graph/document";
import { useBlueprintNodeSelect } from "../BlueprintCanvasContext";
import type { BlueprintFlowNodeData } from "../types";
import { BlueprintNodeShell } from "./BlueprintNodeShell";

export function FetchFlowNode({ id, data }: NodeProps) {
  const nodeData = data as BlueprintFlowNodeData;
  const onSelect = useBlueprintNodeSelect();

  return (
    <BlueprintNodeShell
      nodeId={id}
      label={nodeData.label}
      meta={resolveBlueprintNodeTypeLabel(nodeData)}
      variant="fetch"
      selected={Boolean(nodeData.isSelected)}
      onSelect={onSelect}
    />
  );
}
