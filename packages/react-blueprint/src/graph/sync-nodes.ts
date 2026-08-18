import type { Connection, Edge, Node } from "@xyflow/react";

import type { BlueprintGraph } from "./blueprint-graph";
import {
  collectPositionUpdates,
  toReactFlowNodes,
  type BlueprintFlowNodeData,
} from "./react-flow-adapter";

/** 从 graph 同步节点时保留 RF 已测量的宽高，否则边无法绘制 */
export function mergeMeasuredFlowNodes<T extends Node>(
  incoming: T[],
  previous: T[]
): T[] {
  const prevById = new Map(previous.map((n) => [n.id, n]));
  return incoming.map((n) => {
    const prev = prevById.get(n.id);
    if (!prev) return n;
    return {
      ...n,
      measured: prev.measured ?? n.measured,
      width: prev.width ?? n.width,
      height: prev.height ?? n.height,
    };
  });
}

export function nodeListSignature(nodes: { id: string }[]): string {
  return nodes
    .map((n) => n.id)
    .sort()
    .join(",");
}

/** 含 role / 配置 / 名称等影响 React Flow 节点展示与端口的字段 */
export function nodeStructureSignature(
  nodes: Array<{
    id: string;
    role: string;
    label: string;
    configSource?: string;
    lifecyclePhase?: string;
    libraryBlueprintId?: string;
    nodeType?: string;
    viewElementId?: string;
    viewElementIds?: string[];
    fetchConfig?: { url?: string; method?: string; apiBaseUrl?: string; swaggerDocsUrl?: string };
    jsonConfig?: { jsonString?: string };
    logicConfig?: { sourceCode?: string };
    clockConfig?: { intervalSeconds?: number; timeFormat?: string; outputCount?: number; emitImmediately?: boolean };
    eventConfig?: { eventTypes?: string[] };
  }>
): string {
  return nodes
    .map(
      (n) =>
        `${n.id}:${n.role}:${n.label}:${n.configSource ?? ""}:${n.lifecyclePhase ?? ""}:${n.libraryBlueprintId ?? ""}:${n.nodeType ?? ""}:${(n.viewElementIds ?? (n.viewElementId ? [n.viewElementId] : [])).join(",")}:${n.fetchConfig?.url ?? ""}:${n.fetchConfig?.method ?? ""}:${n.fetchConfig?.apiBaseUrl ?? ""}:${n.fetchConfig?.swaggerDocsUrl ?? ""}:${n.jsonConfig?.jsonString ?? ""}:${n.logicConfig?.sourceCode ?? ""}:${n.clockConfig?.intervalSeconds ?? ""}:${n.clockConfig?.timeFormat ?? ""}:${n.clockConfig?.outputCount ?? ""}:${n.clockConfig?.emitImmediately ?? ""}:${(n.eventConfig?.eventTypes ?? []).join(",")}`
    )
    .sort()
    .join("|");
}

export function graphToFlowNodes(
  graph: BlueprintGraph,
  selectedNodeId: string | null,
  libraryNameById?: ReadonlyMap<string, string>
): Node<BlueprintFlowNodeData>[] {
  const base = toReactFlowNodes(graph.document) as Node<BlueprintFlowNodeData>[];
  return base.map((n) => ({
    ...n,
    selected: false,
    data: {
      ...n.data,
      libraryBlueprintLabel: n.data.libraryBlueprintId
        ? libraryNameById?.get(n.data.libraryBlueprintId)
        : undefined,
      isSelected: selectedNodeId === n.id,
    },
  }));
}

export function resolveConnection(
  connection: Connection,
  rfNodes: Node<BlueprintFlowNodeData>[]
): Connection | null {
  const nodeIds = new Set(rfNodes.map((n) => n.id));
  const source = connection.source ?? "";
  const target = connection.target ?? "";

  if (!source || !target || source === target) return null;
  if (!nodeIds.has(source) || !nodeIds.has(target)) return null;

  return {
    source,
    target,
    sourceHandle: connection.sourceHandle ?? "out",
    targetHandle: connection.targetHandle ?? "in",
  };
}

export function filterEdgesWithValidNodes(edges: Edge[], nodeIds: Set<string>): Edge[] {
  return edges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));
}

export function applyFlowNodePositions(graph: BlueprintGraph, rfNodes: Node[]) {
  return graph.applyNodePositions(collectPositionUpdates(rfNodes));
}
