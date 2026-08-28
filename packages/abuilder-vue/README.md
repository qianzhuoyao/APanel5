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
  name-space="my-app"
/>
```

| Prop | 说明 | 默认 |
|------|------|------|
| `class` | 根容器 class | — |
| `initialZoom` | 画布初始缩放 | `1` |
| `defaultTheme` | `light` / `dark` | `dark` |
| `locale` | `zh-CN` / `en-US`；省略则按 localStorage → 浏览器 → zh-CN | `null` |
| `nameSpace` | 隔离 IndexedDB / 缓存；同一页面多个 App 传入不同值 | — |
| `previewSearch` | 覆盖预览 URL 查询串 | 当前 `location.search` |
| `preview` | `true` 为预览页（用 `initialWorkspace`），`false` 为编辑面板 | `false` |
| `initialWorkspace` | 完整工作区；空则首次渲染空白，不会自动打开 IndexedDB 记录 | — |

顶栏「语言」可运行时切换中文 / English（写入 `abuilder.locale`）。Ant Design Vue 的 `ConfigProvider.locale` 会随语言同步。

### 编辑 / 预览模式

```vue
<!-- 编辑：把后端工作区灌进面板 -->
<App :key="workspace.id" :initial-workspace="workspace" />

<!-- 预览：根据同一份数据直接渲染预览页 -->
<App :key="workspace.id" preview :initial-workspace="workspace" />
```

切换工作区时建议配合 `key`。URL 含 `?preview=online&projectId=<id>` 时也会进入预览（从 IndexedDB 加载）。传了 `nameSpace` 时预览 URL 会带 `ns=`。

### 外部持久化

创建 / 同步工作区时会发出事件，回调带完整 `WorkspaceData`，请写入自己的后端，不要去调编辑器内部的 IndexedDB：

```ts
import {
  addEventSubscription,
  AbuilderEvents,
  parseWorkspaceData,
  type WorkspaceData,
} from "@arronqzy/abuilder-vue";

const addSub = addEventSubscription(AbuilderEvents.workspaceAdd, async (workspace: WorkspaceData) => {
  await saveToServer(workspace);
});
const syncSub = addEventSubscription(AbuilderEvents.workspaceSync, async (workspace) => {
  await saveToServer(workspace);
});
addSub.unsubscribe();
syncSub.unsubscribe();
```

从后端取回后用 `parseWorkspaceData` 规范化，再交给 `initialWorkspace`：

```ts
import {
  parseWorkspaceData,
  createEmptyWorkspace,
  createWorkspaceProjectId,
  validateViewData,
  validateBlueprintData,
  validateWorkspaceData,
} from "@arronqzy/abuilder-vue";

const parsed = parseWorkspaceData(jsonFromBackend);
if (parsed.ok && parsed.value) {
  // <App :initial-workspace="parsed.value" />
}

createEmptyWorkspace({ name: "未命名", id: createWorkspaceProjectId() });
validateWorkspaceData(workspace); // 只检查，不改数据
```

`validate*` 只回答能不能用。`parseWorkspaceData` 会补齐 `id` / 时间戳 / 空字段。只检查视图或只检查蓝图时用 `validateViewData` / `parseViewData`、`validateBlueprintData` / `parseBlueprintData`。

本包 **没有** `getPreviewSnapshot`（React 的 `@arronqzy/abuilder` 才有画布截图）。Vue 侧若需要缩略图，请自行对预览 DOM 截图，不要假定存在同名导出。

## 依赖包

- `@arronqzy/vue-view` — 视图编辑器
- `@arronqzy/i18n` — 共享中英文本
- `ant-design-vue` — UI 组件
- `vue` — peer dependency

## 许可证

MIT
