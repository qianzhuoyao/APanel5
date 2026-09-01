type VitePlugin = {
  name: string;
  enforce?: "pre" | "post";
  config: () => {
    optimizeDeps: { exclude: string[] };
    build: {
      commonjsOptions: { exclude: RegExp[] };
    };
  };
  resolveId?: (
    source: string,
    importer: string | undefined,
    options: { skipSelf?: boolean }
  ) => Promise<{ id: string; external?: boolean } | string | null>;
  load?: (id: string) => string | null;
};

/** Import this from `load-web-llm.vite.ts` so consumer graphs never mention `@mlc-ai/web-llm`. */
export const WEBLLM_VITE_ENTRY = "virtual:arronqzy-webllm-entry";
const RESOLVED_WEBLLM_VITE_ENTRY = "\0" + WEBLLM_VITE_ENTRY;

const WEB_LLM_EXCLUDE = [
  /@mlc-ai[\\/]web-llm/,
  /@mlc-ai\+web-llm/,
  /node_modules[\\/]\.pnpm[\\/]@mlc-ai\+web-llm/,
];

const WEB_LLM_ID = ["@mlc-ai", "web-llm"].join("/");
const WEB_LLM_ENTRY = `${WEB_LLM_ID}/lib/index.js`;
const ASSET_QUERY = ["", "url"].join("?");

function isWebLlmRequest(source: string): boolean {
  if (source === WEB_LLM_ID || source === WEB_LLM_ENTRY) return true;
  if (source.includes("@mlc-ai/web-llm") || source.includes("@mlc-ai+web-llm")) {
    return true;
  }
  return false;
}

function withAssetQuery(resolvedId: string): string {
  if (resolvedId.includes(ASSET_QUERY)) return resolvedId;
  return `${resolvedId}${ASSET_QUERY}`;
}

/**
 * Prevent Vite from running stripLiteral / commonjs transform on the huge
 * WebLLM bundle (Maximum call stack size exceeded).
 */
export function webllmAssistant(): VitePlugin {
  return {
    name: "arronqzy-webllm-assistant",
    enforce: "pre",
    config() {
      return {
        optimizeDeps: {
          exclude: [WEB_LLM_ID],
        },
        build: {
          commonjsOptions: {
            exclude: WEB_LLM_EXCLUDE,
          },
        },
      };
    },
    async resolveId(source, importer, options) {
      if (source === WEBLLM_VITE_ENTRY) {
        return RESOLVED_WEBLLM_VITE_ENTRY;
      }

      if (isWebLlmRequest(source)) {
        const resolved = await (
          this as unknown as {
            resolve: (
              id: string,
              importer: string | undefined,
              opts: { skipSelf?: boolean }
            ) => Promise<{ id: string } | null>;
          }
        ).resolve(WEB_LLM_ENTRY, importer, {
          ...options,
          skipSelf: true,
        });
        if (!resolved) return null;
        return withAssetQuery(resolved.id);
      }

      // Already-resolved absolute paths (e.g. prebundled graph) still hit commonjs.
      if (
        (source.includes("@mlc-ai/web-llm") || source.includes("@mlc-ai+web-llm")) &&
        source.endsWith("/lib/index.js") &&
        !source.includes(ASSET_QUERY)
      ) {
        return withAssetQuery(source);
      }

      return null;
    },
    load(id) {
      if (id !== RESOLVED_WEBLLM_VITE_ENTRY) return null;
      // Dynamic import keeps the specifier out of Rollup's static graph until resolveId runs.
      return `export default import("${WEB_LLM_ID}");`;
    },
  };
}
