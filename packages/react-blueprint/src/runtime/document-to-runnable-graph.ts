import {
  FETCH_NODE_TYPE,
  type RunnableGraph,
} from "@arronqzy/blueprint-dsl";

import {
  resolveNodeFetchConfig,
  resolveRunnableNodeType,
  resolveViewElementIds,
  type BlueprintDocument,
} from "../graph/document";

export function documentToRunnableGraph(
  document: BlueprintDocument,
  options?: {
    libraryNameById?: ReadonlyMap<string, string>;
  }
): RunnableGraph {
  return {
    nodes: document.nodes.map((node) => {
      const viewElementIds = resolveViewElementIds(node);
      const nodeType = resolveRunnableNodeType(node);
      return {
        id: node.id,
        nodeType,
        lifecyclePhase: node.lifecyclePhase,
        libraryBlueprintId: node.libraryBlueprintId,
        viewElementIds:
          viewElementIds.length > 0 ? viewElementIds : undefined,
        fetchConfig:
          nodeType === FETCH_NODE_TYPE
            ? resolveNodeFetchConfig(node)
            : node.fetchConfig,
        jsonConfig: node.jsonConfig,
        logicConfig: node.logicConfig,
        clockConfig: node.clockConfig,
        blueprintName: node.libraryBlueprintId
          ? (options?.libraryNameById?.get(node.libraryBlueprintId) ??
            node.label)
          : undefined,
      };
    }),
    edges: document.edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    })),
    allowFalseSignalPropagation: document.allowFalseSignalPropagation,
  };
}
