<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { onMounted, ref, watch } from "vue";
import { useScopeConfig } from "./useScopeConfig";

const { t, locale } = useI18n();
const WARNINGS_COLLAPSE_STORAGE_KEY = "panel:config-scope-warnings-collapsed";

const ctx = useScopeConfig();
const isCollapsed = ref(false);

onMounted(() => {
  const stored = window.localStorage.getItem(WARNINGS_COLLAPSE_STORAGE_KEY);
  if (stored === "1") isCollapsed.value = true;
});

watch(isCollapsed, (next) => {
  window.localStorage.setItem(
    WARNINGS_COLLAPSE_STORAGE_KEY,
    next ? "1" : "0"
  );
});
</script>

<template>
  <div
    v-if="ctx && ctx.warnings.length > 0"
    class="mt-2 border-t border-border/50 pt-2"
  >
    <div class="flex items-center justify-between gap-2">
      <div class="text-[11px] font-medium text-amber-700 dark:text-amber-300">
        {{ t("panel.scope.warningsTitle") }}
        <span
          class="ml-1.5 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold"
        >
          {{ ctx.warnings.length }}
        </span>
      </div>
      <button
        type="button"
        class="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-accent"
        @click="isCollapsed = !isCollapsed"
      >
        {{ isCollapsed ? t("panel.scope.expandWarnings") : t("panel.scope.collapseWarnings") }}
      </button>
    </div>
    <ul
      v-if="!isCollapsed"
      class="mt-2 max-h-[200px] space-y-1 overflow-auto text-[10px] leading-relaxed"
    >
      <li
        v-for="warning in ctx.warnings"
        :key="`${warning.fieldId}-${warning.kind}-${warning.missingPath}-${warning.expression}`"
      >
        <button
          type="button"
          class="w-full rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-left text-amber-800 hover:bg-amber-500/15 dark:text-amber-200"
          @click="ctx.scrollToField(warning.fieldId)"
        >
          {{ warning.message }}
        </button>
      </li>
    </ul>
  </div>
</template>
