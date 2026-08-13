<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import type { NodeProps } from "@vue-flow/core";
import { resolveBlueprintNodeTypeLabel } from "../graph/document";
import { resolveBlueprintNodeSummary } from "../graph/node-summary";
import { useBlueprintNodeSelect } from "../BlueprintCanvasContext";
import { resolveBlueprintNodeExecutionTone } from "../runtime/execution-overlay";
import type { BlueprintFlowNodeData } from "../types";
import BlueprintNodeShell from "./BlueprintNodeShell.vue";

const { t } = useI18n();

const props = defineProps<NodeProps<BlueprintFlowNodeData>>();
const onSelect = useBlueprintNodeSelect();
const nodeData = props.data;
</script>

<template>
  <BlueprintNodeShell
    :node-id="props.id"
    :label="nodeData.label"
    :meta="resolveBlueprintNodeTypeLabel(nodeData, t)"
    :subtitle="resolveBlueprintNodeSummary(nodeData, t)"
    variant="blueprint"
    :selected="Boolean(nodeData.isSelected)"
    :execution-tone="resolveBlueprintNodeExecutionTone(nodeData)"
    @select="onSelect"
  />
</template>
