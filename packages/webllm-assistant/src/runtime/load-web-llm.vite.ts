/**
 * Vite-only loader. Specifier must be a string literal (no `@vite-ignore`) so
 * Vite rewrites it through `webllmAssistant()` resolveId/load.
 * Must match `WEBLLM_VITE_ENTRY` in vite-plugin.ts.
 */
export function importWebLlm(): Promise<unknown> {
  return import("virtual:arronqzy-webllm-entry");
}
