import { inject } from "vue";
import { scopeConfigKey } from "./scopeConfigContext";

export function useScopeConfig() {
  return inject(scopeConfigKey, null);
}

export function useScopeFieldWarnings(fieldId: string) {
  const ctx = useScopeConfig();
  return ctx?.warningsByField.get(fieldId) ?? [];
}
