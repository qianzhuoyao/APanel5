<script setup lang="ts">
import { Handle, Position, type NodeProps } from "@vue-flow/core";
import { resolveBlueprintNodeTypeLabel } from "../graph/document";
import { resolveBlueprintNodeSummary } from "../graph/node-summary";
import { useBlueprintNodeSelect } from "../BlueprintCanvasContext";
import { resolveBlueprintNodeExecutionTone } from "../runtime/execution-overlay";
import type { BlueprintFlowNodeData } from "../types";
import BlueprintNodeCard from "./BlueprintNodeCard.vue";
import { cn } from "../utils/cn";

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
      title="输入 A（多连线为或）"
    />
    <Handle
      type="target"
      :position="Position.Left"
      id="inB"
      class="bp-flow-handle bp-flow-handle--target"
      :style="{ top: '65%' }"
      title="输入 B（多连线为或）"
    />
    <BlueprintNodeCard
      :node-id="props.id"
      :label="nodeData.label"
      :meta="resolveBlueprintNodeTypeLabel(nodeData)"
      :subtitle="resolveBlueprintNodeSummary(nodeData)"
      variant="and"
      :selected="Boolean(nodeData.isSelected)"
      @select="onSelect"
    />
    <Handle
      type="source"
      :position="Position.Right"
      id="out"
      class="bp-flow-handle bp-flow-handle--source"
      title="两路均为真时输出真信号"
    />
  </div>
</template>
