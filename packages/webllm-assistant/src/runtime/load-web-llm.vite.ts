/**
 * Vite loader. Imports a real module so Rollup can resolve it without
 * `webllmAssistant()`. The plugin replaces that module with the WebLLM asset href.
 */
import assetHref from "./web-llm-vite-entry";

export function importWebLlm(): Promise<unknown> {
  return Promise.resolve(assetHref);
}
