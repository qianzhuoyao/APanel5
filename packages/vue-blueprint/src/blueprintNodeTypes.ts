import { markRaw, type Component } from "vue";

import AndFlowNode from "./nodes/AndFlowNode.vue";
import BlueprintFlowNode from "./nodes/BlueprintFlowNode.vue";
import ClockFlowNode from "./nodes/ClockFlowNode.vue";
import FetchFlowNode from "./nodes/FetchFlowNode.vue";
import JsonFlowNode from "./nodes/JsonFlowNode.vue";
import LifecycleFlowNode from "./nodes/LifecycleFlowNode.vue";
import EventFlowNode from "./nodes/EventFlowNode.vue";
import LogicFlowNode from "./nodes/LogicFlowNode.vue";

/** 稳定引用，避免 Vue Flow 因 nodeTypes 变化反复卸载节点 */
export const blueprintNodeTypes: Record<string, Component> = {
  and: markRaw(AndFlowNode),
  blueprint: markRaw(BlueprintFlowNode),
  clock: markRaw(ClockFlowNode),
  fetch: markRaw(FetchFlowNode),
  json: markRaw(JsonFlowNode),
  logic: markRaw(LogicFlowNode),
  lifecycle: markRaw(LifecycleFlowNode),
  event: markRaw(EventFlowNode),
};
