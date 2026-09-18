# @arronqzy/abuilder

React 一站式编辑器。安装后渲染 `<App />`，就是完整的 Abuilder：物料画布、蓝图、工作区、在线预览和浏览器内 AI 助手。

![安装后直接得到的编辑器](https://github.com/qianzhuoyao/APanel5/raw/v5/docs/guide-assets/live-zh/01-overview.png)

当前版本见本包 `package.json`（设置菜单「关于」里显示的就是这个版本号）。本包 **1.1.35** 起配套能力：接口集合、`{system?...}` 模版、JSON 节点错误高亮。完整中文手册见仓库 `docs/Abuilder使用文档与功能说明.docx`（适用版本表写在文首）。

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
| `initialWorkspace` | 完整工作区。不传则空白画布，**不会**自动打开 IndexedDB 里已有项目 | — |

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

IndexedDB 是编辑器自己的浏览器缓存，**不导出** list / get / put / delete。宿主应：

1. 订阅创建和同步事件，把回调里的完整对象写到自己的存储。
2. 下次打开时校验 JSON，再交给 `initialWorkspace`。

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

回调参数是完整 `WorkspaceData`（即 `WorkspaceProjectRecord`）：

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

也可以用字符串：`addEventSubscription("workspace:add", callback)`。

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

## 预览缩略图

画布已经渲染且有内容时：

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

Vue 包没有这个函数。

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
} from "@arronqzy/abuilder";
```

类型：`WorkspaceData`、`WorkspaceProjectRecord`、`AbuilderEventName`、`GetPreviewSnapshotOptions`、`ParseCheckResult`、`WorkspaceParseCheckResult`。

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
