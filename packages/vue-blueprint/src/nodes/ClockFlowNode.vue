<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import type { NodeProps } from "@vue-flow/core";
import { computed } from "vue";
import { resolveBlueprintNodeTypeLabel } from "../graph/document";
import { resolveBlueprintNodeSummary } from "../graph/node-summary";
import {
  useBlueprintClockAbort,
  useBlueprintNodeSelect,
  useClockNodeCanAbort,
} from "../BlueprintCanvasContext";
import { resolveBlueprintNodeExecutionTone } from "../runtime/execution-overlay";
import type { BlueprintFlowNodeData } from "../types";
import BlueprintNodeShell from "./BlueprintNodeShell.vue";
import { cn } from "../utils/cn";

const { t } = useI18n();

const props = defineProps<NodeProps<BlueprintFlowNodeData>>();
const onSelect = useBlueprintNodeSelect();
const onAbortClock = useBlueprintClockAbort();
const canAbort = useClockNodeCanAbort(props.id);
const nodeData = props.data;

const progressLabel = computed(() => {
  const progress = nodeData.clockEmitProgress;
  return progress ? `${progress.current}/${progress.total}` : undefined;
});
</script>

<template>
  <div class="relative">
    <BlueprintNodeShell
      :node-id="props.id"
      :label="nodeData.label"
      :meta="resolveBlueprintNodeTypeLabel(nodeData, t)"
      :subtitle="resolveBlueprintNodeSummary(nodeData, t)"
      :progress-label="progressLabel"
      variant="clock"
      :selected="Boolean(nodeData.isSelected)"
      :execution-tone="resolveBlueprintNodeExecutionTone(nodeData)"
      @select="onSelect"
    />
    <button
      v-if="canAbort"
      type="button"
      :class="
        cn(
          'nodrag nopan absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center',
          'rounded border border-rose-500/50 bg-rose-500/15 text-rose-600 shadow-sm',
          'hover:bg-rose-500/25 dark:text-rose-300'
        )
      "
      :title="t('blueprint.node.abortClock')"
      @pointerdown.stop
      @click.stop="onAbortClock(props.id)"
    >
      <svg viewBox="0 0 24 24" class="h-3 w-3" aria-hidden="true">
        <rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" />
      </svg>
    </button>
  </div>
</template>
