import { useI18n } from "@arronqzy/i18n/react";
import type { NodeProps } from "@xyflow/react";

import { resolveBlueprintNodeTypeLabel } from "../graph/document";
import { resolveBlueprintNodeSummary } from "../graph/node-summary";
import { useBlueprintNodeSelect } from "../BlueprintCanvasContext";
import { resolveBlueprintNodeExecutionTone } from "../runtime/execution-overlay";
import type { BlueprintFlowNodeData } from "../types";
import { BlueprintNodeShell } from "./BlueprintNodeShell";

export function JsonFlowNode({ id, data }: NodeProps) {
  const { t } = useI18n();
  const nodeData = data as BlueprintFlowNodeData;
  const onSelect = useBlueprintNodeSelect();

  return (
    <BlueprintNodeShell
      nodeId={id}
      label={nodeData.label}
      meta={resolveBlueprintNodeTypeLabel(nodeData, t)}
      subtitle={resolveBlueprintNodeSummary(nodeData, t)}
      variant="json"
      selected={Boolean(nodeData.isSelected)}
      executionTone={resolveBlueprintNodeExecutionTone(nodeData)}
      onSelect={onSelect}
    />
  );
}
