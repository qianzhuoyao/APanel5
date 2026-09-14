# @arronqzy/webllm-assistant

编辑器右上角「AI 助手」的运行时：在浏览器里用 WebGPU 跑小模型，不调用云端大模型接口。第一次会下载权重到浏览器缓存，之后可离线。

需要 Chrome / Edge 且开启 WebGPU。没有 WebGPU 时助手不可用，编辑器其余功能不受影响。

## 模型

- 默认：`Qwen2.5-1.5B-Instruct-q4f16_1-MLC`
- 可选：`Qwen2.5-3B-Instruct-q4f16_1-MLC`

模型通过 `@mlc-ai/web-llm` 加载。本仓库把这份依赖放在 `vendor/bundled/web-llm`，避免根 `node_modules` 权限问题时装不上。可写 store 时更推荐正常 `pnpm add @mlc-ai/web-llm`。

## Vite（必加）

Vite 5 转换 `@mlc-ai/web-llm` 时，`stripLiteral` 会栈溢出。任何打包了本包或 `@arronqzy/react-view` 的 Vite 应用都要加插件：

```ts
import { defineConfig } from "vite";
import { webllmAssistant } from "@arronqzy/abuilder/vite";

export default defineConfig({
  plugins: [webllmAssistant()],
});
```

从 `@arronqzy/abuilder/vite` 导入，不要从 `@arronqzy/webllm-assistant/vite` 导入。pnpm 下后者往往不是宿主的直接依赖，配置阶段会 `ERR_MODULE_NOT_FOUND`。

不要在共享源码里写带 Vite 资源查询的 WebLLM import。Webpack / Umi 会把 `?url` 写进异步 chunk 文件名，gzip 体积统计随后 `ENOENT`。

## Webpack / Umi

不要导入 `@arronqzy/webllm-assistant/vite`，也不要写 `@mlc-ai/web-llm?url`。使用 `@arronqzy/webllm-assistant@0.1.16` 或 `@arronqzy/abuilder@1.1.28` 及以上：加载器打出普通的 `mlc-web-llm` 异步 chunk，而不是 `@mlc-ai-web-llm?url-lib.async.js`。

## 助手能改什么

协议在 `src/actions`：模型输出结构化动作，由编辑器落到画布 / 蓝图，而不是让模型直接改 DOM。具体动作以 `schema.ts` 为准。宿主不需要自己调推理；用 `<App />` 即可出现入口。

## 许可证

见 `package.json`。
