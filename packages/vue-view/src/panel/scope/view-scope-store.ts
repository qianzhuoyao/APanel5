import {
  onScopeDispose,
  shallowRef,
  toValue,
  watchEffect,
  type MaybeRefOrGetter,
  type Ref,
  type ShallowRef,
} from "vue";

const scopes = new Map<string, unknown>();
let version = 0;
const listeners = new Set<() => void>();

function emit() {
  version += 1;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function clearViewElementScopes() {
  if (scopes.size === 0) return;
  scopes.clear();
  emit();
}

export function setViewElementScope(elementId: string, scope: unknown) {
  scopes.set(elementId, scope);
  emit();
}

export function setViewElementScopes(elementIds: string[], scope: unknown) {
  if (elementIds.length === 0) return;
  elementIds.forEach((id) => scopes.set(id, scope));
  emit();
}

export function getViewElementScope(elementId: string): unknown | undefined {
  return scopes.get(elementId);
}

export function hasViewElementScope(elementId: string): boolean {
  return scopes.has(elementId);
}

function useSyncExternalStore<T>(getSnapshot: () => T): ShallowRef<T> {
  const state = shallowRef(getSnapshot()) as ShallowRef<T>;
  const update = () => {
    state.value = getSnapshot();
  };
  const unsub = subscribe(update);
  onScopeDispose(unsub);
  return state;
}

/** 订阅单个视图元素的 scope 快照（Vue composable） */
export function useViewElementScope(
  elementId: MaybeRefOrGetter<string | null | undefined>
): Ref<unknown | undefined> {
  const scope = shallowRef<unknown>(undefined);

  watchEffect((onCleanup) => {
    const id = toValue(elementId);
    const update = () => {
      scope.value = id ? scopes.get(id) : undefined;
    };
    update();
    const unsub = subscribe(update);
    onCleanup(unsub);
  });

  return scope;
}

/** 订阅 scope store 版本号，用于在任意 scope 变更时触发重渲染 */
export function useViewScopeStoreVersion(): Ref<number> {
  return useSyncExternalStore(() => version);
}
