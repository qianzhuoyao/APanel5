<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { Button, Checkbox, Input, Tooltip } from "ant-design-vue";
import {
  PAGE_LIFECYCLE_LABELS,
  type ExecutionTraceEntry,
  type PageLifecyclePhase,
} from "@arronqzy/blueprint-dsl";

import type { ExecutionLogSettings } from "../library/execution-log-settings";
import { cn } from "../utils/cn";

export type BlueprintExecutionLogPanelProps = {
  entries: ExecutionTraceEntry[];
  settings: ExecutionLogSettings;
  onUpdateSettings: (patch: Partial<ExecutionLogSettings>) => void;
  onSave: () => void;
  onExport: () => void;
  onClear: () => void;
  onClearAllSaved?: () => void | Promise<void>;
  onApplyRetention: () => void;
  hasSavedRuns?: boolean;
  lifecyclePhase?: string;
};

const props = withDefaults(defineProps<BlueprintExecutionLogPanelProps>(), {
  hasSavedRuns: false,
});

const scrollRef = ref<HTMLDivElement | null>(null);
const bottomRef = ref<HTMLDivElement | null>(null);
const prevEntryCount = ref(props.entries.length);
const stickToBottom = ref(true);
const hasNewBelow = ref(false);

const SCROLL_BOTTOM_THRESHOLD = 48;

function isScrollNearBottom(element: HTMLElement) {
  return (
    element.scrollHeight - element.scrollTop - element.clientHeight <=
    SCROLL_BOTTOM_THRESHOLD
  );
}

function formatJson(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

const phaseLabel = computed(() => {
  if (!props.lifecyclePhase) return null;
  return (
    PAGE_LIFECYCLE_LABELS[props.lifecyclePhase as PageLifecyclePhase] ??
    props.lifecyclePhase
  );
});

const latestEntryPreview = computed(() => {
  const latest = props.entries[props.entries.length - 1];
  if (!latest) return "";
  return latest.nodeLabel ?? latest.nodeId;
});

async function scrollToBottom(behavior: ScrollBehavior = "smooth") {
  await nextTick();
  bottomRef.value?.scrollIntoView({ behavior, block: "end" });
  stickToBottom.value = true;
  hasNewBelow.value = false;
}

function handleScroll() {
  const el = scrollRef.value;
  if (!el) return;
  const nearBottom = isScrollNearBottom(el);
  stickToBottom.value = nearBottom;
  if (nearBottom) {
    hasNewBelow.value = false;
  }
}

watch(
  () => props.entries,
  (entries) => {
    const prevCount = prevEntryCount.value;
    prevEntryCount.value = entries.length;

    if (entries.length === 0) {
      hasNewBelow.value = false;
      stickToBottom.value = true;
      return;
    }

    if (entries.length <= prevCount) return;

    if (stickToBottom.value) {
      void scrollToBottom(prevCount === 0 ? "auto" : "smooth");
      return;
    }

    hasNewBelow.value = true;
  },
  { deep: true }
);
</script>

<template>
  <div class="flex h-full min-h-0 flex-col overflow-hidden bg-background text-foreground">
    <div class="shrink-0 border-b border-border px-3 py-2">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <div class="text-xs font-semibold">蓝图任务输出日志</div>
          <div class="mt-0.5 text-[11px] text-muted-foreground">
            {{ phaseLabel ? `模拟场景：${phaseLabel}` : "选择生命周期节点并开始调试" }}
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-1">
          <Tooltip
            v-if="onClearAllSaved"
            title="立即清空 IndexedDB 中所有已保存的蓝图执行日志"
          >
            <Button
              size="small"
              class="h-7 w-7 shrink-0"
              aria-label="清空 IndexedDB 日志"
              :disabled="!hasSavedRuns"
              @click="() => void onClearAllSaved?.()"
            >
              🗄✕
            </Button>
          </Tooltip>
          <Tooltip title="清空当前日志，并重置画布执行高亮">
            <Button
              size="small"
              class="h-7 w-7 shrink-0"
              aria-label="清空日志"
              :disabled="entries.length === 0"
              @click="onClear"
            >
              🗑
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>

    <div class="relative min-h-0 flex-1">
      <div ref="scrollRef" class="h-full overflow-auto p-3" @scroll="handleScroll">
        <p v-if="entries.length === 0" class="text-[11px] text-muted-foreground">
          暂无执行记录。使用工具栏「走完全流程」或「下一步」开始模拟。
        </p>
        <div v-else class="space-y-0">
          <div v-for="(entry, index) in entries" :key="entry.id">
            <div class="rounded-md border border-border/70 bg-muted/20 p-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <div class="text-xs font-medium text-foreground">
                    {{ entry.nodeLabel ?? entry.nodeId }}
                  </div>
                  <div class="mt-0.5 font-mono text-[10px] text-muted-foreground">
                    {{ entry.nodeType }} · {{ entry.nodeId }}
                  </div>
                </div>
                <time class="shrink-0 text-[10px] text-muted-foreground">
                  {{ entry.isoTime }}
                </time>
              </div>

              <div class="mt-2 grid gap-2">
                <div>
                  <div class="mb-1 text-[10px] font-medium text-muted-foreground">输入</div>
                  <pre
                    class="max-h-32 overflow-auto rounded border border-border/60 bg-background p-2 font-mono text-[10px] leading-relaxed text-foreground"
                  >{{ formatJson(entry.inputs) }}</pre>
                </div>
                <div>
                  <div class="mb-1 text-[10px] font-medium text-muted-foreground">输出</div>
                  <pre
                    class="max-h-32 overflow-auto rounded border p-2 font-mono text-[10px] leading-relaxed"
                    :class="
                      cn(
                        entry.error
                          ? 'border-destructive/40 bg-destructive/5 text-destructive'
                          : 'border-border/60 bg-background text-foreground'
                      )
                    "
                  >{{ entry.error ?? formatJson(entry.outputs) }}</pre>
                </div>
              </div>
            </div>
            <div
              v-if="index < entries.length - 1"
              class="flex justify-center py-1 text-muted-foreground"
            >
              ↓
            </div>
          </div>
        </div>
        <div ref="bottomRef" class="h-px shrink-0" aria-hidden="true" />
      </div>

      <div
        v-if="hasNewBelow"
        class="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center px-3"
      >
        <button
          type="button"
          class="pointer-events-auto inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary/30 bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground shadow-md transition hover:bg-primary/90"
          @click="() => void scrollToBottom('smooth')"
        >
          <span class="shrink-0">↓</span>
          <span class="truncate">有新日志</span>
          <span v-if="latestEntryPreview" class="truncate opacity-90">
            · {{ latestEntryPreview }}
          </span>
        </button>
      </div>
    </div>

    <div class="shrink-0 space-y-2 border-t border-border p-3 text-xs">
      <div class="grid grid-cols-2 gap-2">
        <Tooltip title="将当前调试日志保存到 IndexedDB">
          <Button size="small" block :disabled="entries.length === 0" @click="onSave">
            保存日志
          </Button>
        </Tooltip>
        <Tooltip title="将当前调试日志导出为 JSON 文件">
          <Button size="small" block :disabled="entries.length === 0" @click="onExport">
            导出 JSON
          </Button>
        </Tooltip>
      </div>

      <Tooltip title="调试运行完成后，自动将日志写入 IndexedDB">
        <label class="flex cursor-default items-center gap-2">
          <Checkbox
            :checked="settings.autoSave"
            @update:checked="(v) => onUpdateSettings({ autoSave: Boolean(v) })"
          />
          <span class="text-[11px] text-muted-foreground">
            运行完成后自动保存到 IndexedDB
          </span>
        </label>
      </Tooltip>

      <div class="grid grid-cols-2 gap-2">
        <Tooltip title="IndexedDB 中最多保留的日志条数，超出后自动删除最旧记录">
          <div class="space-y-1">
            <span class="text-[11px] text-muted-foreground">最多保存条数</span>
            <Input
              type="number"
              size="small"
              :min="1"
              :step="1"
              :value="settings.maxSavedRuns"
              aria-label="IndexedDB 最多保存日志条数"
              @update:value="
                (v) =>
                  onUpdateSettings({
                    maxSavedRuns: Math.max(1, Number(v) || 1),
                  })
              "
            />
          </div>
        </Tooltip>
        <Tooltip title="超过保留天数的已保存日志将在清理时被删除">
          <div class="space-y-1">
            <span class="text-[11px] text-muted-foreground">保留天数</span>
            <Input
              type="number"
              size="small"
              :min="1"
              :step="1"
              :value="settings.retentionDays"
              aria-label="日志保留天数"
              @update:value="
                (v) =>
                  onUpdateSettings({
                    retentionDays: Math.max(1, Number(v) || 1),
                  })
              "
            />
          </div>
        </Tooltip>
      </div>

      <Tooltip title="按保留天数与条数上限，清理 IndexedDB 中的日志记录">
        <Button size="small" block @click="onApplyRetention">清理过期与超额</Button>
      </Tooltip>
    </div>
  </div>
</template>
