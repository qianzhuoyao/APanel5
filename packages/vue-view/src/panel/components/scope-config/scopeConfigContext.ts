import type { InjectionKey, Ref } from "vue";
import type { ScopeTemplateWarning } from "../../utils/scope-template-warnings";

export type ScopeConfigContextValue = {
  warnings: ScopeTemplateWarning[];
  warningsByField: Map<string, ScopeTemplateWarning[]>;
  scrollToField: (fieldId: string) => void;
};

export const scopeConfigKey: InjectionKey<ScopeConfigContextValue> =
  Symbol("scopeConfig");

export type ScopeConfigProviderProps = {
  scope?: unknown;
  warnings: ScopeTemplateWarning[];
  scrollContainerRef?: Ref<HTMLElement | null | undefined>;
};
