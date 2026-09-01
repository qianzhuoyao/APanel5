# Offline WebLLM assistant for Abuilder (React)

Pure browser-side inference via `@mlc-ai/web-llm`. No cloud LLM API.

## Models

- Default: `Qwen2.5-1.5B-Instruct-q4f16_1-MLC`
- Optional: `Qwen2.5-3B-Instruct-q4f16_1-MLC`

Requires WebGPU (Chrome/Edge). First run downloads model weights into the browser cache; later runs work offline.

## Install note

`@mlc-ai/web-llm` is vendored at `vendor/bundled/web-llm` (avoids root `node_modules` permission issues). Prefer a normal `pnpm add @mlc-ai/web-llm` when the monorepo store is writable.

## Vite

Vite 5 can crash while transforming `@mlc-ai/web-llm` (`Maximum call stack size exceeded` in `stripLiteral`). Add the helper plugin so the huge bundle is excluded from commonjs / dep optimization:

```ts
import { webllmAssistant } from "@arronqzy/webllm-assistant/vite";

export default defineConfig({
  plugins: [webllmAssistant()],
});
```

Do not put a Vite asset-query import of WebLLM in shared source. Webpack/Umi will bake the query into the async chunk filename, and the gzip size reporter then fails with ENOENT. Vite hosts should use the plugin above instead.
