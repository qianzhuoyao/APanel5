# @arronqzy/abuilder-vue

Vue 3 版 Abuilder 入口包，对应 React 版的 `@arronqzy/abuilder`。安装后即可通过 `<App />` 渲染完整编辑器。

## 安装

```bash
pnpm add @arronqzy/abuilder-vue vue ant-design-vue
```

## 使用

```ts
import { createApp } from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import { App } from "@arronqzy/abuilder-vue";

createApp(App).use(Antd).mount("#app");
```

### 可选配置

```vue
<App class="h-screen" :initial-zoom="1" default-theme="dark" />
```

| Prop | 说明 | 默认 |
|------|------|------|
| `class` | 根容器 class | — |
| `initialZoom` | 画布初始缩放 | `1` |
| `defaultTheme` | `light` / `dark` | `dark` |
| `previewSearch` | 覆盖预览 URL 查询串 | 当前 `location.search` |

### 在线预览 URL

当 URL 含 `?preview=online&projectId=<id>` 时，自动渲染 `VueViewOnlinePreview`（从 IndexedDB 加载工作区并执行蓝图生命周期）。

## 依赖包

- `@arronqzy/vue-view` — 视图编辑器（画布、工作区、配置侧栏）
- `ant-design-vue` — UI 组件
- `vue` — peer dependency

## 许可证

MIT
