# @arronqzy/vue-blueprint

Vue 3 蓝图编辑器，用 `@vue-flow/core` 和 Ant Design Vue。节点类型、调试和蓝图库与 `@arronqzy/react-blueprint` 对齐，不依赖 React Flow。

一般由 `@arronqzy/vue-view` 嵌在视图下方。

![蓝图画布嵌在编辑器下半部分](https://github.com/qianzhuoyao/APanel5/raw/v5/docs/guide-assets/live-zh/41-blueprint-nodes.png)

## 能力

- 拖节点、连线、右键菜单
- 内置节点：蓝图、逻辑、与门、生命周期、请求、JSON、存储、时钟、事件
- 自定义边和执行时的高亮
- 蓝图库（IndexedDB）、导入 / 导出
- 节点配置侧栏、执行日志、调试会话
- 页面生命周期把 Scope 写入视图

节点配置和 React 版同一套字段：名称、配置类型、引用蓝图库、是否允许假信号继续传递。

![节点配置](https://github.com/qianzhuoyao/APanel5/raw/v5/docs/guide-assets/live-zh/42-blueprint-node-config.png)

## 使用

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BluePrintVueRoot, BlueprintGraph } from "@arronqzy/vue-blueprint";
import "@arronqzy/vue-blueprint/blueprint.css";

const graph = ref(BlueprintGraph.empty());
const selectedNodeId = ref<string | null>(null);
</script>

<template>
  <BluePrintVueRoot
    :graph="graph"
    :selected-node-id="selectedNodeId"
    @graph-change="graph = $event"
    @select-node="selectedNodeId = $event"
  />
</template>
```

样式：

```ts
import "@arronqzy/vue-blueprint/blueprint.css";
```

## 本地存储

蓝图库、执行日志、接口集合存在 IndexedDB，函数最后一个参数都是 `nameSpace`：

| 数据 | 函数 |
|------|------|
| 蓝图库 | `listBlueprintLibrary` / `getBlueprintLibraryRecord` / `putBlueprintLibraryRecord` / `deleteBlueprintLibraryRecord` / `clearBlueprintLibrary` |
| 执行日志 | `listExecutionRunRecords` / `getExecutionRunRecord` / `putExecutionRunRecord` / `deleteExecutionRunRecord` / `clearAllExecutionRunRecords` / `purgeExecutionRunsOlderThan` / `trimExecutionRunRecordsToMax` / `downloadExecutionRunExport` |
| 执行日志保留策略 | `readExecutionLogSettings` / `writeExecutionLogSettings` / `DEFAULT_EXECUTION_LOG_SETTINGS` |
| 接口集合 | `listApiCollectionRecords` / `deleteApiCollection` / `clearApiCollections`（同时更新内存中的接口列表） |

这一层不负责通知已挂载的视图面板。宿主清理数据请用 `@arronqzy/abuilder` / `@arronqzy/abuilder-vue` 导出的同名函数，删除蓝图库后面板会自动刷新。

## 和 React 版

图数据结构（`BlueprintGraph`、文档同步）是独立 TypeScript 实现，形状与 `react-blueprint` 对齐，所以同一份蓝图 JSON 两边都能打开。画布实现不共享。长期可以抽一层 `blueprint-core`，目前还没有。

执行引擎仍是 `@arronqzy/blueprint-dsl`，不要在本包里再实现一套节点行为。

## 许可证

MIT
