import veauryVitePlugins from "veaury/vite/index.js";
import { webllmAssistant } from "@arronqzy/abuilder/vite";

/**
 * Vue 宿主一站式 Vite 插件：内置 Veaury（Vue SFC + React JSX）与可选 AI。
 * 宿主不要再单独加 `vue()` / 不要再直接使用 veaury。
 *
 * @param {{ ai?: boolean, veaury?: object, webllm?: object }} [options]
 * @returns {import('vite').PluginOption[]}
 */
export function abuilderVue(options = {}) {
  const { ai = true, veaury, webllm } = options;

  const veauryPlugins = veauryVitePlugins({
    type: "custom",
    vueJsxInclude: [
      /vue&type=script&lang\.[tj]sx$/i,
      /vue&type=script&setup=true&lang\.[tj]sx$/i,
    ],
    ...veaury,
  });

  const plugins = [...veauryPlugins];
  if (ai) {
    plugins.push(webllmAssistant(webllm));
  }
  return plugins;
}

export { webllmAssistant } from "@arronqzy/abuilder/vite";
