# @arronqzy/vue-view

Vue 3 版 Abuilder **视图编辑器**，使用 **Ant Design Vue** 作为 UI 组件库，功能与 `@arronqzy/react-view` 对齐。

## 功能

- **画布**：无限平移/缩放（Infinite Viewer）、Moveable 拖拽/缩放/旋转、Selecto 框选
- **物料**：图表（ECharts）、文本、图片、音视频、几何、网格、引用节点
- **图层**：多图层、映射图层、主图层、锁定与合并
- **配置侧栏**：按物料类型的完整属性编辑、Scope 模版与预览
- **工作区**：IndexedDB 多项目、导入导出、跨标签页同步
- **蓝图集成**：分屏蓝图编辑器、调试 Scope 绑定
- **在线预览**：`VueViewOnlinePreview` 独立预览页

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

URL 参数：`?preview=online&projectId=<id>&pid=<instanceId>`

## 依赖

- `@arronqzy/rx-store` — 画布状态
- `@arronqzy/vue-rx-store` — Vue composables
- `@arronqzy/vue-blueprint` — 蓝图编辑器
- `@arronqzy/blueprint-dsl` — 蓝图 DSL
- `ant-design-vue`、`echarts`、`moveable`、`selecto`、`infinite-viewer`

## 与 React 版差异

- UI 使用 **Ant Design Vue**，非 shadcn/Radix
- 标尺使用 canvas 兼容实现（可替换为 `@scena/ruler`）
- 共享 `@arronqzy/rx-store` 与 `panel/utils` 数据逻辑

## 许可证

MIT
