import fs from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";

interface WebllmPluginThis {
  meta: { watchMode: boolean };
  resolve: (
    id: string,
    importer?: string,
    opts?: { skipSelf?: boolean }
  ) => Promise<{ id: string } | null>;
}

interface WebllmVitePlugin {
  name: string;
  enforce?: "pre" | "post";
  config: () => {
    define: Record<string, string>;
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
  load?: (
    this: WebllmPluginThis,
    id: string
  ) => string | null | Promise<string | null>;
  transform?: (
    this: WebllmPluginThis,
    code: string,
    id: string
  ) =>
    | string
    | null
    | { code: string; map: null }
    | Promise<string | null | { code: string; map: null }>;
  buildStart?: () => void | Promise<void>;
}

/** Kept for hosts that still import the old virtual id. Runtime uses `web-llm-vite-entry.ts`. */
export const WEBLLM_VITE_ENTRY = "virtual:arronqzy-webllm-entry";
const RESOLVED_WEBLLM_VITE_ENTRY = "\0" + WEBLLM_VITE_ENTRY;
const VITE_ENTRY_FILE = "web-llm-vite-entry.ts";

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

  function isViteEntryModule(id: string): boolean {
    const file = id.split("?")[0]?.replace(/\\/g, "/") ?? "";
    return file.endsWith(`/${VITE_ENTRY_FILE}`);
  }

  async function webLlmAssetModule(
    ctx: WebllmPluginThis,
    importer?: string
  ): Promise<string> {
    const file = await resolveWebLlmFile(ctx, importer);
    if (ctx.meta?.watchMode) {
      return `export default ${JSON.stringify(WEBLLM_RAW_DEV_PATH)};\n`;
    }
    const assetId = withAssetQuery(file);
    return `import __webllmAssetUrl from ${JSON.stringify(assetId)};\nexport default __webllmAssetUrl;\n`;
  }

  async function resolveWebLlmFile(
    ctx: {
      resolve: (
        id: string,
        importer?: string,
        opts?: { skipSelf?: boolean }
      ) => Promise<{ id: string } | null>;
    },
    importer?: string
  ): Promise<string> {
    if (webLlmFile) return webLlmFile;
    const resolved =
      (await ctx.resolve(WEB_LLM_ID, importer, { skipSelf: true })) ??
      (await ctx.resolve(WEB_LLM_ENTRY, importer, { skipSelf: true }));
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
    async load(this: WebllmPluginThis, id) {
      if (id !== RESOLVED_WEBLLM_VITE_ENTRY) return null;
      return webLlmAssetModule(this);
    },
    async transform(this: WebllmPluginThis, _code, id) {
      if (!isViteEntryModule(id)) return null;
      const importer = id.split("?")[0];
      return { code: await webLlmAssetModule(this, importer), map: null };
    },
  };
}
