import type { NodeProps } from "@xyflow/react";

import { resolveBlueprintNodeTypeLabel } from "../graph/document";
import { resolveBlueprintNodeSummary } from "../graph/node-summary";
import { useBlueprintNodeSelect } from "../BlueprintCanvasContext";
import { resolveBlueprintNodeExecutionTone } from "../runtime/execution-overlay";
import type { BlueprintFlowNodeData } from "../types";
import { BlueprintNodeShell } from "./BlueprintNodeShell";

/** 时钟节点：收到真信号后按配置间隔输出含当前时间的真信号 */
export function ClockFlowNode({ id, data }: NodeProps) {
  const nodeData = data as BlueprintFlowNodeData;
  const onSelect = useBlueprintNodeSelect();
  const progress = nodeData.clockEmitProgress;
  const progressLabel = progress
    ? `${progress.current}/${progress.total}`
    : undefined;

  return (
    <BlueprintNodeShell
      nodeId={id}
      label={nodeData.label}
      meta={resolveBlueprintNodeTypeLabel(nodeData)}
      subtitle={resolveBlueprintNodeSummary(nodeData)}
      progressLabel={progressLabel}
      variant="clock"
      selected={Boolean(nodeData.isSelected)}
      executionTone={resolveBlueprintNodeExecutionTone(nodeData)}
      onSelect={onSelect}
    />
  );
}
