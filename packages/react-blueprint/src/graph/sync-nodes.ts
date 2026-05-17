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

export function graphToFlowNodes(
  graph: BlueprintGraph,
  selectedNodeId: string | null
): Node<BlueprintFlowNodeData>[] {
  const base = toReactFlowNodes(graph.document) as Node<BlueprintFlowNodeData>[];
  return base.map((n) => ({
    ...n,
    selected: false,
    data: {
      ...n.data,
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
