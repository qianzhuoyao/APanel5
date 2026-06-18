# @arronqzy/abuilder

Abuilder **一站式可视化编辑器** npm 包。安装后在 React 应用中引入 `App` 即可渲染完整应用（视图画布 + 蓝图 + 工作区 + 在线预览）。

## 功能概览

- **视图编辑**：拖拽物料、图层、缩放平移、多选、图表与 Scope 配置
- **蓝图编辑**：节点连线、调试执行、蓝图库与执行日志
- **工作区**：多项目、IndexedDB 持久化、导入导出
- **在线预览**：独立预览页，支持 URL 参数打开指定工作区

## 安装

```bash
npm install @arronqzy/abuilder react react-dom
# 或
pnpm add @arronqzy/abuilder react react-dom
```

## 使用

```tsx
import { createRoot } from "react-dom/client";
import { App } from "@arronqzy/abuilder";
import "@arronqzy/abuilder/styles.css";

createRoot(document.getElementById("root")!).render(<App />);
```

### 可选配置

```tsx
<App
  className="h-screen"
  defaultTheme="dark"
  initialZoom={1}
/>
```

### 在线预览

URL 带 `?preview=online&projectId=<工作区ID>` 时自动进入预览模式：

```tsx
<App previewSearch="?preview=online&projectId=xxx" />
```

### 高级导出

除 `App` 外，也可单独使用底层组件：

```tsx
import {
  ReactViewPanel,
  ReactViewOnlinePreview,
} from "@arronqzy/abuilder";
```

## Monorepo 包结构

| 包 | 职责 |
|----|------|
| `@arronqzy/abuilder` | 聚合入口（本包） |
| `@arronqzy/react-view` | 视图画布与工作区 |
| `@arronqzy/react-blueprint` | 蓝图编辑器 UI |
| `@arronqzy/blueprint-dsl` | 蓝图 DSL 与运行时 |
| `@arronqzy/rx-store` | 画布状态与 Undo/Redo |
| `@arronqzy/ui` | 共享 UI 组件 |

## 宿主应用要求

- React 18+
- 构建工具需支持 CSS 导入（Vite / Webpack 5 等）
- 根节点容器建议 `height: 100%`（样式已包含 `#root` / `#app` 规则）

## 许可证

MIT
