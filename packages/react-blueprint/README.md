# @arronqzy/react-blueprint

蓝图编辑器。基于 [React Flow](https://reactflow.dev/)：拖节点、连线、单步调试、蓝图库和执行日志。节点怎么跑由 `@arronqzy/blueprint-dsl` 决定，本包只负责画布和调试界面。

通常由 `@arronqzy/react-view` 嵌在视图下方。单独用时自己管 `graph` 状态。

![视图下方的蓝图画布，可从库里选蓝图、保存和同步](https://github.com/qianzhuoyao/APanel5/raw/v5/docs/guide-assets/live-zh/40-blueprint-open.png)

选中节点后，配置侧栏说明这个节点是什么、引用哪份蓝图、假信号要不要继续往下传：

![蓝图节点配置](https://github.com/qianzhuoyao/APanel5/raw/v5/docs/guide-assets/live-zh/42-blueprint-node-config.png)

## 能编辑什么

- 画布：拖节点、连线、右键菜单、平移缩放
- 内置节点：蓝图引用、逻辑、与门、生命周期、请求、JSON、存储、时钟、事件
- 调试：模拟场景、全部运行、回到起点、上一步 / 下一步、连线信号高亮、时钟进度
- 蓝图库：IndexedDB 保存、导入导出、重命名
- 执行日志：持久化、导出、保留天数和条数
- 和视图联动：生命周期钩子把 Scope 写回视图节点

节点在没有匹配的 `I18nProvider` 时不会直接抛错（`EnsureI18nProvider` + `useI18nOptional`）。Umi 等打包器打出两份 `@arronqzy/i18n` 时，界面仍能打开；若语言不跟随面板切换，用 `overrides` 把 `@arronqzy/i18n` 收成一份。

## 安装

```bash
pnpm add @arronqzy/react-blueprint @xyflow/react
```

```ts
import "@arronqzy/react-blueprint/blueprint.css";
```

## 画布

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

## 调试和生命周期

把文档变成可执行图：

```ts
import { documentToRunnableGraph } from "@arronqzy/react-blueprint";

const runnable = documentToRunnableGraph(document, { libraryNameById });
```

调试会话（工具栏的单步、全部运行都走这里）：

```tsx
import { useBlueprintDebugSession } from "@arronqzy/react-blueprint";

const debug = useBlueprintDebugSession({
  graph,
  blueprintId,
  blueprintName: "我的蓝图",
  resolveLibraryBlueprint,
  onViewScopeUpdate: (ids, scope) => {
    // 回写视图 Scope
  },
});
```

页面打开 / 关闭时启停蓝图：

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

| 导出 | 说明 |
|------|------|
| `BluePrintReactRoot` | 主画布 |
| `BlueprintGraph` | 图数据，`empty()` 得到空图 |
| `documentToRunnableGraph` | 文档 → 运行时图 |
| `useBlueprintDebugSession` | 调试会话 |
| `useBlueprintPageLifecycle` | 挂载 / 卸载时启停 |
| `BlueprintNodeConfigSidebar` | 节点配置侧栏 |
| `BlueprintPanelToolbar` | 库、保存、同步、调试按钮 |
| `BlueprintExecutionLogPanel` | 执行日志 |

## 依赖

`@arronqzy/blueprint-dsl`、`@arronqzy/i18n`、`@arronqzy/react-rx-store`、`@arronqzy/ui`、`@xyflow/react`。

## 许可证

ISC
