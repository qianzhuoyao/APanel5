# @arronqzy/vue-view

Vue 3 视图编辑器，功能对齐 `@arronqzy/react-view`，组件用 Ant Design Vue。大多数 Vue 宿主应直接用 [`@arronqzy/abuilder-vue`](../abuilder-vue/README.md)。

![物料、画布、配置和图层](https://github.com/qianzhuoyao/APanel5/raw/v5/docs/guide-assets/live-zh/09-table-full.png)

## 能力

- 无限平移 / 缩放（Infinite Viewer）、Moveable、Selecto 框选
- 图表、文本、表格、图片、音视频、几何、网格、三维、引用节点
- 多图层、映射图层、主图层、锁定与合并
- 按物料类型的配置侧栏，支持 Scope 模版
- IndexedDB 多项目、导入导出、跨标签同步
- 分屏蓝图（`@arronqzy/vue-blueprint`）和调试时的 Scope 回写
- `VueViewOnlinePreview` 只读预览

打开蓝图后的分屏和 React 版一样：上面视图，下面节点：

![分屏蓝图](https://github.com/qianzhuoyao/APanel5/raw/v5/docs/guide-assets/live-zh/40-blueprint-open.png)

## 使用

```ts
import { createApp } from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import { VueViewPanel } from "@arronqzy/vue-view";

createApp(VueViewPanel).use(Antd).mount("#app");
```

### 在线预览

```ts
import { VueViewOnlinePreview, parseOnlinePreviewSearchParams } from "@arronqzy/vue-view";
```

URL：`?preview=online&projectId=<id>&pid=<instanceId>`。传入 `workspace` 时优先于 `projectId`。

### 宿主集成

```ts
import {
  addEventSubscription,
  AbuilderEvents,
  parseWorkspaceData,
  createEmptyWorkspace,
  createWorkspaceProjectId,
} from "@arronqzy/vue-view";
```

创建 / 同步发出 `workspace:add` / `workspace:sync`。`parseWorkspaceData` 的 `value` 可作 `initialWorkspace`。

IndexedDB CRUD 与 `getPreviewSnapshot` **不导出**。缩略图只在 React 包实现。

## 和 React 版的差别

- UI 是 Ant Design Vue
- 标尺是 canvas 实现（可换成 `@scena/ruler`）
- 画布状态仍是共享的 `@arronqzy/rx-store`

## 依赖

`@arronqzy/rx-store`、`@arronqzy/vue-rx-store`、`@arronqzy/vue-blueprint`、`@arronqzy/blueprint-dsl`、`ant-design-vue`、`echarts`、`moveable`、`selecto`、`infinite-viewer`。

## 许可证

MIT
