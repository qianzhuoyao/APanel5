<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed, ref } from "vue";
import { validateLogicSourceCode } from "@arronqzy/blueprint-dsl";
import type { LogicNodeConfig } from "@arronqzy/blueprint-dsl";

import ConfigHintIcon from "./ConfigHintIcon.vue";
import type { BlueprintGraphNode } from "../graph/document";
import { resolveNodeLogicConfig } from "../graph/document";

const { t } = useI18n();

export type LogicNodeConfigPanelProps = {
  node: BlueprintGraphNode;
  onUpdateNode: (
    nodeId: string,
    patch: Partial<Pick<BlueprintGraphNode, "logicConfig" | "configSource">>
  ) => void;
};

const props = defineProps<LogicNodeConfigPanelProps>();

const draftError = ref<string | null>(null);

function patchLogicConfig(node: BlueprintGraphNode, patch: Partial<LogicNodeConfig>) {
  return {
    logicConfig: { ...resolveNodeLogicConfig(node), ...patch },
    configSource: "logic" as const,
  };
}

const logicConfig = computed(() => resolveNodeLogicConfig(props.node));

const storedValidation = computed(() =>
  validateLogicSourceCode(logicConfig.value.sourceCode)
);

const parseError = computed(
  () => draftError.value ?? (storedValidation.value.ok ? null : storedValidation.value.error)
);

function handleChange(event: Event) {
  const sourceCode = (event.target as HTMLTextAreaElement).value;
  const result = validateLogicSourceCode(sourceCode);
  draftError.value = result.ok ? null : result.error;
  props.onUpdateNode(props.node.id, patchLogicConfig(props.node, { sourceCode }));
}
</script>

<template>
  <div class="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
    <div class="flex items-center gap-1.5">
      <div class="font-medium text-foreground">{{ t("blueprint.config.logicTitle") }}</div>
      <ConfigHintIcon :label="t('blueprint.config.logicTitle')">
        {{ t("blueprint.config.logicHint") }}
      </ConfigHintIcon>
    </div>

    <label class="block space-y-1">
      <span class="text-muted-foreground">{{ t("blueprint.config.jsCode") }}</span>
      <textarea
        :value="logicConfig.sourceCode"
        rows="14"
        spellcheck="false"
        class="w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
        placeholder="function update(input) {
  return input;
}"
        @input="handleChange"
      />
      <p v-if="parseError" class="text-[11px] text-destructive">
        {{ t("blueprint.config.jsError", { error: parseError }) }}
      </p>
      <p v-else class="text-[11px] text-muted-foreground">{{ t("blueprint.config.jsSyntaxOk") }}</p>
    </label>
  </div>
</template>
