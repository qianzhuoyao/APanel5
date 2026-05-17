import type { NodeProps } from "@xyflow/react";

import type { BlueprintFlowNodeData } from "../types";
import { BlueprintNodeShell } from "./BlueprintNodeShell";

export type BlueprintFlowNodeProps = NodeProps & {
  onSelect?: (nodeId: string) => void;
};

export function BlueprintFlowNode({ id, data, onSelect }: BlueprintFlowNodeProps) {
  const nodeData = data as BlueprintFlowNodeData;
  const selected = Boolean(nodeData.isSelected);

  return (
    <BlueprintNodeShell
      nodeId={id}
      label={nodeData.label}
      meta="蓝图"
      variant="blueprint"
      selected={selected}
      onSelect={onSelect}
    />
  );
}
