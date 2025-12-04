# `@arron/rx-store`  

**一个专为低代码/画布编辑器打造的极简、高性能、工业级状态管理库**  
基于 **Immer + RxJS**，天生支持：

- 100% Immutable（写法却像 mutable）
- 类似 Figma 的精准路径订阅（只重渲染改动的节点）
- 完整的 Undo/Redo + Batch 操作（拖拽只记一次）
- 插件系统（内置 + 第三方任意扩展）
- 体积仅 ~15kB，TypeScript 体验完美

灵感来源：**tldraw v2、Figma、Excalidraw、Linear、Retool** 等新一代编辑器的核心状态层实现。

## 安装

```bash
# yarn / pnpm / npm 任意
yarn add @arron/rx-store rxjs immer
```

## 快速开始

```ts
import { store } from '@arron/rx-store';

// 1. 普通更新（写法跟 mutable 完全一样）
store.update(draft => {
  draft.root.children.push({
    id: 'text-1',
    type: 'text',
    props: { text: 'Hello World', x: 100, y: 100 }
  });
});

// 2. 拖拽防抖（只记一次历史）
store.startBatch('drag-node-123');
store.update(draft => {
  draft.root.children[0].props.x += 10;
});
store.endBatch();

// 3. Undo / Redo（Ctrl+Z / Ctrl+Y 直接可用）
store.undo();
store.redo();
```

## 核心 API

### store.update(updater, options?)

```ts
store.update(draft => {
  // draft 就是普通对象，随便改！
  draft.selectedIds = ['node-1'];
}, {
  meta: { type: 'select' },
  skipHistory: false   // 可选：这次操作不进历史（比如光标移动）
});
```

### store.selectPath<T>(path)

精准订阅某一条路径的变化，**只在真正改变时触发**，完美适配 React/Vue 局部渲染。

```ts
store.selectPath<number>('root.children[2].props.x')
  .subscribe(x => {
    console.log('X 坐标变了：', x);
  });

// 支持嵌套数组写法
store.selectPath('root.children[0].props.style.fontSize')
```

### Undo / Redo

```ts
store.undo();
store.redo();

// 响应式按钮状态
store.canUndo$.subscribe(can => btnUndo.disabled = !can);
store.canRedo$.subscribe(can => btnRedo.disabled = !can);
```

### Batch 操作（拖拽、框选移动必备）

```ts
store.startBatch('move-multiple-nodes');
// ... 连续多次 update
store.endBatch();   // 整个过程只记一次历史
```

### 插件系统

```ts
import { store } from '@arron/rx-store';

const autoSavePlugin = {
  name: 'auto-save',
  init(store) {
    store.select().subscribe(state => {
      localStorage.setItem('editor-state', JSON.stringify(state));
    });
  }
};

store.registerPlugin(autoSavePlugin);
```

插件可用的钩子：

- `init(store)`
- `onBeforeUpdate(old, new)`
- `shouldSkipHistory(old, new)` → 返回 `true` 跳过本次历史记录
- `onUpdate(old, new)`

## 完整示例：React Hook

```tsx
import { store } from '@arron/rx-store';
import { useEffect, useState } from 'react';

function useNode(id: string) {
  const [node, setNode] = useState(() =>
    store.getState().root.children.find(n => n.id === id)
  );

  useEffect(() => {
    const sub = store
      .selectPath(`root.children[${id}]`)  // 也可以写死索引或用 find
      .subscribe(setNode);
    return () => sub.unsubscribe();
  }, [id]);

  return node;
}
```

## 为什么选择这个方案（2025 最佳实践）

| 方案                | 体积   | TS 支持 | 性能     | 社区趋势 |
|---------------------|--------|---------|----------|----------|
| immutable.js        | 150kB+ | 差      | 慢 30-200% | 已无人维护 |
| zustand + immer     | ~20kB  | 好      | 快       | 流行     |
| **本库 (Immer + RxJS)** | **~15kB** | **完美** | **最快** | **新一代编辑器标配** |

## 许可证

MIT © arron

---

