import { addEdge } from "@xyflow/react";

import { BlueprintGraph } from "./graph";
import {
  BP_EDGE_STYLE,
  BP_FLOW_EDGE_TYPE,
  flowEdgesToGraphEdges,
  graphToFlowEdges,
} from "./graph/sync-edges";

/** DevApp 初始图：两个节点 + 一条连线，便于直接验证边是否渲染 */
export function createDevBlueprintGraph(): BlueprintGraph {
  let graph = BlueprintGraph.empty();
  graph = graph.addBlueprintNode({ x: 40, y: 80 }, "节点 A");
  const nodeA = graph.document.nodes[0]!;
  graph = graph.addBlueprintNode({ x: 300, y: 80 }, "节点 B");
  const nodeB = graph.document.nodes[1]!;

  const withEdge = addEdge(
    {
      id: "dev-edge-1",
      source: nodeA.id,
      target: nodeB.id,
      sourceHandle: "out",
      targetHandle: "in",
      type: BP_FLOW_EDGE_TYPE,
      zIndex: 1000,
      style: { ...BP_EDGE_STYLE },
    },
    graphToFlowEdges(graph)
  );

  return graph.replaceEdges(flowEdgesToGraphEdges(withEdge));
}
