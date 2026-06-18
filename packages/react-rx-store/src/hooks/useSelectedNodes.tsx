import { store, Node } from "@arronqzy/rx-store";
import { useStore } from "./useStore";

export function useSelectedNodes(): Record<string, any> {
  return useStore((state) => {
    const selectedMap: Record<string, any> = {};
    state.selectedIds.forEach((id) => {
      const node = store.findNodeById(state.root, id); // ID 递归查找
      if (node) {
        selectedMap[id] = node.props; // 只存 props，节省内存
      }
    });
    return selectedMap;
  });
}
// 精炼版：只订阅特定属性（如位置）
export function useSelectedPositions(): Record<
  string,
  { x: number; y: number }
> {
  return useStore((state) => {
    const posMap: Record<string, { x: number; y: number }> = {};
    state.selectedIds.forEach((id) => {
      const node = store.findNodeById(state.root, id);
      if (node) {
        posMap[id] = { x: node.props.x ?? 0, y: node.props.y ?? 0 };
      }
    });
    return posMap;
  });
}

// 高级：订阅节点完整对象（含 events 等）
export function useSelectedNodesFull(): Node[] {
  return useStore(
    (state) =>
      state.selectedIds
        .map((id) => store.findNodeById(state.root, id))
        .filter(Boolean) as Node[]
  );
}
