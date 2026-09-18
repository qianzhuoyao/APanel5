import { useI18nOptional as useI18n } from "@arronqzy/i18n/react";
import type { NodeProps } from "@xyflow/react";

import {
  resolveBlueprintConfigSource,
  resolveBlueprintNodeTypeLabel,
} from "../graph/document";
import { resolveBlueprintNodeSummary } from "../graph/node-summary";
import { useBlueprintNodeSelect } from "../BlueprintCanvasContext";
import { resolveBlueprintNodeExecutionTone } from "../runtime/execution-overlay";
import type { BlueprintFlowNodeData } from "../types";
import { BlueprintNodeShell } from "./BlueprintNodeShell";

export function BlueprintFlowNode({ id, data }: NodeProps) {
  const { t } = useI18n();
  const nodeData = data as BlueprintFlowNodeData;
  const onSelect = useBlueprintNodeSelect();
  const configSource = resolveBlueprintConfigSource(nodeData);
  const variant = configSource === "view" ? "view" : "blueprint";

  return (
    <BlueprintNodeShell
      nodeId={id}
      label={nodeData.label}
      meta={resolveBlueprintNodeTypeLabel(nodeData, t)}
      subtitle={resolveBlueprintNodeSummary(nodeData, t)}
      variant={variant}
      selected={Boolean(nodeData.isSelected)}
      executionTone={resolveBlueprintNodeExecutionTone(nodeData)}
      onSelect={onSelect}
    />
  );
}
