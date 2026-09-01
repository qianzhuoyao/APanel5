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

function isViteBundler(): boolean {
  return typeof import.meta !== "undefined" && "env" in import.meta;
}

const VITE_PLUGIN_HINT =
  "Add webllmAssistant() from @arronqzy/abuilder/vite to your Vite plugins.";

/**
 * Load the WebLLM runtime.
 *
 * Vite: virtual entry + plugin copies the huge file as an asset (no stripLiteral).
 * Webpack/Umi: vite sibling is webpackIgnore'd; runtime import is also ignored.
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
    if (isViteBundler()) {
      throw new Error(`WebLLM asset URL was not produced. ${VITE_PLUGIN_HINT}`);
    }
  } catch (error) {
    if (isViteBundler()) {
      const message =
        error instanceof Error ? error.message : "WebLLM Vite loader failed";
      throw new Error(`${message}. ${VITE_PLUGIN_HINT}`, {
        cause: error instanceof Error ? error : undefined,
      });
    }
    // Webpack/Umi: fall through to a runtime specifier import.
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
