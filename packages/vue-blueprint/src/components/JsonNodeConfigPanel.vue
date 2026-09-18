<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed, ref } from "vue";
import type {
  ExecutionTraceEntry,
  JsonErrorRange,
  JsonNodeConfig,
} from "@arronqzy/blueprint-dsl";
import {
  latestTraceOutputsByNode,
  resolveFetchIncomingScope,
  resolveFetchScopeAutocompleteRoot,
  validateJsonStringAllowingScope,
} from "@arronqzy/blueprint-dsl";

import ConfigHintIcon from "./ConfigHintIcon.vue";
import JsonLintTextarea from "./JsonLintTextarea.vue";
import ScopeTemplateAutocompleteHost from "./ScopeTemplateAutocompleteHost.vue";
import type { BlueprintGraphEdge, BlueprintGraphNode } from "../graph/document";
import { resolveNodeJsonConfig } from "../graph/document";

const { t } = useI18n();

export type JsonNodeConfigPanelProps = {
  node: BlueprintGraphNode;
  graphNodes?: BlueprintGraphNode[];
  graphEdges?: BlueprintGraphEdge[];
  traceEntries?: ExecutionTraceEntry[];
  onUpdateNode: (
    nodeId: string,
    patch: Partial<Pick<BlueprintGraphNode, "jsonConfig" | "configSource">>
  ) => void;
};

const props = withDefaults(defineProps<JsonNodeConfigPanelProps>(), {
  graphNodes: () => [],
  graphEdges: () => [],
  traceEntries: () => [],
});

const formRef = ref<HTMLDivElement | null>(null);
const draftError = ref<string | null>(null);
const draftRanges = ref<JsonErrorRange[] | null>(null);

function patchJsonConfig(node: BlueprintGraphNode, patch: Partial<JsonNodeConfig>) {
  return {
    jsonConfig: { ...resolveNodeJsonConfig(node), ...patch },
    configSource: "json" as const,
  };
}

const jsonConfig = computed(() => resolveNodeJsonConfig(props.node));

const incomingScope = computed(() => {
  const outputs = latestTraceOutputsByNode(props.traceEntries);
  return resolveFetchIncomingScope({
    fetchNodeId: props.node.id,
    nodes: props.graphNodes,
    edges: props.graphEdges,
    getOutput: (sourceId, port) => outputs[sourceId]?.[port],
  });
});
const autocompleteScope = computed(() =>
  resolveFetchScopeAutocompleteRoot(incomingScope.value)
);

const storedValidation = computed(() =>
  validateJsonStringAllowingScope(jsonConfig.value.jsonString)
);

const parseError = computed(
  () =>
    draftError.value ??
    (storedValidation.value.ok ? null : storedValidation.value.error)
);

const errorRanges = computed<JsonErrorRange[]>(() => {
  if (draftRanges.value) return draftRanges.value;
  if (!storedValidation.value.ok && "ranges" in storedValidation.value) {
    return storedValidation.value.ranges;
  }
  return [];
});

const deferredScope = computed(
  () =>
    storedValidation.value.ok &&
    "deferred" in storedValidation.value &&
    storedValidation.value.deferred === true
);

function handleChange(jsonString: string) {
  const result = validateJsonStringAllowingScope(jsonString);
  draftError.value = result.ok ? null : result.error;
  draftRanges.value = result.ok ? null : result.ranges;
  props.onUpdateNode(props.node.id, patchJsonConfig(props.node, { jsonString }));
}
</script>

<template>
  <div
    ref="formRef"
    class="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5"
  >
    <ScopeTemplateAutocompleteHost :scope="autocompleteScope" :container-ref="formRef" />
    <div class="flex items-center gap-1.5">
      <div class="font-medium text-foreground">{{ t("blueprint.config.jsonTitle") }}</div>
      <ConfigHintIcon :label="t('blueprint.config.jsonTitle')">
        {{ t("blueprint.config.jsonHint") }}
      </ConfigHintIcon>
    </div>

    <label class="block space-y-1">
      <span class="inline-flex items-center gap-1 text-muted-foreground">
        {{ t("blueprint.config.jsonContent") }}
        <ConfigHintIcon :label="t('blueprint.config.jsonContent')">
          {{ t("blueprint.config.jsonScopeHint") }}
        </ConfigHintIcon>
      </span>
      <JsonLintTextarea
        :model-value="jsonConfig.jsonString"
        :ranges="errorRanges"
        :rows="12"
        placeholder='{
  "key": "{scope?.value}"
}'
        @update:model-value="handleChange"
      />
      <p v-if="parseError" class="text-[11px] text-destructive">
        {{ t("blueprint.config.jsonFormatError", { error: parseError }) }}
      </p>
      <p v-else-if="deferredScope" class="text-[11px] text-muted-foreground">
        {{ t("blueprint.config.jsonScopeDeferred") }}
      </p>
      <p v-else class="text-[11px] text-muted-foreground">{{ t("blueprint.config.jsonFormatOk") }}</p>
    </label>
  </div>
</template>
