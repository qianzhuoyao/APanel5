# @arronqzy/react-rx-store

为 `@arronqzy/rx-store` 提供的 **React Hooks** 封装，用于在画布/编辑器中精准订阅节点与选中状态。

## 功能概览

- **`useStore`**：订阅全局 store 状态
- **`useNode`**：按节点 id 订阅单个节点
- **`useSelectedNodes` / `useSelectedNodesFull`**：订阅当前选中节点
- **`useSelectedPositions`**：订阅选中节点位置（适合高频拖拽场景）

基于 `use-sync-external-store`，与 RxJS 路径订阅配合，减少不必要的重渲染。

## 安装

```bash
pnpm add @arronqzy/react-rx-store @arronqzy/rx-store react
```

## 使用

```tsx
import { useNode, useStore } from "@arronqzy/react-rx-store";
import { store } from "@arronqzy/rx-store";

function NodeLabel({ id }: { id: string }) {
  const node = useNode(id);
  return <span>{node?.props?.name}</span>;
}

function SelectionCount() {
  const state = useStore();
  const count = state.selectedIds?.length ?? 0;
  return <span>已选 {count} 个</span>;
}
```

更新状态仍通过 `store.update` / `store.undo` 等 API（见 `@arronqzy/rx-store`）。

## 依赖关系

- `@arronqzy/rx-store` — 核心状态引擎
- `react` >= 18（peer）

## 许可证

MIT
