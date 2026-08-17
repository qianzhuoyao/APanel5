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

/**
 * Prevent Vite from running stripLiteral / commonjs transform on the huge
 * `@mlc-ai/web-llm` bundle (Maximum call stack size exceeded).
 */
export function webllmAssistant(): VitePlugin {
  return {
    name: "arronqzy-webllm-assistant",
    config() {
      return {
        optimizeDeps: {
          exclude: ["@mlc-ai/web-llm"],
        },
        build: {
          commonjsOptions: {
            exclude: WEB_LLM_EXCLUDE,
          },
        },
      };
    },
    async resolveId(source, importer, options) {
      if (source !== "@mlc-ai/web-llm") return null;
      const resolved = await (
        this as unknown as {
          resolve: (
            id: string,
            importer: string | undefined,
            opts: { skipSelf?: boolean }
          ) => Promise<{ id: string } | null>;
        }
      ).resolve("@mlc-ai/web-llm/lib/index.js", importer, {
        ...options,
        skipSelf: true,
      });
      if (!resolved) return null;
      if (resolved.id.includes("?url")) return resolved.id;
      return `${resolved.id}?url`;
    },
  };
}
