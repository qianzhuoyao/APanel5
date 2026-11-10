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
const showExclusiveStatus = Boolean(nodeData.lifecycleExclusive);
const isEnabled = nodeData.lifecycleEnabled !== false;
</script>

<template>
  <div
    :class="
      cn(
        'bp-node bp-node--lifecycle relative',
        nodeData.isSelected && 'bp-node--selected',
        executionTone === 'success' && 'bp-node--execution-true',
        executionTone === 'error' && 'bp-node--execution-false',
        showExclusiveStatus && !isEnabled && 'opacity-70'
      )
    "
  >
    <BlueprintNodeCard
      :node-id="props.id"
      :label="nodeData.label"
      :meta="resolveBlueprintNodeTypeLabel(nodeData, t)"
      :subtitle="resolveBlueprintNodeSummary(nodeData, t)"
      variant="lifecycle"
      :selected="Boolean(nodeData.isSelected)"
      hide-leading-dot
      @select="onSelect"
    />
    <span
      v-if="showExclusiveStatus"
      :class="
        cn(
          'pointer-events-none absolute right-1.5 top-1.5 rounded px-1 py-0.5 text-[10px] font-medium leading-none',
          isEnabled
            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
            : 'bg-muted text-muted-foreground'
        )
      "
    >
      {{
        isEnabled
          ? t("blueprint.config.lifecycleStatusEnabled")
          : t("blueprint.config.lifecycleStatusDisabled")
      }}
    </span>
    <Handle
      type="source"
      :position="Position.Right"
      id="out"
      class="bp-flow-handle bp-flow-handle--source"
      :title="t('blueprint.node.lifecycleOut')"
    />
  </div>
</template>
