<script setup lang="ts">
import type { BlueprintGraph } from "../graph/blueprint-graph";
import type { BlueprintExecutionOverlay } from "../runtime/execution-overlay";
import BlueprintCanvas from "./BlueprintCanvas.vue";

const props = withDefaults(
  defineProps<{
    style?: Record<string, string | number>;
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
  abortClock: [nodeId: string];
}>();

function onGraphChange(next: BlueprintGraph) {
  emit("graphChange", next);
}

function onSelectNode(nodeId: string | null) {
  props.onSelectNode?.(nodeId);
  emit("selectNode", nodeId);
}

function onAbortClock(nodeId: string) {
  props.onAbortClock?.(nodeId);
  emit("abortClock", nodeId);
}
</script>

<template>
  <div
    data-workspace-region="blueprint"
    class="blueprint-vue-root bp-canvas h-full w-full bg-background text-foreground"
    :style="{
      width: '100%',
      height: '100%',
      minHeight: 0,
      ...style,
    }"
  >
    <BlueprintCanvas
      :graph="graph"
      :selected-node-id="selectedNodeId"
      :execution-overlay="executionOverlay"
      :library-name-by-id="libraryNameById"
      :on-select-node="onSelectNode"
      :on-abort-clock="onAbortClock"
      @graph-change="onGraphChange"
      @select-node="onSelectNode"
    />
  </div>
</template>

<style scoped>
.blueprint-vue-root {
  display: flex;
  flex-direction: column;
  min-height: 240px;
}
</style>
