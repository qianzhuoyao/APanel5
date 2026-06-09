import type { NodeTypes } from "@xyflow/react";

import { BlueprintFlowNode } from "./nodes/BlueprintFlowNode";
import { FetchFlowNode } from "./nodes/FetchFlowNode";
import { JsonFlowNode } from "./nodes/JsonFlowNode";
import { LifecycleFlowNode } from "./nodes/LifecycleFlowNode";
import { LogicFlowNode } from "./nodes/LogicFlowNode";

/** 稳定引用，避免 React Flow 因 nodeTypes 变化反复卸载节点 */
export const blueprintNodeTypes = {
  blueprint: BlueprintFlowNode,
  fetch: FetchFlowNode,
  json: JsonFlowNode,
  logic: LogicFlowNode,
  lifecycle: LifecycleFlowNode,
} satisfies NodeTypes;
