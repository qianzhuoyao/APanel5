import type { ExecutionRunRecord } from "@arron/blueprint-dsl";

const DB_NAME = "arron-blueprint-execution-log";
const DB_VERSION = 1;
const STORE_NAME = "runs";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
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
  runner: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDb().then(
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

export async function putExecutionRunRecord(
  record: ExecutionRunRecord
): Promise<ExecutionRunRecord> {
  await runTransaction<IDBValidKey>("readwrite", (store) => store.put(record));
  return record;
}

export async function getExecutionRunRecord(
  runId: string
): Promise<ExecutionRunRecord | null> {
  const record = await runTransaction<ExecutionRunRecord | undefined>(
    "readonly",
    (store) => store.get(runId)
  );
  return record ?? null;
}

export async function listExecutionRunRecords(
  blueprintId?: string | null
): Promise<ExecutionRunRecord[]> {
  const records = await runTransaction<ExecutionRunRecord[]>("readonly", (store) =>
    store.getAll()
  );
  const filtered = blueprintId
    ? records.filter((item) => item.blueprintId === blueprintId)
    : records;
  return filtered.sort((a, b) => b.startedAt - a.startedAt);
}

export async function deleteExecutionRunRecord(runId: string): Promise<void> {
  await runTransaction<undefined>("readwrite", (store) => store.delete(runId));
}

export async function clearAllExecutionRunRecords(): Promise<number> {
  const records = await runTransaction<ExecutionRunRecord[]>("readonly", (store) =>
    store.getAll()
  );
  if (records.length === 0) return 0;

  await runTransaction<undefined>("readwrite", (store) => store.clear());
  return records.length;
}

export async function trimExecutionRunRecordsToMax(
  maxCount: number
): Promise<number> {
  if (!Number.isFinite(maxCount) || maxCount < 1) return 0;

  const records = await runTransaction<ExecutionRunRecord[]>("readonly", (store) =>
    store.getAll()
  );
  if (records.length <= maxCount) return 0;

  const sorted = [...records].sort((a, b) => b.startedAt - a.startedAt);
  const overflow = sorted.slice(maxCount);
  if (overflow.length === 0) return 0;

  await openDb().then(
    (db) =>
      new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        for (const item of overflow) {
          store.delete(item.runId);
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

  return overflow.length;
}

export async function purgeExecutionRunsOlderThan(cutoffMs: number): Promise<number> {
  const records = await runTransaction<ExecutionRunRecord[]>("readonly", (store) =>
    store.getAll()
  );
  const stale = records.filter((item) => item.startedAt < cutoffMs);
  if (stale.length === 0) return 0;

  await openDb().then(
    (db) =>
      new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        for (const item of stale) {
          store.delete(item.runId);
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
