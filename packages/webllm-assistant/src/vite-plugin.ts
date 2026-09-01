type VitePlugin = {
  name: string;
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
};

const WEB_LLM_EXCLUDE = [
  /@mlc-ai\/web-llm/,
  /node_modules[\\/]\.pnpm[\\/]@mlc-ai\+web-llm/,
];

const WEB_LLM_ID = ["@mlc-ai", "web-llm"].join("/");
const WEB_LLM_ENTRY = `${WEB_LLM_ID}/lib/index.js`;
const ASSET_QUERY = ["", "url"].join("?");

/**
 * Prevent Vite from running stripLiteral / commonjs transform on the huge
 * WebLLM bundle (Maximum call stack size exceeded).
 */
export function webllmAssistant(): VitePlugin {
  return {
    name: "arronqzy-webllm-assistant",
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
      if (source !== WEB_LLM_ID) return null;
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
      if (resolved.id.includes(ASSET_QUERY)) return resolved.id;
      return `${resolved.id}${ASSET_QUERY}`;
    },
  };
}
