# @arronqzy/react-rx-store

`@arronqzy/rx-store` 的 React Hooks。按节点 id 订阅，拖一个节点时不要让整棵树重渲染。

更新仍走 `store.update` / `store.updateById` / `store.undo`，本包只负责读。

## 安装

```bash
pnpm add @arronqzy/react-rx-store @arronqzy/rx-store react
```

React 18+。

## 用法

```tsx
import { useNode, useStore } from "@arronqzy/react-rx-store";

function NodeLabel({ id }: { id: string }) {
  const node = useNode(id);
  return <span>{node?.props?.name}</span>;
}

function SelectionCount() {
  const state = useStore();
  return <span>已选 {state.selectedIds?.length ?? 0} 个</span>;
}
```

| Hook | 订阅什么 |
|------|----------|
| `useStore` | 整份或选择器切出的状态 |
| `useNode(id)` | 单个节点 |
| `useSelectedNodes` | 当前选中节点 |
| `useSelectedNodesFull` | 选中节点的完整对象 |
| `useSelectedPositions` | 选中节点位置，给拖拽用 |

实现基于 `use-sync-external-store`，和 store 的路径订阅配合。不要在组件里自己 `store.select().subscribe` 再 `setState`，容易和批量更新打架。

## 许可证

MIT
