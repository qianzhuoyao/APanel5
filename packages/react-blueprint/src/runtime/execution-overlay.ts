import {
  CLOCK_NODE_TYPE,
  type ExecutionTraceEntry,
} from "@arron/blueprint-dsl";

import type { BlueprintGraph } from "../graph/blueprint-graph";

export type BlueprintNodeSignalKind = "true" | "false";

export type BlueprintEdgeSignalKind = BlueprintNodeSignalKind | "clock-green" | "clock-blue";

export type BlueprintExecutionOverlay = {
  /** 当前执行到的节点（最后一条 trace 对应节点） */
  activeNodeId: string | null;
  /** 当前执行节点的主输出信号类型 */
  activeNodeSignalKind: BlueprintNodeSignalKind | null;
  /** 边 id -> 该边最近一次流出的信号类型 */
  edgeSignals: Record<string, BlueprintEdgeSignalKind>;
  /** 时钟节点输出口连线对应当前 tick（用于同色系再次输出时触发重置动画） */
  clockEdgeTicks?: Record<string, number>;
  /** 时钟节点已发送信号进度（调试用） */
  clockNodeProgress?: Record<string, { current: number; total: number }>;
};

function readOutputSignalKind(value: unknown): BlueprintNodeSignalKind | null {
  if (!value || typeof value !== "object" || !("kind" in value)) return null;
  const kind = (value as { kind: unknown }).kind;
  if (kind === "true" || kind === "false") return kind;
  return null;
}

function resolveOutputEdgeSignalKind(
  entry: ExecutionTraceEntry,
  value: unknown
): BlueprintEdgeSignalKind | null {
  const kind = readOutputSignalKind(value);
  if (!kind) return null;
  // 时钟每次输出真信号时连线均显示为绿色（与其它真信号一致）
  if (entry.nodeType === CLOCK_NODE_TYPE && kind === "true") {
    return "true";
  }
  return kind;
}

function applyClockEdgeTicks(
  graph: BlueprintGraph,
  entry: ExecutionTraceEntry,
  clockEdgeTicks: Record<string, number>
) {
  const tickIndex = entry.clockTickIndex ?? 1;
  for (const edge of graph.document.edges) {
    if (
      edge.source === entry.nodeId &&
      (edge.sourceHandle ?? "out") === "out"
    ) {
      clockEdgeTicks[edge.id] = tickIndex;
    }
  }
}

function findLastClockTraceEntry(
  entries: ExecutionTraceEntry[]
): ExecutionTraceEntry | undefined {
  return [...entries]
    .reverse()
    .find(
      (entry) =>
        entry.nodeType === CLOCK_NODE_TYPE &&
        getTraceEntryOutputKind(entry) === "true"
    );
}

function applyEntryOutputEdgeSignals(
  graph: BlueprintGraph,
  entry: ExecutionTraceEntry,
  edgeSignals: Record<string, BlueprintEdgeSignalKind>
) {
  for (const [port, value] of Object.entries(entry.outputs)) {
    const kind = resolveOutputEdgeSignalKind(entry, value);
    if (!kind) continue;

    for (const edge of graph.document.edges) {
      if (
        edge.source === entry.nodeId &&
        (edge.sourceHandle ?? "out") === port
      ) {
        edgeSignals[edge.id] = kind;
      }
    }
  }
}

export function getTraceEntryOutputKind(
  entry: ExecutionTraceEntry,
  port = "out"
): BlueprintNodeSignalKind | null {
  if (entry.error) return "false";
  return readOutputSignalKind(entry.outputs[port]);
}

export function isTraceHaltedByFalseSignal(
  entries: ExecutionTraceEntry[]
): boolean {
  if (entries.length === 0) return false;
  return getTraceEntryOutputKind(entries[entries.length - 1]!) === "false";
}

export function shouldHaltDebugOnFalseSignal(
  entries: ExecutionTraceEntry[],
  allowFalseSignalPropagation = false
): boolean {
  if (allowFalseSignalPropagation) return false;
  return isTraceHaltedByFalseSignal(entries);
}

export function buildExecutionOverlay(
  graph: BlueprintGraph,
  entries: ExecutionTraceEntry[]
): BlueprintExecutionOverlay | null {
  if (entries.length === 0) return null;

  const lastEntry = entries[entries.length - 1]!;
  const edgeSignals: Record<string, BlueprintEdgeSignalKind> = {};
  const clockEdgeTicks: Record<string, number> = {};

  // 按执行顺序累积各输出口最近一次信号；未再次输出的连线保持变色
  for (const entry of entries) {
    applyEntryOutputEdgeSignals(graph, entry, edgeSignals);
    if (
      entry.nodeType === CLOCK_NODE_TYPE &&
      getTraceEntryOutputKind(entry) === "true"
    ) {
      applyClockEdgeTicks(graph, entry, clockEdgeTicks);
    }
  }

  const lastClockEntry = findLastClockTraceEntry(entries);

  const clockNodeProgress: Record<string, { current: number; total: number }> =
    {};
  if (lastClockEntry) {
    clockNodeProgress[lastClockEntry.nodeId] = {
      current: lastClockEntry.clockTickIndex ?? 1,
      total: lastClockEntry.clockTickTotal ?? 1,
    };
  }

  return {
    activeNodeId: lastEntry.nodeId,
    activeNodeSignalKind: getTraceEntryOutputKind(lastEntry),
    edgeSignals,
    clockEdgeTicks:
      Object.keys(clockEdgeTicks).length > 0 ? clockEdgeTicks : undefined,
    clockNodeProgress:
      Object.keys(clockNodeProgress).length > 0 ? clockNodeProgress : undefined,
  };
}

export type BlueprintNodeExecutionTone = "success" | "error";

export function resolveBlueprintNodeExecutionTone(data: {
  isExecutionActive?: boolean;
  executionSignalKind?: BlueprintNodeSignalKind | null;
}): BlueprintNodeExecutionTone | undefined {
  if (!data.isExecutionActive) return undefined;
  if (data.executionSignalKind === "false") return "error";
  if (data.executionSignalKind === "true") return "success";
  return undefined;
}
