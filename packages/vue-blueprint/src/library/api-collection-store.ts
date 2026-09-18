import { computed, onScopeDispose, ref, type ComputedRef, type Ref } from "vue";
import {
  apiCollectionToListItem,
  createApiCollectionId,
  parseApiCollectionJson,
  type ApiCollectionDocument,
  type ApiCollectionListItem,
  type ApiCollectionRecord,
} from "@arronqzy/blueprint-dsl";

import {
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
};

export type UpsertApiCollectionResult =
  | { ok: true; record: ApiCollectionRecord }
  | { ok: false; error: string };

export async function upsertApiCollectionFromJson(
  input: UpsertApiCollectionInput
): Promise<UpsertApiCollectionResult> {
  const parsed = parseApiCollectionJson(input.rawJson);
  if (!parsed.ok) return parsed;

  const document: ApiCollectionDocument = {
    ...parsed.document,
    name:
      parsed.document.name.trim() ||
      input.fallbackName?.replace(/\.json$/i, "").trim() ||
      parsed.document.name,
  };
  const now = Date.now();
  const existing = input.id
    ? records.find((item) => item.id === input.id) ?? null
    : null;
  const record: ApiCollectionRecord = {
    id: existing?.id ?? createApiCollectionId(),
    name: document.name,
    persistLocal: input.persistLocal,
    document,
    rawJson: JSON.stringify(document, null, 2),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  if (record.persistLocal) {
    await putApiCollectionRecord(record, nameSpaceRef);
  } else if (existing?.persistLocal) {
    await deleteApiCollectionRecord(record.id, nameSpaceRef);
  }

  const next = records.filter((item) => item.id !== record.id);
  next.push(record);
  records = sortRecords(next);
  emit();
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
