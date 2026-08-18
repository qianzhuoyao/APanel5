<script setup lang="ts">
import {
  ConnectionMode,
  VueFlow,
  useVueFlow,
  type Edge,
  type Node,
  type NodeMouseEvent,
  type EdgeMouseEvent,
} from "@vue-flow/core";
import { computed, ref, toRef, watch } from "vue";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import "../blueprint.css";

import {
  provideBlueprintCanvasContext,
  syncBlueprintCanvasContext,
} from "../BlueprintCanvasContext";
import { blueprintNodeTypes } from "../blueprintNodeTypes";
import { createBlueprintEdgeTypes } from "../createBlueprintEdgeTypes";
import BlueprintContextMenu, {
  type BlueprintContextMenuState,
} from "./BlueprintContextMenu.vue";
import { BLUEPRINT_DEFAULT_EDGE_OPTIONS } from "../flowDefaults";
import { clientToFlowNodePosition } from "../flowCoordinates";
import type { BlueprintGraph } from "../graph/blueprint-graph";
import type { BlueprintFlowNodeData } from "../graph/vue-flow-adapter";
import { useBlueprintFlowState } from "../composables/useBlueprintFlowState";
import { useBlueprintFlowViewport } from "../composables/useBlueprintFlowViewport";
import type { BlueprintExecutionOverlay } from "../runtime/execution-overlay";

const props = withDefaults(
  defineProps<{
    graph: BlueprintGraph;
    selectedNodeId?: string | null;
    executionOverlay?: BlueprintExecutionOverlay | null;
    libraryNameById?: ReadonlyMap<string, string>;
    onSelectNode?: (nodeId: string | null) => void;
    onAbortClock?: (nodeId: string) => void;
  }>(),
  {
    selectedNodeId: null,
    executionOverlay: null,
  }
);

const emit = defineEmits<{
  graphChange: [graph: BlueprintGraph];
  selectNode: [nodeId: string | null];
}>();

const containerRef = ref<HTMLElement | null>(null);
const menu = ref<BlueprintContextMenuState | null>(null);
const blueprintEdgeTypes = createBlueprintEdgeTypes();

const canvasContext = provideBlueprintCanvasContext({
  onSelectNode: (nodeId) => {
    props.onSelectNode?.(nodeId);
    emit("selectNode", nodeId);
  },
  onAbortClock: props.onAbortClock,
});

watch(
  () => [props.onSelectNode, props.onAbortClock] as const,
  () => {
    syncBlueprintCanvasContext(canvasContext, {
      onSelectNode: (nodeId) => {
        props.onSelectNode?.(nodeId);
        emit("selectNode", nodeId);
      },
      onAbortClock: props.onAbortClock,
    });
  }
);

const graphRef = toRef(props, "graph");
const selectedNodeIdRef = toRef(props, "selectedNodeId");
const executionOverlayRef = toRef(props, "executionOverlay");
const libraryNameByIdRef = toRef(props, "libraryNameById");

const { screenToFlowCoordinate } = useVueFlow();

function applyGraphChange(updater: (prev: BlueprintGraph) => BlueprintGraph) {
  emit("graphChange", updater(props.graph));
}

const flowState = useBlueprintFlowState({
  graph: graphRef,
  selectedNodeId: computed(() => selectedNodeIdRef.value ?? null),
  executionOverlay: executionOverlayRef,
  libraryNameById: libraryNameByIdRef,
  onGraphChange: applyGraphChange,
  onSelectNode: (nodeId) => {
    props.onSelectNode?.(nodeId);
    emit("selectNode", nodeId);
  },
});

const {
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeDragStop,
  onConnect,
  onConnectEnd,
  isValidConnection,
} = flowState;

useBlueprintFlowViewport(containerRef, true);

function onPaneContextMenu(event: MouseEvent) {
  event.preventDefault();
  menu.value = {
    kind: "pane",
    clientX: event.clientX,
    clientY: event.clientY,
  };
}

function onNodeContextMenu({ event, node }: NodeMouseEvent) {
  event.preventDefault();
  const mouse = event as MouseEvent;
  props.onSelectNode?.(node.id);
  emit("selectNode", node.id);
  const data = node.data as BlueprintFlowNodeData;
  menu.value = {
    kind: "node",
    clientX: mouse.clientX,
    clientY: mouse.clientY,
    nodeId: node.id,
    role: data.role,
  };
}

function onEdgeContextMenu({ event, edge }: EdgeMouseEvent) {
  event.preventDefault();
  const mouse = event as MouseEvent;
  menu.value = {
    kind: "edge",
    clientX: mouse.clientX,
    clientY: mouse.clientY,
    edgeId: edge.id,
  };
}

function onEdgeClick() {
  menu.value = null;
}

function onPaneClick() {
  menu.value = null;
  props.onSelectNode?.(null);
  emit("selectNode", null);
}

function handleAddBlueprintNode(clientX: number, clientY: number) {
  const position = clientToFlowNodePosition(
    (point) => screenToFlowCoordinate(point),
    clientX,
    clientY
  );
  applyGraphChange((prev) => prev.addBlueprintNode(position));
}

function handleDeleteNode(nodeId: string) {
  if (nodeId === props.selectedNodeId) {
    props.onSelectNode?.(null);
    emit("selectNode", null);
  }
  applyGraphChange((prev) => prev.removeNode(nodeId));
}

function handleDeleteEdge(edgeId: string) {
  applyGraphChange((prev) => prev.removeEdge(edgeId));
}
</script>

<template>
  <div
    ref="containerRef"
    data-workspace-region="blueprint"
    class="bp-canvas vue-blueprint-canvas h-full w-full"
  >
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      class="bp-flow h-full w-full"
      :node-types="blueprintNodeTypes"
      :edge-types="blueprintEdgeTypes"
      :default-edge-options="BLUEPRINT_DEFAULT_EDGE_OPTIONS"
      :connection-mode="ConnectionMode.Strict"
      :nodes-connectable="true"
      :elements-selectable="true"
      :edges-focusable="true"
      :select-nodes-on-drag="false"
      :elevate-nodes-on-select="false"
      :node-click-distance="8"
      fit-view-on-init
      @nodes-change="onNodesChange"
      @edges-change="onEdgesChange"
      @connect="onConnect"
      @connect-end="onConnectEnd"
      :is-valid-connection="isValidConnection"
      @node-drag-stop="onNodeDragStop"
      @pane-context-menu="onPaneContextMenu"
      @node-context-menu="onNodeContextMenu"
      @edge-context-menu="onEdgeContextMenu"
      @edge-click="onEdgeClick"
      @pane-click="onPaneClick"
    />
    <BlueprintContextMenu
      :menu="menu"
      @close="menu = null"
      @add-blueprint-node="handleAddBlueprintNode"
      @delete-node="handleDeleteNode"
      @delete-edge="handleDeleteEdge"
    />
  </div>
</template>
