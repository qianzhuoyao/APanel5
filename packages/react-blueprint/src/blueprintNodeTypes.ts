import type { NodeTypes } from "@xyflow/react";

import { BlueprintFlowNode } from "./nodes/BlueprintFlowNode";
import { LogicFlowNode } from "./nodes/LogicFlowNode";

/** 稳定引用，避免 React Flow 因 nodeTypes 变化反复卸载节点 */
export const blueprintNodeTypes = {
  blueprint: BlueprintFlowNode,
  logic: LogicFlowNode,
} satisfies NodeTypes;
