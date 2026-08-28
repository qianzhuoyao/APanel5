import {
  evaluateScopeExpression,
  evaluateScopeTemplate,
  hasScopeTemplate,
  looksLikeJsonText,
} from "./scope-template.js";
import { isWholeScopeExpression } from "./incoming-node-scope.js";

export type StorageKind = "session" | "local";

export type StorageReadConfig = {
  storage: StorageKind;
  key: string;
};

export type StorageSetConfig = {
  storages: StorageKind[];
  key: string;
  value: string;
};

export type StorageNodeConfig = {
  read: StorageReadConfig;
  set: StorageSetConfig;
};

export const STORAGE_KINDS: StorageKind[] = ["session", "local"];

export const DEFAULT_STORAGE_NODE_CONFIG: StorageNodeConfig = {
  read: { storage: "local", key: "" },
  set: { storages: [], key: "", value: "" },
};

export type WebStorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

export type StorageAccessors = {
  session?: WebStorageLike | null;
  local?: WebStorageLike | null;
};

function isStorageKind(value: unknown): value is StorageKind {
  return value === "session" || value === "local";
}

export function uniqueStorageKinds(kinds?: readonly unknown[]): StorageKind[] {
  const next = new Set<StorageKind>();
  for (const kind of kinds ?? []) {
    if (isStorageKind(kind)) next.add(kind);
  }
  return STORAGE_KINDS.filter((kind) => next.has(kind));
}

export function normalizeStorageConfig(
  config?: Partial<StorageNodeConfig> | null
): StorageNodeConfig {
  const read = config?.read;
  const set = config?.set;
  return {
    read: {
      storage: read?.storage === "session" ? "session" : "local",
      key: typeof read?.key === "string" ? read.key : "",
    },
    set: {
      storages: uniqueStorageKinds(set?.storages),
      key: typeof set?.key === "string" ? set.key : "",
      value: typeof set?.value === "string" ? set.value : "",
    },
  };
}

export function isStorageReadConfigured(
  config: Pick<StorageNodeConfig, "read">
): boolean {
  return Boolean(config.read?.key?.trim());
}

export function isStorageSetConfigured(
  config: Pick<StorageNodeConfig, "set">
): boolean {
  return (
    Boolean(config.set?.key?.trim()) && (config.set?.storages?.length ?? 0) > 0
  );
}

export function resolveStorageWriteValue(
  template: string,
  scope: unknown
): unknown {
  const raw = template ?? "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (isWholeScopeExpression(trimmed)) {
    const value = evaluateScopeExpression(trimmed.slice(1, -1), scope);
    return value === undefined ? "" : value;
  }
  if (hasScopeTemplate(raw)) {
    return evaluateScopeTemplate(raw, scope);
  }
  return raw;
}

export function serializeStorageValue(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function deserializeStorageValue(raw: string | null): unknown {
  if (raw === null) return null;
  const trimmed = raw.trim();
  if (!trimmed) return raw;
  if (!looksLikeJsonText(trimmed)) return raw;
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return raw;
  }
}

function getDefaultStorageAccessors(): StorageAccessors | null {
  if (typeof window === "undefined") return null;
  try {
    return {
      session: window.sessionStorage,
      local: window.localStorage,
    };
  } catch {
    return null;
  }
}

function requireStorage(
  accessors: StorageAccessors | null,
  kind: StorageKind
): WebStorageLike {
  const target = kind === "session" ? accessors?.session : accessors?.local;
  if (!target) {
    throw new Error(
      kind === "session"
        ? "当前环境不支持 sessionStorage"
        : "当前环境不支持 localStorage"
    );
  }
  return target;
}

/** 先设置再读取。未配置设置则不写入；未配置读取则返回空。 */
export function executeStorageConfig(
  config: StorageNodeConfig,
  incomingScope: unknown,
  accessors?: StorageAccessors | null
): unknown {
  const normalized = normalizeStorageConfig(config);
  const store = accessors === undefined ? getDefaultStorageAccessors() : accessors;

  if (isStorageSetConfigured(normalized)) {
    const value = resolveStorageWriteValue(normalized.set.value, incomingScope);
    const serialized = serializeStorageValue(value);
    const key = normalized.set.key.trim();
    for (const kind of normalized.set.storages) {
      requireStorage(store, kind).setItem(key, serialized);
    }
  }

  if (!isStorageReadConfigured(normalized)) {
    return null;
  }

  return deserializeStorageValue(
    requireStorage(store, normalized.read.storage).getItem(
      normalized.read.key.trim()
    )
  );
}
