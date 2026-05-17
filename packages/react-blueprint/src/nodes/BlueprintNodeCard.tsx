import { cn } from "@arron/ui";

export type BlueprintNodeCardProps = {
  nodeId: string;
  label: string;
  meta?: string;
  variant?: "blueprint" | "logic";
  selected?: boolean;
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
  variant = "blueprint",
  selected = false,
  onSelect,
}: BlueprintNodeCardProps) {
  const v = variantStyle[variant];

  return (
    <div
      data-blueprint-node-card
      className={cn(
        "bp-node-card w-[168px] overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm",
        "border-l-[3px] transition-[box-shadow,border-color] duration-150",
        v.accent,
        selected &&
          "border-primary/50 shadow-[0_0_0_1px_hsl(var(--primary)/0.35),0_4px_12px_hsl(var(--primary)/0.12)]"
      )}
    >
      <div
        className={cn(
          "bp-flow-drag-handle flex cursor-grab items-center gap-2 border-b border-border/50 px-2 py-1.5",
          "bg-muted/25 text-muted-foreground active:cursor-grabbing"
        )}
        title="拖拽移动"
      >
        <NodeGrip />
        {/* <span
          className={cn(
            "rounded px-1.5 py-0.5 text-[10px] font-medium leading-none tracking-wide",
            v.badge
          )}
        >
          {meta}
        </span> */}
      </div>

      <button
        type="button"
        className={cn(
          "nodrag flex w-full items-start gap-2 px-2.5 py-2 text-left",
          "outline-none transition-colors hover:bg-accent/30",
          "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-inset"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(nodeId);
        }}
      >
        <span
          className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", v.dot)}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1 truncate text-[13px] font-medium leading-snug text-foreground">
          {label}
        </span>
      </button>
    </div>
  );
}
