# Offline WebLLM assistant for Abuilder (React)

Pure browser-side inference via `@mlc-ai/web-llm`. No cloud LLM API.

## Models

- Default: `Qwen2.5-1.5B-Instruct-q4f16_1-MLC`
- Optional: `Qwen2.5-3B-Instruct-q4f16_1-MLC`

Requires WebGPU (Chrome/Edge). First run downloads model weights into the browser cache; later runs work offline.

## Install note

`@mlc-ai/web-llm` is vendored at `vendor/bundled/web-llm` (avoids root `node_modules` permission issues). Prefer a normal `pnpm add @mlc-ai/web-llm` when the monorepo store is writable.
