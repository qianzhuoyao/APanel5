# @arronqzy/abuilder

Abuilder **一站式可视化编辑器** npm 包。安装后在 React 应用中引入 `App` 即可渲染完整应用（视图画布 + 蓝图 + 工作区 + 在线预览）。

## 功能概览

- **视图编辑**：拖拽物料、图层、缩放平移、多选、图表与 Scope 配置
- **蓝图编辑**：节点连线、调试执行、蓝图库与执行日志
- **工作区**：多项目、IndexedDB 持久化、导入导出
- **在线预览**：独立预览页，支持 URL 参数或外部工作区数据
- **宿主集成**：事件订阅、预览快照、外部工作区加载与预览/编辑模式切换

## 安装

```bash
npm install @arronqzy/abuilder react react-dom
# 或
pnpm add @arronqzy/abuilder react react-dom
```

### Vite 宿主项目

若你用 Vite 打包集成了 `<App />` 的应用，请在 `vite.config.ts` 注册 WebLLM 插件（避免 `@mlc-ai/web-llm` 触发 `stripLiteral` 栈溢出）：

```ts
import { webllmAssistant } from "@arronqzy/abuilder/vite";

export default defineConfig({
  plugins: [webllmAssistant()],
});
```

请从 `@arronqzy/abuilder/vite` 导入，不要从 `@arronqzy/webllm-assistant/vite` 导入——pnpm 下后者不是 easycode 的直接依赖，配置加载阶段会 `ERR_MODULE_NOT_FOUND`。

## 使用

```tsx
import { createRoot } from "react-dom/client";
import { App } from "@arronqzy/abuilder";
import "@arronqzy/abuilder/styles.css";

createRoot(document.getElementById("root")!).render(<App />);
```

### App 参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `className` | 编辑面板根节点 class | — |
| `initialZoom` | 初始画布缩放 | `1` |
| `defaultTheme` | 编辑器主题 `"dark"` / `"light"` | `"dark"` |
| `locale` | 界面语言 `"zh-CN"` / `"en-US"`；省略则按 localStorage / 浏览器语言 | — |
| `nameSpace` | 隔离 IndexedDB / 缓存；同一页面多个 App 传入不同值 | — |
| `previewSearch` | 在线预览 URL 查询串；含 `?preview=online&projectId=...` 时进入预览 | `window.location.search` |
| `preview` | `true` 为预览页，`false` 为编辑面板 | `false` |
| `initialWorkspace` | 完整工作区数据；空则首次渲染空白，不会自动打开 IndexedDB 记录 | — |

```tsx
<App
  className="h-screen"
  defaultTheme="dark"
  initialZoom={1}
  locale="zh-CN"
  preview={false}
  initialWorkspace={savedWorkspace}
/>
```

编辑器顶栏「设置 → 语言」可运行时切换中文 / English（写入 `localStorage` key `abuilder.locale`）。

### 编辑 / 预览模式

```tsx
// 编辑模式（默认）：加载工作区到面板
<App key={workspace.id} initialWorkspace={workspace} />

// 预览模式：根据工作区数据直接渲染预览页
<App key={workspace.id} preview initialWorkspace={workspace} />
```

切换工作区时建议配合 `key`，确保完整重新加载。

### 在线预览（URL）

URL 带 `?preview=online&projectId=<工作区ID>` 时自动进入预览模式（从 IndexedDB 加载）。若编辑器传了 `nameSpace`，预览 URL 会带 `ns=`，预览页用同一命名空间读库：

```tsx
<App previewSearch="?preview=online&projectId=xxx&ns=my-app" />
```

同一页面挂多个编辑器时，给每个 App 不同的 `nameSpace`，工作区 / 蓝图库 / 预览缓存不会互相覆盖。不传或空字符串保持原来的全局库名。

### 外部持久化完整流程

```tsx
import { useEffect, useState } from "react";
import {
  App,
  addEventSubscription,
  AbuilderEvents,
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
    <>
      <button onClick={() => setIsPreview(false)}>编辑</button>
      <button onClick={() => setIsPreview(true)}>预览</button>
      <App
        key={`${workspace.id}-${workspace.updatedAt}-${isPreview}`}
        preview={isPreview}
        initialWorkspace={workspace}
      />
    </>
  );
}
```

### 工作区事件订阅

```ts
import {
  addEventSubscription,
  AbuilderEvents,
  type WorkspaceData,
} from "@arronqzy/abuilder";

const addSub = addEventSubscription(
  AbuilderEvents.workspaceAdd,
  async (workspace: WorkspaceData) => {
    await saveToServer(workspace);
  }
);

const syncSub = addEventSubscription(
  AbuilderEvents.workspaceSync,
  async (workspace) => {
    await saveToServer(workspace);
  }
);

addSub.unsubscribe();
syncSub.unsubscribe();
```

| 事件 | 常量 | 触发时机 | 回调参数 |
|------|------|----------|----------|
| `workspace:add` | `AbuilderEvents.workspaceAdd` | 创建工作区成功 | `WorkspaceData` |
| `workspace:sync` | `AbuilderEvents.workspaceSync` | 同步工作区成功 | `WorkspaceData` |

`WorkspaceData`（即 `WorkspaceProjectRecord`）字段：

| 字段 | 说明 |
|------|------|
| `id` | 工作区 ID |
| `name` | 工作区名称 |
| `createdAt` / `updatedAt` | 时间戳 |
| `panelState` | 面板完整状态（rx-store） |
| `blueprintDocument` | 蓝图文档 |
| `blueprintMeta` | 蓝图元信息（名称、备注） |
| `productName` | 产品名称 |
| `titleIconDataUrl` | 标题图标（可选） |

也可使用事件名字符串订阅，例如 `addEventSubscription("workspace:add", callback)`。

### 校验 / 解析工作区数据

把后端或文件里的 JSON 交给 `App` 之前：

- `validate*`：只回答能不能用，不改数据。
- `parseWorkspaceData`：校验通过后补齐 `id` / 时间戳 / 空字段，返回的 `value` 可直接作为 `initialWorkspace`。
- `createEmptyWorkspace`：构造一份形状正确的空工作区，不必自己猜字段。

```ts
import {
  validateViewData,
  validateBlueprintData,
  validateWorkspaceData,
  parseWorkspaceData,
  createEmptyWorkspace,
  createWorkspaceProjectId,
} from "@arronqzy/abuilder";

validateViewData(workspace.panelState); // { ok: true } 或 { ok: false, error: "invalid-view-data" }
validateBlueprintData(workspace.blueprintDocument);
validateWorkspaceData(workspace); // 同时检查视图 + 蓝图，结果里带 `view` / `blueprint`

const parsed = parseWorkspaceData(jsonFromBackend);
if (parsed.ok && parsed.value) {
  // <App initialWorkspace={parsed.value} />
}

const blank = createEmptyWorkspace({ name: "未命名", id: createWorkspaceProjectId() });
```

也可把完整工作区对象传给 `validateViewData` / `parseViewData`（读 `panelState`）和 `validateBlueprintData` / `parseBlueprintData`（读 `blueprintDocument`）。只校验视图或只校验蓝图时用这两套，不要用 `parseWorkspaceData`（它要求两边都合法）。

`initialWorkspace` 为空（不传 / `null`）时，编辑器首次渲染空画布和空蓝图，**不会**自动选中 IndexedDB 里的第一条工作区。侧栏仍可列出已保存项目，需用户手动打开。传入的工作区会按这份数据完整显示。

IndexedDB 的 list / get / put / delete **不对外导出**。那是编辑器自己的浏览器缓存，和宿主后端双写会打架。宿主应订阅 `workspace:add` / `workspace:sync` 写入自己的存储，再用 `parseWorkspaceData` + `initialWorkspace` 灌回来。同一页多个编辑器用 `nameSpace` 隔离这份缓存。

### 获取预览快照

```ts
import { getPreviewSnapshot } from "@arronqzy/abuilder";

const thumbnail = await getPreviewSnapshot({
  maxWidth: 320,
  maxHeight: 180,
  mimeType: "image/jpeg",
  quality: 0.85,
});
// 返回 "data:image/jpeg;base64,..."
```

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `maxWidth` / `maxHeight` | 等比缩放上限 | 不限制 |
| `mimeType` | `"image/png"` 或 `"image/jpeg"` | `"image/png"` |
| `quality` | JPEG 质量 0–1 | `0.92` |
| `backgroundColor` | 背景色 | `"#ffffff"` |

需在 `App` / `ReactViewPanel` 或在线预览页已渲染且画布有内容时调用。Vue 包 `@arronqzy/abuilder-vue` **没有**对等实现，不要从那边找同名导出。

### 高级导出

除 `App` 外，也可单独使用底层组件：

```tsx
import {
  ReactViewPanel,
  ReactViewOnlinePreview,
  addEventSubscription,
  AbuilderEvents,
  getPreviewSnapshot,
  parseWorkspaceData,
  createEmptyWorkspace,
  createWorkspaceProjectId,
} from "@arronqzy/abuilder";

import type {
  WorkspaceData,
  WorkspaceProjectRecord,
  AbuilderEventName,
  GetPreviewSnapshotOptions,
  ParseCheckResult,
  WorkspaceParseCheckResult,
} from "@arronqzy/abuilder";
```

## Monorepo 包结构

| 包 | 职责 |
|----|------|
| `@arronqzy/abuilder` | 聚合入口（本包） |
| `@arronqzy/i18n` | 共享中英文本 |
| `@arronqzy/react-view` | 视图画布与工作区 |
| `@arronqzy/react-blueprint` | 蓝图编辑器 UI |
| `@arronqzy/blueprint-dsl` | 蓝图 DSL 与运行时 |
| `@arronqzy/rx-store` | 画布状态与 Undo/Redo |
| `@arronqzy/ui` | 共享 UI 组件 |

## 宿主应用要求

- React 18+
- 构建工具需支持 CSS 导入（Vite / Webpack 5 等）
- 根节点容器建议 `height: 100%`（样式已包含 `#root` / `#app` 规则）

本地开发时若样式缺失，需先构建 CSS：

```bash
pnpm -C packages/ui run build:css
pnpm -C packages/react-view run build:css
pnpm -C packages/abuilder run build:css
```

`apps/web` 的 `pnpm dev` 会通过 `predev` 自动执行上述步骤。

## 许可证

MIT
