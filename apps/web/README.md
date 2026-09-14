# apps/web

Abuilder 的 React 演示应用。用来在本仓库里跑完整编辑器，不发布到 npm。

启动后是一页 `<App />`：物料、画布、蓝图、工作区和 AI 助手都在这一页。样式来自 workspace 包的 CSS 构建，源码改动会热更新。

![演示应用即完整编辑器](../../docs/guide-assets/live-zh/01-overview.png)

## 启动

在仓库根目录：

```bash
pnpm install
pnpm -C apps/web dev
```

默认 `http://127.0.0.1:31011`。`predev` 会先构建 `ui`、`react-view`、`abuilder` 的 CSS。样式仍不对时手动再跑：

```bash
pnpm -C packages/abuilder run build:css
```

改 `packages/ui` 或 `packages/react-view` 的样式时，另开：

```bash
pnpm -C packages/react-view dev:css
pnpm -C packages/ui dev:css
```

## 入口在做什么

`src/main.tsx` 挂载 `@arronqzy/abuilder` 的 `App`，并订阅工作区创建事件，方便在控制台看完整 `panelState` + `blueprintDocument`：

```tsx
import { App, addEventSubscription, AbuilderEvents } from "@arronqzy/abuilder";
import "@arronqzy/abuilder/styles.css";

addEventSubscription(AbuilderEvents.workspaceAdd, (workspace) => {
  console.log("workspace created", workspace);
});
```

Vite 配置里已经加了 `webllmAssistant()`。宿主项目集成时也要加，否则 WebLLM 会把 Vite 5 的 `stripLiteral` 打爆栈。说明见 [packages/abuilder/README.md](../../packages/abuilder/README.md)。

## 构建

```bash
pnpm -C apps/web build
pnpm -C apps/web preview
```

对外集成不要引用本应用，用 `@arronqzy/abuilder`。
