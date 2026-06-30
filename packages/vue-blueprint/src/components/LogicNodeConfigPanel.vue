<script setup lang="ts">
import { computed, ref } from "vue";
import { validateLogicSourceCode } from "@arronqzy/blueprint-dsl";
import type { LogicNodeConfig } from "@arronqzy/blueprint-dsl";

import type { BlueprintGraphNode } from "../graph/document";
import { resolveNodeLogicConfig } from "../graph/document";

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
    <div class="font-medium text-foreground">逻辑节点</div>
    <p class="text-[11px] text-muted-foreground">
      收到<strong>真信号</strong>后，将输入数据传入下方 <code>update</code>
      函数并执行；返回值作为<strong>真信号</strong>输出。代码语法错误或运行时报错则发出
      <strong>假信号</strong>（错误信息为输出值）。
    </p>

    <label class="block space-y-1">
      <span class="text-muted-foreground">JavaScript 代码</span>
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
        JavaScript 错误：{{ parseError }}
      </p>
      <p v-else class="text-[11px] text-muted-foreground">JavaScript 语法正确</p>
    </label>
  </div>
</template>
