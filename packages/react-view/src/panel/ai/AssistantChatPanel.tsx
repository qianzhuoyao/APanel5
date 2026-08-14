import { useI18n } from "@arronqzy/i18n/react";
import {
  ASSISTANT_MODEL_OPTIONS,
  DEFAULT_MODEL_ID,
  WebLLMAssistantRuntime,
  isWebGPUAvailable,
  looksLikePureQuestion,
  inferPanelAddFromUserText,
  runAgentLoop,
  buildEditorContext,
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
import type { BlueprintGraph } from "@arronqzy/react-blueprint";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@arronqzy/ui";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  applyAssistantAction,
  type ApplyAssistantDeps,
} from "./applyAssistantAction";
import { AssistantMarkdown } from "./AssistantMarkdown";

type UiMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  /** Collapsed agent step trail (optional). */
  steps?: string[];
};

export type AssistantChatPanelProps = {
  deps: ApplyAssistantDeps;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const QUICK_PROMPTS = [
  "panel.ai.quickWhatComponents",
  "panel.ai.quickAddTable",
] as const;

const RECENT_MESSAGE_COUNT = 8;

function StatusDot({
  tone,
}: {
  tone: "ready" | "loading" | "idle" | "error";
}) {
  const color =
    tone === "ready"
      ? "bg-emerald-500"
      : tone === "loading"
        ? "bg-amber-400 animate-pulse"
        : tone === "error"
          ? "bg-destructive"
          : "bg-muted-foreground/40";
  return <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${color}`} />;
}

function AiAvatar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-[11px] font-semibold text-foreground ${className}`}
      aria-hidden
    >
      AI
    </div>
  );
}

function UserAvatar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${className}`}
      style={{
        backgroundColor: "hsl(var(--foreground))",
        color: "hsl(var(--background))",
      }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="8" r="4" />
      </svg>
    </div>
  );
}

/** Theme-safe bubble colors (avoid Tailwind palette classes that may be purged). */
const userBubbleStyle: React.CSSProperties = {
  backgroundColor: "hsl(var(--foreground))",
  color: "hsl(var(--background))",
  borderRadius: "18px",
  overflow: "hidden",
};

const assistantBubbleStyle: React.CSSProperties = {
  backgroundColor: "hsl(var(--muted))",
  color: "hsl(var(--foreground))",
  borderRadius: "18px",
  overflow: "hidden",
};

const messageListStyle: React.CSSProperties = {
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
  return !/然后|并且|再|保存|选中|改成|设置|宽度|高度|蓝图|图层|预览|主题/.test(
    text
  );
}

function formatApplyFail(
  message: string,
  t: (key: string, params?: Record<string, string | number>) => string
) {
  if (message === "layer_locked_or_add_failed") {
    return t("panel.ai.layerLockedAddFailed");
  }
  if (message.startsWith("unknown_material:")) {
    return t("panel.ai.unknownMaterial", {
      type: message.replace("unknown_material:", ""),
    });
  }
  return message;
}

export function AssistantChatPanel({
  deps,
  open,
  onOpenChange,
}: AssistantChatPanelProps) {
  const { t } = useI18n();
  const runtimeRef = useRef<WebLLMAssistantRuntime | null>(null);
  if (!runtimeRef.current) runtimeRef.current = new WebLLMAssistantRuntime();
  const depsRef = useRef(deps);
  depsRef.current = deps;

  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID);
  const [status, setStatus] = useState(runtimeRef.current.status);
  const [progress, setProgress] = useState<InitProgress>({ progress: 0, text: "" });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [agentStepHint, setAgentStepHint] = useState<string | null>(null);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([
    {
      id: "welcome",
      role: "system",
      content: t("panel.ai.welcome"),
    },
  ]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const webgpuOk = useMemo(() => isWebGPUAvailable(), []);

  /** Prior Q/A for the model (excludes welcome/system; excludes the in-flight user turn). */
  const getPriorChat = useCallback(() => {
    return buildPriorChatMessages(messagesRef.current, {
      maxTurns: 6,
      maxCharsPerMessage: 480,
    });
  }, []);

  const getRecentDialog = useCallback(() => {
    return buildRecentDialogSummary(messagesRef.current, {
      maxTurns: 4,
      maxCharsPerMessage: 220,
    });
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open, agentStepHint]);

  const ensureReady = useCallback(async () => {
    const runtime = runtimeRef.current!;
    if (runtime.status === "ready" && runtime.currentModelId === modelId) {
      setStatus("ready");
      return;
    }
    setStatus("loading");
    await runtime.init(modelId, (p) => {
      setProgress(p);
      setStatus("loading");
    });
    setStatus(runtime.status);
  }, [modelId]);

  const pushMessage = (msg: Omit<UiMessage, "id">) => {
    setMessages((prev) => [
      ...prev,
      { ...msg, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
    ]);
  };

  const buildObservation = useCallback(() => {
    const d = depsRef.current;
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
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;
      if (!webgpuOk) {
        pushMessage({ role: "system", content: t("panel.ai.webgpuRequired") });
        return;
      }

      setInput("");
      // Capture prior turns before enqueueing this user message.
      const priorChat = getPriorChat();
      const recentDialog = getRecentDialog();
      pushMessage({ role: "user", content: trimmed });
      setBusy(true);
      setAgentStepHint(null);
      try {
        // Deterministic FAQ first (capability / components / table setup).
        const localFaq = tryLocalFaqReply(trimmed);
        if (localFaq) {
          pushMessage({ role: "assistant", content: localFaq });
          return;
        }

        // High-confidence local tools (add / resize / delete / save …) — skip model.
        const selectedIds = depsRef.current.getSelectedIds() ?? [];
        const localPlan = inferLocalEditorPlan(trimmed, { selectedIds });
        if (localPlan) {
          const stepLines: string[] = [];
          for (let i = 0; i < localPlan.actions.length; i += 1) {
            const action = localPlan.actions[i]!;
            if (action.type === "reply") {
              pushMessage({ role: "assistant", content: action.message });
              return;
            }
            setAgentStepHint(
              t("panel.ai.stepRunning", {
                step: String(i + 1),
                type: action.type,
              })
            );
            const result = await applyAssistantAction(action, depsRef.current);
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
        const runtime = runtimeRef.current!;

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
            content:
              message || t("panel.ai.unclearIntent") || UNCLEAR_INTENT_REPLY,
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
          apply: async (action) => applyAssistantAction(action, depsRef.current),
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
            setAgentStepHint(
              t("panel.ai.stepRunning", {
                step: String(record.step),
                type: record.action.type,
              })
            );
          },
        });

        setAgentStepHint(null);

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
          setStatus("unsupported");
          pushMessage({ role: "system", content: t("panel.ai.webgpuRequired") });
        } else {
          setStatus(runtimeRef.current?.status ?? "error");
          pushMessage({
            role: "system",
            content: `${t("panel.ai.error")}: ${code}`,
          });
        }
      } finally {
        setAgentStepHint(null);
        setBusy(false);
      }
    },
    [buildObservation, busy, ensureReady, getPriorChat, getRecentDialog, t, webgpuOk]
  );

  const loadModelOnly = async () => {
    if (!webgpuOk) {
      setStatus("unsupported");
      return;
    }
    setBusy(true);
    try {
      await ensureReady();
      pushMessage({ role: "system", content: t("panel.ai.modelReady") });
    } catch (err) {
      pushMessage({
        role: "system",
        content: `${t("panel.ai.error")}: ${err instanceof Error ? err.message : String(err)}`,
      });
    } finally {
      setBusy(false);
    }
  };

  const visibleMessages = useMemo(() => {
    // ChatGPT-style timeline: keep chronological order, drop the initial welcome
    // once the user has started chatting so turns read as Q → A → Q → A.
    const hasUserTurn = messages.some((m) => m.role === "user");
    const timeline = hasUserTurn
      ? messages.filter((m) => !(m.id === "welcome" && m.role === "system"))
      : messages;
    if (historyExpanded || timeline.length <= RECENT_MESSAGE_COUNT) {
      return timeline;
    }
    return timeline.slice(-RECENT_MESSAGE_COUNT);
  }, [historyExpanded, messages]);

  const hiddenCount = useMemo(() => {
    const hasUserTurn = messages.some((m) => m.role === "user");
    const timeline = hasUserTurn
      ? messages.filter((m) => !(m.id === "welcome" && m.role === "system"))
      : messages;
    return Math.max(0, timeline.length - visibleMessages.length);
  }, [messages, visibleMessages.length]);

  const statusTone =
    status === "ready"
      ? "ready"
      : status === "loading"
        ? "loading"
        : status === "unsupported" || status === "error"
          ? "error"
          : "idle";

  const statusText =
    status === "ready"
      ? t("panel.ai.statusReady")
      : status === "loading"
        ? t("panel.ai.statusLoading", {
            pct: Math.round((progress.progress || 0) * 100),
          })
        : status === "unsupported"
          ? t("panel.ai.statusUnsupported")
          : t("panel.ai.statusIdle");


  const isEmptyChat =
    visibleMessages.every((m) => m.role === "system") && !agentStepHint;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        showOverlay={false}
        showClose={false}
        minWidth={640}
        minHeight={420}
        className="pointer-events-auto flex h-[min(72vh,580px)] w-[min(92vw,720px)] max-w-[720px] flex-col gap-0 overflow-hidden rounded-xl border border-border bg-background p-0 text-foreground shadow-2xl opacity-100"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "min(72vh, 580px)",
          maxHeight: "72vh",
          width: "min(92vw, 720px)",
          backgroundColor: "hsl(var(--background))",
          opacity: 1,
          isolation: "isolate",
        }}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div
          className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-background"
          style={{ backgroundColor: "hsl(var(--background))" }}
        >
          <DialogHeader className="shrink-0 flex-row items-center gap-3 space-y-0 border-b border-border bg-background px-4 py-3 text-left">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-[15px] font-semibold tracking-tight text-foreground">
                {t("panel.ai.title")}
              </DialogTitle>
              <DialogDescription className="mt-0.5 line-clamp-1 text-[12px] text-muted-foreground">
                {t("panel.ai.welcome")}
              </DialogDescription>
            </div>
            <div className="flex shrink-0 items-center gap-2" data-no-drag>
              <div className="hidden items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 sm:flex">
                <StatusDot tone={statusTone} />
                <span className="text-[11px] text-muted-foreground">{statusText}</span>
              </div>
              <Select
                value={modelId}
                onValueChange={setModelId}
                disabled={busy || status === "loading"}
              >
                <SelectTrigger className="h-8 w-[108px] rounded-md border-border bg-background text-[12px] shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={6}>
                  {ASSISTANT_MODEL_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.id}
                      value={opt.id}
                      className="text-[12px]"
                      title={t(opt.hintKey)}
                    >
                      {t(opt.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {status !== "ready" ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-md px-3 text-[12px]"
                  disabled={busy || !webgpuOk}
                  onClick={() => void loadModelOnly()}
                >
                  {t("panel.ai.downloadModel")}
                </Button>
              ) : null}
              <DialogClose
                data-no-drag
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </DialogClose>
            </div>
          </DialogHeader>

          {status === "loading" ? (
            <div className="h-0.5 shrink-0 overflow-hidden bg-muted">
              <div
                className="h-full bg-primary/70 transition-all"
                style={{
                  width: `${Math.max(4, Math.round((progress.progress || 0) * 100))}%`,
                }}
              />
            </div>
          ) : null}

          {!webgpuOk ? (
            <div className="shrink-0 border-b border-destructive/20 bg-destructive/10 px-4 py-2 text-[12px] text-destructive">
              {t("panel.ai.webgpuRequired")}
            </div>
          ) : null}

          <div
            ref={listRef}
            className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-background"
            style={{ backgroundColor: "hsl(var(--background))" }}
          >
            <div className="mx-auto flex min-h-full w-full max-w-[720px] flex-col px-4 py-4">
              {isEmptyChat ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-5 py-6 text-center">
                  <AiAvatar className="h-12 w-12 text-[14px]" />
                  <div className="space-y-1.5">
                    <h2 className="text-[20px] font-semibold tracking-tight text-foreground">
                      {t("panel.ai.title")}
                    </h2>
                    <p className="mx-auto max-w-[420px] text-[13px] leading-5 text-muted-foreground">
                      {t("panel.ai.welcome")}
                    </p>
                  </div>
                  <div className="flex max-w-[520px] flex-wrap justify-center gap-2">
                    {QUICK_PROMPTS.map((key) => (
                      <button
                        key={key}
                        type="button"
                        className="rounded-full border border-border bg-muted/30 px-3.5 py-1.5 text-[12px] text-foreground transition hover:bg-muted disabled:opacity-50"
                        disabled={busy}
                        onClick={() => void send(t(key))}
                        data-no-drag
                      >
                        {t(key)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={messageListStyle}>
                  {hiddenCount > 0 ? (
                    <button
                      type="button"
                      className="mx-auto text-[12px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                      onClick={() => setHistoryExpanded((v) => !v)}
                      data-no-drag
                    >
                      {historyExpanded
                        ? t("panel.ai.historyCollapse")
                        : t("panel.ai.historyExpand", { count: hiddenCount })}
                    </button>
                  ) : null}

                  {visibleMessages.map((m) => {
                    if (m.role === "system") {
                      return (
                        <div
                          key={m.id}
                          className="mx-auto max-w-[85%] px-3.5 py-2 text-center text-[12px] leading-5 text-muted-foreground"
                          style={{
                            backgroundColor: "hsl(var(--muted))",
                            borderRadius: 16,
                          }}
                        >
                          {m.content}
                        </div>
                      );
                    }
                    if (m.role === "user") {
                      return (
                        <div
                          key={m.id}
                          className="flex w-full flex-col items-end"
                          style={{ marginBottom: 2 }}
                        >
                          <div className="flex max-w-[85%] items-end gap-2">
                            <div
                              className="px-4 py-2.5 text-[14px] leading-6 shadow-sm"
                              style={userBubbleStyle}
                            >
                              <p className="whitespace-pre-wrap break-words">{m.content}</p>
                            </div>
                            <UserAvatar />
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={m.id}
                        className="flex w-full flex-col items-start"
                        style={{ marginBottom: 2 }}
                      >
                        <div className="flex max-w-[90%] items-end gap-2">
                          <AiAvatar />
                          <div
                            className="border border-border px-4 py-2.5 shadow-sm"
                            style={assistantBubbleStyle}
                          >
                            <AssistantMarkdown content={m.content} />
                            {m.steps?.length ? (
                              <details className="mt-2 border-t border-border/60 pt-2" data-no-drag>
                                <summary className="cursor-pointer select-none text-[12px] text-muted-foreground hover:text-foreground">
                                  {t("panel.ai.stepsSummary")}
                                </summary>
                                <ul className="mt-1.5 space-y-1 border-l border-border pl-2.5 text-[12px] leading-5 text-muted-foreground">
                                  {m.steps.map((line, i) => (
                                    <li key={i}>{line}</li>
                                  ))}
                                </ul>
                              </details>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {agentStepHint ? (
                    <div
                      className="flex items-center gap-2 self-start border border-border px-3 py-2 text-[13px] text-muted-foreground"
                      style={{ borderRadius: 12 }}
                    >
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                      {agentStepHint}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div
            className="shrink-0 border-t border-border bg-background px-4 py-3"
            style={{ backgroundColor: "hsl(var(--background))" }}
          >
            <div className="mx-auto w-full max-w-[720px] space-y-2">
              {!isEmptyChat ? (
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      className="rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                      disabled={busy}
                      onClick={() => void send(t(key))}
                      data-no-drag
                    >
                      {t(key)}
                    </button>
                  ))}
                </div>
              ) : null}
              <form
                className="relative overflow-hidden rounded-2xl border border-border bg-muted/15 transition-colors focus-within:border-sky-500/40 focus-within:bg-background"
                onSubmit={(e) => {
                  e.preventDefault();
                  void send(input);
                }}
              >
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("panel.ai.inputPlaceholder")}
                  className="min-h-[68px] max-h-[160px] w-full resize-none border-0 bg-transparent px-3.5 pb-12 pt-3 text-[14px] leading-5 text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 md:text-[14px]"
                  disabled={busy}
                  data-no-drag
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send(input);
                    }
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-2.5 pb-2.5">
                  <span className="pl-1 text-[11px] text-muted-foreground">
                    {t("panel.ai.inputHint")}
                  </span>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={busy || !input.trim()}
                    data-no-drag
                    aria-label={t("panel.ai.send")}
                    className="h-9 w-9 rounded-full shadow-sm disabled:opacity-40"
                    style={
                      busy || !input.trim()
                        ? undefined
                        : {
                            backgroundColor: "hsl(var(--foreground))",
                            color: "hsl(var(--background))",
                          }
                    }
                  >
                    {busy ? (
                      <span className="text-[12px]">…</span>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M12 19V5" />
                        <path d="m5 12 7-7 7 7" />
                      </svg>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
