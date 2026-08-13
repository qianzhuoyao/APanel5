import type { NormalizedTable, PanelTableConfig } from "../types";
import { transformToTable } from "../transform/transformToTable";

type CacheEntry = { key: string; value: NormalizedTable };

export class TransformCache {
  private map = new Map<string, CacheEntry>();
  constructor(private maxSize = 32) {}

  get(key: string): NormalizedTable | undefined {
    const hit = this.map.get(key);
    if (!hit) return undefined;
    // refresh LRU order
    this.map.delete(key);
    this.map.set(key, hit);
    return hit.value;
  }

  set(key: string, value: NormalizedTable) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, { key, value });
    while (this.map.size > this.maxSize) {
      const oldest = this.map.keys().next().value as string | undefined;
      if (oldest == null) break;
      this.map.delete(oldest);
    }
  }

  clear() {
    this.map.clear();
  }
}

const globalCache = new TransformCache(48);

function stableStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function buildTransformCacheKey(raw: unknown, config: PanelTableConfig): string {
  return `${stableStringify(raw)}::${stableStringify({
    transform: config.transform,
    columns: config.columns,
  })}`;
}

export function transformToTableCached(
  raw: unknown,
  config: PanelTableConfig = {},
  cache: TransformCache = globalCache
): NormalizedTable {
  const key = buildTransformCacheKey(raw, config);
  const hit = cache.get(key);
  if (hit) return hit;
  const next = transformToTable(raw, config);
  cache.set(key, next);
  return next;
}

export { globalCache as tableTransformCache };
