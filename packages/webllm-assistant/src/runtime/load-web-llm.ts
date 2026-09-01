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

function runtimeSpecifier(): string {
  return ["@mlc-ai", "web-llm"].join("/");
}

function urlFromUnknown(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "default" in (value as object)) {
    const nested = (value as { default: unknown }).default;
    return typeof nested === "string" ? nested : null;
  }
  return null;
}

/**
 * Load the WebLLM runtime.
 *
 * Vite: a sibling module holds a static package import so the Vite plugin can
 * copy the huge file as an asset and skip stripLiteral.
 * Webpack/Umi: that sibling is webpackIgnore'd, so no async chunk is emitted
 * and the gzip size reporter cannot trip over a query-string filename.
 */
export async function loadWebLlmModule(): Promise<WebLLMModule> {
  try {
    const viteLoader = await import(
      /* webpackIgnore: true */
      "./load-web-llm.vite"
    );
    const loaded = await viteLoader.importWebLlm();
    const asModule = moduleFromUnknown(loaded);
    if (asModule) return asModule;
    const assetHref = urlFromUnknown(loaded);
    if (assetHref) {
      const fromUrl = moduleFromUnknown(
        await import(/* @vite-ignore */ assetHref)
      );
      if (fromUrl) return fromUrl;
    }
  } catch {
    // Webpack/Umi (or missing Vite plugin): fall through to a runtime specifier.
  }

  const loaded: unknown = await import(
    /* webpackIgnore: true */
    /* @vite-ignore */
    runtimeSpecifier()
  );
  const asModule = moduleFromUnknown(loaded);
  if (asModule) return asModule;
  throw new Error("Failed to load WebLLM runtime");
}
