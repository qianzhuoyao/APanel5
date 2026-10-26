import { normalizeAppNameSpace } from "@arronqzy/blueprint-dsl";
import {
  clearWorkspaceProjectStore,
  deleteWorkspaceProject as deleteWorkspaceProjectRecord,
  getWorkspaceProject,
  listWorkspaceProjects,
  putWorkspaceProject as putWorkspaceProjectRecord,
  type WorkspaceProjectRecord,
} from "./workspace-project-db";
import {
  clearWorkspacePreviewCaches,
  removeWorkspacePreviewCache,
  writeWorkspacePreviewCache,
} from "./workspace-project-cache";
import {
  broadcastWorkspaceProjectUpdate,
  broadcastWorkspaceProjectsChanged,
} from "./workspace-project-sync";
import { AbuilderEvents, emitAbuilderEvent } from "./event-subscription";

export { listWorkspaceProjects, getWorkspaceProject };
export type { WorkspaceProjectListItem, WorkspaceProjectRecord } from "./workspace-project-db";

export type PutWorkspaceProjectOptions = {
  /**
   * 写入后是否发出工作区事件。
   * - `false` / 省略：只写 IndexedDB（宿主自己管后端时常用）
   * - `"add"`：发出 `workspace:add`
   * - `"sync"`：发出 `workspace:sync`
   */
  emitEvent?: false | "add" | "sync";
};

function resolvedNameSpace(nameSpace?: string | null): string | null {
  return normalizeAppNameSpace(nameSpace) || null;
}

/**
 * 写入 / 覆盖 IndexedDB 中的工作区（upsert），并更新预览缓存、通知其他标签页。
 * `nameSpace` 需与面板的 `nameSpace` 一致。
 */
export async function putWorkspaceProject(
  record: WorkspaceProjectRecord,
  nameSpace?: string | null,
  options?: PutWorkspaceProjectOptions
): Promise<WorkspaceProjectRecord> {
  const saved = await putWorkspaceProjectRecord(record, nameSpace);
  writeWorkspacePreviewCache(saved, nameSpace);
  broadcastWorkspaceProjectUpdate(saved.id, saved.updatedAt, nameSpace);
  broadcastWorkspaceProjectsChanged(
    { type: "upserted", projectIds: [saved.id] },
    nameSpace
  );
  const ns = resolvedNameSpace(nameSpace);
  if (options?.emitEvent === "add") {
    emitAbuilderEvent(AbuilderEvents.workspaceAdd, { ...saved, nameSpace: ns });
  } else if (options?.emitEvent === "sync") {
    emitAbuilderEvent(AbuilderEvents.workspaceSync, { ...saved, nameSpace: ns });
  }
  return saved;
}

/** `putWorkspaceProject` 的别名 */
export async function upsertWorkspaceProject(
  record: WorkspaceProjectRecord,
  nameSpace?: string | null,
  options?: PutWorkspaceProjectOptions
): Promise<WorkspaceProjectRecord> {
  return putWorkspaceProject(record, nameSpace, options);
}

/**
 * 删除 IndexedDB 中保存的单个工作区（及其 localStorage 预览标记）。
 * `nameSpace` 需与 `ReactViewPanel` 的 `nameSpace` 一致；已挂载的面板会自动刷新工作区列表。
 */
export async function deleteWorkspaceProject(
  id: string,
  nameSpace?: string | null
): Promise<void> {
  await deleteWorkspaceProjectRecord(id, nameSpace);
  removeWorkspacePreviewCache(id, nameSpace);
  broadcastWorkspaceProjectsChanged({ type: "deleted", projectIds: [id] }, nameSpace);
  emitAbuilderEvent(AbuilderEvents.workspaceDelete, {
    ids: [id],
    nameSpace: resolvedNameSpace(nameSpace),
  });
}

/**
 * 清空该 `nameSpace` 下保存的全部工作区，返回删除的数量。
 * 不影响蓝图库、执行日志、接口集合等其他存储。
 */
export async function clearWorkspaceProjects(nameSpace?: string | null): Promise<number> {
  const items = await listWorkspaceProjects(nameSpace);
  await clearWorkspaceProjectStore(nameSpace);
  clearWorkspacePreviewCaches(nameSpace);
  broadcastWorkspaceProjectsChanged({ type: "cleared" }, nameSpace);
  if (items.length > 0) {
    emitAbuilderEvent(AbuilderEvents.workspaceDelete, {
      ids: items.map((item) => item.id),
      nameSpace: resolvedNameSpace(nameSpace),
    });
  }
  return items.length;
}
