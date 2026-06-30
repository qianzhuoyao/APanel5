<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";
import BlueprintNodeCard, { type BlueprintNodeCardProps } from "./BlueprintNodeCard.vue";
import type { BlueprintNodeExecutionTone } from "../runtime/execution-overlay";
import { cn } from "../utils/cn";

export type BlueprintNodeShellProps = BlueprintNodeCardProps & {
  selected?: boolean;
  executionTone?: BlueprintNodeExecutionTone | null;
};

const props = withDefaults(defineProps<BlueprintNodeShellProps>(), {
  selected: false,
  executionTone: null,
});

const {
  nodeId,
  label,
  meta,
  subtitle,
  progressLabel,
  variant,
  selected,
  hideLeadingDot,
  executionTone,
} = props;

const emit = defineEmits<{
  select: [nodeId: string];
}>();
</script>

<template>
  <div
    :class="
      cn(
        'bp-node',
        executionTone === 'success' && 'bp-node--execution-true',
        executionTone === 'error' && 'bp-node--execution-false'
      )
    "
  >
    <Handle
      type="target"
      :position="Position.Left"
      id="in"
      class="bp-flow-handle bp-flow-handle--target"
      title="真/假信号输入"
    />
    <BlueprintNodeCard
      :node-id="nodeId"
      :label="label"
      :meta="meta"
      :subtitle="subtitle"
      :progress-label="progressLabel"
      :variant="variant"
      :selected="selected"
      :hide-leading-dot="hideLeadingDot"
      @select="emit('select', $event)"
    />
    <Handle
      type="source"
      :position="Position.Right"
      id="out"
      class="bp-flow-handle bp-flow-handle--source"
      title="真/假信号输出"
    />
  </div>
</template>
