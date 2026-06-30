import { store, type Node } from "@arronqzy/rx-store";
import { useStoreRef } from "./useStore";

export function useSelectedNodes() {
  return useStoreRef((state) => {
    const selectedMap: Record<string, Record<string, unknown>> = {};
    state.selectedIds.forEach((id) => {
      const node = store.findNodeById(state.root, id);
      if (node) selectedMap[id] = node.props as Record<string, unknown>;
    });
    return selectedMap;
  });
}

export function useSelectedPositions() {
  return useStoreRef((state) => {
    const posMap: Record<string, { x: number; y: number }> = {};
    state.selectedIds.forEach((id) => {
      const node = store.findNodeById(state.root, id);
      if (node) {
        const props = node.props as { x?: number; y?: number };
        posMap[id] = { x: props.x ?? 0, y: props.y ?? 0 };
      }
    });
    return posMap;
  });
}

export function useSelectedNodesFull() {
  return useStoreRef(
    (state) =>
      state.selectedIds
        .map((id) => store.findNodeById(state.root, id))
        .filter(Boolean) as Node[]
  );
}
