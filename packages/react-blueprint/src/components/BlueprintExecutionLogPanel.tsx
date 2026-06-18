import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import {
  Button,
  Input,
  Label,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
} from "@arronqzy/ui";
import {
  PAGE_LIFECYCLE_LABELS,
  type ExecutionTraceEntry,
  type PageLifecyclePhase,
} from "@arronqzy/blueprint-dsl";

import type { ExecutionLogSettings } from "../library/execution-log-settings";

function IconClear({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function IconClearDb({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="6" rx="7" ry="2.5" />
      <path d="M5 6v12c0 1.5 3.1 2.5 7 2.5s7-1 2.5-7-2.5V6" />
      <path d="M5 12c0 1.5 3.1 2.5 7 2.5s7-1 7-2.5" />
      <path d="m16 16 4 4M20 16l-4 4" />
    </svg>
  );
}

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  );
}

function formatJson(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function LogTooltip({
  content,
  children,
}: {
  content: string;
  children: ReactElement;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="top" className="max-w-[260px] text-[11px]">
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

function LogTooltipButton({
  content,
  disabled,
  className,
  ...props
}: React.ComponentProps<typeof Button> & { content: string }) {
  const button = (
    <Button disabled={disabled} className={className} {...props} />
  );
  return (
    <LogTooltip content={content}>
      {disabled ? <span className="inline-flex w-full">{button}</span> : button}
    </LogTooltip>
  );
}

const SCROLL_BOTTOM_THRESHOLD = 48;

function isScrollNearBottom(element: HTMLElement) {
  return (
    element.scrollHeight - element.scrollTop - element.clientHeight <=
    SCROLL_BOTTOM_THRESHOLD
  );
}

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

export function BlueprintExecutionLogPanel({
  entries,
  settings,
  onUpdateSettings,
  onSave,
  onExport,
  onClear,
  onClearAllSaved,
  onApplyRetention,
  hasSavedRuns = false,
  lifecyclePhase,
}: BlueprintExecutionLogPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevEntryCountRef = useRef(entries.length);
  const stickToBottomRef = useRef(true);

  const [hasNewBelow, setHasNewBelow] = useState(false);

  const phaseLabel = useMemo(() => {
    if (!lifecyclePhase) return null;
    return PAGE_LIFECYCLE_LABELS[lifecyclePhase as PageLifecyclePhase] ?? lifecyclePhase;
  }, [lifecyclePhase]);

  const latestEntryPreview = useMemo(() => {
    const latest = entries[entries.length - 1];
    if (!latest) return "";
    return latest.nodeLabel ?? latest.nodeId;
  }, [entries]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior, block: "end" });
    stickToBottomRef.current = true;
    setHasNewBelow(false);
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = isScrollNearBottom(el);
    stickToBottomRef.current = nearBottom;
    if (nearBottom) {
      setHasNewBelow(false);
    }
  }, []);

  useEffect(() => {
    const prevCount = prevEntryCountRef.current;
    prevEntryCountRef.current = entries.length;

    if (entries.length === 0) {
      setHasNewBelow(false);
      stickToBottomRef.current = true;
      return;
    }

    if (entries.length <= prevCount) return;

    if (stickToBottomRef.current) {
      scrollToBottom(prevCount === 0 ? "auto" : "smooth");
      return;
    }

    setHasNewBelow(true);
  }, [entries, scrollToBottom]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background text-foreground">
        <div className="shrink-0 border-b border-border px-3 py-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs font-semibold">蓝图任务输出日志</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                {phaseLabel ? `模拟场景：${phaseLabel}` : "选择生命周期节点并开始调试"}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {onClearAllSaved ? (
                <LogTooltipButton
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  content="立即清空 IndexedDB 中所有已保存的蓝图执行日志"
                  aria-label="清空 IndexedDB 日志"
                  disabled={!hasSavedRuns}
                  onClick={() => void onClearAllSaved()}
                >
                  <IconClearDb className="h-3.5 w-3.5" />
                </LogTooltipButton>
              ) : null}
              <LogTooltipButton
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7 shrink-0"
                content="清空当前日志，并重置画布执行高亮"
                aria-label="清空日志"
                disabled={entries.length === 0}
                onClick={onClear}
              >
                <IconClear className="h-3.5 w-3.5" />
              </LogTooltipButton>
            </div>
          </div>
        </div>

        <div className="relative min-h-0 flex-1">
          <div
            ref={scrollRef}
            className="h-full overflow-auto p-3"
            onScroll={handleScroll}
          >
            {entries.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">
                暂无执行记录。使用工具栏「走完全流程」或「下一步」开始模拟。
              </p>
            ) : (
              <div className="space-y-0">
                {entries.map((entry, index) => (
                  <div key={entry.id}>
                    <div className="rounded-md border border-border/70 bg-muted/20 p-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-medium text-foreground">
                            {entry.nodeLabel ?? entry.nodeId}
                          </div>
                          <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                            {entry.nodeType} · {entry.nodeId}
                          </div>
                        </div>
                        <time className="shrink-0 text-[10px] text-muted-foreground">
                          {entry.isoTime}
                        </time>
                      </div>

                      <div className="mt-2 grid gap-2">
                        <div>
                          <div className="mb-1 text-[10px] font-medium text-muted-foreground">
                            输入
                          </div>
                          <pre className="max-h-32 overflow-auto rounded border border-border/60 bg-background p-2 font-mono text-[10px] leading-relaxed text-foreground">
                            {formatJson(entry.inputs)}
                          </pre>
                        </div>
                        <div>
                          <div className="mb-1 text-[10px] font-medium text-muted-foreground">
                            输出
                          </div>
                          <pre
                            className={cn(
                              "max-h-32 overflow-auto rounded border p-2 font-mono text-[10px] leading-relaxed",
                              entry.error
                                ? "border-destructive/40 bg-destructive/5 text-destructive"
                                : "border-border/60 bg-background text-foreground"
                            )}
                          >
                            {entry.error ?? formatJson(entry.outputs)}
                          </pre>
                        </div>
                      </div>
                    </div>
                    {index < entries.length - 1 ? (
                      <div className="flex justify-center py-1 text-muted-foreground">
                        <ArrowDownIcon className="h-4 w-4" />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
            <div ref={bottomRef} className="h-px shrink-0" aria-hidden="true" />
          </div>

          {hasNewBelow ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center px-3">
              <button
                type="button"
                className="pointer-events-auto inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary/30 bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground shadow-md transition hover:bg-primary/90"
                onClick={() => scrollToBottom("smooth")}
              >
                <ArrowDownIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">有新日志</span>
                {latestEntryPreview ? (
                  <span className="truncate opacity-90">· {latestEntryPreview}</span>
                ) : null}
              </button>
            </div>
          ) : null}
        </div>

        <div className="shrink-0 space-y-2 border-t border-border p-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <LogTooltipButton
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              content="将当前调试日志保存到 IndexedDB"
              disabled={entries.length === 0}
              onClick={onSave}
            >
              保存日志
            </LogTooltipButton>
            <LogTooltipButton
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              content="将当前调试日志导出为 JSON 文件"
              disabled={entries.length === 0}
              onClick={onExport}
            >
              导出 JSON
            </LogTooltipButton>
          </div>

          <LogTooltip content="调试运行完成后，自动将日志写入 IndexedDB">
            <label className="flex cursor-default items-center gap-2">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => onUpdateSettings({ autoSave: e.target.checked })}
                className="h-3.5 w-3.5 rounded border border-input"
              />
              <span className="text-[11px] text-muted-foreground">
                运行完成后自动保存到 IndexedDB
              </span>
            </label>
          </LogTooltip>

          <div className="grid grid-cols-2 gap-2">
            <LogTooltip content="IndexedDB 中最多保留的日志条数，超出后自动删除最旧记录">
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">最多保存条数</Label>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={settings.maxSavedRuns}
                  onChange={(e) =>
                    onUpdateSettings({
                      maxSavedRuns: Math.max(1, Number(e.target.value) || 1),
                    })
                  }
                  className="h-8"
                  aria-label="IndexedDB 最多保存日志条数"
                />
              </div>
            </LogTooltip>
            <LogTooltip content="超过保留天数的已保存日志将在清理时被删除">
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">保留天数</Label>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={settings.retentionDays}
                  onChange={(e) =>
                    onUpdateSettings({
                      retentionDays: Math.max(1, Number(e.target.value) || 1),
                    })
                  }
                  className="h-8"
                  aria-label="日志保留天数"
                />
              </div>
            </LogTooltip>
          </div>

          <LogTooltipButton
            type="button"
            variant="secondary"
            size="sm"
            className="w-full"
            content="按保留天数与条数上限，清理 IndexedDB 中的日志记录"
            onClick={onApplyRetention}
          >
            清理过期与超额
          </LogTooltipButton>
        </div>
      </div>
    </TooltipProvider>
  );
}
