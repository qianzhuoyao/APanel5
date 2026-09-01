import { WEBLLM_VITE_ENTRY } from "../vite-plugin";

/**
 * Vite-only loader. The companion plugin resolves `virtual:arronqzy-webllm-entry`
 * to a static asset copy of the huge runtime file.
 * Webpack must not compile this module (see webpackIgnore in load-web-llm.ts).
 */
export function importWebLlm(): Promise<unknown> {
  return import(/* @vite-ignore */ WEBLLM_VITE_ENTRY);
}
