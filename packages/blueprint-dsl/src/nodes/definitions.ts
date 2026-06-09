import type { NodeDefinition } from "../type.js";

export const BLUEPRINT_NODE_TYPE = "Blueprint";
export const DEFAULT_LOGIC_NODE_TYPE = "Logic";
export const LIFECYCLE_NODE_TYPE = "Lifecycle";

export const blueprintNodeDefinition: NodeDefinition = {
  type: BLUEPRINT_NODE_TYPE,
  inputs: [{ name: "in", kind: "flow" }],
  outputs: [{ name: "out", kind: "flow" }],
  behavior: { kind: "blueprint", ref: "nested-blueprint" },
};

export const defaultLogicNodeDefinition: NodeDefinition = {
  type: DEFAULT_LOGIC_NODE_TYPE,
  inputs: [{ name: "in", kind: "data", optional: true }],
  outputs: [{ name: "out", kind: "flow" }],
  behavior: { kind: "js", ref: "logic-noop" },
};

/** 生命周期钩子节点：无入流，在页面生命周期触发时自动向下游发送信号 */
export const lifecycleNodeDefinition: NodeDefinition = {
  type: LIFECYCLE_NODE_TYPE,
  inputs: [],
  outputs: [
    { name: "out", kind: "flow" },
    { name: "signal", kind: "data" },
  ],
  behavior: { kind: "js", ref: "lifecycle-emit" },
};

export const nodeDefinitionRegistry: Record<string, NodeDefinition> = {
  [BLUEPRINT_NODE_TYPE]: blueprintNodeDefinition,
  [DEFAULT_LOGIC_NODE_TYPE]: defaultLogicNodeDefinition,
  [LIFECYCLE_NODE_TYPE]: lifecycleNodeDefinition,
};

export function getNodeDefinition(type: string): NodeDefinition {
  const def = nodeDefinitionRegistry[type];
  if (!def) {
    throw new Error(`NodeDefinition not found: ${type}`);
  }
  return def;
}
