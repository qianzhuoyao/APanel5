<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useI18n } from "@arronqzy/i18n/vue";
import { Button } from "ant-design-vue";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const { t } = useI18n();
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const preRef = ref<HTMLPreElement | null>(null);
const gutterRef = ref<HTMLDivElement | null>(null);

const lines = computed(() => Math.max(1, (props.modelValue || "").split("\n").length));

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightJson(source: string): string {
  const escaped = escapeHtml(source || " ");
  return escaped.replace(
    /("(?:\\.|[^"\\])*")\s*(:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,
    (match, str, colon, boolNull) => {
      if (str != null) {
        if (colon != null) return `<span class="jt-key">${str}</span>${colon}`;
        return `<span class="jt-str">${str}</span>`;
      }
      if (boolNull != null) return `<span class="jt-bool">${boolNull}</span>`;
      return `<span class="jt-num">${match}</span>`;
    }
  );
}

const highlighted = computed(() => highlightJson(props.modelValue));

function syncScroll() {
  const ta = textareaRef.value;
  const pre = preRef.value;
  const gutter = gutterRef.value;
  if (!ta) return;
  if (pre) {
    pre.scrollTop = ta.scrollTop;
    pre.scrollLeft = ta.scrollLeft;
  }
  if (gutter) gutter.scrollTop = ta.scrollTop;
}

function onInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLTextAreaElement).value);
}

function onKeydown(e: KeyboardEvent) {
  if (e.key !== "Tab") return;
  e.preventDefault();
  const el = e.target as HTMLTextAreaElement;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const value = props.modelValue ?? "";
  const next = `${value.slice(0, start)}  ${value.slice(end)}`;
  emit("update:modelValue", next);
  void nextTick(() => {
    el.selectionStart = el.selectionEnd = start + 2;
  });
}

function formatJson() {
  const trimmed = (props.modelValue ?? "").trim();
  if (!trimmed) return;
  try {
    emit("update:modelValue", JSON.stringify(JSON.parse(trimmed), null, 2));
  } catch {
    // ignore
  }
}

watch(
  () => props.modelValue,
  () => {
    void nextTick(syncScroll);
  }
);
</script>

<template>
  <div>
    <div class="mb-2 flex items-center justify-between gap-2">
      <div class="text-[11px] text-gray-500">{{ t("panel.config.tableRowsEditEditorHint") }}</div>
      <Button size="small" @click="formatJson">{{ t("panel.config.tableRowsEditFormat") }}</Button>
    </div>
    <div class="overflow-hidden rounded-lg border border-zinc-700/80 bg-[#0f1419] shadow-inner">
      <div class="flex max-h-[min(62vh,560px)] min-h-[420px]">
        <div
          ref="gutterRef"
          aria-hidden="true"
          class="select-none overflow-hidden border-r border-zinc-800 bg-[#0b1015] px-2 py-3 text-right font-mono text-[12px] leading-5 text-zinc-600"
          style="min-width: 36px"
        >
          <div v-for="n in lines" :key="n">{{ n }}</div>
        </div>
        <div class="relative min-w-0 flex-1">
          <pre
            ref="preRef"
            class="pointer-events-none absolute inset-0 m-0 overflow-auto whitespace-pre p-3 font-mono text-[12.5px] leading-5 text-zinc-200"
            v-html="highlighted + '\n'"
          />
          <textarea
            ref="textareaRef"
            :value="modelValue"
            spellcheck="false"
            class="absolute inset-0 h-full w-full resize-none overflow-auto bg-transparent p-3 font-mono text-[12.5px] leading-5 text-transparent caret-sky-300 outline-none"
            style="-webkit-text-fill-color: transparent"
            :aria-label="t('panel.config.tableRowsEditTitle')"
            @scroll="syncScroll"
            @input="onInput"
            @keydown="onKeydown"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.jt-key) {
  color: #7dd3fc;
}
:deep(.jt-str) {
  color: #86efac;
}
:deep(.jt-num) {
  color: #fcd34d;
}
:deep(.jt-bool) {
  color: #f9a8d4;
}
</style>
