import type { RunnableGraph } from "@arron/blueprint-dsl";

import type { BlueprintDocument } from "../graph/document";

export function documentToRunnableGraph(
  document: BlueprintDocument,
  options?: {
    libraryNameById?: ReadonlyMap<string, string>;
  }
): RunnableGraph {
  return {
    nodes: document.nodes.map((node) => ({
      id: node.id,
      nodeType: node.nodeType,
      lifecyclePhase: node.lifecyclePhase,
      libraryBlueprintId: node.libraryBlueprintId,
      fetchConfig: node.fetchConfig,
      jsonConfig: node.jsonConfig,
      blueprintName: node.libraryBlueprintId
        ? (options?.libraryNameById?.get(node.libraryBlueprintId) ?? node.label)
        : undefined,
    })),
    edges: document.edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    })),
  };
}
