<script setup lang="ts">
import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@vue-flow/core";
import { computed } from "vue";

const EDGE_STROKE = "#2563eb";
const EDGE_WIDTH = 2.5;

const props = defineProps<EdgeProps>();

const path = computed(() => {
  const [edgePath] = getSmoothStepPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  });
  return edgePath;
});

const edgeStyle = computed(() => ({
  stroke: EDGE_STROKE,
  strokeWidth: EDGE_WIDTH,
  ...(props.style as Record<string, unknown> | undefined),
}));
</script>

<template>
  <BaseEdge :path="path" class="bp-edge-visible" :style="edgeStyle" />
</template>
