import { Handle, Position, type NodeProps } from "@xyflow/react";

import type { BlueprintFlowNodeData } from "../types";
import { BlueprintNodeCard } from "./BlueprintNodeCard";

export type BlueprintFlowNodeProps = NodeProps & {
  onSelect?: (nodeId: string) => void;
};

export function BlueprintFlowNode({ id, data, onSelect }: BlueprintFlowNodeProps) {
  const nodeData = data as BlueprintFlowNodeData;

  return (
    <div className="relative flex flex-col items-stretch">
      <Handle type="target" position={Position.Top} className="bp-flow-handle" />
      <div
        className="bp-flow-drag-handle flex h-4 cursor-grab items-center justify-center rounded-t-md border border-b-0 border-border/70 bg-muted/50 text-muted-foreground active:cursor-grabbing"
        title="拖拽移动"
      >
        <span className="select-none text-[10px] leading-none tracking-[0.2em]">···</span>
      </div>
      <BlueprintNodeCard
        nodeId={id}
        label={nodeData.label}
        meta="蓝图"
        variant="blueprint"
        selected={Boolean(nodeData.isSelected)}
        onSelect={onSelect}
      />
      <Handle type="source" position={Position.Bottom} className="bp-flow-handle" />
    </div>
  );
}
