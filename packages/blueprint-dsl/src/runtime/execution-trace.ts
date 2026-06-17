import type { Value } from "../type.js";
import { isFalseSignal, isTrueSignal } from "../node-signal.js";

export type ExecutionTraceEntry = {
  id: string;
  nodeId: string;
  nodeLabel?: string;
  nodeType: string;
  startedAt: number;
  finishedAt: number;
  isoTime: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  error?: string;
  /** 时钟节点第几次 tick（从 1 开始） */
  clockTickIndex?: number;
  /** 时钟节点本次调度总 tick 数 */
  clockTickTotal?: number;
};

export type ExecutionRunRecord = {
  runId: string;
  blueprintId: string | null;
  blueprintName: string;
  lifecycleNodeId: string;
  lifecycleNodeLabel?: string;
  lifecyclePhase?: string;
  startedAt: number;
  finishedAt?: number;
  status: "running" | "completed" | "paused" | "failed";
  entries: ExecutionTraceEntry[];
};

export function serializeTraceValue(value: Value | undefined): unknown {
  if (value === undefined) return undefined;
  if (isTrueSignal(value)) {
    return {
      kind: "true",
      value: value.value,
      isoTime: value.isoTime,
    };
  }
  if (isFalseSignal(value)) {
    return {
      kind: "false",
      error: value.error,
      isoTime: value.isoTime,
    };
  }
  return value;
}

export function createTraceEntryId() {
  return `trace_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
