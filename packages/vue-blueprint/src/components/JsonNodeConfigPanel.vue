<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed, ref } from "vue";
import { validateJsonString } from "@arronqzy/blueprint-dsl";
import type { JsonNodeConfig } from "@arronqzy/blueprint-dsl";

import ConfigHintIcon from "./ConfigHintIcon.vue";
import type { BlueprintGraphNode } from "../graph/document";
import { resolveNodeJsonConfig } from "../graph/document";

const { t } = useI18n();

export type JsonNodeConfigPanelProps = {
  node: BlueprintGraphNode;
  onUpdateNode: (
    nodeId: string,
    patch: Partial<Pick<BlueprintGraphNode, "jsonConfig" | "configSource">>
  ) => void;
};

const props = defineProps<JsonNodeConfigPanelProps>();

const draftError = ref<string | null>(null);

function patchJsonConfig(node: BlueprintGraphNode, patch: Partial<JsonNodeConfig>) {
  return {
    jsonConfig: { ...resolveNodeJsonConfig(node), ...patch },
    configSource: "json" as const,
  };
}

const jsonConfig = computed(() => resolveNodeJsonConfig(props.node));

const storedValidation = computed(() =>
  validateJsonString(jsonConfig.value.jsonString)
);

const parseError = computed(
  () => draftError.value ?? (storedValidation.value.ok ? null : storedValidation.value.error)
);

function handleChange(event: Event) {
  const jsonString = (event.target as HTMLTextAreaElement).value;
  const result = validateJsonString(jsonString);
  draftError.value = result.ok ? null : result.error;
  props.onUpdateNode(props.node.id, patchJsonConfig(props.node, { jsonString }));
}
</script>

<template>
  <div class="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
    <div class="flex items-center gap-1.5">
      <div class="font-medium text-foreground">{{ t("blueprint.config.jsonTitle") }}</div>
      <ConfigHintIcon :label="t('blueprint.config.jsonTitle')">
        {{ t("blueprint.config.jsonHint") }}
      </ConfigHintIcon>
    </div>

    <label class="block space-y-1">
      <span class="text-muted-foreground">{{ t("blueprint.config.jsonContent") }}</span>
      <textarea
        :value="jsonConfig.jsonString"
        rows="12"
        spellcheck="false"
        class="w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
        placeholder='{
  "key": "value"
}'
        @input="handleChange"
      />
      <p v-if="parseError" class="text-[11px] text-destructive">
        {{ t("blueprint.config.jsonFormatError", { error: parseError }) }}
      </p>
      <p v-else class="text-[11px] text-muted-foreground">{{ t("blueprint.config.jsonFormatOk") }}</p>
    </label>
  </div>
</template>
