/**
 * Vite-only loader. The companion plugin rewrites this specifier to a static
 * asset so Vite 5 does not run stripLiteral on the huge runtime file.
 * Webpack must not compile this module (see webpackIgnore in load-web-llm.ts).
 */
export function importWebLlm(): Promise<unknown> {
  return import("@mlc-ai/web-llm");
}
