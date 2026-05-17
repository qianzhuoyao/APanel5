import type { NodeProps, NodeTypes } from "@xyflow/react";

import { BlueprintFlowNode } from "./nodes/BlueprintFlowNode";
import { LogicFlowNode } from "./nodes/LogicFlowNode";

export function createBlueprintNodeTypes(
  onSelectNode?: (nodeId: string) => void
): NodeTypes {
  const onSelect = (nodeId: string) => {
    onSelectNode?.(nodeId);
  };

  return {
    blueprint: (props: NodeProps) => (
      <BlueprintFlowNode {...props} onSelect={onSelect} />
    ),
    logic: (props: NodeProps) => (
      <LogicFlowNode {...props} onSelect={onSelect} />
    ),
  };
}
