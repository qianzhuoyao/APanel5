<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { ref } from "vue";
import {
  formatScopeTemplatePreview,
  resolveScopeTemplatePreview,
} from "../../utils/scope-template-preview";

const { t, locale } = useI18n();

const props = defineProps<{
  template: string;
  scope: unknown;
  fieldId?: string;
}>();

const isExpanded = ref(false);

const previewValue = () =>
  resolveScopeTemplatePreview(props.template, props.scope, props.fieldId);
const previewText = () => formatScopeTemplatePreview(previewValue());
const previewType = () => {
  const value = previewValue();
  return Array.isArray(value) ? t("panel.scope.previewArray", { count: value.length }) : typeof value;
};
</script>

<template>
  <div class="mt-1 rounded border border-border/60 bg-muted/30">
    <button
      type="button"
      class="flex w-full items-center justify-between gap-2 px-2 py-1 text-left text-[10px] text-muted-foreground hover:bg-accent/40"
      @click="isExpanded = !isExpanded"
    >
      <span class="font-medium text-foreground/80">{{ t("panel.scope.previewTitle") }}</span>
      <span class="shrink-0 text-[10px]">
        {{ previewType() }} · {{ isExpanded ? t("panel.scope.collapsePreview") : t("panel.scope.expandPreview") }}
      </span>
    </button>
    <pre
      v-if="isExpanded"
      class="max-h-28 overflow-auto border-t border-border/50 px-2 py-1.5 font-mono text-[10px] leading-relaxed text-foreground/90 whitespace-pre-wrap break-all"
    >{{ previewText() }}</pre>
  </div>
</template>
