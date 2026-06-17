import type {
  ClockNodeConfig,
  FetchRequestConfig,
  JsonNodeConfig,
  LogicNodeConfig,
  PageLifecyclePhase,
} from "@arron/blueprint-dsl";
import {
  BLUEPRINT_NODE_TYPE,
  CLOCK_NODE_TYPE,
  AND_NODE_TYPE,
  DEFAULT_CLOCK_NODE_CONFIG,
  DEFAULT_FETCH_REQUEST_CONFIG,
  DEFAULT_JSON_NODE_CONFIG,
  DEFAULT_LOGIC_NODE_CONFIG,
  DEFAULT_LOGIC_NODE_TYPE,
  FETCH_NODE_TYPE,
  JSON_NODE_TYPE,
  LIFECYCLE_NODE_TYPE,
  normalizeClockConfig,
  VIEW_NODE_TYPE,
} from "@arron/blueprint-dsl";

export type { FetchRequestConfig as BlueprintFetchConfig } from "@arron/blueprint-dsl";
export type { JsonNodeConfig as BlueprintJsonConfig } from "@arron/blueprint-dsl";
export type { LogicNodeConfig as BlueprintLogicConfig } from "@arron/blueprint-dsl";
export type { ClockNodeConfig as BlueprintClockConfig } from "@arron/blueprint-dsl";

export type BlueprintNodeRole = "blueprint" | "logic" | "and" | "lifecycle" | "fetch" | "json" | "clock";

/** 决定右侧配置面板展示哪类配置 */
export type BlueprintConfigSource =
  | "blueprint"
  | "logic"
  | "and"
  | "lifecycle"
  | "view"
  | "fetch"
  | "json"
  | "clock";

export type BlueprintGraphNode = {
  id: string;
  role: BlueprintNodeRole;
  /** 对应 @arron/blueprint-dsl NodeDefinition.type */
  nodeType: string;
  label: string;
  position: { x: number; y: number };
  /** 配置面板类型；默认由 role 推断 */
  configSource?: BlueprintConfigSource;
  /** @deprecated 请使用 viewElementIds；读取时由 resolveViewElementIds 兼容 */
  viewElementId?: string;
  /** 关联的视图画布节点 id 列表，配置类型为 view 时可一次绑定多个 */
  viewElementIds?: string[];
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
  /** 逻辑节点的 JavaScript 脚本配置 */
  logicConfig?: LogicNodeConfig;
  /** 时钟节点的间隔与时间格式配置 */
  clockConfig?: ClockNodeConfig;
};

export function resolveViewElementIds(
  node: Pick<BlueprintGraphNode, "viewElementId" | "viewElementIds">
): string[] {
  if (node.viewElementIds?.length) return [...node.viewElementIds];
  if (node.viewElementId) return [node.viewElementId];
  return [];
}

/** 仅保留仍存在于视图画布中的关联 id */
export function pruneViewElementIds(
  ids: readonly string[],
  existingViewElementIds: ReadonlySet<string>
): string[] {
  return ids.filter((id) => existingViewElementIds.has(id));
}

export function resolveBlueprintConfigSource(
  node: Pick<
    BlueprintGraphNode,
    "role" | "configSource" | "viewElementId" | "viewElementIds"
  >
): BlueprintConfigSource {
  if (node.configSource) return node.configSource;
  if (resolveViewElementIds(node).length > 0) return "view";
  if (node.role === "lifecycle") return "lifecycle";
  if (node.role === "clock") return "clock";
  if (node.role === "and") return "and";
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
  and: "并运算",
  lifecycle: "生命周期",
  view: "视图",
  fetch: "数据源获取",
  json: "JSON 节点",
  clock: "时钟",
};

export function resolveBlueprintNodeTypeLabel(
  node: Pick<
    BlueprintGraphNode,
    "role" | "configSource" | "viewElementId" | "viewElementIds"
  >
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

export function resolveNodeLogicConfig(
  node: Pick<BlueprintGraphNode, "logicConfig">
): LogicNodeConfig {
  return {
    ...DEFAULT_LOGIC_NODE_CONFIG,
    ...node.logicConfig,
  };
}

export function resolveNodeClockConfig(
  node: Pick<BlueprintGraphNode, "clockConfig">
): ClockNodeConfig {
  return normalizeClockConfig({
    ...DEFAULT_CLOCK_NODE_CONFIG,
    ...node.clockConfig,
  });
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
  /** 为 true 时，假信号不阻塞任务链，会继续向下游传递 */
  allowFalseSignalPropagation?: boolean;
};

export function createBlueprintDocument(id = "default"): BlueprintDocument {
  return { id, nodes: [], edges: [] };
}

export function createNodeId(prefix = "node"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

const noInputTargetNodeIds = (document: BlueprintDocument) =>
  new Set(
    document.nodes
      .filter((node) => node.role === "lifecycle")
      .map((node) => node.id)
  );

/** 生命周期节点无输入口：移除连入边，并修正节点配置 */
export function sanitizeBlueprintDocument(
  document: BlueprintDocument
): BlueprintDocument {
  const blockedTargets = noInputTargetNodeIds(document);

  const nodes = document.nodes.map((node) => {
    let next = node;
    if (node.viewElementId && !node.viewElementIds?.length) {
      next = {
        ...next,
        viewElementIds: [node.viewElementId],
        viewElementId: undefined,
      };
    }
    if (
      resolveBlueprintConfigSource(next) === "view" &&
      next.nodeType !== VIEW_NODE_TYPE
    ) {
      next = { ...next, nodeType: VIEW_NODE_TYPE };
    }
    if (next.role === "lifecycle") {
      return { ...next, configSource: "lifecycle" as const };
    }
    if (next.role === "clock") {
      return { ...next, configSource: "clock" as const };
    }
    if (next.configSource === "lifecycle" || next.configSource === "clock") {
      return { ...next, configSource: undefined };
    }
    return next;
  });

  const edges = document.edges.filter((edge) => !blockedTargets.has(edge.target));

  return { ...document, nodes, edges };
}

export function filterInvalidBlueprintEdges(
  document: BlueprintDocument,
  edges: BlueprintGraphEdge[]
): BlueprintGraphEdge[] {
  const blockedTargets = noInputTargetNodeIds(document);
  return edges.filter((edge) => !blockedTargets.has(edge.target));
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
      viewElementIds: undefined,
      libraryBlueprintId: undefined,
      fetchConfig: undefined,
      jsonConfig: undefined,
      logicConfig: undefined,
      clockConfig: undefined,
    };
  }

  if (configSource === "clock") {
    return {
      role: "clock",
      nodeType: CLOCK_NODE_TYPE,
      configSource: "clock",
      clockConfig: resolveNodeClockConfig(node),
      lifecyclePhase: undefined,
      viewElementId: undefined,
      viewElementIds: undefined,
      libraryBlueprintId: undefined,
      fetchConfig: undefined,
      jsonConfig: undefined,
      logicConfig: undefined,
    };
  }

  if (configSource === "fetch") {
    return {
      role: "fetch",
      nodeType: FETCH_NODE_TYPE,
      configSource: "fetch",
      lifecyclePhase: undefined,
      viewElementId: undefined,
      viewElementIds: undefined,
      libraryBlueprintId: undefined,
      fetchConfig: resolveNodeFetchConfig(node),
      jsonConfig: undefined,
      logicConfig: undefined,
      clockConfig: undefined,
    };
  }

  if (configSource === "json") {
    return {
      role: "json",
      nodeType: JSON_NODE_TYPE,
      configSource: "json",
      lifecyclePhase: undefined,
      viewElementId: undefined,
      viewElementIds: undefined,
      libraryBlueprintId: undefined,
      fetchConfig: undefined,
      jsonConfig: resolveNodeJsonConfig(node),
      logicConfig: undefined,
      clockConfig: undefined,
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
      viewElementIds: undefined,
      fetchConfig: undefined,
      jsonConfig: undefined,
      logicConfig: undefined,
      clockConfig: undefined,
    };
  }

  if (configSource === "logic") {
    return {
      role: "logic",
      nodeType: DEFAULT_LOGIC_NODE_TYPE,
      configSource: "logic",
      lifecyclePhase: undefined,
      viewElementId: undefined,
      viewElementIds: undefined,
      libraryBlueprintId: undefined,
      fetchConfig: undefined,
      jsonConfig: undefined,
      logicConfig: resolveNodeLogicConfig(node),
      clockConfig: undefined,
    };
  }

  if (configSource === "and") {
    return {
      role: "and",
      nodeType: AND_NODE_TYPE,
      configSource: "and",
      lifecyclePhase: undefined,
      viewElementId: undefined,
      viewElementIds: undefined,
      libraryBlueprintId: undefined,
      fetchConfig: undefined,
      jsonConfig: undefined,
      logicConfig: undefined,
      clockConfig: undefined,
    };
  }

  return {
    role: "blueprint",
    nodeType: VIEW_NODE_TYPE,
    configSource: "view",
    lifecyclePhase: undefined,
    libraryBlueprintId: undefined,
    fetchConfig: undefined,
    jsonConfig: undefined,
    logicConfig: undefined,
    clockConfig: undefined,
  };
}
