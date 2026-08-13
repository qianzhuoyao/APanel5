<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { Handle, Position, type NodeProps } from "@vue-flow/core";
import { resolveBlueprintNodeTypeLabel } from "../graph/document";
import { resolveBlueprintNodeSummary } from "../graph/node-summary";
import { useBlueprintNodeSelect } from "../BlueprintCanvasContext";
import { resolveBlueprintNodeExecutionTone } from "../runtime/execution-overlay";
import type { BlueprintFlowNodeData } from "../types";
import BlueprintNodeCard from "./BlueprintNodeCard.vue";
import { cn } from "../utils/cn";

const { t } = useI18n();

const props = defineProps<NodeProps<BlueprintFlowNodeData>>();
const onSelect = useBlueprintNodeSelect();
const nodeData = props.data;
const executionTone = resolveBlueprintNodeExecutionTone(nodeData);
</script>

<template>
  <div
    :class="
      cn(
        'bp-node bp-node--and',
        executionTone === 'success' && 'bp-node--execution-true',
        executionTone === 'error' && 'bp-node--execution-false'
      )
    "
  >
    <Handle
      type="target"
      :position="Position.Left"
      id="inA"
      class="bp-flow-handle bp-flow-handle--target"
      :style="{ top: '35%' }"
      :title="t('blueprint.node.andInA')"
    />
    <Handle
      type="target"
      :position="Position.Left"
      id="inB"
      class="bp-flow-handle bp-flow-handle--target"
      :style="{ top: '65%' }"
      :title="t('blueprint.node.andInB')"
    />
    <BlueprintNodeCard
      :node-id="props.id"
      :label="nodeData.label"
      :meta="resolveBlueprintNodeTypeLabel(nodeData, t)"
      :subtitle="resolveBlueprintNodeSummary(nodeData, t)"
      variant="and"
      :selected="Boolean(nodeData.isSelected)"
      @select="onSelect"
    />
    <Handle
      type="source"
      :position="Position.Right"
      id="out"
      class="bp-flow-handle bp-flow-handle--source"
      :title="t('blueprint.node.andOut')"
    />
  </div>
</template>
