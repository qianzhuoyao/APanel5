import type { Edge } from "@xyflow/react";

import type { BlueprintGraphEdge } from "./document";
import { syncEdgesFromFlow, toReactFlowEdges } from "./react-flow-adapter";
import type { BlueprintGraph } from "./blueprint-graph";

/** 边线描边（写入 edge.style；使用 hex 避免 SVG style 解析 hsl 异常） */
export const BP_EDGE_STYLE = {
  stroke: "#2563eb",
  strokeWidth: 2.5,
} as const;

export const BP_FLOW_EDGE_TYPE = "blueprintSmooth" as const;

export function flowEdgesToGraphEdges(flowEdges: Edge[]): BlueprintGraphEdge[] {
  return syncEdgesFromFlow(
    flowEdges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle ?? "out",
      targetHandle: e.targetHandle ?? "in",
    }))
  );
}

export function graphToFlowEdges(graph: BlueprintGraph): Edge[] {
  return normalizeFlowEdges(toReactFlowEdges(graph.document) as Edge[]);
}

export function edgeListSignature(edges: { id: string }[]): string {
  return edges
    .map((e) => e.id)
    .sort()
    .join(",");
}

function edgeConnectionKey(edge: {
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}): string {
  return `${edge.source}|${edge.sourceHandle ?? "out"}|${edge.target}|${edge.targetHandle ?? "in"}`;
}

/** 避免 onConnect 与 onEdgesChange 各加一条时重复 */
export function dedupeFlowEdges(edges: Edge[]): Edge[] {
  const seen = new Set<string>();
  const out: Edge[] = [];
  for (const e of edges) {
    const key = edgeConnectionKey(e);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  return out;
}

export function normalizeFlowEdges(edges: Edge[]): Edge[] {
  return dedupeFlowEdges(edges).map((e) => ({
    ...e,
    type: BP_FLOW_EDGE_TYPE,
    zIndex: 1000,
    style: { ...BP_EDGE_STYLE },
  })) as Edge[];
}
