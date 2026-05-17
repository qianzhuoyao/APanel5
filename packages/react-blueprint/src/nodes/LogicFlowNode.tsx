import type { NodeProps } from "@xyflow/react";

import type { BlueprintFlowNodeData } from "../types";
import { BlueprintNodeShell } from "./BlueprintNodeShell";

export type LogicFlowNodeProps = NodeProps & {
  onSelect?: (nodeId: string) => void;
};

export function LogicFlowNode({ id, data, onSelect }: LogicFlowNodeProps) {
  const nodeData = data as BlueprintFlowNodeData;
  const selected = Boolean(nodeData.isSelected);

  return (
    <BlueprintNodeShell
      nodeId={id}
      label={nodeData.label}
      meta={nodeData.nodeType}
      variant="logic"
      selected={selected}
      onSelect={onSelect}
    />
  );
}
