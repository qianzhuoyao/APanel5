<script setup lang="ts">
import { formatViewElementScope } from "../utils/scope-template";
import ConfigHintIcon from "./ConfigHintIcon.vue";
import ScopeTemplateUsageHint from "./scope-config/ScopeTemplateUsageHint.vue";
import { onMounted, ref, watch } from "vue";

const SCOPE_COLLAPSE_STORAGE_KEY = "panel:config-scope-collapsed";

const props = defineProps<{
  scope: unknown;
}>();

const isCollapsed = ref(false);
const scopeUpdated = ref(false);
const prevScopeSerialized = ref<string | null>(null);

const themedScrollbarClass =
  "scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/80 [&::-webkit-scrollbar-thumb]:hover:bg-border";

const formattedScope = ref(formatViewElementScope(props.scope));

onMounted(() => {
  const stored = window.localStorage.getItem(SCOPE_COLLAPSE_STORAGE_KEY);
  if (stored === "1") isCollapsed.value = true;
});

watch(isCollapsed, (next) => {
  window.localStorage.setItem(SCOPE_COLLAPSE_STORAGE_KEY, next ? "1" : "0");
});

watch(
  () => props.scope,
  (next) => {
    const serialized = formatViewElementScope(next);
    if (
      prevScopeSerialized.value !== null &&
      prevScopeSerialized.value !== serialized
    ) {
      scopeUpdated.value = true;
    }
    prevScopeSerialized.value = serialized;
    formattedScope.value = serialized;
  },
  { immediate: true }
);
</script>

<template>
  <div class="mt-2 border-t border-border/50 pt-2">
    <div class="flex items-center justify-between gap-2">
      <div class="flex min-w-0 items-center gap-1.5">
        <div class="text-[11px] font-medium text-foreground">Scope 数据</div>
        <ConfigHintIcon label="Scope 模版" content-class="max-w-[380px]">
          <ScopeTemplateUsageHint />
        </ConfigHintIcon>
        <span
          v-if="scopeUpdated"
          class="shrink-0 rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-medium text-sky-700 dark:text-sky-300"
        >
          已更新
        </span>
      </div>
      <button
        type="button"
        class="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-accent"
        @click="isCollapsed = !isCollapsed"
      >
        {{ isCollapsed ? "展开 Scope" : "收起 Scope" }}
      </button>
    </div>
    <pre
      v-if="!isCollapsed"
      :class="`mt-2 max-h-[200px] overflow-auto rounded-md border border-border/70 bg-muted/30 p-2 font-mono text-[10px] leading-relaxed text-foreground ${themedScrollbarClass}`"
    >{{ formattedScope }}</pre>
  </div>
</template>
