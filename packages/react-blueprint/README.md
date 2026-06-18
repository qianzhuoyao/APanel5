# @arronqzy/react-blueprint

Abuilder 的**蓝图编辑器** React 包，基于 [React Flow](https://reactflow.dev/) 提供节点连线编辑、调试执行与蓝图库管理。

## 功能概览

- **可视化蓝图**：拖拽节点、连线、对齐、视口平移缩放
- **节点类型**：逻辑、请求、时钟、JSON、子蓝图引用等（由 `blueprint-dsl` 定义行为）
- **调试执行**：单步/连续调试、执行轨迹、连线信号高亮、时钟节点进度
- **蓝图库**：IndexedDB 存储、导入导出、元数据编辑
- **执行日志**：运行记录持久化、导出与清理策略
- **视图联动**：生命周期钩子向视图节点写入 Scope

## 安装

```bash
pnpm add @arronqzy/react-blueprint @xyflow/react
```

```ts
import "@arronqzy/react-blueprint/blueprint.css";
```

## 使用

### 蓝图画布

```tsx
import { useState } from "react";
import { BluePrintReactRoot, BlueprintGraph } from "@arronqzy/react-blueprint";
import "@arronqzy/react-blueprint/blueprint.css";

function BlueprintEditor() {
  const [graph, setGraph] = useState(() => BlueprintGraph.empty());

  return (
    <BluePrintReactRoot
      graph={graph}
      onGraphChange={setGraph}
      selectedNodeId={null}
      onSelectNode={() => {}}
    />
  );
}
```

### 文档转可执行图

```ts
import { documentToRunnableGraph } from "@arronqzy/react-blueprint";

const runnable = documentToRunnableGraph(document, { libraryNameById });
```

### 调试会话

```tsx
import { useBlueprintDebugSession } from "@arronqzy/react-blueprint";

const debug = useBlueprintDebugSession({
  graph,
  blueprintId,
  blueprintName: "我的蓝图",
  resolveLibraryBlueprint,
  onViewScopeUpdate: (ids, scope) => { /* 回写视图 Scope */ },
});
```

### 页面生命周期（与视图集成）

```tsx
import { useBlueprintPageLifecycle } from "@arronqzy/react-blueprint";

useBlueprintPageLifecycle({
  graph,
  active: blueprintOpen,
  onViewScopeUpdate,
  resolveLibraryBlueprint,
});
```

## 主要导出

| 模块 | 说明 |
|------|------|
| `BluePrintReactRoot` | 蓝图主画布 |
| `BlueprintGraph` | 图数据结构（`src/graph`） |
| `documentToRunnableGraph` | 文档 → 运行时图 |
| `useBlueprintDebugSession` | 调试工具栏与会话 |
| `useBlueprintPageLifecycle` | 挂载/卸载时启停蓝图 |
| `BlueprintNodeConfigSidebar` | 节点配置侧栏 |
| `BlueprintPanelToolbar` | 蓝图工具栏 |
| `blueprint-library-db` | 蓝图库 IndexedDB API |

## 依赖关系

- `@arronqzy/blueprint-dsl` — 节点定义与执行引擎
- `@arronqzy/react-rx-store` — 与画布状态订阅
- `@arronqzy/ui` — UI 组件

## 许可证

ISC
