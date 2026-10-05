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
              "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            }
            aria-label={t("common.hintAria", { label: resolvedLabel })}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className={`z-[10120] max-w-[360px] text-[11px] leading-5 ${contentClassName ?? ""}`}
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
