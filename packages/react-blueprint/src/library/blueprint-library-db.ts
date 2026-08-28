import { appStorageKey } from "@arronqzy/blueprint-dsl";
import type {
  BlueprintLibraryListItem,
  BlueprintLibraryRecord,
} from "./types";

const DB_NAME = "arronqzy-blueprint-library";
const DB_VERSION = 1;
const STORE_NAME = "blueprints";

function openDb(nameSpace?: string | null): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(appStorageKey(DB_NAME, nameSpace), DB_VERSION);
    request.onerror = () => reject(request.error ?? new Error("indexeddb-open-failed"));
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("source", "source", { unique: false });
        store.createIndex("updatedAt", "updatedAt", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  runner: (store: IDBObjectStore) => IDBRequest<T>,
  nameSpace?: string | null
): Promise<T> {
  return openDb(nameSpace).then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        const store = tx.objectStore(STORE_NAME);
        const request = runner(store);
        let result!: T;

        request.onerror = () =>
          reject(request.error ?? new Error("indexeddb-request-failed"));
        request.onsuccess = () => {
          result = request.result as T;
        };

        tx.oncomplete = () => {
          db.close();
          resolve(result);
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error ?? new Error("indexeddb-transaction-failed"));
        };
      })
  );
}

export async function listBlueprintLibrary(
  nameSpace?: string | null
): Promise<BlueprintLibraryListItem[]> {
  const records = await runTransaction<BlueprintLibraryRecord[]>(
    "readonly",
    (store) => store.getAll(),
    nameSpace
  );
  return records
    .map((record) => ({
      id: record.id,
      name: record.name,
      remark: record.remark,
      source: record.source,
      updatedAt: record.updatedAt,
    }))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getBlueprintLibraryRecord(
  id: string,
  nameSpace?: string | null
): Promise<BlueprintLibraryRecord | null> {
  const record = await runTransaction<BlueprintLibraryRecord | undefined>(
    "readonly",
    (store) => store.get(id),
    nameSpace
  );
  return record ?? null;
}

export async function putBlueprintLibraryRecord(
  record: BlueprintLibraryRecord,
  nameSpace?: string | null
): Promise<BlueprintLibraryRecord> {
  await runTransaction<IDBValidKey>("readwrite", (store) => store.put(record), nameSpace);
  return record;
}

export async function updateBlueprintLibraryMeta(
  id: string,
  patch: { name?: string; remark?: string },
  nameSpace?: string | null
): Promise<BlueprintLibraryRecord | null> {
  const existing = await getBlueprintLibraryRecord(id, nameSpace);
  if (!existing) return null;

  const name = patch.name?.trim() || existing.name;
  const record: BlueprintLibraryRecord = {
    ...existing,
    name,
    remark: patch.remark !== undefined ? patch.remark.trim() || undefined : existing.remark,
    updatedAt: Date.now(),
    document: {
      ...existing.document,
      name,
    },
  };

  await putBlueprintLibraryRecord(record, nameSpace);
  return record;
}

export async function deleteBlueprintLibraryRecord(
  id: string,
  nameSpace?: string | null
): Promise<void> {
  await runTransaction<undefined>("readwrite", (store) => store.delete(id), nameSpace);
}
