/** 页面生命周期阶段 */
export const PAGE_LIFECYCLE_PHASES = [
  "created",
  "beforeMount",
  "mounted",
  "updated",
  "beforeDestroy",
  "destroy",
  "activated",
  "deactivated",
  /** 被其他蓝图的蓝图配置节点引用且收到真信号时触发 */
  "blueprintActivated",
] as const;

export type PageLifecyclePhase = (typeof PAGE_LIFECYCLE_PHASES)[number];

export type LifecycleSignal = {
  /** 触发的生命周期枚举 */
  phase: PageLifecyclePhase;
  /** 触发时刻（Unix 毫秒时间戳） */
  timestamp: number;
  /** ISO 8601 时间字符串，便于下游节点展示或日志 */
  isoTime: string;
};

/** 图内生命周期节点的最小形状（编辑态 / 运行态共用） */
export type LifecycleNodeLike = {
  id: string;
  nodeType?: string;
  role?: string;
  lifecyclePhase?: string;
  /** false = 停用；缺省 / true = 启用 */
  lifecycleEnabled?: boolean;
};

export const PAGE_LIFECYCLE_LABELS: Record<PageLifecyclePhase, string> = {
  created: "已创建 (created)",
  beforeMount: "挂载前 (beforeMount)",
  mounted: "已挂载 (mounted)",
  updated: "已更新 (updated)",
  beforeDestroy: "销毁前 (beforeDestroy)",
  destroy: "已销毁 (destroy)",
  activated: "已激活 (activated)",
  deactivated: "已停用 (deactivated)",
  blueprintActivated: "蓝图激活 (blueprintActivated)",
};

export function createLifecycleSignal(phase: PageLifecyclePhase): LifecycleSignal {
  const timestamp = Date.now();
  return {
    phase,
    timestamp,
    isoTime: new Date(timestamp).toISOString(),
  };
}

export function resolveLifecyclePhase(
  node: Pick<LifecycleNodeLike, "lifecyclePhase">
): PageLifecyclePhase {
  const phase = node.lifecyclePhase;
  if (phase && (PAGE_LIFECYCLE_PHASES as readonly string[]).includes(phase)) {
    return phase as PageLifecyclePhase;
  }
  return "mounted";
}

export function isLifecycleGraphNode(
  node: Pick<LifecycleNodeLike, "nodeType" | "role">,
  lifecycleNodeType = "Lifecycle"
): boolean {
  return node.nodeType === lifecycleNodeType || node.role === "lifecycle";
}

export function listLifecyclePeers<T extends LifecycleNodeLike>(
  nodes: readonly T[],
  phase: string,
  lifecycleNodeType = "Lifecycle"
): T[] {
  return nodes.filter(
    (node) =>
      isLifecycleGraphNode(node, lifecycleNodeType) &&
      resolveLifecyclePhase(node) === phase
  );
}

export function hasDuplicateLifecyclePhase(
  nodes: readonly LifecycleNodeLike[],
  phase: string,
  lifecycleNodeType = "Lifecycle"
): boolean {
  return listLifecyclePeers(nodes, phase, lifecycleNodeType).length > 1;
}

/**
 * 同图同阶段只有 1 个时始终触发；超过 1 个时仅 `lifecycleEnabled !== false` 的节点触发。
 */
export function shouldEmitLifecycleNode(
  node: LifecycleNodeLike,
  nodes: readonly LifecycleNodeLike[],
  lifecycleNodeType = "Lifecycle"
): boolean {
  if (!isLifecycleGraphNode(node, lifecycleNodeType)) return false;
  const peers = listLifecyclePeers(
    nodes,
    resolveLifecyclePhase(node),
    lifecycleNodeType
  );
  if (peers.length <= 1) return true;
  return node.lifecycleEnabled !== false;
}

/** 新增同阶段生命周期节点时的默认启用状态：已有同伴则停用 */
export function defaultLifecycleEnabledForNewNode(
  nodes: readonly LifecycleNodeLike[],
  phase: string,
  lifecycleNodeType = "Lifecycle"
): boolean {
  return listLifecyclePeers(nodes, phase, lifecycleNodeType).length === 0;
}

/**
 * 同阶段互斥整理：
 * - `enabled === true`：启用 focus，停用同阶段其它
 * - `enabled === false`：仅停用 focus
 * - 未指定：每个阶段若多个「开启」，只保留文档顺序中第一个，其余写 false
 */
/** 调试 / 选择：优先 preferred，否则同阶段可发出信号的节点 */
export function findEmittableLifecycleNodeId(
  nodes: readonly LifecycleNodeLike[],
  preferredId?: string | null,
  lifecycleNodeType = "Lifecycle"
): string | null {
  if (preferredId) {
    const preferred = nodes.find((node) => node.id === preferredId);
    if (
      preferred &&
      shouldEmitLifecycleNode(preferred, nodes, lifecycleNodeType)
    ) {
      return preferredId;
    }
    if (preferred && isLifecycleGraphNode(preferred, lifecycleNodeType)) {
      const peer = listLifecyclePeers(
        nodes,
        resolveLifecyclePhase(preferred),
        lifecycleNodeType
      ).find((candidate) =>
        shouldEmitLifecycleNode(candidate, nodes, lifecycleNodeType)
      );
      if (peer) return peer.id;
    }
  }

  const first = nodes.find(
    (node) =>
      isLifecycleGraphNode(node, lifecycleNodeType) &&
      shouldEmitLifecycleNode(node, nodes, lifecycleNodeType)
  );
  return first?.id ?? null;
}

export function reconcileLifecycleEnabled<T extends LifecycleNodeLike>(
  nodes: readonly T[],
  focusNodeId?: string,
  enabled?: boolean,
  lifecycleNodeType = "Lifecycle"
): T[] {
  if (focusNodeId && enabled === true) {
    const focus = nodes.find((node) => node.id === focusNodeId);
    if (!focus || !isLifecycleGraphNode(focus, lifecycleNodeType)) {
      return [...nodes];
    }
    const phase = resolveLifecyclePhase(focus);
    return nodes.map((node) => {
      if (!isLifecycleGraphNode(node, lifecycleNodeType)) return node;
      if (resolveLifecyclePhase(node) !== phase) return node;
      if (node.id === focusNodeId) {
        return node.lifecycleEnabled === true
          ? node
          : { ...node, lifecycleEnabled: true };
      }
      return node.lifecycleEnabled === false
        ? node
        : { ...node, lifecycleEnabled: false };
    });
  }

  if (focusNodeId && enabled === false) {
    return nodes.map((node) =>
      node.id === focusNodeId
        ? node.lifecycleEnabled === false
          ? node
          : { ...node, lifecycleEnabled: false }
        : node
    );
  }

  let next = [...nodes] as T[];
  const phases = new Set(
    nodes
      .filter((node) => isLifecycleGraphNode(node, lifecycleNodeType))
      .map((node) => resolveLifecyclePhase(node))
  );

  for (const phase of phases) {
    const peers = listLifecyclePeers(next, phase, lifecycleNodeType);
    if (peers.length <= 1) continue;
    const enabledPeers = peers.filter((peer) => peer.lifecycleEnabled !== false);
    if (enabledPeers.length === 0) {
      next = next.map((node) => {
        if (!isLifecycleGraphNode(node, lifecycleNodeType)) return node;
        if (resolveLifecyclePhase(node) !== phase) return node;
        return node.lifecycleEnabled === false
          ? node
          : { ...node, lifecycleEnabled: false };
      });
      continue;
    }
    const keepId = enabledPeers[0]!.id;
    next = next.map((node) => {
      if (!isLifecycleGraphNode(node, lifecycleNodeType)) return node;
      if (resolveLifecyclePhase(node) !== phase) return node;
      if (node.id === keepId) {
        return node.lifecycleEnabled === true
          ? node
          : { ...node, lifecycleEnabled: true };
      }
      return node.lifecycleEnabled === false
        ? node
        : { ...node, lifecycleEnabled: false };
    });
  }

  return next;
}
