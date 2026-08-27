# web

Abuilder 的 **本地开发演示应用**，基于 Vite + React，用于在 monorepo 内调试完整编辑器。

## 功能

- 挂载 `@arronqzy/abuilder` 的 `<App />`，体验视图 + 蓝图完整流程
- 开发热更新，依赖 workspace 内各 package 源码
- 示例演示工作区事件订阅（见 `src/main.tsx`）

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

`predev` 会自动构建 `ui`、`react-view`、`abuilder` 的 CSS。若样式仍缺失，可手动执行：

```bash
pnpm -C packages/abuilder run build:css
```

同时需要 CSS 监听（若修改了 `react-view` / `ui` 样式）：

```bash
pnpm -C packages/react-view dev:css
pnpm -C packages/ui dev:css
```

## 入口

```tsx
// apps/web/src/main.tsx
import { App, addEventSubscription, AbuilderEvents } from "@arronqzy/abuilder";
import "@arronqzy/abuilder/styles.css";

// 订阅工作区事件，回调含完整 panelState + blueprintDocument
addEventSubscription(AbuilderEvents.workspaceAdd, (workspace) => {
  console.log("workspace created", workspace);
});

createRoot(document.getElementById("app")!).render(<App />);
```

更多宿主集成（`initialWorkspace`、`preview`、`getPreviewSnapshot`）见 [packages/abuilder/README.md](../packages/abuilder/README.md)。

## 构建

```bash
pnpm -C apps/web build
pnpm -C apps/web preview
```

## 说明

本应用为 **private**，不发布到 npm；对外集成请参考 `@arronqzy/abuilder` 的 README。
