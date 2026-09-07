import type { BlueprintDocument, BlueprintMetaDraft } from "@arronqzy/vue-blueprint";
import type { State } from "@arronqzy/rx-store";
import { appStorageKey } from "@arronqzy/blueprint-dsl";

const DB_NAME = "arronqzy-workspace-projects";
const DB_VERSION = 1;
const STORE_NAME = "projects";
const OPEN_TIMEOUT_MS = 10_000;

export type WorkspaceProjectListItem = {
  id: string;
  name: string;
  updatedAt: number;
  createdAt: number;
};

export type WorkspaceProjectRecord = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  panelState: State;
  blueprintDocument: BlueprintDocument;
  blueprintMeta: BlueprintMetaDraft;
  productName: string;
  titleIconDataUrl?: string;
};

const dbPromises = new Map<string, Promise<IDBDatabase>>();

function getIndexedDb(): IDBFactory {
  if (typeof indexedDB === "undefined" || !indexedDB) {
    throw Object.assign(new Error("indexeddb-unavailable"), {
      name: "IndexedDbUnavailable",
    });
  }
  return indexedDB;
}

/** Make a value safe for IndexedDB structured clone (drops non-cloneable fields). */
export function cloneForIndexedDb<T>(value: T): T {
  if (typeof structuredClone === "function") {
    try {
      return structuredClone(value);
    } catch {
      /* fall through to JSON */
    }
  }
  try {
    return JSON.parse(JSON.stringify(value)) as T;
  } catch (error) {
    throw Object.assign(new Error("indexeddb-serialize-failed"), {
      name: "DataCloneError",
      cause: error,
    });
  }
}

function openDb(nameSpace?: string | null): Promise<IDBDatabase> {
  const key = appStorageKey(DB_NAME, nameSpace);
  const cached = dbPromises.get(key);
  if (cached) return cached;

  const promise = new Promise<IDBDatabase>((resolve, reject) => {
    let settled = false;
    const fail = (error: unknown) => {
      if (settled) return;
      settled = true;
      dbPromises.delete(key);
      reject(
        error instanceof Error
          ? error
          : Object.assign(new Error("indexeddb-open-failed"), { cause: error })
      );
    };

    let request: IDBOpenDBRequest;
    try {
      request = getIndexedDb().open(key, DB_VERSION);
    } catch (error) {
      fail(error);
      return;
    }

    const timer = setTimeout(() => {
      fail(
        Object.assign(new Error("indexeddb-open-timeout"), {
          name: "TimeoutError",
        })
      );
    }, OPEN_TIMEOUT_MS);

    request.onerror = () => {
      clearTimeout(timer);
      fail(request.error ?? new Error("indexeddb-open-failed"));
    };
    request.onblocked = () => {
      // Wait for onsuccess / timeout; another tab may be holding an older connection.
    };
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("updatedAt", "updatedAt", { unique: false });
      }
    };
    request.onsuccess = () => {
      clearTimeout(timer);
      if (settled) {
        try {
          request.result.close();
        } catch {
          /* ignore */
        }
        return;
      }
      settled = true;
      const db = request.result;
      db.onversionchange = () => {
        try {
          db.close();
        } catch {
          /* ignore */
        }
        dbPromises.delete(key);
      };
      db.onclose = () => {
        dbPromises.delete(key);
      };
      resolve(db);
    };
  });

  dbPromises.set(key, promise);
  return promise;
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  runner: (store: IDBObjectStore) => IDBRequest<T>,
  nameSpace?: string | null
): Promise<T> {
  return openDb(nameSpace).then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        let tx: IDBTransaction;
        try {
          tx = db.transaction(STORE_NAME, mode);
        } catch (error) {
          dbPromises.delete(appStorageKey(DB_NAME, nameSpace));
          reject(error);
          return;
        }
        const store = tx.objectStore(STORE_NAME);
        const request = runner(store);
        let result!: T;
        let settled = false;

        const fail = (error: unknown) => {
          if (settled) return;
          settled = true;
          reject(
            error instanceof Error
              ? error
              : Object.assign(new Error("indexeddb-transaction-failed"), {
                  cause: error,
                })
          );
        };

        request.onerror = () =>
          fail(request.error ?? new Error("indexeddb-request-failed"));
        request.onsuccess = () => {
          result = request.result as T;
        };

        tx.oncomplete = () => {
          if (settled) return;
          settled = true;
          resolve(result);
        };
        tx.onerror = () => fail(tx.error ?? new Error("indexeddb-transaction-failed"));
        tx.onabort = () => fail(tx.error ?? new Error("indexeddb-transaction-aborted"));
      })
  ).catch(async (error) => {
    const message = error instanceof Error ? error.message : String(error);
    const name = error instanceof DOMException ? error.name : "";
    if (
      name === "InvalidStateError" ||
      message.includes("InvalidStateError") ||
      message.includes("closing")
    ) {
      dbPromises.delete(appStorageKey(DB_NAME, nameSpace));
      const db = await openDb(nameSpace);
      return new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        const store = tx.objectStore(STORE_NAME);
        const request = runner(store);
        let result!: T;
        request.onerror = () =>
          reject(request.error ?? new Error("indexeddb-request-failed"));
        request.onsuccess = () => {
          result = request.result as T;
        };
        tx.oncomplete = () => resolve(result);
        tx.onerror = () =>
          reject(tx.error ?? new Error("indexeddb-transaction-failed"));
        tx.onabort = () =>
          reject(tx.error ?? new Error("indexeddb-transaction-aborted"));
      });
    }
    throw error;
  });
}

export function createWorkspaceProjectId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `ws-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function listWorkspaceProjects(
  nameSpace?: string | null
): Promise<WorkspaceProjectListItem[]> {
  const db = await openDb(nameSpace);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.openCursor();
    const items: WorkspaceProjectListItem[] = [];
    request.onerror = () =>
      reject(request.error ?? new Error("indexeddb-request-failed"));
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      const record = cursor.value as WorkspaceProjectRecord;
      items.push({
        id: record.id,
        name: record.name,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      });
      cursor.continue();
    };
    tx.oncomplete = () => {
      resolve(items.sort((a, b) => b.updatedAt - a.updatedAt));
    };
    tx.onerror = () => {
      reject(tx.error ?? new Error("indexeddb-transaction-failed"));
    };
  });
}

export async function getWorkspaceProject(
  id: string,
  nameSpace?: string | null
): Promise<WorkspaceProjectRecord | null> {
  const record = await runTransaction<WorkspaceProjectRecord | undefined>(
    "readonly",
    (store) => store.get(id),
    nameSpace
  );
  return record ?? null;
}

export async function putWorkspaceProject(
  record: WorkspaceProjectRecord,
  nameSpace?: string | null
): Promise<WorkspaceProjectRecord> {
  const safeRecord = cloneForIndexedDb(record);
  await runTransaction<IDBValidKey>(
    "readwrite",
    (store) => store.put(safeRecord),
    nameSpace
  );
  return safeRecord;
}

export async function deleteWorkspaceProject(
  id: string,
  nameSpace?: string | null
): Promise<void> {
  await runTransaction<undefined>("readwrite", (store) => store.delete(id), nameSpace);
}
