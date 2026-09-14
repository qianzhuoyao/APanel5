# @arronqzy/vue-rx-store

`@arronqzy/rx-store` 的 Vue 3 composables。和 `@arronqzy/react-rx-store` 同一套订阅粒度：整份状态、单个节点、选中集、位置。

写状态仍用 `store.update` / `store.updateById`，不要在 composable 里再包一层可变副本。

## 安装

```bash
pnpm add @arronqzy/vue-rx-store @arronqzy/rx-store vue
```

## API

| Composable | 说明 |
|------------|------|
| `useStore(selector?)` | 订阅状态切片（快照） |
| `useStoreRef(selector?)` | 返回 `ref`，给模板用 |
| `useNode(id, selector?)` | 按节点 id 订阅 props |
| `useSelectedNodes()` | 当前选中节点 |
| `useSelectedPositions()` | 选中节点位置 |
| `useSelectedNodesFull()` | 选中节点完整对象 |

```vue
<script setup lang="ts">
import { useStoreRef } from "@arronqzy/vue-rx-store";

const selectedCount = useStoreRef((s) => s.selectedIds.length);
</script>

<template>
  <span>已选 {{ selectedCount }} 个</span>
</template>
```

## 许可证

MIT
