# @arronqzy/abuilder

Abuilder 可视化编辑器 npm 包。安装后在 React 应用中引入 `App` 即可渲染完整编辑器（含蓝图、工作区、在线预览）。

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

URL 带 `?preview=online&projectId=<工作区ID>` 时自动进入预览模式。也可手动传入：

```tsx
<App previewSearch="?preview=online&projectId=xxx" />
```

## 高级导出

除 `App` 外，也可直接使用底层组件：

```tsx
import { ReactViewPanel, ReactViewOnlinePreview } from "@arronqzy/abuilder";
```

## 宿主应用要求

- React 18+
- 构建工具需支持 CSS 导入（Vite / Webpack 5 等）
- 根节点容器建议 `height: 100%`（样式已包含 `#root` / `#app` 规则）
