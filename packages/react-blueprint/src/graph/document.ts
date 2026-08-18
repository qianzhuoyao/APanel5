import type {
  ClockNodeConfig,
  FetchRequestConfig,
  JsonNodeConfig,
  LogicNodeConfig,
  PageLifecyclePhase,
  ViewEventNodeConfig,
  ViewEventType,
} from "@arronqzy/blueprint-dsl";
import {
  BLUEPRINT_NODE_TYPE,
  CLOCK_NODE_TYPE,
  AND_NODE_TYPE,
  DEFAULT_CLOCK_NODE_CONFIG,
  DEFAULT_FETCH_REQUEST_CONFIG,
  DEFAULT_JSON_NODE_CONFIG,
  DEFAULT_LOGIC_NODE_CONFIG,
  DEFAULT_LOGIC_NODE_TYPE,
  DEFAULT_VIEW_EVENT_NODE_CONFIG,
  EVENT_NODE_TYPE,
  FETCH_NODE_TYPE,
  JSON_NODE_TYPE,
  LIFECYCLE_NODE_TYPE,
  normalizeClockConfig,
  normalizeViewEventConfig,
  VIEW_NODE_TYPE,
} from "@arronqzy/blueprint-dsl";

export type { FetchRequestConfig as BlueprintFetchConfig } from "@arronqzy/blueprint-dsl";
export type { JsonNodeConfig as BlueprintJsonConfig } from "@arronqzy/blueprint-dsl";
export type { LogicNodeConfig as BlueprintLogicConfig } from "@arronqzy/blueprint-dsl";
export type { ClockNodeConfig as BlueprintClockConfig } from "@arronqzy/blueprint-dsl";
export type { ViewEventNodeConfig as BlueprintEventConfig } from "@arronqzy/blueprint-dsl";

export type BlueprintNodeRole = "blueprint" | "logic" | "and" | "lifecycle" | "fetch" | "json" | "clock" | "event";

/** 决定右侧配置面板展示哪类配置 */
export type BlueprintConfigSource =
  | "blueprint"
  | "logic"
  | "and"
  | "lifecycle"
  | "view"
  | "fetch"
  | "json"
  | "clock"
  | "event";

export type BlueprintGraphNode = {
  id: string;
  role: BlueprintNodeRole;
  /** 对应 @arronqzy/blueprint-dsl NodeDefinition.type */
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
  /** 视图事件节点监听的事件类型 */
  eventConfig?: ViewEventNodeConfig;
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
    "role" | "nodeType" | "configSource" | "viewElementId" | "viewElementIds"
  >
): BlueprintConfigSource {
  if (node.configSource) return node.configSource;
  if (node.role === "lifecycle") return "lifecycle";
  if (node.role === "event") return "event";
  if (node.role === "clock") return "clock";
  if (node.role === "and") return "and";
  if (node.role === "fetch") return "fetch";
  if (node.role === "json") return "json";
  if (node.nodeType === FETCH_NODE_TYPE) return "fetch";
  if (node.nodeType === JSON_NODE_TYPE) return "json";
  if (node.nodeType === CLOCK_NODE_TYPE) return "clock";
  if (node.nodeType === EVENT_NODE_TYPE) return "event";
  if (node.nodeType === VIEW_NODE_TYPE) return "view";
  if (resolveViewElementIds(node).length > 0) return "view";
  return node.role === "logic" ? "logic" : "blueprint";
}

export type BlueprintConfigSourceNode = Pick<
  BlueprintGraphNode,
  "role" | "nodeType" | "configSource" | "viewElementId" | "viewElementIds"
>;

export type BlueprintConnectionIssue =
  | "lifecycle-no-input"
  | "event-requires-lifecycle";

/** 连入校验：生命周期无输入；事件节点输入必须全部来自生命周期节点 */
export function resolveBlueprintConnectionIssue(
  source: BlueprintConfigSourceNode | undefined,
  target: BlueprintConfigSourceNode | undefined
): BlueprintConnectionIssue | null {
  if (!source || !target) return null;
  const targetSource = resolveBlueprintConfigSource(target);
  if (targetSource === "lifecycle") return "lifecycle-no-input";
  if (
    targetSource === "event" &&
    resolveBlueprintConfigSource(source) !== "lifecycle"
  ) {
    return "event-requires-lifecycle";
  }
  return null;
}

export function inspectEventNodeInputs(
  nodeId: string,
  nodes: Array<BlueprintConfigSourceNode & { id: string }>,
  edges: Array<{ source: string; target: string }>
) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  let incomingCount = 0;
  let lifecycleCount = 0;
  let nonLifecycleCount = 0;
  for (const edge of edges) {
    if (edge.target !== nodeId) continue;
    incomingCount += 1;
    const source = byId.get(edge.source);
    if (source && resolveRunnableNodeType(source) === LIFECYCLE_NODE_TYPE) {
      lifecycleCount += 1;
    } else {
      nonLifecycleCount += 1;
    }
  }
  return { incomingCount, lifecycleCount, nonLifecycleCount };
}

/** 可执行图节点类型：与配置类型对齐，避免文档里残留旧 nodeType */
export function resolveRunnableNodeType(
  node: Pick<
    BlueprintGraphNode,
    "role" | "nodeType" | "configSource" | "viewElementId" | "viewElementIds"
  >
): string {
  switch (resolveBlueprintConfigSource(node)) {
    case "view":
      return VIEW_NODE_TYPE;
    case "event":
      return EVENT_NODE_TYPE;
    case "lifecycle":
      return LIFECYCLE_NODE_TYPE;
    case "clock":
      return CLOCK_NODE_TYPE;
    case "and":
      return AND_NODE_TYPE;
    case "fetch":
      return FETCH_NODE_TYPE;
    case "json":
      return JSON_NODE_TYPE;
    case "logic":
      return DEFAULT_LOGIC_NODE_TYPE;
    default:
      return BLUEPRINT_NODE_TYPE;
  }
}

import type { TranslateFn } from "@arronqzy/i18n";
import { resolveLocale, tForLocale } from "@arronqzy/i18n";

/** 画布节点顶部（拖拽区）配置类型对应的 i18n key */
export const BLUEPRINT_CONFIG_TYPE_LABEL_KEYS: Record<
  BlueprintConfigSource,
  string
> = {
  blueprint: "blueprint.node.typeBlueprint",
  logic: "blueprint.node.typeLogic",
  and: "blueprint.node.typeAnd",
  lifecycle: "blueprint.node.typeLifecycle",
  view: "blueprint.node.typeView",
  event: "blueprint.node.typeEvent",
  fetch: "blueprint.node.typeFetch",
  json: "blueprint.node.typeJson",
  clock: "blueprint.node.typeClock",
};

export const BLUEPRINT_LIFECYCLE_PHASE_KEYS: Record<PageLifecyclePhase, string> =
  {
    created: "blueprint.node.phaseCreated",
    beforeMount: "blueprint.node.phaseBeforeMount",
    mounted: "blueprint.node.phaseMounted",
    updated: "blueprint.node.phaseUpdated",
    beforeDestroy: "blueprint.node.phaseBeforeDestroy",
    destroy: "blueprint.node.phaseDestroy",
    activated: "blueprint.node.phaseActivated",
    deactivated: "blueprint.node.phaseDeactivated",
    blueprintActivated: "blueprint.node.phaseBlueprintActivated",
  };

export const BLUEPRINT_VIEW_EVENT_TYPE_KEYS: Record<ViewEventType, string> = {
  click: "blueprint.node.eventClick",
  dblclick: "blueprint.node.eventDblclick",
  contextmenu: "blueprint.node.eventContextmenu",
  mouseenter: "blueprint.node.eventMouseenter",
  mouseleave: "blueprint.node.eventMouseleave",
};

function defaultTranslate(): TranslateFn {
  return tForLocale(resolveLocale());
}

export function getBlueprintNodeTypeLabel(
  t: TranslateFn,
  type: BlueprintConfigSource
): string {
  return t(BLUEPRINT_CONFIG_TYPE_LABEL_KEYS[type]);
}

export function getLifecyclePhaseLabel(
  t: TranslateFn,
  phase: PageLifecyclePhase
): string {
  const key = BLUEPRINT_LIFECYCLE_PHASE_KEYS[phase];
  return key ? t(key) : phase;
}

export function getViewEventTypeLabel(t: TranslateFn, eventType: ViewEventType): string {
  const key = BLUEPRINT_VIEW_EVENT_TYPE_KEYS[eventType];
  return key ? t(key) : eventType;
}

export function resolveBlueprintNodeTypeLabel(
  node: Pick<
    BlueprintGraphNode,
    "role" | "nodeType" | "configSource" | "viewElementId" | "viewElementIds"
  >,
  t: TranslateFn = defaultTranslate()
): string {
  return getBlueprintNodeTypeLabel(t, resolveBlueprintConfigSource(node));
}

/** 新建节点时的默认显示名称（与类型文案一致） */
export function defaultBlueprintNodeLabel(
  configSource: BlueprintConfigSource,
  t: TranslateFn = defaultTranslate()
): string {
  return getBlueprintNodeTypeLabel(t, configSource);
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
    headersJson: node.fetchConfig?.headersJson,
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

export function resolveNodeEventConfig(
  node: Pick<BlueprintGraphNode, "eventConfig">
): ViewEventNodeConfig {
  return normalizeViewEventConfig({
    ...DEFAULT_VIEW_EVENT_NODE_CONFIG,
    ...node.eventConfig,
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

function isLifecycleSourceNode(node: BlueprintGraphNode | undefined): boolean {
  return Boolean(node) && resolveRunnableNodeType(node!) === LIFECYCLE_NODE_TYPE;
}

function isEventTargetNode(node: BlueprintGraphNode | undefined): boolean {
  return Boolean(node) && resolveBlueprintConfigSource(node!) === "event";
}

/** 生命周期节点无输入口；事件节点输入必须来自生命周期节点 */
export function sanitizeBlueprintDocument(
  document: BlueprintDocument
): BlueprintDocument {
  const nodes = document.nodes.map((node) => {
    let next = node;
    if (node.viewElementId && !node.viewElementIds?.length) {
      next = {
        ...next,
        viewElementIds: [node.viewElementId],
        viewElementId: undefined,
      };
    }
    const runnableNodeType = resolveRunnableNodeType(next);
    if (next.nodeType !== runnableNodeType) {
      next = { ...next, nodeType: runnableNodeType };
    }
    if (next.role === "lifecycle") {
      return { ...next, configSource: "lifecycle" as const };
    }
    if (next.role === "event") {
      return { ...next, configSource: "event" as const };
    }
    if (next.role === "clock") {
      return { ...next, configSource: "clock" as const };
    }
    if (next.role === "fetch") {
      return { ...next, configSource: "fetch" as const };
    }
    if (next.role === "json") {
      return { ...next, configSource: "json" as const };
    }
    if (next.role === "and") {
      return { ...next, configSource: "and" as const };
    }
    if (next.configSource === "lifecycle" || next.configSource === "clock" || next.configSource === "event") {
      return { ...next, configSource: undefined };
    }
    return next;
  });

  const edges = filterInvalidBlueprintEdges(
    { ...document, nodes },
    document.edges
  );

  return { ...document, nodes, edges };
}

export function filterInvalidBlueprintEdges(
  document: BlueprintDocument,
  edges: BlueprintGraphEdge[]
): BlueprintGraphEdge[] {
  const blockedTargets = noInputTargetNodeIds(document);
  const byId = new Map(document.nodes.map((node) => [node.id, node]));
  return edges.filter((edge) => {
    if (blockedTargets.has(edge.target)) return false;
    const target = byId.get(edge.target);
    if (isEventTargetNode(target)) {
      return isLifecycleSourceNode(byId.get(edge.source));
    }
    return true;
  });
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
      eventConfig: undefined,
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
      eventConfig: undefined,
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
      eventConfig: undefined,
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
      eventConfig: undefined,
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
      eventConfig: undefined,
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
      eventConfig: undefined,
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
      eventConfig: undefined,
    };
  }

  if (configSource === "event") {
    return {
      role: "event",
      nodeType: EVENT_NODE_TYPE,
      configSource: "event",
      eventConfig: resolveNodeEventConfig(node),
      lifecyclePhase: undefined,
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
    eventConfig: undefined,
  };
}
