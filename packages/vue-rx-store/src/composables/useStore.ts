import { store, type State } from "@arronqzy/rx-store";
import { ref, onBeforeUnmount } from "vue";

function shallowEqual<T>(a: T, b: T): boolean {
  return Object.is(a, b);
}

/**
 * 订阅 rx-store 全局状态切片。
 * @example const count = useStore((s) => s.selectedIds.length);
 */
export function useStore<T = State>(
  selector?: (state: State) => T,
  equalityFn: (a: T, b: T) => boolean = shallowEqual
): T {
  const sel = selector ?? ((s: State) => s as unknown as T);
  const state = ref(sel(store.getState())) as { value: T };

  const sub = store.select().subscribe(() => {
    const next = sel(store.getState());
    if (!equalityFn(state.value, next)) {
      state.value = next;
    }
  });

  onBeforeUnmount(() => sub.unsubscribe());

  return state.value;
}

/** 返回响应式 ref，适合模板绑定 */
export function useStoreRef<T = State>(
  selector?: (state: State) => T,
  equalityFn: (a: T, b: T) => boolean = shallowEqual
) {
  const sel = selector ?? ((s: State) => s as unknown as T);
  const state = ref(sel(store.getState())) as { value: T };

  const sub = store.select().subscribe(() => {
    const next = sel(store.getState());
    if (!equalityFn(state.value, next)) {
      state.value = next;
    }
  });

  onBeforeUnmount(() => sub.unsubscribe());

  return state;
}
