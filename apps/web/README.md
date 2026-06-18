# web

Abuilder 的 **本地开发演示应用**，基于 Vite + React，用于在 monorepo 内调试完整编辑器。

## 功能

- 挂载 `@arronqzy/abuilder` 的 `<App />`，体验视图 + 蓝图完整流程
- 开发热更新，依赖 workspace 内各 package 源码

## 启动

在仓库根目录：

```bash
pnpm install
pnpm dev
```

或仅启动本应用：

```bash
pnpm -C apps/web dev
```

同时需要 CSS 监听（若修改了 `react-view` / `ui` 样式）：

```bash
pnpm -C packages/react-view dev:css
pnpm -C packages/ui dev:css
```

## 入口

```tsx
// apps/web/src/main.tsx
import { App } from "@arronqzy/abuilder";
import "@arronqzy/abuilder/styles.css";

createRoot(document.getElementById("app")!).render(<App />);
```

## 构建

```bash
pnpm -C apps/web build
pnpm -C apps/web preview
```

## 说明

本应用为 **private**，不发布到 npm；对外集成请参考 `@arronqzy/abuilder` 的 README。
