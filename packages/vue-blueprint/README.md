# @arronqzy/vue-blueprint

Vue 3 版 Abuilder **蓝图编辑器**，使用 **@vue-flow/core** 与 **Ant Design Vue**，功能与 `@arronqzy/react-blueprint` 对齐。

## 功能

- 可编辑蓝图画布：拖拽节点、连线、右键菜单
- 7 种内置节点：Blueprint、Logic、And、Lifecycle、Fetch、Json、Clock
- 自定义边与执行 overlay 高亮
- 蓝图库（IndexedDB）、导入/导出
- 节点配置侧栏、执行日志、调试会话
- 页面生命周期与 Scope 写入视图

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

## 样式

```ts
import "@arronqzy/vue-blueprint/blueprint.css";
```

## 与 React 版关系

- 图数据层（`BlueprintGraph`、document 同步等）为独立 TS 实现，结构与 `react-blueprint` 对齐
- UI 与画布基于 Vue Flow，不依赖 `@xyflow/react`
- 长期可抽取共享 `blueprint-core` 消除双份 graph 代码

## 许可证

MIT
