import type { NodeDefinition } from "../type.js";

export const BLUEPRINT_NODE_TYPE = "Blueprint";
export const DEFAULT_LOGIC_NODE_TYPE = "Logic";

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

export const nodeDefinitionRegistry: Record<string, NodeDefinition> = {
  [BLUEPRINT_NODE_TYPE]: blueprintNodeDefinition,
  [DEFAULT_LOGIC_NODE_TYPE]: defaultLogicNodeDefinition,
};

export function getNodeDefinition(type: string): NodeDefinition {
  const def = nodeDefinitionRegistry[type];
  if (!def) {
    throw new Error(`NodeDefinition not found: ${type}`);
  }
  return def;
}
