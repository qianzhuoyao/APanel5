import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "@vue-flow/core";
import { onBeforeUnmount, ref, watch, type Ref } from "vue";

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
import type {
  BlueprintEdgeSignalKind,
  BlueprintExecutionOverlay,
} from "../runtime/execution-overlay";

type UseBlueprintFlowStateOptions = {
  graph: Ref<BlueprintGraph>;
  selectedNodeId: Ref<string | null>;
  executionOverlay?: Ref<BlueprintExecutionOverlay | null | undefined>;
  libraryNameById?: Ref<ReadonlyMap<string, string> | undefined>;
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
      class: signalEdgeClass(signal),
      style: signalEdgeStyle(signal),
    };
  });
}

export function useBlueprintFlowState({
  graph,
  selectedNodeId,
  executionOverlay,
  libraryNameById,
  onGraphChange,
  onSelectNode,
}: UseBlueprintFlowStateOptions) {
  const nodeSigRef = ref(nodeStructureSignature(graph.value.document.nodes));
  const edgeSigRef = ref(edgeListSignature(graph.value.document.edges));
  const selectedIdRef = ref(selectedNodeId.value);
  const executionActiveIdRef = ref(executionOverlay?.value?.activeNodeId ?? null);
  const executionSignalKindRef = ref(
    executionOverlay?.value?.activeNodeSignalKind ?? null
  );
  const prevEdgeSignalsRef = ref<BlueprintExecutionOverlay["edgeSignals"]>({});
  const prevClockEdgeTicksRef = ref<Record<string, number>>({});
  const activePulseRef = ref<ActiveEdgePulse | null>(null);
  const latestOverlayRef = ref<BlueprintExecutionOverlay | null>(null);

  const nodes = ref<Node<BlueprintFlowNodeData>[]>(
    graphToFlowNodes(
      graph.value,
      selectedNodeId.value,
      libraryNameById?.value
    )
  );
  const edges = ref<Edge[]>(graphToFlowEdges(graph.value));

  watch(
    () => graph.value,
    () => {
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
    },
    { immediate: true, flush: "post" }
  );

  watch(
    () => nodeStructureSignature(graph.value.document.nodes),
    (nodeStructureSig) => {
      if (nodeStructureSig === nodeSigRef.value) return;
      nodeSigRef.value = nodeStructureSig;
      const activeId = executionActiveIdRef.value;
      const merged = mergeMeasuredFlowNodes(
        graphToFlowNodes(
          graph.value,
          selectedIdRef.value,
          libraryNameById?.value
        ),
        nodes.value as Node<BlueprintFlowNodeData>[]
      );
      nodes.value = merged.map((n) => ({
        ...n,
        data: {
          ...(n.data as BlueprintFlowNodeData),
          isExecutionActive: n.id === activeId,
          executionSignalKind:
            n.id === activeId ? executionSignalKindRef.value : null,
        },
      })) as Node<BlueprintFlowNodeData>[];
    }
  );

  watch(
    () => edgeListSignature(graph.value.document.edges),
    (edgeIdSig) => {
      if (edgeIdSig === edgeSigRef.value) return;
      edgeSigRef.value = edgeIdSig;
      edges.value = applyExecutionOverlayToEdges(
        graphToFlowEdges(graph.value),
        executionOverlay?.value ?? null
      );
    }
  );

  watch(
    selectedNodeId,
    (nextSelected) => {
      const prevId = selectedIdRef.value;
      if (prevId === nextSelected) return;
      selectedIdRef.value = nextSelected;

      let changed = false;
      const next = (nodes.value as Node<BlueprintFlowNodeData>[]).map((n) => {
        const isSelected = n.id === nextSelected;
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
      if (changed) nodes.value = next as Node<BlueprintFlowNodeData>[];
    },
    { immediate: true }
  );

  watch(
    () => ({
      activeNodeId: executionOverlay?.value?.activeNodeId ?? null,
      activeNodeSignalKind: executionOverlay?.value?.activeNodeSignalKind ?? null,
      clockNodeProgress: executionOverlay?.value?.clockNodeProgress ?? {},
    }),
    ({ activeNodeId, activeNodeSignalKind, clockNodeProgress }) => {
      executionActiveIdRef.value = activeNodeId;
      executionSignalKindRef.value = activeNodeSignalKind;

      let changed = false;
      const next = (nodes.value as Node<BlueprintFlowNodeData>[]).map((n) => {
        const isExecutionActive = n.id === activeNodeId;
        const executionSignalKind = isExecutionActive ? activeNodeSignalKind : null;
        const clockEmitProgress = clockNodeProgress[n.id] ?? null;
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
      if (changed) nodes.value = next as Node<BlueprintFlowNodeData>[];
    },
    { deep: true, immediate: true }
  );

  onBeforeUnmount(() => {
    if (activePulseRef.value) {
      clearTimeout(activePulseRef.value.timerId);
    }
  });

  watch(
    () => executionOverlay?.value ?? null,
    (overlay) => {
      latestOverlayRef.value = overlay;
      const nextSignals = overlay?.edgeSignals ?? {};
      const prevSignals = prevEdgeSignalsRef.value;
      const nextClockTicks = overlay?.clockEdgeTicks ?? {};
      const prevClockTicks = prevClockEdgeTicksRef.value;

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

      prevEdgeSignalsRef.value = { ...nextSignals };
      prevClockEdgeTicksRef.value = { ...nextClockTicks };

      const applyOverlay = (
        nextOverlay: BlueprintExecutionOverlay | null,
        hiddenEdgeIds?: Set<string>
      ) => {
        const effective =
          nextOverlay && hiddenEdgeIds && hiddenEdgeIds.size > 0
            ? withoutEdgeSignals(nextOverlay, hiddenEdgeIds)
            : nextOverlay;
        edges.value = applyExecutionOverlayToEdges(
          edges.value as Edge[],
          effective
        );
      };

      if (!overlay || pulseEdgeIds.length === 0) {
        if (activePulseRef.value) {
          applyOverlay(
            overlay,
            new Set(Object.keys(activePulseRef.value.edgeColors))
          );
          return;
        }
        applyOverlay(overlay);
        return;
      }

      const pulseColors = Object.fromEntries(
        pulseEdgeIds.map((id) => [id, nextSignals[id]!])
      ) as Record<string, BlueprintEdgeSignalKind>;

      if (activePulseRef.value) {
        clearTimeout(activePulseRef.value.timerId);
      }

      applyOverlay(overlay, new Set(pulseEdgeIds));

      const timerId = setTimeout(() => {
        const pending = activePulseRef.value;
        activePulseRef.value = null;
        if (!pending) return;

        const base = latestOverlayRef.value;
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
        edges.value = applyExecutionOverlayToEdges(edges.value as Edge[], merged);
      }, SIGNAL_EDGE_RESET_MS);

      activePulseRef.value = { edgeColors: pulseColors, timerId };
    },
    { deep: true, immediate: true }
  );

  watch(
    libraryNameById ?? ref(undefined),
    () => {
      if (!libraryNameById?.value) return;
      let changed = false;
      const next = (nodes.value as Node<BlueprintFlowNodeData>[]).map((n) => {
        const data = n.data as BlueprintFlowNodeData;
        const libraryBlueprintLabel = data.libraryBlueprintId
          ? libraryNameById.value?.get(data.libraryBlueprintId)
          : undefined;
        if (data.libraryBlueprintLabel === libraryBlueprintLabel) return n;
        changed = true;
        return {
          ...n,
          data: { ...data, libraryBlueprintLabel },
        };
      });
      if (changed) nodes.value = next as Node<BlueprintFlowNodeData>[];
    },
    { deep: true }
  );

  function onNodesChange(changes: NodeChange[]) {
    nodes.value = applyNodeChanges(changes, nodes.value as never) as Node<BlueprintFlowNodeData>[];

    const removals = changes.filter(
      (c): c is NodeChange & { type: "remove"; id: string } => c.type === "remove"
    );
    if (removals.length === 0) return;

    onGraphChange((prev) => {
      let doc = prev;
      for (const { id } of removals) {
        if (id === selectedIdRef.value) {
          onSelectNode?.(null);
        }
        doc = doc.removeNode(id);
      }
      return doc;
    });
  }

  function onNodeDragStop() {
    onGraphChange((prev) =>
      applyFlowNodePositions(prev, nodes.value as Node[])
    );
  }

  function onEdgesChange(changes: EdgeChange[]) {
    if (changes.length === 0) return;
    edges.value = applyEdgeChanges(changes, edges.value as never) as Edge[];

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
  }

  function onConnect(connection: Connection) {
    const resolved = resolveConnection(
      connection,
      nodes.value as Node<BlueprintFlowNodeData>[]
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
        ) as Edge[]
      );
      return prev.replaceEdges(flowEdgesToGraphEdges(next));
    });
  }

  function isValidConnection(connection: Edge | Connection) {
    if (!connection.source || !connection.target) return false;
    if (connection.source === connection.target) return false;

    const rfNodes = nodes.value as Node<BlueprintFlowNodeData>[];
    const nodeIds = new Set(rfNodes.map((n) => n.id));
    if (!nodeIds.has(connection.source) || !nodeIds.has(connection.target)) {
      return false;
    }

    const targetNode = rfNodes.find((n) => n.id === connection.target);
    if (targetNode?.data?.role === "lifecycle") {
      return false;
    }

    return true;
  }

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
