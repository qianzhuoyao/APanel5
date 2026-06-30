# @arronqzy/vue-rx-store

Vue 3 composables，用于订阅 `@arronqzy/rx-store` 全局状态。

## API

| Composable | 说明 |
|------------|------|
| `useStore(selector?)` | 订阅状态切片（快照值） |
| `useStoreRef(selector?)` | 返回 `ref`，适合模板 |
| `useNode(id, selector?)` | 按节点 id 订阅 props |
| `useSelectedNodes()` | 当前选中节点 props |
| `useSelectedPositions()` | 选中节点位置 |
| `useSelectedNodesFull()` | 选中节点完整对象 |

## 示例

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
