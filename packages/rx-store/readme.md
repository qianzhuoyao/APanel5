# @arronqzy/rx-store

画布状态。Immer 负责「改起来像可变对象」，RxJS 负责按路径订阅，历史栈负责撤销 / 重做。视图包和蓝图包都通过它读写节点，不要再平行维护一份画布 state。

React 订阅用 `@arronqzy/react-rx-store`，Vue 用 `@arronqzy/vue-rx-store`。本包不依赖框架。

## 安装

```bash
pnpm add @arronqzy/rx-store rxjs immer
```

仓库里已经有一个单例 `store`。自己的应用也可以 `new RxStore(initialState)`。

## 改状态

`update` 的参数是 Immer draft，不要把返回值再赋回去。

```ts
import { store } from "@arronqzy/rx-store";

store.update((draft) => {
  draft.selectedIds = ["node-1"];
}, {
  meta: { type: "select" },
  skipHistory: false,
});
```

按节点 id 改属性（拖拽、改配置时优先用这个，不依赖 children 下标）：

```ts
store.updateById("node-1", (node) => {
  node.props.x += 10;
});
```

拖拽过程中多次更新只记一条历史：

```ts
store.startBatch("drag-node-1");
store.updateById("node-1", (node) => {
  node.props.x += 10;
});
store.endBatch();
```

```ts
store.undo();
store.redo();
store.canUndo$.subscribe((can) => { /* 按钮禁用 */ });
store.canRedo$.subscribe((can) => {});
```

`replaceState` 整份替换并记入历史，用于加载工作区。光标、hover 这类高频变化传 `skipHistory: true`。

## 订阅

整份状态：

```ts
store.select().subscribe((state) => {
  console.log(state.selectedIds);
});
```

路径或节点 id。传入的字符串若是节点 id，发出的是该节点的 `props`；否则按 `.` 和 `[index]` 取路径。只有值变了才发（`distinctUntilChanged`）。

```ts
store.selectPath("node-1").subscribe((props) => {
  console.log(props);
});

store.selectPath("variables").subscribe((variables) => {
  console.log(variables);
});
```

React / Vue 组件不要手写上面的订阅，用对应的 hooks / composables，它们已经接了 `useSyncExternalStore`。

## 插件

```ts
store.registerPlugin({
  name: "auto-save",
  init(store) {
    store.select().subscribe((state) => {
      // 自己决定何时落盘，不要每个 state 都写 IndexedDB
    });
  },
  shouldSkipHistory() {
    return false;
  },
});
```

钩子：`init`、`onBeforeUpdate`、`shouldSkipHistory`、`onUpdate`、`onEvent`。

## 许可证

MIT
