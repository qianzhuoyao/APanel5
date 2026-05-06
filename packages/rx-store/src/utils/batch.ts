import { store } from '../store';
/**
 * 批量操作：内部所有 update 自动合并为一次历史记录
 * 用法和 produce 几乎一模一样，爽到飞起
 * 
 * @example
 * function onDragNode(nodeId: string, dx: number, dy: number) {
  batch(() => {
    store.update(draft => {
      const node = findNode(draft.root, nodeId);
      if (node) {
        node.props.x += dx;
        node.props.y += dy;
      }
    });
  });
}
 */
export function batch<T>(fn: () => T): T {
  const batchId = `batch-${Date.now()}-${Math.random()}`;
  store.startBatch(batchId);
  try {
    return fn();
  } finally {
    store.endBatch();
  }
}