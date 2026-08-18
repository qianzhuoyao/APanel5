/** 视图事件节点可监听的常用 DOM 事件 */
export const VIEW_EVENT_TYPES = [
  "click",
  "dblclick",
  "contextmenu",
  "mouseenter",
  "mouseleave",
] as const;

export type ViewEventType = (typeof VIEW_EVENT_TYPES)[number];

export type ViewEventNodeConfig = {
  /** 监听的事件类型，至少一项；默认 click */
  eventTypes: ViewEventType[];
};

export const DEFAULT_VIEW_EVENT_NODE_CONFIG: ViewEventNodeConfig = {
  eventTypes: ["click"],
};

const VIEW_EVENT_TYPE_SET = new Set<string>(VIEW_EVENT_TYPES);

export function isViewEventType(value: unknown): value is ViewEventType {
  return typeof value === "string" && VIEW_EVENT_TYPE_SET.has(value);
}

export function normalizeViewEventConfig(
  config?: Partial<ViewEventNodeConfig> | null
): ViewEventNodeConfig {
  const raw = Array.isArray(config?.eventTypes) ? config.eventTypes : [];
  const eventTypes = [
    ...new Set(raw.filter(isViewEventType)),
  ];
  return {
    eventTypes:
      eventTypes.length > 0
        ? eventTypes
        : [...DEFAULT_VIEW_EVENT_NODE_CONFIG.eventTypes],
  };
}

/** 可序列化的 DOM 事件快照（原生 Event 无法作为蓝图信号传递） */
export type ViewEventSnapshot = {
  type: string;
  timeStamp: number;
  clientX?: number;
  clientY?: number;
  pageX?: number;
  pageY?: number;
  button?: number;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

/** 触发该事件的视图节点摘要 */
export type ViewEventNodeSnapshot = {
  id: string;
  name?: string;
  materialType?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  layerId?: string;
};

/** 事件节点向下游发出的真信号 value */
export type ViewEventSignal = {
  /** 触发事件（可序列化快照） */
  event: ViewEventSnapshot;
  /** 触发节点 */
  node: ViewEventNodeSnapshot;
  /** 触发的事件类型 */
  eventType: ViewEventType;
};

export function snapshotDomEvent(event: {
  type: string;
  timeStamp?: number;
  clientX?: number;
  clientY?: number;
  pageX?: number;
  pageY?: number;
  button?: number;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
}): ViewEventSnapshot {
  return {
    type: event.type,
    timeStamp: Number(event.timeStamp) || Date.now(),
    clientX: event.clientX,
    clientY: event.clientY,
    pageX: event.pageX,
    pageY: event.pageY,
    button: event.button,
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
  };
}

export function snapshotViewEventNode(
  node: Partial<ViewEventNodeSnapshot> & { id: string }
): ViewEventNodeSnapshot {
  return {
    id: node.id,
    name: node.name,
    materialType: node.materialType,
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    layerId: node.layerId,
  };
}

export function createViewEventSignal(input: {
  event: ViewEventSnapshot;
  node: ViewEventNodeSnapshot;
  eventType: ViewEventType;
}): ViewEventSignal {
  return {
    event: input.event,
    node: input.node,
    eventType: input.eventType,
  };
}

export function collectArmedViewEventNodeIds(
  nodes: Array<{
    id: string;
    nodeType?: string;
    lifecyclePhase?: string;
  }>,
  edges: Array<{ source: string; target: string }>,
  eventNodeType: string,
  lifecycleNodeType: string,
  firedPhases: ReadonlySet<string>
): Set<string> {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const armed = new Set<string>();
  for (const node of nodes) {
    if (node.nodeType !== eventNodeType) continue;
    const registered = edges.some((edge) => {
      if (edge.target !== node.id) return false;
      const source = byId.get(edge.source);
      if (!source || source.nodeType !== lifecycleNodeType) return false;
      const phase = source.lifecyclePhase || "mounted";
      return firedPhases.has(phase);
    });
    if (registered) armed.add(node.id);
  }
  return armed;
}

/** 仅收集已由生命周期注册的事件节点绑定 */
export function collectArmedViewEventBindings(
  nodes: Array<{
    id: string;
    nodeType?: string;
    lifecyclePhase?: string;
    viewElementIds?: string[];
    eventConfig?: Partial<ViewEventNodeConfig> | null;
  }>,
  edges: Array<{ source: string; target: string }>,
  eventNodeType: string,
  lifecycleNodeType: string,
  firedPhases: ReadonlySet<string>
): Map<string, Set<ViewEventType>> {
  const armed = collectArmedViewEventNodeIds(
    nodes,
    edges,
    eventNodeType,
    lifecycleNodeType,
    firedPhases
  );
  return collectViewEventBindings(nodes, eventNodeType, armed);
}

export function collectViewEventBindings(
  nodes: Array<{
    id?: string;
    nodeType?: string;
    viewElementIds?: string[];
    eventConfig?: Partial<ViewEventNodeConfig> | null;
  }>,
  eventNodeType: string,
  armedNodeIds?: ReadonlySet<string>
): Map<string, Set<ViewEventType>> {
  const map = new Map<string, Set<ViewEventType>>();
  for (const node of nodes) {
    if (node.nodeType !== eventNodeType) continue;
    if (armedNodeIds && (!node.id || !armedNodeIds.has(node.id))) continue;
    const types = normalizeViewEventConfig(node.eventConfig).eventTypes;
    for (const id of node.viewElementIds ?? []) {
      if (!id) continue;
      let set = map.get(id);
      if (!set) {
        set = new Set();
        map.set(id, set);
      }
      for (const type of types) set.add(type);
    }
  }
  return map;
}
