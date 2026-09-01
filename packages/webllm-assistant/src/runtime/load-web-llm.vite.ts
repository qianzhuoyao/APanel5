/** Must match `WEBLLM_VITE_ENTRY` in vite-plugin.ts (not imported — keeps Webpack graphs clean). */
const WEBLLM_VITE_ENTRY = "virtual:arronqzy-webllm-entry";

/**
 * Vite-only loader. The companion plugin resolves the virtual entry to a static
 * asset copy of the huge runtime file.
 */
export function importWebLlm(): Promise<unknown> {
  return import(/* @vite-ignore */ WEBLLM_VITE_ENTRY);
}
