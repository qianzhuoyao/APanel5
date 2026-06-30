<script setup lang="ts">
import { computed, ref } from "vue";
import { validateJsonString } from "@arronqzy/blueprint-dsl";
import type { JsonNodeConfig } from "@arronqzy/blueprint-dsl";

import type { BlueprintGraphNode } from "../graph/document";
import { resolveNodeJsonConfig } from "../graph/document";

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
    <div class="font-medium text-foreground">JSON 节点</div>
    <p class="text-[11px] text-muted-foreground">
      收到<strong>真信号</strong>后，将下方 JSON 解析为 JavaScript object（或
      array）并从输出口发出<strong>真信号</strong>；解析失败则发出
      <strong>假信号</strong>。
    </p>

    <label class="block space-y-1">
      <span class="text-muted-foreground">JSON 内容</span>
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
        JSON 格式错误：{{ parseError }}
      </p>
      <p v-else class="text-[11px] text-muted-foreground">JSON 格式正确</p>
    </label>
  </div>
</template>
