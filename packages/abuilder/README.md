# @arronqzy/abuilder

React 一站式编辑器。安装后渲染 `<App />`，就是完整的 Abuilder：物料画布、蓝图、工作区、在线预览和浏览器内 AI 助手。

![安装后直接得到的编辑器](https://github.com/qianzhuoyao/APanel5/raw/v5/docs/guide-assets/live-zh/01-overview.png)

当前版本见本包 `package.json`（设置菜单「关于」里显示的就是这个版本号）。本包 **1.1.41** 起配套 Soft UI 面板打磨、缩放恒定选框线宽与接口集合弹窗体验；**1.1.40** 起补齐宿主侧完整 CRUD（put / 命令式打开 / 事件 nameSpace / Vue 预览截图）；**1.1.39** 起补齐本地数据接口（蓝图库、执行日志、接口集合的读取与清理，`clearAbuilderStorage` 一次清空，`workspace:delete` 事件）；**1.1.38** 起提供本地工作区清理接口（`listWorkspaceProjects` / `deleteWorkspaceProject` / `clearWorkspaceProjects`）；**1.1.37** 起配套 chroma.js 主题配色、全系统国际化修复与问号图标式字段说明；**1.1.36** 起配套蓝图 Soft UI 节点样式；**1.1.35** 起配套接口集合、`{system?...}` 模版、JSON 节点错误高亮。完整中文手册见仓库 `docs/Abuilder使用文档与功能说明.docx`（适用版本表写在文首）。

## 安装

```bash
pnpm add @arronqzy/abuilder react react-dom
```

需要 React 18+。容器建议撑满高度（样式里已经处理 `#root` / `#app`）。

### Vite 必须加插件

宿主用 Vite 打包 `<App />` 时，在 `vite.config.ts` 注册：

```ts
import { defineConfig } from "vite";
import { webllmAssistant } from "@arronqzy/abuilder/vite";

export default defineConfig({
  plugins: [webllmAssistant()],
});
```

从 `@arronqzy/abuilder/vite` 导入，不要从 `@arronqzy/webllm-assistant/vite` 导入。pnpm 下后者常常不是宿主的直接依赖，配置加载阶段会 `ERR_MODULE_NOT_FOUND`。

不加这个插件，Vite 5 转换 `@mlc-ai/web-llm` 时会在 `stripLiteral` 里栈溢出。Webpack / Umi **不要**导入这个 vite 插件，也不要写 `@mlc-ai/web-llm?url`。

## 最小用法

```tsx
import { createRoot } from "react-dom/client";
import { App } from "@arronqzy/abuilder";
import "@arronqzy/abuilder/styles.css";

createRoot(document.getElementById("root")!).render(<App locale="zh-CN" />);
```

用户打开后会看到：

- 顶栏：文件、编辑、视图、蓝图、设置、创建/保存工作区、AI 助手
- 左侧：物料（图表、文本、表格、几何、三维、媒体）和节点树
- 中间：无限画布，带标尺、缩放、多选
- 右侧：选中节点的配置；没选中时是空状态
- 底部：图层

打开蓝图后上下分屏：

![视图在上、蓝图在下](https://github.com/qianzhuoyao/APanel5/raw/v5/docs/guide-assets/live-zh/40-blueprint-open.png)

## App 参数

| 参数 | 说明 | 默认 |
|------|------|------|
| `className` | 根节点 class | — |
| `initialZoom` | 初始缩放 | `1` |
| `defaultTheme` | `"dark"` / `"light"` | `"dark"` |
| `locale` | `"zh-CN"` / `"en-US"`；省略则 localStorage → 浏览器 → 中文 | — |
| `nameSpace` | 隔离 IndexedDB；同一页多个 App 必须不同 | — |
| `previewSearch` | 预览 URL 查询串 | `window.location.search` |
| `preview` | `true` 只渲染预览页 | `false` |
| `initialWorkspace` | 完整工作区。不传则空白画布，**不会**自动打开 IndexedDB 里已有项目。传入且带 `id` 时，会默认同步写入 IndexedDB（本地已有更新的记录不会被旧数据覆盖），以便预览与「同步」可用 | — |
| `workspaceId` | 按 IndexedDB id 打开（不 remount）。与 `initialWorkspace` 同时存在时：首次优先完整记录；之后 id 变化从 IndexedDB 打开 | — |

```tsx
<App
  className="h-screen"
  defaultTheme="dark"
  locale="zh-CN"
  nameSpace="my-app"
  initialWorkspace={savedWorkspace}
/>
```

顶栏「设置」可切换主题和语言（写入 `abuilder.locale`）。「关于」只显示版本号。

## 编辑和预览

```tsx
<App key={workspace.id} initialWorkspace={workspace} />
<App key={workspace.id} preview initialWorkspace={workspace} />
```

切换工作区时带上 `key`，避免旧画布状态残留。

URL 带 `?preview=online&projectId=<id>` 时进入预览，从 IndexedDB 读。编辑器传了 `nameSpace` 时，预览 URL 会带 `ns=`，预览页用同一命名空间：

```tsx
<App previewSearch="?preview=online&projectId=xxx&ns=my-app" />
```

## 把工作区交给自己的后端

IndexedDB 是编辑器自己的浏览器缓存。宿主仍应以自己的后端为准：

1. 订阅创建和同步事件（`workspace:add` / `workspace:sync`），把回调里的完整对象写到自己的存储。
2. 下次打开时校验 JSON，再交给 `initialWorkspace`；编辑器会把这份工作区默认同步进 IndexedDB，之后「同步 / 预览」不会因本地缺记录报错。
3. 需要清理本地副本时，用导出的 `listWorkspaceProjects` / `deleteWorkspaceProject` / `clearWorkspaceProjects` / `clearAbuilderStorage`，不要直接操作 IndexedDB。

```tsx
import { useEffect, useState } from "react";
import {
  App,
  addEventSubscription,
  AbuilderEvents,
  parseWorkspaceData,
  type WorkspaceData,
} from "@arronqzy/abuilder";
import "@arronqzy/abuilder/styles.css";

function HostApp() {
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const sub = addEventSubscription(AbuilderEvents.workspaceSync, async (data) => {
      await saveToMyBackend(data);
      setWorkspace(data);
    });
    return () => sub.unsubscribe();
  }, []);

  if (!workspace) return <App />;

  return (
    <App
      key={`${workspace.id}-${workspace.updatedAt}-${isPreview}`}
      preview={isPreview}
      initialWorkspace={workspace}
    />
  );
}
```

| 事件 | 常量 | 何时触发 |
|------|------|----------|
| `workspace:add` | `AbuilderEvents.workspaceAdd` | 创建工作区成功 |
| `workspace:sync` | `AbuilderEvents.workspaceSync` | 同步工作区成功 |
| `workspace:delete` | `AbuilderEvents.workspaceDelete` | 删除工作区（界面删除，或调用 `deleteWorkspaceProject` / `clearWorkspaceProjects`） |
| `blueprint-library:changed` | `AbuilderEvents.blueprintLibraryChanged` | 蓝图库 put / delete / clear |
| `api-collection:upload-start` | `AbuilderEvents.apiCollectionUploadStart` | 开始上传接口集合 |
| `api-collection:upload-success` | `AbuilderEvents.apiCollectionUploadSuccess` | 上传接口集合成功 |
| `api-collection:changed` | `AbuilderEvents.apiCollectionChanged` | 接口集合 put / delete / clear |

`workspace:add` / `workspace:sync` 的回调是 `WorkspaceData & { nameSpace }`：

| 字段 | 说明 |
|------|------|
| `id` | 工作区 ID |
| `name` | 名称 |
| `createdAt` / `updatedAt` | 时间戳 |
| `panelState` | 画布完整状态 |
| `blueprintDocument` | 蓝图文档 |
| `blueprintMeta` | 蓝图名称、备注 |
| `productName` | 产物名称 |
| `titleIconDataUrl` | 标题图标（可选） |
| `nameSpace` | 所属命名空间；默认库为 `null` |

同页多个 App 时，用第三个参数过滤：`addEventSubscription(AbuilderEvents.workspaceSync, cb, { nameSpace: "my-app" })`。

## 校验和空工作区

- `validate*`：只回答能不能用，不改数据。
- `parseWorkspaceData`：通过后补齐 `id`、时间戳和空字段，`value` 可直接当 `initialWorkspace`。
- `createEmptyWorkspace`：一份形状正确的空白工作区。

```ts
import {
  validateViewData,
  validateBlueprintData,
  validateWorkspaceData,
  parseWorkspaceData,
  createEmptyWorkspace,
  createWorkspaceProjectId,
} from "@arronqzy/abuilder";

const parsed = parseWorkspaceData(jsonFromBackend);
if (parsed.ok && parsed.value) {
  // <App initialWorkspace={parsed.value} />
}

validateWorkspaceData(workspace); // { ok, view, blueprint }
createEmptyWorkspace({ name: "未命名", id: createWorkspaceProjectId() });
```

只校验视图用 `validateViewData` / `parseViewData`（读 `panelState`）。只校验蓝图用 `validateBlueprintData` / `parseBlueprintData`（读 `blueprintDocument`）。两边都要合法时才用 `parseWorkspaceData`。

`initialWorkspace` 为空时，首次是空画布和空蓝图。侧栏仍可列出已保存项目，但要用户手动打开。

## 本地数据完整 CRUD

编辑器把四类数据存进 IndexedDB，按 `nameSpace` 隔离。公开 API 覆盖读写删清：

| 数据 | Create / Update | Read | Delete |
|------|-----------------|------|--------|
| 工作区 | `putWorkspaceProject` / `upsertWorkspaceProject`（可选 `emitEvent: "add"\|"sync"`）；或 UI 创建/同步 | `listWorkspaceProjects` / `getWorkspaceProject` | `deleteWorkspaceProject` / `clearWorkspaceProjects` |
| 蓝图库 | `putBlueprintLibraryRecord` | `listBlueprintLibrary` / `getBlueprintLibraryRecord` | `deleteBlueprintLibraryRecord` / `clearBlueprintLibrary` |
| 执行日志 | `putExecutionRunRecord` | `listExecutionRunRecords` / `getExecutionRunRecord` | `deleteExecutionRunRecord` / `clearAllExecutionRunRecords` / `purge*` / `trim*` |
| 接口集合 | `putApiCollection` / `upsertApiCollectionFromJson` | `listApiCollectionRecords` | `deleteApiCollection` / `clearApiCollections` |

```ts
import {
  putWorkspaceProject,
  listWorkspaceProjects,
  deleteWorkspaceProject,
  clearAbuilderStorage,
  putBlueprintLibraryRecord,
  putApiCollection,
} from "@arronqzy/abuilder";

// 不挂载编辑器也能预热 IndexedDB（例如后台同步后端数据）
await putWorkspaceProject(parsedWorkspace, nameSpace);
// 需要顺带通知宿主后端时：
await putWorkspaceProject(parsedWorkspace, nameSpace, { emitEvent: "sync" });

const result = await clearAbuilderStorage(nameSpace);
```

- 所有存储函数的 `nameSpace` 要和 `<App nameSpace>` 一致；省略时操作默认库。
- `clearAbuilderStorage` 不动主题、字号、执行日志保留策略等偏好设置。
- 写入 / 删除工作区或蓝图库后，已挂载编辑器会自动刷新列表。

## 命令式打开 / 保存（不 remount）

挂载编辑器后，可用模块函数或 `ref`：

```tsx
import { useRef } from "react";
import {
  App,
  openWorkspace,
  getCurrentWorkspace,
  syncWorkspace,
  type AbuilderViewHandle,
} from "@arronqzy/abuilder";

const ref = useRef<AbuilderViewHandle>(null);

<App ref={ref} nameSpace="my-app" workspaceId={selectedId} />;

await openWorkspace(selectedId, "my-app");          // 或 ref.current.openWorkspace(selectedId)
await syncWorkspace("my-app");                      // 把当前编辑内容写入 IndexedDB + 发 workspace:sync
const draft = getCurrentWorkspace("my-app");        // 导出当前脏状态；无 active 时为 null
```

同页多个实例时务必传同一个 `nameSpace`。

## 预览缩略图

画布已经渲染且有内容时（React / Vue 均支持）：

```ts
import { getPreviewSnapshot } from "@arronqzy/abuilder";

const thumbnail = await getPreviewSnapshot({
  maxWidth: 320,
  maxHeight: 180,
  mimeType: "image/jpeg",
  quality: 0.85,
});
```

| 参数 | 说明 | 默认 |
|------|------|------|
| `maxWidth` / `maxHeight` | 等比上限 | 不限制 |
| `mimeType` | `"image/png"` 或 `"image/jpeg"` | `"image/png"` |
| `quality` | JPEG 0–1 | `0.92` |
| `backgroundColor` | 背景色 | `"#ffffff"` |

## 还导出什么

一般宿主只用 `App`。需要拆开时：

```tsx
import {
  ReactViewPanel,
  ReactViewOnlinePreview,
  addEventSubscription,
  AbuilderEvents,
  getPreviewSnapshot,
  parseWorkspaceData,
  createEmptyWorkspace,
  openWorkspace,
  getCurrentWorkspace,
} from "@arronqzy/abuilder";
```

类型：`AbuilderViewHandle`、`WorkspaceData`、`WorkspaceProjectRecord`、`WorkspaceProjectListItem`、`WorkspaceDeleteEventPayload`、`AbuilderStorageClearResult`、`BlueprintLibraryListItem`、`BlueprintLibraryRecord`、`ExecutionRunRecord`、`ExecutionLogSettings`、`ApiCollectionRecord`、`UpsertApiCollectionInput`、`AbuilderEventName`、`GetPreviewSnapshotOptions`、`ParseCheckResult`、`WorkspaceParseCheckResult`。

## 本仓库里怎么预览

```bash
pnpm -C apps/web dev
```

`http://127.0.0.1:31011`。样式缺失时：

```bash
pnpm -C packages/ui run build:css
pnpm -C packages/react-view run build:css
pnpm -C packages/abuilder run build:css
```

## 许可证

MIT
