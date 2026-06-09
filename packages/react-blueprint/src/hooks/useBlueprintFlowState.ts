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
import { sanitizeBlueprintDocument } from "../graph/document";
import {
  applyFlowNodePositions,
  BP_EDGE_STYLE,
  BP_FLOW_EDGE_TYPE,
  edgeListSignature,
  flowEdgesToGraphEdges,
  graphToFlowEdges,
  graphToFlowNodes,
  mergeMeasuredFlowNodes,
  nodeStructureSignature,
  normalizeFlowEdges,
  resolveConnection,
  type BlueprintFlowNodeData,
} from "../graph";

type UseBlueprintFlowStateOptions = {
  graph: BlueprintGraph;
  selectedNodeId: string | null;
  libraryNameById?: ReadonlyMap<string, string>;
  onGraphChange: (updater: (prev: BlueprintGraph) => BlueprintGraph) => void;
  onSelectNode?: (nodeId: string | null) => void;
};

export function useBlueprintFlowState({
  graph,
  selectedNodeId,
  libraryNameById,
  onGraphChange,
  onSelectNode,
}: UseBlueprintFlowStateOptions) {
  const { getNodes } = useReactFlow();
  const nodeSigRef = useRef(nodeStructureSignature(graph.document.nodes));
  const edgeSigRef = useRef(edgeListSignature(graph.document.edges));
  const selectedIdRef = useRef(selectedNodeId);

  const [nodes, setNodes, onNodesChangeRf] = useNodesState(
    graphToFlowNodes(graph, selectedNodeId, libraryNameById)
  );
  const [edges, setEdges, onEdgesChangeRf] = useEdgesState(
    graphToFlowEdges(graph)
  );

  useEffect(() => {
    onGraphChange((prev) => {
      const sanitized = sanitizeBlueprintDocument(prev.document);
      const edgesChanged = sanitized.edges.length !== prev.document.edges.length;
      const nodesChanged = sanitized.nodes.some((node, index) => {
        const before = prev.document.nodes[index];
        return before && node.configSource !== before.configSource;
      });
      if (!edgesChanged && !nodesChanged) return prev;
      return prev.withDocument(sanitized);
    });
  }, [onGraphChange]);

  const nodeStructureSig = useMemo(
    () => nodeStructureSignature(graph.document.nodes),
    [graph.document.nodes]
  );
  const edgeIdSig = useMemo(
    () => edgeListSignature(graph.document.edges),
    [graph.document.edges]
  );

  useEffect(() => {
    if (nodeStructureSig === nodeSigRef.current) return;
    nodeSigRef.current = nodeStructureSig;
    setNodes((prev) =>
      mergeMeasuredFlowNodes(
        graphToFlowNodes(graph, selectedIdRef.current, libraryNameById),
        prev as Node<BlueprintFlowNodeData>[]
      )
    );
  }, [nodeStructureSig, graph, libraryNameById, setNodes]);

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

  useEffect(() => {
    if (!libraryNameById) return;
    setNodes((nds) => {
      let changed = false;
      const next = nds.map((n) => {
        const data = n.data as BlueprintFlowNodeData;
        const libraryBlueprintLabel = data.libraryBlueprintId
          ? libraryNameById.get(data.libraryBlueprintId)
          : undefined;
        if (data.libraryBlueprintLabel === libraryBlueprintLabel) return n;
        changed = true;
        return {
          ...n,
          data: { ...data, libraryBlueprintLabel },
        };
      });
      return changed ? next : nds;
    });
  }, [libraryNameById, setNodes]);

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

      const rfNodes = getNodes() as Node<BlueprintFlowNodeData>[];
      const nodeIds = new Set(rfNodes.map((n) => n.id));
      if (!nodeIds.has(connection.source) || !nodeIds.has(connection.target)) {
        return false;
      }

      const targetNode = rfNodes.find((n) => n.id === connection.target);
      // 生命周期节点无输入口，禁止连入
      if (targetNode?.data.role === "lifecycle") {
        return false;
      }

      return true;
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
