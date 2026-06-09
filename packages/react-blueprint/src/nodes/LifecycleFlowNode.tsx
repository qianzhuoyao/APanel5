import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@arron/ui";

import { resolveBlueprintNodeTypeLabel } from "../graph/document";
import { useBlueprintNodeSelect } from "../BlueprintCanvasContext";
import type { BlueprintFlowNodeData } from "../types";
import { BlueprintNodeCard } from "./BlueprintNodeCard";

/** 生命周期节点：无输入口，仅在对应生命周期触发时从右侧输出口发出信号 */
export function LifecycleFlowNode({ id, data }: NodeProps) {
  const nodeData = data as BlueprintFlowNodeData;
  const onSelect = useBlueprintNodeSelect();

  return (
    <div
      className={cn("bp-node bp-node--lifecycle", nodeData.isSelected && "bp-node--selected")}
    >
      <BlueprintNodeCard
        nodeId={id}
        label={nodeData.label}
        meta={resolveBlueprintNodeTypeLabel(nodeData)}
        variant="lifecycle"
        selected={Boolean(nodeData.isSelected)}
        hideLeadingDot
        onSelect={onSelect}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="bp-flow-handle bp-flow-handle--source"
        title="生命周期满足时输出真/假信号"
      />
    </div>
  );
}
