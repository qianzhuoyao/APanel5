# @arronqzy/react-view

Abuilder 的**视图编辑器** React 包，提供可视化画布、图层、物料、在线预览与工作区管理能力。

## 功能概览

- **无限画布**：平移、缩放、标尺、框选与 Moveable 拖拽/缩放/旋转
- **图层系统**：多图层、映射图层、主图层、锁定与合并
- **物料节点**：图表（ECharts）、文本、图片、音视频、几何、网格、引用节点等
- **Scope 模版**：节点属性支持 `{scope.xxx}` 表达式与解析预览
- **工作区**：IndexedDB 持久化、多项目切换、同步与在线预览
- **蓝图联动**：与 `@arronqzy/react-blueprint` 分屏编辑，运行时 Scope 回写视图
- **宿主集成**：工作区事件订阅、预览快照、外部工作区数据加载

## 安装

```bash
pnpm add @arronqzy/react-view
```

依赖 React 19，并需引入样式：

```ts
import "@arronqzy/react-view/styles.css";
```

## 使用

### 完整编辑器面板

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

| `ReactViewPanel` 参数 | 说明 | 默认值 |
|----------------------|------|--------|
| `className` | 根节点 class | — |
| `initialZoom` | 初始缩放 | `1` |
| `initialWorkspace` | 外部传入的完整工作区，挂载后自动加载 | — |

### 在线预览

按工作区 ID 从 IndexedDB / 缓存加载：

```tsx
import { ReactViewOnlinePreview } from "@arronqzy/react-view";

<ReactViewOnlinePreview projectId="your-project-id" />
```

直接传入工作区数据（无需 IndexedDB）：

```tsx
<ReactViewOnlinePreview workspace={savedWorkspace} />
```

URL 参数解析：

```ts
import { parseOnlinePreviewSearchParams } from "@arronqzy/react-view";

const params = parseOnlinePreviewSearchParams("?preview=online&projectId=xxx");
```

| `ReactViewOnlinePreview` 参数 | 说明 |
|------------------------------|------|
| `projectId` | 从 IndexedDB 加载的工作区 ID |
| `workspace` | 直接传入的完整工作区数据（优先于 `projectId`） |
| `previewInstanceId` | 预览实例 ID（可选） |

### 工作区事件订阅

监听工作区创建与同步，回调携带**完整工作区数据**（面板 + 蓝图），便于持久化到自有后端：

```ts
import {
  addEventSubscription,
  AbuilderEvents,
  type WorkspaceData,
} from "@arronqzy/react-view";

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

| 事件 | 常量 | 触发时机 |
|------|------|----------|
| `workspace:add` | `AbuilderEvents.workspaceAdd` | 创建工作区成功 |
| `workspace:sync` | `AbuilderEvents.workspaceSync` | 同步工作区成功 |

回调参数类型为 `WorkspaceData`（即 `WorkspaceProjectRecord`），字段包括：`id`、`name`、`createdAt`、`updatedAt`、`panelState`、`blueprintDocument`、`blueprintMeta`、`productName`、`titleIconDataUrl`。

### 获取预览快照

在编辑器或在线预览页已挂载时，截取当前预览画面为 base64（data URL），可用于缩略图：

```ts
import { getPreviewSnapshot } from "@arronqzy/react-view";

const dataUrl = await getPreviewSnapshot({
  maxWidth: 320,
  maxHeight: 180,
  mimeType: "image/jpeg",
  quality: 0.85,
});
```

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `maxWidth` / `maxHeight` | 等比缩放上限 | 不限制 |
| `mimeType` | `"image/png"` 或 `"image/jpeg"` | `"image/png"` |
| `quality` | JPEG 质量 0–1 | `0.92` |
| `backgroundColor` | 背景色 | `"#ffffff"` |

## 核心导出

| 导出 | 说明 |
|------|------|
| `ReactViewPanel` | 主编辑面板（画布 + 配置侧栏 + 蓝图分屏） |
| `ReactViewOnlinePreview` | 只读在线预览页 |
| `parseOnlinePreviewSearchParams` | 解析预览 URL 参数 |
| `addEventSubscription` | 订阅工作区事件，返回 `{ unsubscribe }` |
| `AbuilderEvents` | 工作区事件名常量 |
| `getPreviewSnapshot` | 获取预览画面 base64 缩略图 |
| `WorkspaceData` / `WorkspaceProjectRecord` | 完整工作区数据类型 |
| `createView` / `createAction` 等 | 视图 DSL 与指令扩展（`src/core`） |

相关类型：`AbuilderEventName`、`AbuilderEventPayloadMap`、`WorkspaceAddEventPayload`、`WorkspaceSyncEventPayload`、`GetPreviewSnapshotOptions`。

## 样式与 Tailwind

本包内置 Tailwind 配置，构建产物为 `dist/styles.css`：

```bash
pnpm -C packages/react-view build:css
```

若由应用侧 Tailwind 扫描源码，请将本包加入 `content`：

```ts
content: [
  "./src/**/*.{ts,tsx}",
  "./node_modules/@arronqzy/react-view/src/**/*.{ts,tsx}",
]
```

## 依赖关系

- `@arronqzy/ui` — 基础 UI 组件
- `@arronqzy/rx-store` — 画布状态与历史
- `@arronqzy/react-blueprint` — 蓝图编辑与执行
- `@arronqzy/blueprint-dsl` — 蓝图运行时

## 许可证

MIT
