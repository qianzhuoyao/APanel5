import { appStorageKey } from "@arronqzy/blueprint-dsl";
import type { ApiCollectionRecord } from "@arronqzy/blueprint-dsl";

const DB_NAME = "arronqzy-api-collections";
const DB_VERSION = 1;
const STORE_NAME = "collections";

function openDb(nameSpace?: string | null): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(appStorageKey(DB_NAME, nameSpace), DB_VERSION);
    request.onerror = () => reject(request.error ?? new Error("indexeddb-open-failed"));
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
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

export async function listApiCollectionRecords(
  nameSpace?: string | null
): Promise<ApiCollectionRecord[]> {
  const records = await runTransaction<ApiCollectionRecord[]>(
    "readonly",
    (store) => store.getAll(),
    nameSpace
  );
  return records.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getApiCollectionRecord(
  id: string,
  nameSpace?: string | null
): Promise<ApiCollectionRecord | null> {
  const record = await runTransaction<ApiCollectionRecord | undefined>(
    "readonly",
    (store) => store.get(id),
    nameSpace
  );
  return record ?? null;
}

export async function putApiCollectionRecord(
  record: ApiCollectionRecord,
  nameSpace?: string | null
): Promise<ApiCollectionRecord> {
  await runTransaction<IDBValidKey>(
    "readwrite",
    (store) => store.put(record),
    nameSpace
  );
  return record;
}

export async function deleteApiCollectionRecord(
  id: string,
  nameSpace?: string | null
): Promise<void> {
  await runTransaction<undefined>(
    "readwrite",
    (store) => store.delete(id),
    nameSpace
  );
}
