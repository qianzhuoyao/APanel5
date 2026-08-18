import { useSyncExternalStore } from "react";

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

export function removeViewElementScopes(elementIds: readonly string[]) {
  let changed = false;
  for (const id of elementIds) {
    if (scopes.delete(id)) changed = true;
  }
  if (changed) emit();
}

export function setViewElementScope(elementId: string, scope: unknown) {
  scopes.set(elementId, scope);
  emit();
}

export function setViewElementScopes(
  elementIds: string[],
  scope: unknown
) {
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

export function useViewElementScope(elementId: string | null | undefined) {
  return useSyncExternalStore(
    subscribe,
    () => (elementId ? scopes.get(elementId) : undefined),
    () => undefined
  );
}

export function useViewScopeStoreVersion() {
  return useSyncExternalStore(subscribe, () => version, () => 0);
}
