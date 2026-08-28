import { appStorageKey } from "@arronqzy/blueprint-dsl";
import type { ExecutionRunRecord } from "@arronqzy/blueprint-dsl";

const DB_NAME = "arronqzy-blueprint-execution-log";
const DB_VERSION = 1;
const STORE_NAME = "runs";

function openDb(nameSpace?: string | null): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(appStorageKey(DB_NAME, nameSpace), DB_VERSION);
    request.onerror = () => reject(request.error ?? new Error("indexeddb-open-failed"));
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "runId" });
        store.createIndex("startedAt", "startedAt", { unique: false });
        store.createIndex("blueprintId", "blueprintId", { unique: false });
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

function deleteMany(ids: string[], nameSpace?: string | null): Promise<void> {
  return openDb(nameSpace).then(
    (db) =>
      new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        for (const id of ids) {
          store.delete(id);
        }
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error ?? new Error("indexeddb-transaction-failed"));
        };
      })
  );
}

export async function putExecutionRunRecord(
  record: ExecutionRunRecord,
  nameSpace?: string | null
): Promise<ExecutionRunRecord> {
  await runTransaction<IDBValidKey>("readwrite", (store) => store.put(record), nameSpace);
  return record;
}

export async function getExecutionRunRecord(
  runId: string,
  nameSpace?: string | null
): Promise<ExecutionRunRecord | null> {
  const record = await runTransaction<ExecutionRunRecord | undefined>(
    "readonly",
    (store) => store.get(runId),
    nameSpace
  );
  return record ?? null;
}

export async function listExecutionRunRecords(
  blueprintId?: string | null,
  nameSpace?: string | null
): Promise<ExecutionRunRecord[]> {
  const records = await runTransaction<ExecutionRunRecord[]>(
    "readonly",
    (store) => store.getAll(),
    nameSpace
  );
  const filtered = blueprintId
    ? records.filter((item) => item.blueprintId === blueprintId)
    : records;
  return filtered.sort((a, b) => b.startedAt - a.startedAt);
}

export async function deleteExecutionRunRecord(
  runId: string,
  nameSpace?: string | null
): Promise<void> {
  await runTransaction<undefined>("readwrite", (store) => store.delete(runId), nameSpace);
}

export async function clearAllExecutionRunRecords(
  nameSpace?: string | null
): Promise<number> {
  const records = await runTransaction<ExecutionRunRecord[]>(
    "readonly",
    (store) => store.getAll(),
    nameSpace
  );
  if (records.length === 0) return 0;

  await runTransaction<undefined>("readwrite", (store) => store.clear(), nameSpace);
  return records.length;
}

export async function trimExecutionRunRecordsToMax(
  maxCount: number,
  nameSpace?: string | null
): Promise<number> {
  if (!Number.isFinite(maxCount) || maxCount < 1) return 0;

  const records = await runTransaction<ExecutionRunRecord[]>(
    "readonly",
    (store) => store.getAll(),
    nameSpace
  );
  if (records.length <= maxCount) return 0;

  const sorted = [...records].sort((a, b) => b.startedAt - a.startedAt);
  const overflow = sorted.slice(maxCount);
  if (overflow.length === 0) return 0;

  await deleteMany(
    overflow.map((item) => item.runId),
    nameSpace
  );

  return overflow.length;
}

export async function purgeExecutionRunsOlderThan(
  cutoffMs: number,
  nameSpace?: string | null
): Promise<number> {
  const records = await runTransaction<ExecutionRunRecord[]>(
    "readonly",
    (store) => store.getAll(),
    nameSpace
  );
  const stale = records.filter((item) => item.startedAt < cutoffMs);
  if (stale.length === 0) return 0;

  await deleteMany(
    stale.map((item) => item.runId),
    nameSpace
  );

  return stale.length;
}

export function downloadExecutionRunExport(record: ExecutionRunRecord) {
  const blob = new Blob([JSON.stringify(record, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `blueprint-run-${record.runId}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
