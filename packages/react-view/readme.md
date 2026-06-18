# @arronqzy/react-view

Abuilder 的**视图编辑器** React 包，提供可视化画布、图层、物料、在线预览与工作区管理能力。

## 功能概览

- **无限画布**：平移、缩放、标尺、框选与 Moveable 拖拽/缩放/旋转
- **图层系统**：多图层、映射图层、主图层、锁定与合并
- **物料节点**：图表（ECharts）、文本、图片、音视频、几何、网格、引用节点等
- **Scope 模版**：节点属性支持 `{scope.xxx}` 表达式与解析预览
- **工作区**：IndexedDB 持久化、多项目切换、同步与在线预览
- **蓝图联动**：与 `@arronqzy/react-blueprint` 分屏编辑，运行时 Scope 回写视图

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
import "@arronqzy/react-view/styles.css";

export function Editor() {
  return <ReactViewPanel className="h-screen" initialZoom={1} />;
}
```

### 在线预览

```tsx
import { ReactViewOnlinePreview } from "@arronqzy/react-view";

<ReactViewOnlinePreview projectId="your-project-id" />
```

URL 参数解析：

```ts
import { parseOnlinePreviewSearchParams } from "@arronqzy/react-view";

const params = parseOnlinePreviewSearchParams("?preview=online&projectId=xxx");
```

## 核心导出

| 导出 | 说明 |
|------|------|
| `ReactViewPanel` | 主编辑面板（画布 + 配置侧栏 + 蓝图分屏） |
| `ReactViewOnlinePreview` | 只读在线预览页 |
| `parseOnlinePreviewSearchParams` | 解析预览 URL 参数 |
| `createView` / `createAction` 等 | 视图 DSL 与指令扩展（`src/core`） |

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
