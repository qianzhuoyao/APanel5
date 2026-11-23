<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import {
  ASSISTANT_MODEL_OPTIONS,
  DEFAULT_MODEL_ID,
  WebLLMAssistantRuntime,
  isWebGPUAvailable,
  looksLikePureQuestion,
  inferPanelAddFromUserText,
  runAgentLoop,
  tryLocalFaqReply,
  buildChatSystemPrompt,
  buildForceReplyPrompt,
  unwrapChatReply,
  buildPriorChatMessages,
  buildRecentDialogSummary,
  UNCLEAR_INTENT_REPLY,
  inferLocalEditorPlan,
  type ChatMessage,
  type CompactBlueprintEdge,
  type CompactBlueprintNode,
  type CompactPanelElement,
  type InitProgress,
} from "@arronqzy/webllm-assistant";
import type { BlueprintGraph } from "@arronqzy/vue-blueprint";
import { Button, Modal, Select, Textarea } from "ant-design-vue";
import {
  computed,
  nextTick,
  ref,
  shallowRef,
  watch,
  type CSSProperties,
} from "vue";
import { applyAssistantAction, type ApplyAssistantDeps } from "./applyAssistantAction";
import AssistantMarkdown from "./AssistantMarkdown.vue";

type UiMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  steps?: string[];
};

const props = defineProps<{
  deps: ApplyAssistantDeps;
  open: boolean;
}>();

const emit = defineEmits<{
  "update:open": [open: boolean];
}>();

const openModel = computed({
  get: () => props.open,
  set: (v: boolean) => emit("update:open", v),
});

const QUICK_PROMPTS = [
  "panel.ai.quickWhatComponents",
  "panel.ai.quickAddTable",
] as const;

const RECENT_MESSAGE_COUNT = 8;

const userBubbleStyle: CSSProperties = {
  backgroundColor: "hsl(var(--foreground))",
  color: "hsl(var(--background))",
  borderRadius: "18px",
  overflow: "hidden",
};

const assistantBubbleStyle: CSSProperties = {
  backgroundColor: "hsl(var(--muted))",
  color: "hsl(var(--foreground))",
  borderRadius: "18px",
  overflow: "hidden",
};

const messageListStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

function toCompactElements(
  elements: ReturnType<ApplyAssistantDeps["listElements"]>,
  selectedIds: string[]
): CompactPanelElement[] {
  return elements.map((el) => {
    const config: Record<string, unknown> = {};
    if (el.name) config.name = el.name;
    if (el.textHtml) config.textHtml = el.textHtml.slice(0, 160);
    if (el.textColor) config.textColor = el.textColor;
    if (el.textFontSize != null) config.textFontSize = el.textFontSize;
    if (el.style) config.style = el.style;
    if (el.chart) {
      config.chart = {
        title: el.chart.title,
        color: el.chart.color,
      };
    }
    if (el.table) {
      config.table = {
        source: el.table.source,
        emptyText: el.table.emptyText,
        showHeader: el.table.showHeader,
        stripe: el.table.stripe,
        rowHeight: el.table.rowHeight,
        columns: (el.table.columns ?? []).slice(0, 12).map((c) => ({
          field: c.field,
          title: c.title,
          widget: c.widget,
          width: c.width,
        })),
        rowsText:
          typeof el.table.rowsText === "string"
            ? el.table.rowsText.length > 400
              ? `${el.table.rowsText.slice(0, 400)}…`
              : el.table.rowsText
            : undefined,
      };
    }
    if (el.geometryShape) config.geometryShape = el.geometryShape;
    if (el.geometryColor) config.geometryColor = el.geometryColor;
    return {
      id: el.id,
      materialType: el.materialType,
      name: el.name,
      x: el.x,
      y: el.y,
      width: el.width,
      height: el.height,
      textHtml: el.textHtml,
      locked: el.locked,
      zIndex: el.zIndex,
      selected: selectedIds.includes(el.id),
      config: Object.keys(config).length ? config : undefined,
    };
  });
}

function toCompactBlueprint(graph: BlueprintGraph): {
  nodes: CompactBlueprintNode[];
  edges: CompactBlueprintEdge[];
} {
  return {
    nodes: graph.document.nodes.map((n) => ({
      id: n.id,
      role: n.role,
      nodeType: n.nodeType,
      label: n.label,
      parentId: n.parentId,
    })),
    edges: graph.document.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
    })),
  };
}

function looksLikeSimpleAddOnly(text: string): boolean {
  if (!inferPanelAddFromUserText(text)) return false;
  return !/然后|并且|再|保存|选中|改成|设置|宽度|高度|蓝图|图层|预览|主题/.test(text);
}

function formatApplyFail(
  message: string,
  translate: (key: string, params?: Record<string, string | number>) => string
) {
  if (message === "layer_locked_or_add_failed") {
    return translate("panel.ai.layerLockedAddFailed");
  }
  if (message.startsWith("unknown_material:")) {
    return translate("panel.ai.unknownMaterial", {
      type: message.replace("unknown_material:", ""),
    });
  }
  return message;
}

function statusDotClass(tone: "ready" | "loading" | "idle" | "error") {
  if (tone === "ready") return "bg-emerald-500";
  if (tone === "loading") return "bg-amber-400 animate-pulse";
  if (tone === "error") return "bg-destructive";
  return "bg-muted-foreground/40";
}

const { t } = useI18n();

const runtimeRef = shallowRef<WebLLMAssistantRuntime | null>(null);
if (!runtimeRef.value) runtimeRef.value = new WebLLMAssistantRuntime();

const depsRef = shallowRef(props.deps);
watch(
  () => props.deps,
  (d) => {
    depsRef.value = d;
  }
);

const modelId = ref(DEFAULT_MODEL_ID);
const status = ref(runtimeRef.value!.status);
const progress = ref<InitProgress>({ progress: 0, text: "" });
const input = ref("");
const busy = ref(false);
const agentStepHint = ref<string | null>(null);
const historyExpanded = ref(false);
const messages = ref<UiMessage[]>([
  {
    id: "welcome",
    role: "system",
    content: t("panel.ai.welcome"),
  },
]);
const listRef = ref<HTMLDivElement | null>(null);
const messagesRef = shallowRef(messages.value);
watch(
  messages,
  (m) => {
    messagesRef.value = m;
  },
  { deep: true }
);

const webgpuOk = computed(() => isWebGPUAvailable());

const modelSelectOptions = computed(() =>
  ASSISTANT_MODEL_OPTIONS.map((opt) => ({
    value: opt.id,
    label: t(opt.labelKey),
    title: t(opt.hintKey),
  }))
);

function getPriorChat() {
  return buildPriorChatMessages(messagesRef.value, {
    maxTurns: 6,
    maxCharsPerMessage: 480,
  });
}

function getRecentDialog() {
  return buildRecentDialogSummary(messagesRef.value, {
    maxTurns: 4,
    maxCharsPerMessage: 220,
  });
}

async function scrollListToEnd() {
  await nextTick();
  if (!listRef.value) return;
  listRef.value.scrollTop = listRef.value.scrollHeight;
}

watch(
  () => [messages.value, props.open, agentStepHint.value] as const,
  () => {
    void scrollListToEnd();
  },
  { deep: true }
);

async function ensureReady() {
  const runtime = runtimeRef.value!;
  if (runtime.status === "ready" && runtime.currentModelId === modelId.value) {
    status.value = "ready";
    return;
  }
  status.value = "loading";
  await runtime.init(modelId.value, (p) => {
    progress.value = p;
    status.value = "loading";
  });
  status.value = runtime.status;
}

function pushMessage(msg: Omit<UiMessage, "id">) {
  messages.value = [
    ...messages.value,
    { ...msg, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
  ];
}

function buildObservation() {
  const d = depsRef.value;
  const selectedIds = d.getSelectedIds();
  const bp = toCompactBlueprint(d.getBlueprintGraph());
  return {
    elements: toCompactElements(d.listElements(), selectedIds),
    selectedIds,
    blueprintNodes: bp.nodes,
    blueprintEdges: bp.edges,
    layers: d.getLayers(),
    activeLayerId: d.getActiveLayerId(),
    zoom: d.getZoom(),
    blueprintOpen: d.getBlueprintOpen(),
    workspace: d.getWorkspace(),
  };
}

async function send(text: string) {
  const trimmed = text.trim();
  if (!trimmed || busy.value) return;
  if (!webgpuOk.value) {
    pushMessage({ role: "system", content: t("panel.ai.webgpuRequired") });
    return;
  }

  input.value = "";
  const priorChat = getPriorChat();
  const recentDialog = getRecentDialog();
  pushMessage({ role: "user", content: trimmed });
  busy.value = true;
  agentStepHint.value = null;
  try {
    const localFaq = tryLocalFaqReply(trimmed);
    if (localFaq) {
      pushMessage({ role: "assistant", content: localFaq });
      return;
    }

    const selectedIds = depsRef.value.getSelectedIds() ?? [];
    const localPlan = inferLocalEditorPlan(trimmed, { selectedIds });
    if (localPlan) {
      const stepLines: string[] = [];
      for (let i = 0; i < localPlan.actions.length; i += 1) {
        const action = localPlan.actions[i]!;
        if (action.type === "reply") {
          pushMessage({ role: "assistant", content: action.message });
          return;
        }
        agentStepHint.value = t("panel.ai.stepRunning", {
          step: String(i + 1),
          type: action.type,
        });
        const result = await applyAssistantAction(action, depsRef.value);
        stepLines.push(
          t("panel.ai.stepLine", {
            step: String(i + 1),
            type: action.type,
            result: result.ok
              ? result.message
              : `✗ ${formatApplyFail(result.message, t)}`,
          })
        );
        if (!result.ok) {
          pushMessage({
            role: "assistant",
            content: formatApplyFail(result.message, t),
            steps: stepLines.length > 1 ? stepLines : undefined,
          });
          return;
        }
      }
      pushMessage({
        role: "assistant",
        content: localPlan.doneMessage,
        steps: stepLines.length > 1 ? stepLines : undefined,
      });
      return;
    }

    await ensureReady();
    const runtime = runtimeRef.value!;

    if (looksLikePureQuestion(trimmed)) {
      const history: ChatMessage[] = [
        { role: "system", content: buildChatSystemPrompt() },
        ...priorChat,
        { role: "user", content: trimmed },
      ];
      let message = unwrapChatReply(await runtime.chat(history));
      if (!message) {
        history.push({ role: "user", content: buildForceReplyPrompt() });
        message = unwrapChatReply(await runtime.chat(history));
      }
      pushMessage({
        role: "assistant",
        content: message || t("panel.ai.unclearIntent") || UNCLEAR_INTENT_REPLY,
      });
      return;
    }

    const bootstrap = inferPanelAddFromUserText(trimmed);
    const stepLines: string[] = [];

    const loopResult = await runAgentLoop({
      userGoal: trimmed,
      priorChat,
      getObservation: () => ({
        ...buildObservation(),
        recentDialog,
      }),
      chat: (msgs) => runtime.chat(msgs),
      apply: async (action) => applyAssistantAction(action, depsRef.value),
      bootstrapAction: bootstrap,
      finishAfterBootstrap: looksLikeSimpleAddOnly(trimmed),
      onStep: (record) => {
        stepLines.push(
          t("panel.ai.stepLine", {
            step: String(record.step),
            type: record.action.type,
            result: record.resultOk
              ? record.resultMessage
              : `✗ ${formatApplyFail(record.resultMessage, t)}`,
          })
        );
        agentStepHint.value = t("panel.ai.stepRunning", {
          step: String(record.step),
          type: record.action.type,
        });
      },
    });

    agentStepHint.value = null;

    const reasonText =
      loopResult.stoppedReason === "max_steps"
        ? t("panel.ai.stoppedMaxSteps")
        : loopResult.stoppedReason === "fail"
          ? t("panel.ai.stoppedFail")
          : loopResult.stoppedReason === "parse_fail"
            ? t("panel.ai.stoppedParseFail")
            : "";

    const final =
      loopResult.finalMessage ||
      (loopResult.stoppedReason === "done"
        ? t("panel.ai.done")
        : t("panel.ai.applyFailed"));

    pushMessage({
      role: "assistant",
      content: reasonText ? `${final}\n\n_${reasonText}_` : final,
      steps: stepLines.length > 1 ? stepLines.slice(-6) : undefined,
    });
  } catch (err) {
    const code = err instanceof Error ? err.message : String(err);
    if (code === "webgpu_unavailable") {
      status.value = "unsupported";
      pushMessage({ role: "system", content: t("panel.ai.webgpuRequired") });
    } else {
      status.value = runtimeRef.value?.status ?? "error";
      pushMessage({
        role: "system",
        content: `${t("panel.ai.error")}: ${code}`,
      });
    }
  } finally {
    agentStepHint.value = null;
    busy.value = false;
  }
}

async function loadModelOnly() {
  if (!webgpuOk.value) {
    status.value = "unsupported";
    return;
  }
  busy.value = true;
  try {
    await ensureReady();
    pushMessage({ role: "system", content: t("panel.ai.modelReady") });
  } catch (err) {
    pushMessage({
      role: "system",
      content: `${t("panel.ai.error")}: ${err instanceof Error ? err.message : String(err)}`,
    });
  } finally {
    busy.value = false;
  }
}

const visibleMessages = computed(() => {
  const hasUserTurn = messages.value.some((m) => m.role === "user");
  const timeline = hasUserTurn
    ? messages.value.filter((m) => !(m.id === "welcome" && m.role === "system"))
    : messages.value;
  if (historyExpanded.value || timeline.length <= RECENT_MESSAGE_COUNT) {
    return timeline;
  }
  return timeline.slice(-RECENT_MESSAGE_COUNT);
});

const hiddenCount = computed(() => {
  const hasUserTurn = messages.value.some((m) => m.role === "user");
  const timeline = hasUserTurn
    ? messages.value.filter((m) => !(m.id === "welcome" && m.role === "system"))
    : messages.value;
  return Math.max(0, timeline.length - visibleMessages.value.length);
});

const statusTone = computed((): "ready" | "loading" | "idle" | "error" => {
  const s = status.value;
  if (s === "ready") return "ready";
  if (s === "loading") return "loading";
  if (s === "unsupported" || s === "error") return "error";
  return "idle";
});

const statusText = computed(() => {
  const s = status.value;
  if (s === "ready") return t("panel.ai.statusReady");
  if (s === "loading") {
    return t("panel.ai.statusLoading", {
      pct: Math.round((progress.value.progress || 0) * 100),
    });
  }
  if (s === "unsupported") return t("panel.ai.statusUnsupported");
  return t("panel.ai.statusIdle");
});

const isEmptyChat = computed(
  () =>
    visibleMessages.value.every((m) => m.role === "system") && !agentStepHint.value
);

const progressPct = computed(() =>
  Math.max(4, Math.round((progress.value.progress || 0) * 100))
);

function onSubmit() {
  void send(input.value);
}

function onInputKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    void send(input.value);
  }
}

function onQuickPrompt(key: (typeof QUICK_PROMPTS)[number]) {
  void send(t(key));
}
</script>

<template>
  <Modal
    v-model:open="openModel"
    :mask="false"
    :keyboard="false"
    :mask-closable="false"
    :closable="false"
    :footer="null"
    :width="720"
    :z-index="10100"
    wrap-class-name="assistant-chat-modal-wrap"
    class="assistant-chat-modal"
    :body-style="{ padding: 0 }"
  >
    <div
      class="pointer-events-auto flex h-[min(72vh,580px)] w-full max-w-[720px] flex-col gap-0 overflow-hidden rounded-xl border border-border bg-background p-0 text-foreground shadow-2xl"
      :style="{
        display: 'flex',
        flexDirection: 'column',
        height: 'min(72vh, 580px)',
        maxHeight: '72vh',
        backgroundColor: 'hsl(var(--background))',
        isolation: 'isolate',
      }"
    >
      <div
        class="flex h-full min-h-0 w-full flex-col overflow-hidden bg-background"
        :style="{ backgroundColor: 'hsl(var(--background))' }"
      >
        <header
          class="shrink-0 flex flex-row items-center gap-3 border-b border-border bg-background px-4 py-3 text-left"
        >
          <div class="min-w-0 flex-1">
            <h2 class="text-[15px] font-semibold tracking-tight text-foreground">
              {{ t("panel.ai.title") }}
            </h2>
            <p class="mt-0.5 line-clamp-1 text-[12px] text-muted-foreground">
              {{ t("panel.ai.welcome") }}
            </p>
          </div>
          <div class="flex shrink-0 items-center gap-2" data-no-drag>
            <div class="hidden items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 sm:flex">
              <span
                class="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                :class="statusDotClass(statusTone)"
              />
              <span class="text-[11px] text-muted-foreground">{{ statusText }}</span>
            </div>
            <Select
              v-model:value="modelId"
              class="assistant-model-select min-w-[108px]"
              size="small"
              :disabled="busy || status === 'loading'"
              :options="modelSelectOptions"
              :dropdown-match-select-width="false"
            />
            <Button
              v-if="status !== 'ready'"
              type="default"
              size="small"
              class="h-8 rounded-md px-3 text-[12px]"
              :disabled="busy || !webgpuOk"
              @click="loadModelOnly"
            >
              {{ t("panel.ai.downloadModel") }}
            </Button>
            <button
              type="button"
              data-no-drag
              class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
              @click="openModel = false"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </header>

        <div v-if="status === 'loading'" class="h-0.5 shrink-0 overflow-hidden bg-muted">
          <div
            class="h-full bg-primary/70 transition-all"
            :style="{ width: `${progressPct}%` }"
          />
        </div>

        <div
          v-if="!webgpuOk"
          class="shrink-0 border-b border-destructive/20 bg-destructive/10 px-4 py-2 text-[12px] text-destructive"
        >
          {{ t("panel.ai.webgpuRequired") }}
        </div>

        <div
          ref="listRef"
          class="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-background"
          :style="{ backgroundColor: 'hsl(var(--background))' }"
        >
          <div class="mx-auto flex min-h-full w-full max-w-[720px] flex-col px-4 py-4">
            <div
              v-if="isEmptyChat"
              class="flex flex-1 flex-col items-center justify-center gap-5 py-6 text-center"
            >
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-[14px] font-semibold text-foreground"
                aria-hidden
              >
                AI
              </div>
              <div class="space-y-1.5">
                <h2 class="text-[20px] font-semibold tracking-tight text-foreground">
                  {{ t("panel.ai.title") }}
                </h2>
                <p class="mx-auto max-w-[420px] text-[13px] leading-5 text-muted-foreground">
                  {{ t("panel.ai.welcome") }}
                </p>
              </div>
              <div class="flex max-w-[520px] flex-wrap justify-center gap-2">
                <button
                  v-for="key in QUICK_PROMPTS"
                  :key="key"
                  type="button"
                  class="rounded-full border border-border bg-muted/30 px-3.5 py-1.5 text-[12px] text-foreground transition hover:bg-muted disabled:opacity-50"
                  :disabled="busy"
                  data-no-drag
                  @click="onQuickPrompt(key)"
                >
                  {{ t(key) }}
                </button>
              </div>
            </div>
            <div v-else :style="messageListStyle">
              <button
                v-if="hiddenCount > 0"
                type="button"
                class="mx-auto text-[12px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                data-no-drag
                @click="historyExpanded = !historyExpanded"
              >
                {{
                  historyExpanded
                    ? t("panel.ai.historyCollapse")
                    : t("panel.ai.historyExpand", { count: hiddenCount })
                }}
              </button>

              <template v-for="m in visibleMessages" :key="m.id">
                <div
                  v-if="m.role === 'system'"
                  class="mx-auto max-w-[85%] px-3.5 py-2 text-center text-[12px] leading-5 text-muted-foreground"
                  :style="{ backgroundColor: 'hsl(var(--muted))', borderRadius: 16 }"
                >
                  {{ m.content }}
                </div>

                <div
                  v-else-if="m.role === 'user'"
                  class="flex w-full flex-col items-end"
                  :style="{ marginBottom: '2px' }"
                >
                  <div class="flex max-w-[85%] items-end gap-2">
                    <div class="px-4 py-2.5 text-[14px] leading-6 shadow-sm" :style="userBubbleStyle">
                      <p class="whitespace-pre-wrap break-words">{{ m.content }}</p>
                    </div>
                    <div
                      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                      :style="{
                        backgroundColor: 'hsl(var(--foreground))',
                        color: 'hsl(var(--background))',
                      }"
                      aria-hidden
                    >
                      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21a8 8 0 0 0-16 0" />
                        <circle cx="12" cy="8" r="4" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div
                  v-else
                  class="flex w-full flex-col items-start"
                  :style="{ marginBottom: '2px' }"
                >
                  <div class="flex max-w-[90%] items-end gap-2">
                    <div
                      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-[11px] font-semibold text-foreground"
                      aria-hidden
                    >
                      AI
                    </div>
                    <div
                      class="border border-border px-4 py-2.5 shadow-sm"
                      :style="assistantBubbleStyle"
                    >
                      <AssistantMarkdown :content="m.content" />
                      <details
                        v-if="m.steps?.length"
                        class="mt-2 border-t border-border/60 pt-2"
                        data-no-drag
                      >
                        <summary class="cursor-pointer select-none text-[12px] text-muted-foreground hover:text-foreground">
                          {{ t("panel.ai.stepsSummary") }}
                        </summary>
                        <ul class="mt-1.5 space-y-1 border-l border-border pl-2.5 text-[12px] leading-5 text-muted-foreground">
                          <li v-for="(line, i) in m.steps" :key="i">{{ line }}</li>
                        </ul>
                      </details>
                    </div>
                  </div>
                </div>
              </template>

              <div
                v-if="agentStepHint"
                class="flex items-center gap-2 self-start border border-border px-3 py-2 text-[13px] text-muted-foreground"
                :style="{ borderRadius: 12 }"
              >
                <span class="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                {{ agentStepHint }}
              </div>
            </div>
          </div>
        </div>

        <div
          class="shrink-0 border-t border-border bg-background px-4 py-3"
          :style="{ backgroundColor: 'hsl(var(--background))' }"
        >
          <div class="mx-auto w-full max-w-[720px] space-y-2">
            <div v-if="!isEmptyChat" class="flex flex-wrap gap-1.5">
              <button
                v-for="key in QUICK_PROMPTS"
                :key="key"
                type="button"
                class="rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                :disabled="busy"
                data-no-drag
                @click="onQuickPrompt(key)"
              >
                {{ t(key) }}
              </button>
            </div>
            <form
              class="relative overflow-hidden rounded-2xl border border-border bg-muted/15 transition-colors focus-within:border-sky-500/40 focus-within:bg-background"
              @submit.prevent="onSubmit"
            >
              <Textarea
                v-model:value="input"
                :placeholder="t('panel.ai.inputPlaceholder')"
                class="assistant-chat-textarea min-h-[68px] max-h-[160px] w-full resize-none border-0 bg-transparent px-3.5 pb-12 pt-3 text-[14px] leading-5 text-foreground shadow-none"
                :disabled="busy"
                data-no-drag
                :auto-size="{ minRows: 3, maxRows: 6 }"
                @keydown="onInputKeydown"
              />
              <div class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-2.5 pb-2.5">
                <span class="pl-1 text-[11px] text-muted-foreground">
                  {{ t("panel.ai.inputHint") }}
                </span>
                <Button
                  html-type="submit"
                  shape="circle"
                  :disabled="busy || !input.trim()"
                  data-no-drag
                  :aria-label="t('panel.ai.send')"
                  class="h-9 w-9 shadow-sm disabled:opacity-40"
                  :style="
                    busy || !input.trim()
                      ? undefined
                      : {
                          backgroundColor: 'hsl(var(--foreground))',
                          color: 'hsl(var(--background))',
                        }
                  "
                >
                  <span v-if="busy" class="text-[12px]">…</span>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden
                  >
                    <path d="M12 19V5" />
                    <path d="m5 12 7-7 7 7" />
                  </svg>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
:global(.assistant-chat-modal-wrap .ant-modal) {
  max-width: min(92vw, 720px);
  padding-bottom: 0;
}

:global(.assistant-chat-modal-wrap .ant-modal-content) {
  padding: 0;
  background: hsl(var(--background));
  border-radius: 12px;
  overflow: hidden;
}
</style>