import fs from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";

interface WebllmVitePlugin {
  name: string;
  enforce?: "pre" | "post";
  config: () => {
    optimizeDeps: { exclude: string[] };
    build: {
      commonjsOptions: { exclude: RegExp[] };
    };
  };
  configureServer?: (server: {
    middlewares: {
      use: (
        fn: (
          req: IncomingMessage,
          res: ServerResponse,
          next: (err?: unknown) => void
        ) => void
      ) => void;
    };
  }) => void;
  resolveId?: (
    source: string,
    importer: string | undefined,
    options: { skipSelf?: boolean }
  ) => Promise<{ id: string; external?: boolean } | string | null>;
  load?: (id: string) => string | null | Promise<string | null>;
  buildStart?: () => void | Promise<void>;
}

/** Import this from `load-web-llm.vite.ts` so consumer graphs never mention `@mlc-ai/web-llm`. */
export const WEBLLM_VITE_ENTRY = "virtual:arronqzy-webllm-entry";
const RESOLVED_WEBLLM_VITE_ENTRY = "\0" + WEBLLM_VITE_ENTRY;

/** Dev-only raw ESM endpoint — bypasses Vite transform / ?url remapping. */
const WEBLLM_RAW_DEV_PATH = "/@arronqzy-webllm/web-llm.js";

const WEB_LLM_EXCLUDE = [
  /@mlc-ai[\\/]web-llm/,
  /@mlc-ai\+web-llm/,
  /node_modules[\\/]\.pnpm[\\/]@mlc-ai\+web-llm/,
];

const WEB_LLM_ID = ["@mlc-ai", "web-llm"].join("/");
const WEB_LLM_ENTRY = `${WEB_LLM_ID}/lib/index.js`;
const ASSET_QUERY = ["", "url"].join("?");

function isBareWebLlmSpecifier(source: string): boolean {
  if (source.includes("?")) return false;
  return source === WEB_LLM_ID || source === WEB_LLM_ENTRY;
}

function withAssetQuery(resolvedId: string): string {
  if (resolvedId.includes(ASSET_QUERY)) return resolvedId;
  return `${resolvedId}${ASSET_QUERY}`;
}

/**
 * Prevent Vite from running stripLiteral / commonjs transform on the huge
 * WebLLM bundle (Maximum call stack size exceeded).
 *
 * Dev: virtual entry → raw middleware URL (native dynamic import).
 * Build: virtual entry → `?url` asset href.
 */
export function webllmAssistant(): WebllmVitePlugin {
  let webLlmFile: string | null = null;

  async function resolveWebLlmFile(
    ctx: {
      resolve: (
        id: string,
        importer?: string,
        opts?: { skipSelf?: boolean }
      ) => Promise<{ id: string } | null>;
    }
  ): Promise<string> {
    if (webLlmFile) return webLlmFile;
    const resolved =
      (await ctx.resolve(WEB_LLM_ID, undefined, { skipSelf: true })) ??
      (await ctx.resolve(WEB_LLM_ENTRY, undefined, { skipSelf: true }));
    if (!resolved) {
      throw new Error(
        `[arronqzy-webllm-assistant] Cannot resolve ${WEB_LLM_ID}. Alias it or install the package.`
      );
    }
    webLlmFile = resolved.id.split("?")[0]!;
    return webLlmFile;
  }

  return {
    name: "arronqzy-webllm-assistant",
    enforce: "pre",
    config() {
      return {
        define: {
          __WEBLLM_VITE_LOADER__: JSON.stringify(true),
        },
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
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathOnly = req.url?.split("?")[0];
        if (pathOnly !== WEBLLM_RAW_DEV_PATH) {
          next();
          return;
        }
        if (!webLlmFile || !fs.existsSync(webLlmFile)) {
          res.statusCode = 500;
          res.end(
            `[arronqzy-webllm-assistant] WebLLM file not resolved yet (${webLlmFile ?? "null"})`
          );
          return;
        }
        res.setHeader("Content-Type", "text/javascript; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache");
        fs.createReadStream(webLlmFile).pipe(res);
      });
    },
    async resolveId(source, importer, options) {
      if (source === WEBLLM_VITE_ENTRY) {
        return RESOLVED_WEBLLM_VITE_ENTRY;
      }

      // Only bare package specifiers → ?url (keeps accidental imports out of transform).
      // Do NOT remap absolute /@fs paths — that made the runtime href un-importable.
      if (isBareWebLlmSpecifier(source)) {
        const resolve = (
          this as unknown as {
            resolve: (
              id: string,
              importer: string | undefined,
              opts: { skipSelf?: boolean }
            ) => Promise<{ id: string } | null>;
          }
        ).resolve.bind(this);
        const resolved =
          (await resolve(WEB_LLM_ID, importer, {
            ...options,
            skipSelf: true,
          })) ??
          (await resolve(WEB_LLM_ENTRY, importer, {
            ...options,
            skipSelf: true,
          }));
        if (!resolved) return null;
        return withAssetQuery(resolved.id);
      }

      return null;
    },
    async load(id) {
      if (id !== RESOLVED_WEBLLM_VITE_ENTRY) return null;

      const file = await resolveWebLlmFile(
        this as unknown as {
          resolve: (
            id: string,
            importer?: string,
            opts?: { skipSelf?: boolean }
          ) => Promise<{ id: string } | null>;
        }
      );

      // Dev server: raw middleware URL so dynamic import gets real ESM bytes.
      if (this.meta.watchMode) {
        return `export default ${JSON.stringify(WEBLLM_RAW_DEV_PATH)};\n`;
      }

      // Production build: Vite asset URL (no transform / stripLiteral).
      const assetId = withAssetQuery(file);
      return `import __webllmAssetUrl from ${JSON.stringify(assetId)};\nexport default __webllmAssetUrl;\n`;
    },
  };
}
