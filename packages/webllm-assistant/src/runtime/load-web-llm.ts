export type WebLLMModule = {
  MLCEngine: new (config?: {
    initProgressCallback?: (report: { progress?: number; text?: string }) => void;
  }) => {
    reload: (modelId: string) => Promise<void>;
    unload: () => Promise<void>;
    chat: {
      completions: {
        create: (request: {
          messages: Array<{ role: string; content: string }>;
          stream?: boolean;
          temperature?: number;
          max_tokens?: number;
          extra_body?: { enable_thinking?: boolean };
        }) => Promise<{
          choices?: Array<{
            message?: { content?: string | Array<string | { text?: string }> };
          }>;
        }>;
      };
    };
  };
};

function isWebLLMModule(value: unknown): value is WebLLMModule {
  return Boolean(
    value &&
      typeof value === "object" &&
      "MLCEngine" in (value as Record<string, unknown>)
  );
}

function moduleFromUnknown(value: unknown): WebLLMModule | null {
  if (isWebLLMModule(value)) return value;
  if (value && typeof value === "object" && "default" in (value as object)) {
    const nested = (value as { default: unknown }).default;
    if (isWebLLMModule(nested)) return nested;
  }
  return null;
}

/**
 * Load `@mlc-ai/web-llm` without letting Vite parse the huge bundle, and
 * without letting Webpack/Umi emit a chunk whose filename contains `?url`.
 *
 * Vite 5's stripLiteral overflows on that file. The companion Vite plugin
 * rewrites a bare `@mlc-ai/web-llm` import to `...?url` (static asset).
 * Webpack has no `?url` loader: a literal `import("pkg?url")` becomes
 * `dist/@mlc-ai-web-llm?url-lib.async.js`, and Umi's fileSizeReporter
 * then ENOENTs because `?` is treated as a query, not part of the path.
 *
 * Do not write `import("@mlc-ai/web-llm?url")` in this file.
 */
export async function loadWebLlmModule(): Promise<WebLLMModule> {
  const loaded: unknown = await import(
    /* webpackChunkName: "mlc-web-llm" */
    "@mlc-ai/web-llm"
  );
  const asModule = moduleFromUnknown(loaded);
  if (asModule) return asModule;

  const url =
    typeof loaded === "string"
      ? loaded
      : loaded && typeof loaded === "object" && "default" in (loaded as object)
        ? (loaded as { default: unknown }).default
        : null;

  if (typeof url === "string") {
    const fromUrl = moduleFromUnknown(
      await import(/* @vite-ignore */ url)
    );
    if (fromUrl) return fromUrl;
  }

  const specifier = ["@mlc-ai", "web-llm"].join("/");
  return (await import(/* @vite-ignore */ specifier)) as unknown as WebLLMModule;
}
