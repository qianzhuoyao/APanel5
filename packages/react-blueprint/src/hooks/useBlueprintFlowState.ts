import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "@xyflow/react";

import type { BlueprintGraph } from "../graph/blueprint-graph";
import {
  applyFlowNodePositions,
  BP_EDGE_STYLE,
  BP_FLOW_EDGE_TYPE,
  edgeListSignature,
  flowEdgesToGraphEdges,
  graphToFlowEdges,
  graphToFlowNodes,
  mergeMeasuredFlowNodes,
  nodeListSignature,
  normalizeFlowEdges,
  resolveConnection,
  type BlueprintFlowNodeData,
} from "../graph";

type UseBlueprintFlowStateOptions = {
  graph: BlueprintGraph;
  selectedNodeId: string | null;
  onGraphChange: (updater: (prev: BlueprintGraph) => BlueprintGraph) => void;
  onSelectNode?: (nodeId: string | null) => void;
};

export function useBlueprintFlowState({
  graph,
  selectedNodeId,
  onGraphChange,
  onSelectNode,
}: UseBlueprintFlowStateOptions) {
  const { getNodes } = useReactFlow();
  const nodeSigRef = useRef(nodeListSignature(graph.document.nodes));
  const edgeSigRef = useRef(edgeListSignature(graph.document.edges));
  const selectedIdRef = useRef(selectedNodeId);

  const [nodes, setNodes, onNodesChangeRf] = useNodesState(
    graphToFlowNodes(graph, selectedNodeId)
  );
  const [edges, setEdges, onEdgesChangeRf] = useEdgesState(
    graphToFlowEdges(graph)
  );

  const nodeIdSig = useMemo(
    () => nodeListSignature(graph.document.nodes),
    [graph.document.nodes]
  );
  const edgeIdSig = useMemo(
    () => edgeListSignature(graph.document.edges),
    [graph.document.edges]
  );

  useEffect(() => {
    if (nodeIdSig === nodeSigRef.current) return;
    nodeSigRef.current = nodeIdSig;
    setNodes((prev) =>
      mergeMeasuredFlowNodes(
        graphToFlowNodes(graph, selectedIdRef.current),
        prev as Node<BlueprintFlowNodeData>[]
      )
    );
  }, [nodeIdSig, graph, setNodes]);

  useEffect(() => {
    if (edgeIdSig === edgeSigRef.current) return;
    edgeSigRef.current = edgeIdSig;
    setEdges(graphToFlowEdges(graph));
  }, [edgeIdSig, graph, setEdges]);

  useEffect(() => {
    const prevId = selectedIdRef.current;
    if (prevId === selectedNodeId) return;
    selectedIdRef.current = selectedNodeId;

    setNodes((nds) => {
      let changed = false;
      const next = nds.map((n) => {
        const isSelected = n.id === selectedNodeId;
        const wasSelected = Boolean(
          (n.data as BlueprintFlowNodeData).isSelected
        );
        if (wasSelected === isSelected) return n;
        changed = true;
        return {
          ...n,
          data: {
            ...(n.data as BlueprintFlowNodeData),
            isSelected,
          },
        };
      });
      return changed ? next : nds;
    });
  }, [selectedNodeId, setNodes]);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<BlueprintFlowNodeData>>[]) => {
      onNodesChangeRf(changes);

      const removals = changes.filter(
        (c): c is NodeChange & { type: "remove"; id: string } =>
          c.type === "remove"
      );
      if (removals.length === 0) return;

      onGraphChange((prev) => {
        let doc = prev;
        for (const { id } of removals) {
          if (id === selectedIdRef.current) {
            onSelectNode?.(null);
          }
          doc = doc.removeNode(id);
        }
        return doc;
      });
    },
    [onNodesChangeRf, onGraphChange, onSelectNode]
  );

  const onNodeDragStop = useCallback(() => {
    onGraphChange((prev) => applyFlowNodePositions(prev, getNodes()));
  }, [getNodes, onGraphChange]);

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (changes.length === 0) return;
      onEdgesChangeRf(changes);

      const removals = changes.filter(
        (c): c is EdgeChange & { type: "remove"; id: string } => c.type === "remove"
      );
      if (removals.length === 0) return;

      onGraphChange((prev) => {
        let next = prev;
        for (const { id } of removals) {
          next = next.removeEdge(id);
        }
        return next;
      });
    },
    [onEdgesChangeRf, onGraphChange]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const resolved = resolveConnection(
        connection,
        getNodes() as Node<BlueprintFlowNodeData>[]
      );
      if (!resolved?.source || !resolved.target) return;

      onGraphChange((prev) => {
        const current = graphToFlowEdges(prev);
        const exists = current.some(
          (e) =>
            e.source === resolved.source &&
            e.target === resolved.target &&
            (e.sourceHandle ?? "out") === (resolved.sourceHandle ?? "out") &&
            (e.targetHandle ?? "in") === (resolved.targetHandle ?? "in")
        );
        if (exists) return prev;

        const next = normalizeFlowEdges(
          addEdge(
            {
              ...resolved,
              type: BP_FLOW_EDGE_TYPE,
              zIndex: 1000,
              style: { ...BP_EDGE_STYLE },
            },
            current
          )
        );
        return prev.replaceEdges(flowEdgesToGraphEdges(next));
      });
    },
    [getNodes, onGraphChange]
  );

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      if (!connection.source || !connection.target) return false;
      if (connection.source === connection.target) return false;
      const nodeIds = new Set(getNodes().map((n) => n.id));
      return (
        nodeIds.has(connection.source) && nodeIds.has(connection.target)
      );
    },
    [getNodes]
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onNodeDragStop,
    onConnect,
    isValidConnection,
  };
}
