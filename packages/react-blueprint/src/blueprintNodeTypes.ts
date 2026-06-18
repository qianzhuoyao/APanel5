import type { NodeTypes } from "@xyflow/react";

import { BlueprintFlowNode } from "./nodes/BlueprintFlowNode";
import { AndFlowNode } from "./nodes/AndFlowNode";
import { ClockFlowNode } from "./nodes/ClockFlowNode";
import { FetchFlowNode } from "./nodes/FetchFlowNode";
import { JsonFlowNode } from "./nodes/JsonFlowNode";
import { LifecycleFlowNode } from "./nodes/LifecycleFlowNode";
import { LogicFlowNode } from "./nodes/LogicFlowNode";

/** 稳定引用，避免 React Flow 因 nodeTypes 变化反复卸载节点 */
export const blueprintNodeTypes = {
  and: AndFlowNode,
  blueprint: BlueprintFlowNode,
  clock: ClockFlowNode,
  fetch: FetchFlowNode,
  json: JsonFlowNode,
  logic: LogicFlowNode,
  lifecycle: LifecycleFlowNode,
} satisfies NodeTypes;
