# @arronqzy/react-view

视图编辑器。物料、无限画布、图层、配置侧栏、工作区和在线预览都在这个包。蓝图分屏通过依赖的 `@arronqzy/react-blueprint` 嵌进来。

大多数 React 宿主应直接用 [`@arronqzy/abuilder`](../abuilder/README.md) 的 `<App />`。只有要把面板拆进已有布局时才引本包。

![左侧物料、中间画布、右侧配置、底部图层](https://github.com/qianzhuoyao/APanel5/raw/v5/docs/guide-assets/live-zh/01-overview.png)

## 画布上有什么

- **无限画布**：平移、缩放、标尺、框选，Moveable 拖拽 / 缩放 / 旋转
- **物料**：ECharts 图表、可视化表格、文本、图片、音视频、几何、网格、视口、三维、引用节点
- **图层**：多图层、映射图层、主图层、锁定、显示、合并
- **配置**：按类型展开；可搜字段；展开状态按节点记住
- **Scope**：属性可写 `{scope.xxx}`，蓝图执行后展开
- **工作区**：IndexedDB 多项目、导入导出、跨标签同步

表格是物料里配置最多的一类，列、条件样式和外观都在右侧：

![表格节点与配置侧栏](https://github.com/qianzhuoyao/APanel5/raw/v5/docs/guide-assets/live-zh/09-table-full.png)

打开蓝图后，本包把画布拆成上下两块，下面交给蓝图编辑器：

![视图与蓝图分屏](https://github.com/qianzhuoyao/APanel5/raw/v5/docs/guide-assets/live-zh/17-blueprint.png)

## 安装

```bash
pnpm add @arronqzy/react-view
```

```ts
import "@arronqzy/react-view/styles.css";
```

Vite 宿主还要加 `@arronqzy/abuilder/vite` 的 `webllmAssistant()`，见 abuilder 的 README。否则打包 WebLLM 会失败。

## 编辑面板

```tsx
import { ReactViewPanel } from "@arronqzy/react-view";
import type { WorkspaceProjectRecord } from "@arronqzy/react-view";
import "@arronqzy/react-view/styles.css";

export function Editor({ workspace }: { workspace?: WorkspaceProjectRecord | null }) {
  return (
    <ReactViewPanel
      className="h-screen"
      initialZoom={1}
      initialWorkspace={workspace}
    />
  );
}
```

| 参数 | 说明 | 默认 |
|------|------|------|
| `className` | 根节点 class | — |
| `initialZoom` | 初始缩放 | `1` |
| `initialWorkspace` | 挂载后加载的完整工作区。空则空白画布 | — |

## 在线预览

按 ID 从 IndexedDB / 缓存加载：

```tsx
import { ReactViewOnlinePreview } from "@arronqzy/react-view";

<ReactViewOnlinePreview projectId="your-project-id" />
```

直接给数据（优先于 `projectId`）：

```tsx
<ReactViewOnlinePreview workspace={savedWorkspace} />
```

```ts
import { parseOnlinePreviewSearchParams } from "@arronqzy/react-view";

parseOnlinePreviewSearchParams("?preview=online&projectId=xxx");
```

| 参数 | 说明 |
|------|------|
| `projectId` | 从 IndexedDB 加载 |
| `workspace` | 宿主传入的完整工作区，优先 |
| `previewInstanceId` | 预览实例 ID（可选） |

## 工作区事件

回调带完整工作区，用来写自己的后端。IndexedDB 的增删改查不导出。

```ts
import {
  addEventSubscription,
  AbuilderEvents,
  parseWorkspaceData,
  type WorkspaceData,
} from "@arronqzy/react-view";

const syncSub = addEventSubscription(
  AbuilderEvents.workspaceSync,
  async (workspace: WorkspaceData) => {
    await saveToServer(workspace);
  }
);
syncSub.unsubscribe();
```

| 事件 | 常量 | 何时触发 |
|------|------|----------|
| `workspace:add` | `AbuilderEvents.workspaceAdd` | 创建成功 |
| `workspace:sync` | `AbuilderEvents.workspaceSync` | 同步成功 |

字段：`id`、`name`、`createdAt`、`updatedAt`、`panelState`、`blueprintDocument`、`blueprintMeta`、`productName`、`titleIconDataUrl`。

校验：

- `validateViewData` / `parseViewData` — 视图 `panelState`
- `validateBlueprintData` / `parseBlueprintData` — 蓝图文档
- `validateWorkspaceData` / `parseWorkspaceData` — 两边都要合法；`parse` 的 `value` 可作 `initialWorkspace`
- `createEmptyWorkspace` / `createWorkspaceProjectId` — 空白记录和 ID

## 预览缩略图

编辑器或预览页已挂载且画布有内容时：

```ts
import { getPreviewSnapshot } from "@arronqzy/react-view";

const dataUrl = await getPreviewSnapshot({
  maxWidth: 320,
  maxHeight: 180,
  mimeType: "image/jpeg",
  quality: 0.85,
});
```

| 参数 | 说明 | 默认 |
|------|------|------|
| `maxWidth` / `maxHeight` | 等比上限 | 不限制 |
| `mimeType` | png 或 jpeg | `"image/png"` |
| `quality` | JPEG 0–1 | `0.92` |
| `backgroundColor` | 背景色 | `"#ffffff"` |

## 主要导出

| 导出 | 说明 |
|------|------|
| `ReactViewPanel` | 主面板（画布 + 配置 + 蓝图分屏） |
| `ReactViewOnlinePreview` | 只读预览 |
| `parseOnlinePreviewSearchParams` | 解析预览 URL |
| `addEventSubscription` / `AbuilderEvents` | 工作区事件 |
| `getPreviewSnapshot` | 预览截图 data URL |
| `parseWorkspaceData` 等 | 校验 / 解析 / 空工作区 |
| `createView` / `createAction` | 视图 DSL 扩展点（`src/core`） |

## 样式

产物是 `dist/styles.css`。本仓库构建：

```bash
pnpm -C packages/react-view build:css
```

若应用自己的 Tailwind 要扫描本包源码，把 `node_modules/@arronqzy/react-view/src/**/*.{ts,tsx}` 加进 `content`。

## 依赖

`@arronqzy/ui`、`@arronqzy/rx-store`、`@arronqzy/react-blueprint`、`@arronqzy/blueprint-dsl`、`@arronqzy/view-table`、`@arronqzy/view-scene3d`。

## 许可证

MIT
