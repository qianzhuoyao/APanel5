import { useI18n } from "@arronqzy/i18n/react";
import { cn } from "@arronqzy/ui";

export type BlueprintNodeCardProps = {
  nodeId: string;
  label: string;
  meta?: string;
  /** 节点关键配置摘要，显示在名称下方 */
  subtitle?: string;
  /** 调试执行进度（如时钟 2/3） */
  progressLabel?: string;
  variant?: "blueprint" | "logic" | "and" | "lifecycle" | "event" | "fetch" | "json" | "clock";
  selected?: boolean;
  hideLeadingDot?: boolean;
  onSelect?: (nodeId: string) => void;
};

const variantStyle = {
  blueprint: {
    accent: "border-l-primary",
    badge: "bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  logic: {
    accent: "border-l-sky-500 dark:border-l-sky-400",
    badge: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  and: {
    accent: "border-l-indigo-500 dark:border-l-indigo-400",
    badge: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
    dot: "bg-indigo-500",
  },
  lifecycle: {
    accent: "border-l-amber-500 dark:border-l-amber-400",
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  event: {
    accent: "border-l-fuchsia-500 dark:border-l-fuchsia-400",
    badge: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
    dot: "bg-fuchsia-500",
  },
  fetch: {
    accent: "border-l-violet-500 dark:border-l-violet-400",
    badge: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
    dot: "bg-violet-500",
  },
  json: {
    accent: "border-l-teal-500 dark:border-l-teal-400",
    badge: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
    dot: "bg-teal-500",
  },
  clock: {
    accent: "border-l-rose-500 dark:border-l-rose-400",
    badge: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
} as const;

function NodeGrip() {
  return (
    <div
      className="flex shrink-0 flex-col gap-[3px] opacity-35"
      aria-hidden="true"
    >
      <span className="flex gap-[3px]">
        <span className="h-[3px] w-[3px] rounded-full bg-current" />
        <span className="h-[3px] w-[3px] rounded-full bg-current" />
      </span>
      <span className="flex gap-[3px]">
        <span className="h-[3px] w-[3px] rounded-full bg-current" />
        <span className="h-[3px] w-[3px] rounded-full bg-current" />
      </span>
    </div>
  );
}

export function BlueprintNodeCard({
  nodeId,
  label,
  meta,
  subtitle,
  progressLabel,
  variant = "blueprint",
  selected = false,
  hideLeadingDot = false,
  onSelect,
}: BlueprintNodeCardProps) {
  const { t } = useI18n();
  const v = variantStyle[variant];

  return (
    <div
      data-blueprint-node-card
      className={cn(
        "bp-node-card w-[168px] overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm",
        "transition-[box-shadow,border-color] duration-150",
        hideLeadingDot
          ? cn(
              "border-t-[3px]",
              variant === "event"
                ? "border-t-fuchsia-500 dark:border-t-fuchsia-400"
                : "border-t-amber-500 dark:border-t-amber-400"
            )
          : cn("border-l-[3px]", v.accent),
        selected &&
          "border-primary/50 shadow-[0_0_0_1px_hsl(var(--primary)/0.35),0_4px_12px_hsl(var(--primary)/0.12)]"
      )}
    >
      <div
        className={cn(
          "bp-flow-drag-handle flex cursor-grab items-center gap-2 border-b border-border/50 px-2 py-1.5",
          "bg-muted/25 text-muted-foreground active:cursor-grabbing"
        )}
        title={t("blueprint.node.dragToMove")}
      >
        <NodeGrip />
        {meta ? (
          <span
            className={cn(
              "min-w-0 flex-1 truncate rounded px-1.5 py-0.5 text-[10px] font-medium leading-none tracking-wide",
              v.badge
            )}
            title={meta}
          >
            {meta}
          </span>
        ) : null}
      </div>

      <button
        type="button"
        className={cn(
          "nodrag flex w-full text-left outline-none transition-colors hover:bg-accent/30",
          "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-inset",
          hideLeadingDot
            ? cn("px-2.5 py-2", subtitle ? "items-start" : "items-center")
            : "items-start gap-2 px-2.5 py-2"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(nodeId);
        }}
      >
        {!hideLeadingDot ? (
          <span
            className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", v.dot)}
            aria-hidden="true"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-1.5">
            <div className="min-w-0 flex-1 truncate text-[13px] font-medium leading-snug text-foreground">
              {label}
            </div>
            {progressLabel ? (
              <span
                className={cn(
                  "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                  v.badge
                )}
                title={t("blueprint.node.signalSentCount")}
              >
                {progressLabel}
              </span>
            ) : null}
          </div>
          {subtitle ? (
            <div
              className="mt-0.5 truncate font-mono text-[10px] leading-tight text-muted-foreground"
              title={subtitle}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </button>
    </div>
  );
}
