import { State, store } from "@arronqzy/rx-store";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";

/**
 * 
 * @param selector 
 * @param equalityFn 
 * @returns 
 * 
 * @example
 * const selectedCount = useStore(s => s.selectedIds.length);
const node = useStore(s => s.root.children.find(n => n.id === nodeId));
const canUndo = useStore(() => store.history.canUndo$.value); // 甚至可以订阅 BehaviorSubject！
 */

export const useStore = <T = State,>(
  selector?: (state: State) => T,
  equalityFn?: (a: T, b: T) => boolean
): T => {
  const sel = selector ?? ((s: State) => s as unknown as T);

  return useSyncExternalStoreWithSelector(
    (callback) => {
      const sub = store.select().subscribe(callback);
      return () => sub.unsubscribe();
    },
    () => store.getState(),
    undefined,
    sel,
    equalityFn
  );
};
