import type { PageLifecyclePhase } from "@arron/blueprint-dsl";

export type BlueprintNodeRole = "blueprint" | "logic" | "lifecycle";

/** 决定右侧配置面板展示哪类配置 */
export type BlueprintConfigSource = "blueprint" | "logic" | "lifecycle" | "view";

export type BlueprintGraphNode = {
  id: string;
  role: BlueprintNodeRole;
  /** 对应 @arron/blueprint-dsl NodeDefinition.type */
  nodeType: string;
  label: string;
  position: { x: number; y: number };
  /** 配置面板类型；默认由 role 推断 */
  configSource?: BlueprintConfigSource;
  /** 关联视图画布节点 id 时，配置面板展示视图节点配置 */
  viewElementId?: string;
  /** logic 节点所属的蓝图节点 */
  parentId?: string;
  /** blueprint 节点嵌套子蓝图 id */
  nestedBlueprintId?: string;
  /** lifecycle 节点监听的生命周期阶段 */
  lifecyclePhase?: PageLifecyclePhase;
};

export function resolveBlueprintConfigSource(
  node: BlueprintGraphNode
): BlueprintConfigSource {
  if (node.configSource) return node.configSource;
  if (node.viewElementId) return "view";
  if (node.role === "lifecycle") return "lifecycle";
  return node.role === "logic" ? "logic" : "blueprint";
}

export type BlueprintGraphEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
};

export type BlueprintDocument = {
  id: string;
  name?: string;
  nodes: BlueprintGraphNode[];
  edges: BlueprintGraphEdge[];
};

export function createBlueprintDocument(id = "default"): BlueprintDocument {
  return { id, nodes: [], edges: [] };
}

export function createNodeId(prefix = "node"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
