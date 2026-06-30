<script setup lang="ts">
import { ref } from "vue";
import {
  formatScopeTemplatePreview,
  resolveScopeTemplatePreview,
} from "../../utils/scope-template-preview";

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
  return Array.isArray(value) ? `数组 · ${value.length} 项` : typeof value;
};
</script>

<template>
  <div class="mt-1 rounded border border-border/60 bg-muted/30">
    <button
      type="button"
      class="flex w-full items-center justify-between gap-2 px-2 py-1 text-left text-[10px] text-muted-foreground hover:bg-accent/40"
      @click="isExpanded = !isExpanded"
    >
      <span class="font-medium text-foreground/80">解析预览</span>
      <span class="shrink-0 text-[10px]">
        {{ previewType() }} · {{ isExpanded ? "收起" : "展开" }}
      </span>
    </button>
    <pre
      v-if="isExpanded"
      class="max-h-28 overflow-auto border-t border-border/50 px-2 py-1.5 font-mono text-[10px] leading-relaxed text-foreground/90 whitespace-pre-wrap break-all"
    >{{ previewText() }}</pre>
  </div>
</template>
