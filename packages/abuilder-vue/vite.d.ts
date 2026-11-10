import type { PluginOption } from "vite";
import type { webllmAssistant } from "@arronqzy/abuilder/vite";

export type AbuilderVueViteOptions = {
  /**
   * 是否注册 WebLLM Vite 插件。
   * 宿主传入 `plugins: ['ai']` 时应保持默认 `true`；不开 AI 可设 `false`。
   * @default true
   */
  ai?: boolean;
  /** 透传给 `veauryVitePlugins` 的额外选项（一般不用改）。 */
  veaury?: Record<string, unknown>;
  /** 透传给 `webllmAssistant`。 */
  webllm?: Parameters<typeof webllmAssistant>[0];
};

/**
 * Vue 宿主一站式 Vite 插件：内置 Veaury（Vue SFC + React JSX）与可选 AI。
 * 不要再单独加 `@vitejs/plugin-vue`，也不要在宿主里直接使用 veaury。
 */
export function abuilderVue(options?: AbuilderVueViteOptions): PluginOption[];

export { webllmAssistant } from "@arronqzy/abuilder/vite";
