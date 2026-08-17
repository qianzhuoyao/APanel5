import type { ReactNode } from "react";
import { useI18n } from "@arronqzy/i18n/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@arronqzy/ui";

export type ConfigHintIconProps = {
  label?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function ConfigHintIcon({
  label,
  children,
  className,
  contentClassName,
}: ConfigHintIconProps) {
  const { t } = useI18n();
  const resolvedLabel = label ?? t("common.hint");

  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={
              className ??
              "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border text-[10px] leading-none text-muted-foreground hover:bg-accent/50"
            }
            aria-label={t("common.hintAria", { label: resolvedLabel })}
          >
            ?
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className={`z-[10120] max-w-[360px] space-y-1.5 text-[11px] leading-5 ${contentClassName ?? ""}`}
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ConfigSectionTitle({
  title,
  hint,
}: {
  title: string;
  hint: ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="font-medium text-foreground">{title}</div>
      <ConfigHintIcon label={title}>{hint}</ConfigHintIcon>
    </div>
  );
}

export function ConfigFieldLabel({
  label,
  hint,
}: {
  label: string;
  hint?: ReactNode;
}) {
  if (!hint) {
    return <span className="text-muted-foreground">{label}</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      {label}
      <ConfigHintIcon label={label}>{hint}</ConfigHintIcon>
    </span>
  );
}
