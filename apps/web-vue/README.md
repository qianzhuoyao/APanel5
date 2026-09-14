# apps/web-vue

Abuilder 的 Vue 3 演示应用，功能和 `apps/web` 对齐，UI 用 Ant Design Vue。不发布到 npm。

![同一套编辑器，Vue 演示入口也是完整面板](../../docs/guide-assets/live-zh/40-blueprint-open.png)

## 启动

```bash
pnpm install
pnpm -C apps/web-vue dev
```

默认 `http://127.0.0.1:31012`。

入口是 `@arronqzy/abuilder-vue` 的 `<App />`，并 `app.use(Antd)`。参数、工作区事件和预览模式见 [packages/abuilder-vue/README.md](../../packages/abuilder-vue/README.md)。

## 构建

```bash
pnpm -C apps/web-vue build
pnpm -C apps/web-vue preview
```

## 和 React 演示的差别

- 没有 `getPreviewSnapshot`（画布缩略图目前只在 React 包实现）
- 组件库是 Ant Design Vue，不是 `@arronqzy/ui`
- 蓝图画布是 Vue Flow，不是 React Flow

业务数据格式（工作区、蓝图文档、Scope 模版）两边一致，可以互相打开同一份 JSON。
