import type { NodeProps } from "@xyflow/react";

import { resolveBlueprintNodeTypeLabel } from "../graph/document";
import { resolveBlueprintNodeSummary } from "../graph/node-summary";
import { useBlueprintNodeSelect } from "../BlueprintCanvasContext";
import { resolveBlueprintNodeExecutionTone } from "../runtime/execution-overlay";
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
      subtitle={resolveBlueprintNodeSummary(nodeData)}
      variant="fetch"
      selected={Boolean(nodeData.isSelected)}
      executionTone={resolveBlueprintNodeExecutionTone(nodeData)}
      onSelect={onSelect}
    />
  );
}
