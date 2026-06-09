import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@arron/ui";
import { PAGE_LIFECYCLE_LABELS } from "@arron/blueprint-dsl";

import { useBlueprintNodeSelect } from "../BlueprintCanvasContext";
import type { BlueprintFlowNodeData } from "../types";
import { BlueprintNodeCard } from "./BlueprintNodeCard";

export function LifecycleFlowNode({ id, data }: NodeProps) {
  const nodeData = data as BlueprintFlowNodeData;
  const onSelect = useBlueprintNodeSelect();
  const phaseLabel = nodeData.lifecyclePhase
    ? PAGE_LIFECYCLE_LABELS[nodeData.lifecyclePhase]
    : "未配置";

  return (
    <div className={cn("bp-node", nodeData.isSelected && "bp-node--selected")}>
      <BlueprintNodeCard
        nodeId={id}
        label={nodeData.label}
        meta={phaseLabel}
        variant="lifecycle"
        selected={Boolean(nodeData.isSelected)}
        onSelect={onSelect}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="bp-flow-handle bp-flow-handle--source"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="signal"
        className="bp-flow-handle bp-flow-handle--signal"
        title="生命周期信号（phase + timestamp）"
      />
    </div>
  );
}
