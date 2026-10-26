import { computed, onScopeDispose, ref, type ComputedRef, type Ref } from "vue";
import {
  apiCollectionToListItem,
  createApiCollectionId,
  parseApiCollectionJson,
  type ApiCollectionDocument,
  type ApiCollectionListItem,
  type ApiCollectionRecord,
  normalizeAppNameSpace,
} from "@arronqzy/blueprint-dsl";

import {
  clearApiCollectionRecords,
  deleteApiCollectionRecord,
  listApiCollectionRecords,
  putApiCollectionRecord,
} from "./api-collection-db";

type Listener = () => void;

let nameSpaceRef: string | null | undefined = null;
let records: ApiCollectionRecord[] = [];
let hydrated = false;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener();
}

function sortRecords(list: ApiCollectionRecord[]): ApiCollectionRecord[] {
  return [...list].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getApiCollectionRecords(): ApiCollectionRecord[] {
  return records;
}

export function getApiCollectionListItems(): ApiCollectionListItem[] {
  return records.map(apiCollectionToListItem);
}

export function getApiCollectionById(id: string): ApiCollectionRecord | null {
  return records.find((item) => item.id === id) ?? null;
}

export function subscribeApiCollections(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function hydrateApiCollections(
  nameSpace?: string | null
): Promise<ApiCollectionRecord[]> {
  nameSpaceRef = nameSpace;
  const persisted = await listApiCollectionRecords(nameSpace);
  const memoryOnly = records.filter((item) => !item.persistLocal);
  const persistedIds = new Set(persisted.map((item) => item.id));
  records = sortRecords([
    ...persisted,
    ...memoryOnly.filter((item) => !persistedIds.has(item.id)),
  ]);
  hydrated = true;
  emit();
  return records;
}

export type UpsertApiCollectionInput = {
  id?: string;
  rawJson: string;
  persistLocal: boolean;
  /** 未写 document.name 时用文件名 */
  fallbackName?: string;
  /** 省略时写入当前已 hydrate 的 nameSpace */
  nameSpace?: string | null;
};

export type UpsertApiCollectionResult =
  | { ok: true; record: ApiCollectionRecord }
  | { ok: false; error: string };

function isCurrentNameSpace(nameSpace?: string | null): boolean {
  return normalizeAppNameSpace(nameSpace) === normalizeAppNameSpace(nameSpaceRef);
}

/** 写入接口集合；persistLocal 时落 IndexedDB，同一 nameSpace 下刷新内存列表 */
export async function putApiCollection(
  record: ApiCollectionRecord,
  nameSpace?: string | null
): Promise<ApiCollectionRecord> {
  if (record.persistLocal) {
    await putApiCollectionRecord(record, nameSpace);
  } else if (isCurrentNameSpace(nameSpace)) {
    const existing = records.find((item) => item.id === record.id);
    if (existing?.persistLocal) {
      await deleteApiCollectionRecord(record.id, nameSpace);
    }
  }
  if (isCurrentNameSpace(nameSpace)) {
    const next = records.filter((item) => item.id !== record.id);
    next.push(record);
    records = sortRecords(next);
    emit();
  }
  return record;
}

export async function upsertApiCollectionFromJson(
  input: UpsertApiCollectionInput
): Promise<UpsertApiCollectionResult> {
  const parsed = parseApiCollectionJson(input.rawJson);
  if (!parsed.ok) return parsed;

  const targetNameSpace =
    input.nameSpace !== undefined ? input.nameSpace : nameSpaceRef;
  const document: ApiCollectionDocument = {
    ...parsed.document,
    name:
      parsed.document.name.trim() ||
      input.fallbackName?.replace(/\.json$/i, "").trim() ||
      parsed.document.name,
  };
  const now = Date.now();
  const existingInMemory = input.id
    ? records.find((item) => item.id === input.id) ?? null
    : null;
  const existingPersisted =
    input.id && !isCurrentNameSpace(targetNameSpace)
      ? await listApiCollectionRecords(targetNameSpace).then(
          (list) => list.find((item) => item.id === input.id) ?? null
        )
      : null;
  const existing = existingInMemory ?? existingPersisted;
  const record: ApiCollectionRecord = {
    id: existing?.id ?? input.id ?? createApiCollectionId(),
    name: document.name,
    persistLocal: input.persistLocal,
    document,
    rawJson: JSON.stringify(document, null, 2),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await putApiCollection(record, targetNameSpace);
  return { ok: true, record };
}

export async function removeApiCollection(id: string): Promise<void> {
  const existing = records.find((item) => item.id === id);
  if (existing?.persistLocal || hydrated) {
    try {
      await deleteApiCollectionRecord(id, nameSpaceRef);
    } catch {
      // 内存-only 记录在库里可能不存在
    }
  }
  records = records.filter((item) => item.id !== id);
  emit();
}

/** 按 nameSpace 删除接口集合；若该 nameSpace 正在被编辑器使用，内存列表同步移除 */
export async function deleteApiCollection(
  id: string,
  nameSpace?: string | null
): Promise<void> {
  await deleteApiCollectionRecord(id, nameSpace);
  if (!isCurrentNameSpace(nameSpace)) return;
  records = records.filter((item) => item.id !== id);
  emit();
}

/** 清空该 nameSpace 下的接口集合（含仅存内存的集合），返回删除数量 */
export async function clearApiCollections(nameSpace?: string | null): Promise<number> {
  const persisted = await listApiCollectionRecords(nameSpace);
  await clearApiCollectionRecords(nameSpace);
  const removedIds = new Set(persisted.map((item) => item.id));
  if (isCurrentNameSpace(nameSpace)) {
    records.forEach((item) => removedIds.add(item.id));
    records = [];
    emit();
  }
  return removedIds.size;
}

/** Vue composable：返回响应式集合列表 */
export function useApiCollections(): Ref<ApiCollectionRecord[]> {
  const list = ref<ApiCollectionRecord[]>([...records]);
  const unsubscribe = subscribeApiCollections(() => {
    list.value = [...records];
  });
  onScopeDispose(unsubscribe);
  return list;
}

export function useApiCollectionListItems(): ComputedRef<ApiCollectionListItem[]> {
  const list = useApiCollections();
  return computed(() => list.value.map(apiCollectionToListItem));
}
