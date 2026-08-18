import type { BlueprintDocument } from "@arronqzy/react-blueprint";
import type { BlueprintMetaDraft } from "@arronqzy/react-blueprint";
import type { State } from "@arronqzy/rx-store";

const DB_NAME = "arronqzy-workspace-projects";
const DB_VERSION = 1;
const STORE_NAME = "projects";

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

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
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

export function createWorkspaceProjectId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `ws-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function listWorkspaceProjects(): Promise<WorkspaceProjectListItem[]> {
  const db = await openDb();
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
      db.close();
      resolve(items.sort((a, b) => b.updatedAt - a.updatedAt));
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error ?? new Error("indexeddb-transaction-failed"));
    };
  });
}

export async function getWorkspaceProject(
  id: string
): Promise<WorkspaceProjectRecord | null> {
  const record = await runTransaction<WorkspaceProjectRecord | undefined>("readonly", (store) =>
    store.get(id)
  );
  return record ?? null;
}

export async function putWorkspaceProject(
  record: WorkspaceProjectRecord
): Promise<WorkspaceProjectRecord> {
  await runTransaction<IDBValidKey>("readwrite", (store) => store.put(record));
  return record;
}

export async function deleteWorkspaceProject(id: string): Promise<void> {
  await runTransaction<undefined>("readwrite", (store) => store.delete(id));
}
