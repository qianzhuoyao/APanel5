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

declare const __WEBLLM_VITE_LOADER__: boolean | undefined;

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

function usesViteLoader(): boolean {
  return typeof __WEBLLM_VITE_LOADER__ !== "undefined" && __WEBLLM_VITE_LOADER__;
}

const VITE_PLUGIN_HINT =
  "Add webllmAssistant() from @arronqzy/abuilder/vite to your Vite plugins.";

async function unwrapLoaded(value: unknown): Promise<unknown> {
  let current = value;
  // Virtual entry may nest `{ default }` / Promise from earlier plugin shapes.
  for (let i = 0; i < 4; i += 1) {
    if (current && typeof (current as Promise<unknown>).then === "function") {
      current = await (current as Promise<unknown>);
      continue;
    }
    if (current && typeof current === "object" && "default" in (current as object)) {
      const nested = (current as { default: unknown }).default;
      if (nested !== current) {
        current = nested;
        continue;
      }
    }
    break;
  }
  return current;
}

async function importAssetHref(assetHref: string): Promise<unknown> {
  return import(/* @vite-ignore */ assetHref);
}

async function loadViaVite(): Promise<WebLLMModule> {
  const viteLoader = await import("./load-web-llm.vite");
  const loaded = await unwrapLoaded(await viteLoader.importWebLlm());
  const asModule = moduleFromUnknown(loaded);
  if (asModule) return asModule;

  const assetHref = typeof loaded === "string" ? loaded : urlFromUnknown(loaded);
  if (assetHref) {
    const fromUrl = moduleFromUnknown(
      await unwrapLoaded(await importAssetHref(assetHref))
    );
    if (fromUrl) return fromUrl;
  }

  throw new Error(`WebLLM asset URL was not produced. ${VITE_PLUGIN_HINT}`);
}

/**
 * Webpack/Umi async chunk. Never use `?url` here — Umi's fileSizeReporter treats
 * `?` as a query string and ENOENTs on `@mlc-ai-web-llm?url-lib.async.js`.
 */
async function loadViaWebpack(): Promise<WebLLMModule> {
  const loaded: unknown = await import(
    /* webpackChunkName: "mlc-web-llm" */
    /* @vite-ignore */
    runtimeSpecifier()
  );
  const asModule = moduleFromUnknown(loaded);
  if (asModule) return asModule;
  throw new Error("Failed to load WebLLM runtime");
}

/**
 * Load the WebLLM runtime.
 *
 * Vite (webllmAssistant plugin sets __WEBLLM_VITE_LOADER__): virtual entry → asset copy.
 * Webpack/Umi: bare `@mlc-ai/web-llm` async chunk with a safe filename.
 */
export async function loadWebLlmModule(): Promise<WebLLMModule> {
  if (usesViteLoader()) {
    return loadViaVite();
  }
  return loadViaWebpack();
}
