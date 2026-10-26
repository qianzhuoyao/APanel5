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
| `initialWorkspace` | 完整工作区。空则空白画布，不会自动打开 IndexedDB 记录。传入且带 `id` 时默认同步写入 IndexedDB（本地已有更新的记录不会被旧数据覆盖），以便预览与「同步」可用 | — |
| `workspaceId` | 按 IndexedDB id 打开（不 remount）。与 `initialWorkspace` 同时存在时：首次优先完整记录；之后 id 变化从 IndexedDB 打开 | — |

顶栏可切换中文 / English（`abuilder.locale`）。可用 `ref` 拿到 `AbuilderViewHandle`（`openWorkspace` / `syncWorkspace` / `getCurrentWorkspace` 等）。

## 编辑和预览

```vue
<App :key="workspace.id" :initial-workspace="workspace" />
<App :key="workspace.id" preview :initial-workspace="workspace" />
```

切换工作区时带 `key`。URL 含 `?preview=online&projectId=<id>` 时从 IndexedDB 进入预览。传了 `nameSpace` 时预览 URL 带 `ns=`。

## 自己存工作区

以自己的后端为准：订阅 `workspace:add` / `workspace:sync`（载荷含 `nameSpace`），把完整对象交给后端；打开时校验后再传 `initialWorkspace`（会默认同步进 IndexedDB）。也可用 `putWorkspaceProject` 在不挂载编辑器时预热本地库，或用 `openWorkspace` / `workspaceId` / `ref` 命令式打开。

```ts
import {
  addEventSubscription,
  AbuilderEvents,
  parseWorkspaceData,
  putWorkspaceProject,
  openWorkspace,
  getCurrentWorkspace,
  getPreviewSnapshot,
  type WorkspaceData,
} from "@arronqzy/abuilder-vue";

addEventSubscription(
  AbuilderEvents.workspaceSync,
  async (workspace) => {
    await saveToServer(workspace);
  },
  { nameSpace: "my-app" }
);

const parsed = parseWorkspaceData(jsonFromBackend);
if (parsed.ok && parsed.value) {
  await putWorkspaceProject(parsed.value, "my-app");
  // <App name-space="my-app" :workspace-id="parsed.value.id" />
}
```

| 事件 | 常量 | 说明 |
|------|------|------|
| `workspace:add` / `workspace:sync` | `workspaceAdd` / `workspaceSync` | 载荷为 `WorkspaceData & { nameSpace }` |
| `workspace:delete` | `workspaceDelete` | `{ ids, nameSpace }` |
| `blueprint-library:changed` | `blueprintLibraryChanged` | 蓝图库 put / delete / clear |
| `api-collection:changed` | `apiCollectionChanged` | 接口集合 put / delete / clear |

### 本地数据完整 CRUD

| 数据 | Create / Update | Read | Delete |
|------|-----------------|------|--------|
| 工作区 | `putWorkspaceProject` / `upsertWorkspaceProject` | `list` / `get` | `delete` / `clear` |
| 蓝图库 | `putBlueprintLibraryRecord` | `list` / `get` | `delete` / `clear` |
| 执行日志 | `putExecutionRunRecord` | `list` / `get` | `delete` / `clear` / `purge*` / `trim*` |
| 接口集合 | `putApiCollection` / `upsertApiCollectionFromJson` | `list` | `delete` / `clear` |

`clearAbuilderStorage(nameSpace)` 一次清空四类。`getPreviewSnapshot` 与 React 版同名。

## 和 React 版的差别

- 组件是 Ant Design Vue，不是 `@arronqzy/ui`。
- 本包以源码发布（`exports` 指向 `src/`），宿主需要能编译 Vue SFC。
- 存储 / 事件 / 命令式 API / `getPreviewSnapshot` 与 React 版对齐。

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
