/**
 * Isolate IndexedDB / localStorage / BroadcastChannel per App instance.
 * Empty or omitted keeps the legacy global store names.
 */
export function normalizeAppNameSpace(value?: string | null): string {
  return (value ?? "").trim();
}

export function appStorageKey(base: string, nameSpace?: string | null): string {
  const ns = normalizeAppNameSpace(nameSpace);
  if (!ns) return base;
  return `${base}__${ns.slice(0, 120)}`;
}
