# @arronqzy/abuilder-vue

Vue 3 版入口，对应 React 的 `@arronqzy/abuilder`。功能对齐：无限画布、物料配置、图层、蓝图调试、工作区和中英切换。UI 是 Ant Design Vue，蓝图画布是 Vue Flow。

本包 **0.1.20** 与 `@arronqzy/abuilder@1.1.36` 能力对齐（蓝图 Soft UI、接口集合、System 模版、JSON 错误高亮等）。中文全功能手册：仓库 `docs/Abuilder使用文档与功能说明.docx`。

![同一套编辑器：上半视图，下半蓝图](https://github.com/qianzhuoyao/APanel5/raw/v5/docs/guide-assets/live-zh/40-blueprint-open.png)

## 安装

```bash
pnpm add @arronqzy/abuilder-vue vue ant-design-vue
```

## 最小用法

```ts
import { createApp } from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import { App } from "@arronqzy/abuilder-vue";

createApp(App).use(Antd).mount("#app");
```

必须 `use(Antd)`。语言切换时，Ant Design Vue 的 `ConfigProvider.locale` 会跟着变。

```vue
<App
  class="h-screen"
  :initial-zoom="1"
  default-theme="dark"
  locale="zh-CN"
  name-space="my-app"
/>
```

## Props

| Prop | 说明 | 默认 |
|------|------|------|
| `class` | 根容器 class | — |
| `initialZoom` | 画布初始缩放 | `1` |
| `defaultTheme` | `light` / `dark` | `dark` |
| `locale` | `zh-CN` / `en-US`；省略则 localStorage → 浏览器 → 中文 | `null` |
| `nameSpace` | 隔离 IndexedDB；同一页多个 App 必须不同 | — |
| `previewSearch` | 覆盖预览 URL 查询串 | 当前 `location.search` |
| `preview` | `true` 为预览页 | `false` |
| `initialWorkspace` | 完整工作区。空则空白画布，不会自动打开 IndexedDB 记录 | — |

顶栏可切换中文 / English（`abuilder.locale`）。

## 编辑和预览

```vue
<App :key="workspace.id" :initial-workspace="workspace" />
<App :key="workspace.id" preview :initial-workspace="workspace" />
```

切换工作区时带 `key`。URL 含 `?preview=online&projectId=<id>` 时从 IndexedDB 进入预览。传了 `nameSpace` 时预览 URL 带 `ns=`。

## 自己存工作区

不要读写编辑器内部 IndexedDB。订阅事件，把完整对象交给自己的后端：

```ts
import {
  addEventSubscription,
  AbuilderEvents,
  parseWorkspaceData,
  createEmptyWorkspace,
  createWorkspaceProjectId,
  validateWorkspaceData,
  type WorkspaceData,
} from "@arronqzy/abuilder-vue";

const syncSub = addEventSubscription(
  AbuilderEvents.workspaceSync,
  async (workspace: WorkspaceData) => {
    await saveToServer(workspace);
  }
);
syncSub.unsubscribe();

const parsed = parseWorkspaceData(jsonFromBackend);
if (parsed.ok && parsed.value) {
  // <App :initial-workspace="parsed.value" />
}

createEmptyWorkspace({ name: "未命名", id: createWorkspaceProjectId() });
validateWorkspaceData(workspace);
```

| 事件 | 常量 | 何时触发 |
|------|------|----------|
| `workspace:add` | `AbuilderEvents.workspaceAdd` | 创建成功 |
| `workspace:sync` | `AbuilderEvents.workspaceSync` | 同步成功 |

`validate*` 只检查。`parseWorkspaceData` 会补齐 `id`、时间戳和空字段。只检查视图用 `validateViewData` / `parseViewData`；只检查蓝图用 `validateBlueprintData` / `parseBlueprintData`。

`WorkspaceData` 字段与 React 版相同：`id`、`name`、`createdAt`、`updatedAt`、`panelState`、`blueprintDocument`、`blueprintMeta`、`productName`、`titleIconDataUrl`。

## 和 React 版的差别

- **没有** `getPreviewSnapshot`。要缩略图就自己截预览 DOM，不要假设有同名导出。
- 组件是 Ant Design Vue，不是 `@arronqzy/ui`。
- 本包以源码发布（`exports` 指向 `src/`），宿主需要能编译 Vue SFC。

本仓库演示：

```bash
pnpm -C apps/web-vue dev
```

`http://127.0.0.1:31012`。

## 依赖

- `@arronqzy/vue-view` — 视图编辑器
- `@arronqzy/i18n` — 中英文案
- `ant-design-vue` — UI
- `vue` — peer

## 许可证

MIT
