import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from "@arron/ui";

export type BlueprintNodeCardProps = {
  nodeId: string;
  label: string;
  meta: string;
  variant?: "blueprint" | "logic";
  selected?: boolean;
  onSelect?: (nodeId: string) => void;
};

export function BlueprintNodeCard({
  nodeId,
  label,
  meta,
  variant = "blueprint",
  selected = false,
  onSelect,
}: BlueprintNodeCardProps) {
  return (
    <Card
      data-blueprint-node-card
      className={cn(
        "nodrag min-w-[140px] cursor-pointer shadow-sm transition-shadow hover:shadow-md",
        "rounded-t-none",
        variant === "blueprint" &&
          "border-violet-300/70 bg-violet-50/90 dark:border-violet-500/40 dark:bg-violet-950/40",
        variant === "logic" &&
          "min-w-[120px] border-sky-300/70 bg-sky-50/90 dark:border-sky-500/40 dark:bg-sky-950/40",
        selected && "ring-2 ring-primary ring-inset"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(nodeId);
      }}
    >
      <CardHeader className="space-y-1 p-3">
        <CardTitle className="text-sm font-semibold leading-tight">{label}</CardTitle>
        <CardDescription className="text-[11px]">{meta}</CardDescription>
      </CardHeader>
    </Card>
  );
}
