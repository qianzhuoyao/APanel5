import { useMemo, useState } from "react";
import {
  Button,
  cn,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@arron/ui";

export type ViewElementMultiSelectOption = {
  id: string;
  label: string;
};

export type ViewElementMultiSelectProps = {
  options: ViewElementMultiSelectOption[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M7 10l5 5 5-5z" />
    </svg>
  );
}

function resolveTriggerText(
  value: string[],
  labelById: Map<string, string>,
  placeholder: string
): string {
  if (value.length === 0) return placeholder;
  const labels = value.map((id) => labelById.get(id) ?? id);
  if (labels.length === 1) return labels[0]!;
  const joined = labels.join("、");
  if (joined.length <= 26) return joined;
  return `已选 ${value.length} 项`;
}

export function ViewElementMultiSelect({
  options,
  value,
  onChange,
  placeholder = "选择视图节点",
  disabled = false,
}: ViewElementMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const labelById = useMemo(
    () => new Map(options.map((opt) => [opt.id, opt.label])),
    [options]
  );
  const selectedSet = useMemo(() => new Set(value), [value]);
  const triggerText = resolveTriggerText(value, labelById, placeholder);
  const emptyOptions = options.length === 0;

  const toggle = (id: string) => {
    onChange(
      selectedSet.has(id)
        ? value.filter((item) => item !== id)
        : [...value, id]
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || emptyOptions}
          className={cn(
            "h-8 w-full justify-between px-3 text-xs font-normal",
            value.length === 0 && "text-muted-foreground"
          )}
        >
          <span className="min-w-0 flex-1 truncate text-left">
            {emptyOptions ? "视图画布暂无节点" : triggerText}
          </span>
          <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-[10100] w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="搜索视图节点…" className="h-9 text-xs" />
          <CommandList>
            <CommandEmpty>无匹配节点</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => {
                const selected = selectedSet.has(opt.id);
                return (
                  <CommandItem
                    key={opt.id}
                    value={`${opt.label} ${opt.id}`}
                    className="text-xs"
                    onMouseDown={(e) => e.preventDefault()}
                    onSelect={() => toggle(opt.id)}
                  >
                    <CheckIcon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        selected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="min-w-0 truncate">{opt.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
