import type React from "react";
import type { PanelChartConfig, PanelElement } from "../../types";

export type UpdateElement = (
  id: string,
  patch: Partial<PanelElement>,
  options?: { batchId?: string; meta?: Record<string, unknown> }
) => void;

export type RenderSection = (
  key: string,
  title: string,
  children: React.ReactNode,
  defaultOpen?: boolean,
  searchTerms?: string[],
  hint?: React.ReactNode
) => React.ReactNode;

export type RenderFieldGroup = (
  title: string,
  children: React.ReactNode,
  hint?: React.ReactNode,
  options?: { groupKey?: string; defaultOpen?: boolean }
) => React.ReactNode;

export type RenderColorField = (
  label: string,
  value: string,
  onTextChange: (next: string) => void
) => React.ReactNode;

export type ConfigSectionHelpers = {
  renderSection: RenderSection;
  renderFieldGroup: RenderFieldGroup;
  renderColorField: RenderColorField;
  hasSearch: boolean;
  normalizedSearch: string;
  isSectionExpanded: (key: string, defaultValue?: boolean) => boolean;
  setSectionExpanded: (key: string, next: boolean) => void;
  optionCheckboxClass: string;
  optionInputClass: string;
  optionSelectTriggerClass: string;
  renderOptionLabel: (label: string, keyPath: string, desc: string) => React.ReactNode;
  renderFormatterLabel: (label?: string) => React.ReactNode;
};

export const OPTION_CHECKBOX_CLASS =
  "h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40";
export const OPTION_INPUT_CLASS =
  "h-7 border border-border/60 bg-background/90 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border/60";
export const OPTION_SELECT_TRIGGER_CLASS =
  "h-7 border border-border/60 bg-muted/40 shadow-none ring-0 focus:ring-0 focus:ring-offset-0 focus:border-border/60 data-[state=open]:border-border/60";

export function mergeOptionPatch(
  base: Record<string, unknown> | undefined,
  patch: Record<string, unknown>
): Record<string, unknown> {
  const output: Record<string, unknown> = { ...(base ?? {}) };
  for (const [key, value] of Object.entries(patch)) {
    const prev = output[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      prev &&
      typeof prev === "object" &&
      !Array.isArray(prev)
    ) {
      output[key] = mergeOptionPatch(
        prev as Record<string, unknown>,
        value as Record<string, unknown>
      );
    } else {
      output[key] = value;
    }
  }
  return output;
}

export function patchChart(
  chart: PanelChartConfig | undefined,
  patch: Partial<PanelChartConfig>
): PanelChartConfig {
  return { ...(chart ?? {}), ...patch };
}
