import { store } from "@arronqzy/rx-store";
import { useStoreRef } from "./useStore";

export function useNode<T = Record<string, unknown>>(
  id: string,
  selector?: (props: Record<string, unknown>) => T
) {
  return useStoreRef((state) => {
    const node = store.findNodeById(state.root, id);
    const props = (node?.props ?? {}) as Record<string, unknown>;
    return selector ? selector(props) : (props as T);
  });
}
