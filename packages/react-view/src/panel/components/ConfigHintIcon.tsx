import type { ReactNode } from "react";
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
  label = "说明",
  children,
  className,
  contentClassName,
}: ConfigHintIconProps) {
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
            aria-label={`${label}说明`}
          >
            ?
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
