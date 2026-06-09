import type {
  FetchRequestConfig,
  JsonNodeConfig,
  PageLifecyclePhase,
} from "@arron/blueprint-dsl";
import {
  BLUEPRINT_NODE_TYPE,
  DEFAULT_FETCH_REQUEST_CONFIG,
  DEFAULT_JSON_NODE_CONFIG,
  DEFAULT_LOGIC_NODE_TYPE,
  FETCH_NODE_TYPE,
  JSON_NODE_TYPE,
  LIFECYCLE_NODE_TYPE,
} from "@arron/blueprint-dsl";

export type { FetchRequestConfig as BlueprintFetchConfig } from "@arron/blueprint-dsl";
export type { JsonNodeConfig as BlueprintJsonConfig } from "@arron/blueprint-dsl";

export type BlueprintNodeRole = "blueprint" | "logic" | "lifecycle" | "fetch" | "json";

/** 决定右侧配置面板展示哪类配置 */
export type BlueprintConfigSource =
  | "blueprint"
  | "logic"
  | "lifecycle"
  | "view"
  | "fetch"
  | "json";

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
  /** blueprint 节点嵌套子蓝图 id（内部标识，保留兼容） */
  nestedBlueprintId?: string;
  /** 引用的蓝图库记录 id，执行时会等待该蓝图完成后继续 */
  libraryBlueprintId?: string;
  /** lifecycle 节点监听的生命周期阶段 */
  lifecyclePhase?: PageLifecyclePhase;
  /** 数据源获取节点的 fetch 配置 */
  fetchConfig?: FetchRequestConfig;
  /** JSON 节点的 JSON 字符串配置 */
  jsonConfig?: JsonNodeConfig;
};

export function resolveBlueprintConfigSource(
  node: Pick<BlueprintGraphNode, "role" | "configSource" | "viewElementId">
): BlueprintConfigSource {
  if (node.configSource) return node.configSource;
  if (node.viewElementId) return "view";
  if (node.role === "lifecycle") return "lifecycle";
  if (node.role === "fetch") return "fetch";
  if (node.role === "json") return "json";
  return node.role === "logic" ? "logic" : "blueprint";
}

/** 画布节点顶部（拖拽区）展示的配置类型文案 */
export const BLUEPRINT_CONFIG_TYPE_LABELS: Record<
  BlueprintConfigSource,
  string
> = {
  blueprint: "蓝图",
  logic: "逻辑",
  lifecycle: "生命周期",
  view: "视图",
  fetch: "数据源获取",
  json: "JSON 节点",
};

export function resolveBlueprintNodeTypeLabel(
  node: Pick<BlueprintGraphNode, "role" | "configSource" | "viewElementId">
): string {
  return BLUEPRINT_CONFIG_TYPE_LABELS[resolveBlueprintConfigSource(node)];
}

/** 新建节点时的默认显示名称（与类型文案一致） */
export function defaultBlueprintNodeLabel(
  configSource: BlueprintConfigSource
): string {
  return BLUEPRINT_CONFIG_TYPE_LABELS[configSource];
}

export function resolveNodeFetchConfig(
  node: Pick<BlueprintGraphNode, "fetchConfig">
): FetchRequestConfig {
  return {
    ...DEFAULT_FETCH_REQUEST_CONFIG,
    ...node.fetchConfig,
    headers: {
      ...DEFAULT_FETCH_REQUEST_CONFIG.headers,
      ...node.fetchConfig?.headers,
    },
    swaggerEndpoints: node.fetchConfig?.swaggerEndpoints,
  };
}

export function resolveNodeJsonConfig(
  node: Pick<BlueprintGraphNode, "jsonConfig">
): JsonNodeConfig {
  return {
    ...DEFAULT_JSON_NODE_CONFIG,
    ...node.jsonConfig,
  };
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

const lifecycleNodeIds = (document: BlueprintDocument) =>
  new Set(
    document.nodes.filter((node) => node.role === "lifecycle").map((node) => node.id)
  );

/** 生命周期节点无输入口：移除连入边，并修正节点配置 */
export function sanitizeBlueprintDocument(
  document: BlueprintDocument
): BlueprintDocument {
  const lifecycleIds = lifecycleNodeIds(document);

  const nodes = document.nodes.map((node) => {
    if (node.role === "lifecycle") {
      return { ...node, configSource: "lifecycle" as const };
    }
    if (node.configSource === "lifecycle") {
      return { ...node, configSource: undefined };
    }
    return node;
  });

  const edges = document.edges.filter((edge) => !lifecycleIds.has(edge.target));

  return { ...document, nodes, edges };
}

export function filterInvalidBlueprintEdges(
  document: BlueprintDocument,
  edges: BlueprintGraphEdge[]
): BlueprintGraphEdge[] {
  const lifecycleIds = lifecycleNodeIds(document);
  return edges.filter((edge) => !lifecycleIds.has(edge.target));
}

/** 切换配置类型时同步节点 role / nodeType，确保生命周期节点渲染为无输入口 */
export function patchNodeConfigSource(
  node: BlueprintGraphNode,
  configSource: BlueprintConfigSource
): Partial<BlueprintGraphNode> {
  if (configSource === "lifecycle") {
    const phase = node.lifecyclePhase ?? "mounted";
    return {
      role: "lifecycle",
      nodeType: LIFECYCLE_NODE_TYPE,
      configSource: "lifecycle",
      lifecyclePhase: phase,
      viewElementId: undefined,
      libraryBlueprintId: undefined,
      fetchConfig: undefined,
      jsonConfig: undefined,
    };
  }

  if (configSource === "fetch") {
    return {
      role: "fetch",
      nodeType: FETCH_NODE_TYPE,
      configSource: "fetch",
      lifecyclePhase: undefined,
      viewElementId: undefined,
      libraryBlueprintId: undefined,
      fetchConfig: resolveNodeFetchConfig(node),
      jsonConfig: undefined,
    };
  }

  if (configSource === "json") {
    return {
      role: "json",
      nodeType: JSON_NODE_TYPE,
      configSource: "json",
      lifecyclePhase: undefined,
      viewElementId: undefined,
      libraryBlueprintId: undefined,
      fetchConfig: undefined,
      jsonConfig: resolveNodeJsonConfig(node),
    };
  }

  if (configSource === "blueprint") {
    return {
      role: "blueprint",
      nodeType: BLUEPRINT_NODE_TYPE,
      configSource: "blueprint",
      lifecyclePhase: undefined,
      nestedBlueprintId: node.nestedBlueprintId ?? createNodeId("nested_bp"),
      viewElementId: undefined,
      fetchConfig: undefined,
      jsonConfig: undefined,
    };
  }

  if (configSource === "logic") {
    return {
      role: "logic",
      nodeType: DEFAULT_LOGIC_NODE_TYPE,
      configSource: "logic",
      lifecyclePhase: undefined,
      viewElementId: undefined,
      libraryBlueprintId: undefined,
      fetchConfig: undefined,
      jsonConfig: undefined,
    };
  }

  return {
    role: "blueprint",
    nodeType: BLUEPRINT_NODE_TYPE,
    configSource: "view",
    lifecyclePhase: undefined,
    libraryBlueprintId: undefined,
    fetchConfig: undefined,
    jsonConfig: undefined,
  };
}
