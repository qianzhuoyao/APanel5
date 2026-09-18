<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "@arronqzy/i18n/vue";
import {
  renderJsonWithErrorHighlights,
  type JsonErrorRange,
} from "@arronqzy/blueprint-dsl";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    ranges?: JsonErrorRange[];
    placeholder?: string;
    rows?: number;
    class?: string;
  }>(),
  {
    ranges: () => [],
    rows: 12,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const { t } = useI18n();
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const highlightedHtml = computed(() =>
  renderJsonWithErrorHighlights(props.modelValue, props.ranges)
);

const rootClass = computed(() =>
  ["space-y-1.5", props.class].filter(Boolean).join(" ")
);

const textareaClass = computed(() =>
  [
    "w-full resize-y rounded-md border border-input bg-background px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary",
    props.ranges.length > 0 ? "border-destructive/60" : "",
  ]
    .filter(Boolean)
    .join(" ")
);

function onInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLTextAreaElement).value);
}

function jumpToFirstError() {
  const ta = textareaRef.value;
  const first = props.ranges[0];
  if (!ta || !first) return;
  ta.focus();
  const start = Math.max(0, first.start);
  const end = Math.max(start, Math.min(props.modelValue.length, first.end));
  ta.setSelectionRange(start, end);
}
</script>

<template>
  <div :class="rootClass">
    <textarea
      ref="textareaRef"
      :value="modelValue"
      :rows="rows"
      spellcheck="false"
      :placeholder="placeholder"
      :class="textareaClass"
      @input="onInput"
    />
    <div v-if="ranges.length > 0" class="space-y-1">
      <div class="flex items-center justify-between gap-2">
        <span class="text-[10px] text-destructive">
          {{ t("blueprint.config.jsonErrorPreviewHint") }}
        </span>
        <button
          type="button"
          class="shrink-0 text-[10px] text-destructive underline-offset-2 hover:underline"
          @click="jumpToFirstError"
        >
          {{ t("blueprint.config.jsonJumpToError") }}
        </button>
      </div>
      <pre
        aria-hidden="true"
        class="max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-md border border-destructive/30 bg-destructive/5 px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground"
        v-html="highlightedHtml || '\n'"
      />
    </div>
  </div>
</template>

<style scoped>
:deep(.json-lint-error) {
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  line-height: inherit;
  color: hsl(var(--destructive, 0 84% 60%));
  background: color-mix(
    in oklab,
    hsl(var(--destructive, 0 84% 60%)) 22%,
    transparent
  );
  border-radius: 2px;
  text-decoration: underline wavy hsl(var(--destructive, 0 84% 60%));
  text-underline-offset: 2px;
}
</style>
