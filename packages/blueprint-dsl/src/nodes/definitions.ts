import type { NodeDefinition } from "../type.js";

export const BLUEPRINT_NODE_TYPE = "Blueprint";
export const DEFAULT_LOGIC_NODE_TYPE = "Logic";
export const LIFECYCLE_NODE_TYPE = "Lifecycle";
export const FETCH_NODE_TYPE = "DataFetch";
export const JSON_NODE_TYPE = "JsonNode";

/** 蓝图引用节点：单入单出，收到真信号后执行嵌套蓝图 */
export const blueprintNodeDefinition: NodeDefinition = {
  type: BLUEPRINT_NODE_TYPE,
  inputs: [{ name: "in", kind: "data" }],
  outputs: [{ name: "out", kind: "data" }],
  behavior: { kind: "js", ref: "blueprint-ref-run" },
};

export const defaultLogicNodeDefinition: NodeDefinition = {
  type: DEFAULT_LOGIC_NODE_TYPE,
  inputs: [{ name: "in", kind: "data", optional: true }],
  outputs: [{ name: "out", kind: "data" }],
  behavior: { kind: "js", ref: "logic-noop" },
};

/** 生命周期钩子节点：无入流，触发后向下游发出真/假信号 */
export const lifecycleNodeDefinition: NodeDefinition = {
  type: LIFECYCLE_NODE_TYPE,
  inputs: [],
  outputs: [{ name: "out", kind: "data" }],
  behavior: { kind: "js", ref: "lifecycle-emit" },
};

/** 数据源获取：收到真信号后发起 fetch，成功/失败输出对应信号 */
export const fetchNodeDefinition: NodeDefinition = {
  type: FETCH_NODE_TYPE,
  inputs: [{ name: "in", kind: "data" }],
  outputs: [{ name: "out", kind: "data" }],
  behavior: { kind: "js", ref: "fetch-run" },
};

/** JSON 解析：收到真信号后将配置的 JSON 转为 object 输出 */
export const jsonNodeDefinition: NodeDefinition = {
  type: JSON_NODE_TYPE,
  inputs: [{ name: "in", kind: "data" }],
  outputs: [{ name: "out", kind: "data" }],
  behavior: { kind: "js", ref: "json-parse-run" },
};

export const nodeDefinitionRegistry: Record<string, NodeDefinition> = {
  [BLUEPRINT_NODE_TYPE]: blueprintNodeDefinition,
  [DEFAULT_LOGIC_NODE_TYPE]: defaultLogicNodeDefinition,
  [LIFECYCLE_NODE_TYPE]: lifecycleNodeDefinition,
  [FETCH_NODE_TYPE]: fetchNodeDefinition,
  [JSON_NODE_TYPE]: jsonNodeDefinition,
};

export function getNodeDefinition(type: string): NodeDefinition {
  const def = nodeDefinitionRegistry[type];
  if (!def) {
    throw new Error(`NodeDefinition not found: ${type}`);
  }
  return def;
}
