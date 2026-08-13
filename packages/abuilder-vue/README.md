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
<App
  class="h-screen"
  :initial-zoom="1"
  default-theme="dark"
  locale="zh-CN"
/>
```

| Prop | 说明 | 默认 |
|------|------|------|
| `class` | 根容器 class | — |
| `initialZoom` | 画布初始缩放 | `1` |
| `defaultTheme` | `light` / `dark` | `dark` |
| `locale` | `zh-CN` / `en-US`；省略则按 localStorage → 浏览器 → zh-CN | `null` |
| `previewSearch` | 覆盖预览 URL 查询串 | 当前 `location.search` |

顶栏「语言」可运行时切换中文 / English（写入 `abuilder.locale`）。Ant Design Vue 的 `ConfigProvider.locale` 会随语言同步。

### 在线预览 URL

当 URL 含 `?preview=online&projectId=<id>` 时，自动渲染 `VueViewOnlinePreview`。

## 依赖包

- `@arronqzy/vue-view` — 视图编辑器
- `@arronqzy/i18n` — 共享中英文本
- `ant-design-vue` — UI 组件
- `vue` — peer dependency

## 许可证

MIT
