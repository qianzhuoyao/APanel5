import { normalizeAppNameSpace } from "@arronqzy/blueprint-dsl";
import type { WorkspaceProjectRecord } from "./workspace-project-db";

/** 已挂载编辑面板的命令式句柄（也可通过 `ref` 拿到） */
export type AbuilderViewHandle = {
  /** 当前 nameSpace */
  getNameSpace: () => string | null;
  /** 导出当前编辑器中的完整工作区；尚无关联 id 时返回 null */
  getCurrentWorkspace: () => WorkspaceProjectRecord | null;
  /** 按 id 从 IndexedDB 打开，或直接应用完整记录 */
  openWorkspace: (idOrRecord: string | WorkspaceProjectRecord) => Promise<void>;
  /** 创建新工作区并写入 IndexedDB，发出 workspace:add */
  createWorkspace: () => Promise<{ name: string; id: string }>;
  /** 保存当前工作区到 IndexedDB，发出 workspace:sync；无 active 时等同创建 */
  saveWorkspace: () => Promise<{ name: string; id: string }>;
  /** 同步当前工作区到 IndexedDB，发出 workspace:sync */
  syncWorkspace: () => Promise<string>;
};

const handles = new Set<AbuilderViewHandle>();

export function registerAbuilderViewHandle(handle: AbuilderViewHandle): () => void {
  handles.add(handle);
  return () => {
    handles.delete(handle);
  };
}

function findHandle(nameSpace?: string | null): AbuilderViewHandle | null {
  if (handles.size === 0) return null;
  if (nameSpace === undefined) {
    return handles.values().next().value ?? null;
  }
  const wanted = normalizeAppNameSpace(nameSpace);
  for (const handle of handles) {
    if (normalizeAppNameSpace(handle.getNameSpace()) === wanted) return handle;
  }
  return null;
}

/**
 * 读取当前已挂载编辑器中的工作区快照。
 * 同页多个实例时请传入 `nameSpace`；未挂载或尚无 active 工作区时返回 null。
 */
export function getCurrentWorkspace(
  nameSpace?: string | null
): WorkspaceProjectRecord | null {
  return findHandle(nameSpace)?.getCurrentWorkspace() ?? null;
}

/**
 * 命令式打开工作区（不 remount）。
 * 同页多个实例时请传入 `nameSpace`。
 */
export async function openWorkspace(
  idOrRecord: string | WorkspaceProjectRecord,
  nameSpace?: string | null
): Promise<void> {
  const handle = findHandle(nameSpace);
  if (!handle) {
    throw new Error(
      "No mounted Abuilder panel. Pass initialWorkspace or mount <App> first."
    );
  }
  await handle.openWorkspace(idOrRecord);
}

export async function createWorkspace(
  nameSpace?: string | null
): Promise<{ name: string; id: string }> {
  const handle = findHandle(nameSpace);
  if (!handle) {
    throw new Error(
      "No mounted Abuilder panel. Pass initialWorkspace or mount <App> first."
    );
  }
  return handle.createWorkspace();
}

export async function saveWorkspace(
  nameSpace?: string | null
): Promise<{ name: string; id: string }> {
  const handle = findHandle(nameSpace);
  if (!handle) {
    throw new Error(
      "No mounted Abuilder panel. Pass initialWorkspace or mount <App> first."
    );
  }
  return handle.saveWorkspace();
}

export async function syncWorkspace(nameSpace?: string | null): Promise<string> {
  const handle = findHandle(nameSpace);
  if (!handle) {
    throw new Error(
      "No mounted Abuilder panel. Pass initialWorkspace or mount <App> first."
    );
  }
  return handle.syncWorkspace();
}
