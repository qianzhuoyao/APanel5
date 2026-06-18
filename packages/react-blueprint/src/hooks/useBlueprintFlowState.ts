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
import type { BlueprintExecutionOverlay, BlueprintEdgeSignalKind } from "../runtime/execution-overlay";

type UseBlueprintFlowStateOptions = {
  graph: BlueprintGraph;
  selectedNodeId: string | null;
  executionOverlay?: BlueprintExecutionOverlay | null;
  libraryNameById?: ReadonlyMap<string, string>;
  onGraphChange: (updater: (prev: BlueprintGraph) => BlueprintGraph) => void;
  onSelectNode?: (nodeId: string | null) => void;
};

const SIGNAL_EDGE_STROKE = {
  true: "#16a34a",
  false: "#dc2626",
  "clock-green": "#16a34a",
  "clock-blue": "#2563eb",
} as const;

const SIGNAL_EDGE_RESET_MS = 320;

type ActiveEdgePulse = {
  edgeColors: Record<string, BlueprintEdgeSignalKind>;
  timerId: ReturnType<typeof setTimeout>;
};

function withoutEdgeSignals(
  overlay: BlueprintExecutionOverlay,
  edgeIds: Set<string>
): BlueprintExecutionOverlay {
  return {
    ...overlay,
    edgeSignals: Object.fromEntries(
      Object.entries(overlay.edgeSignals).filter(([id]) => !edgeIds.has(id))
    ),
  };
}

function signalEdgeClass(
  kind: BlueprintExecutionOverlay["edgeSignals"][string] | undefined
) {
  if (kind === "true" || kind === "clock-green") return "bp-edge--signal-true";
  if (kind === "clock-blue") return "bp-edge--signal-clock-blue";
  if (kind === "false") return "bp-edge--signal-false";
  return undefined;
}

function signalEdgeStyle(
  kind: BlueprintExecutionOverlay["edgeSignals"][string] | undefined
) {
  if (kind === "true") {
    return { ...BP_EDGE_STYLE, stroke: SIGNAL_EDGE_STROKE.true };
  }
  if (kind === "clock-green") {
    return { ...BP_EDGE_STYLE, stroke: SIGNAL_EDGE_STROKE["clock-green"] };
  }
  if (kind === "clock-blue") {
    return { ...BP_EDGE_STYLE, stroke: SIGNAL_EDGE_STROKE["clock-blue"] };
  }
  if (kind === "false") {
    return { ...BP_EDGE_STYLE, stroke: SIGNAL_EDGE_STROKE.false };
  }
  return { ...BP_EDGE_STYLE };
}

function applyExecutionOverlayToEdges(
  edges: Edge[],
  executionOverlay: BlueprintExecutionOverlay | null
): Edge[] {
  return edges.map((edge) => {
    const signal = executionOverlay?.edgeSignals[edge.id];
    return {
      ...edge,
      className: signalEdgeClass(signal),
      style: signalEdgeStyle(signal),
    };
  });
}

export function useBlueprintFlowState({
  graph,
  selectedNodeId,
  executionOverlay = null,
  libraryNameById,
  onGraphChange,
  onSelectNode,
}: UseBlueprintFlowStateOptions) {
  const { getNodes } = useReactFlow();
  const nodeSigRef = useRef(nodeStructureSignature(graph.document.nodes));
  const edgeSigRef = useRef(edgeListSignature(graph.document.edges));
  const selectedIdRef = useRef(selectedNodeId);
  const executionActiveIdRef = useRef(executionOverlay?.activeNodeId ?? null);
  const executionSignalKindRef = useRef(
    executionOverlay?.activeNodeSignalKind ?? null
  );
  const prevEdgeSignalsRef = useRef<
    BlueprintExecutionOverlay["edgeSignals"]
  >({});
  const prevClockEdgeTicksRef = useRef<Record<string, number>>({});
  const activePulseRef = useRef<ActiveEdgePulse | null>(null);
  const latestOverlayRef = useRef<BlueprintExecutionOverlay | null>(null);

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
    setNodes((prev) => {
      const activeId = executionActiveIdRef.current;
      const merged = mergeMeasuredFlowNodes(
        graphToFlowNodes(graph, selectedIdRef.current, libraryNameById),
        prev as Node<BlueprintFlowNodeData>[]
      );
      return merged.map((n) => ({
        ...n,
        data: {
          ...(n.data as BlueprintFlowNodeData),
          isExecutionActive: n.id === activeId,
          executionSignalKind:
            n.id === activeId ? executionSignalKindRef.current : null,
        },
      }));
    });
  }, [nodeStructureSig, graph, libraryNameById, setNodes]);

  useEffect(() => {
    if (edgeIdSig === edgeSigRef.current) return;
    edgeSigRef.current = edgeIdSig;
    setEdges(applyExecutionOverlayToEdges(graphToFlowEdges(graph), executionOverlay));
  }, [edgeIdSig, executionOverlay, graph, setEdges]);

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
    const activeId = executionOverlay?.activeNodeId ?? null;
    const activeSignalKind = executionOverlay?.activeNodeSignalKind ?? null;
    const clockProgressByNodeId = executionOverlay?.clockNodeProgress ?? {};
    executionActiveIdRef.current = activeId;
    executionSignalKindRef.current = activeSignalKind;

    setNodes((nds) => {
      let changed = false;
      const next = nds.map((n) => {
        const isExecutionActive = n.id === activeId;
        const executionSignalKind = isExecutionActive ? activeSignalKind : null;
        const clockEmitProgress = clockProgressByNodeId[n.id] ?? null;
        const data = n.data as BlueprintFlowNodeData;
        if (
          Boolean(data.isExecutionActive) === isExecutionActive &&
          data.executionSignalKind === executionSignalKind &&
          data.clockEmitProgress?.current === clockEmitProgress?.current &&
          data.clockEmitProgress?.total === clockEmitProgress?.total
        ) {
          return n;
        }
        changed = true;
        return {
          ...n,
          data: {
            ...data,
            isExecutionActive,
            executionSignalKind,
            clockEmitProgress,
          },
        };
      });
      return changed ? next : nds;
    });
  }, [
    executionOverlay?.activeNodeId,
    executionOverlay?.activeNodeSignalKind,
    executionOverlay?.clockNodeProgress,
    setNodes,
  ]);

  useEffect(() => {
    return () => {
      if (activePulseRef.current) {
        clearTimeout(activePulseRef.current.timerId);
      }
    };
  }, []);

  useEffect(() => {
    latestOverlayRef.current = executionOverlay ?? null;
    const nextSignals = executionOverlay?.edgeSignals ?? {};
    const prevSignals = prevEdgeSignalsRef.current;
    const nextClockTicks = executionOverlay?.clockEdgeTicks ?? {};
    const prevClockTicks = prevClockEdgeTicksRef.current;

    const pulseEdgeIds = Object.keys(nextSignals).filter((edgeId) => {
      const prevKind = prevSignals[edgeId];
      if (prevKind === undefined) return false;

      const prevTick = prevClockTicks[edgeId];
      const nextTick = nextClockTicks[edgeId];
      if (
        nextTick !== undefined &&
        prevTick !== undefined &&
        nextTick > prevTick
      ) {
        return true;
      }

      return prevKind !== nextSignals[edgeId];
    });

    prevEdgeSignalsRef.current = { ...nextSignals };
    prevClockEdgeTicksRef.current = { ...nextClockTicks };

    const applyOverlay = (
      overlay: BlueprintExecutionOverlay | null,
      hiddenEdgeIds?: Set<string>
    ) => {
      const effective =
        overlay && hiddenEdgeIds && hiddenEdgeIds.size > 0
          ? withoutEdgeSignals(overlay, hiddenEdgeIds)
          : overlay;
      setEdges((prev) => applyExecutionOverlayToEdges(prev, effective));
    };

    if (!executionOverlay || pulseEdgeIds.length === 0) {
      if (activePulseRef.current) {
        applyOverlay(
          executionOverlay,
          new Set(Object.keys(activePulseRef.current.edgeColors))
        );
        return;
      }
      applyOverlay(executionOverlay);
      return;
    }

    const pulseColors = Object.fromEntries(
      pulseEdgeIds.map((id) => [id, nextSignals[id]!])
    ) as Record<string, BlueprintEdgeSignalKind>;

    if (activePulseRef.current) {
      clearTimeout(activePulseRef.current.timerId);
    }

    applyOverlay(executionOverlay, new Set(pulseEdgeIds));

    const timerId = setTimeout(() => {
      const pending = activePulseRef.current;
      activePulseRef.current = null;
      if (!pending) return;

      setEdges((prev) => {
        const base = latestOverlayRef.current;
        const merged = base
          ? {
              ...base,
              edgeSignals: {
                ...base.edgeSignals,
                ...pending.edgeColors,
              },
            }
          : {
              activeNodeId: null,
              activeNodeSignalKind: null,
              edgeSignals: pending.edgeColors,
            };
        return applyExecutionOverlayToEdges(prev, merged);
      });
    }, SIGNAL_EDGE_RESET_MS);

    activePulseRef.current = { edgeColors: pulseColors, timerId };
  }, [executionOverlay, setEdges]);

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
