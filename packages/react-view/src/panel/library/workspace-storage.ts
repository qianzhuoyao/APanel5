import {
  clearWorkspaceProjectStore,
  deleteWorkspaceProject as deleteWorkspaceProjectRecord,
  listWorkspaceProjects,
} from "./workspace-project-db";
import {
  clearWorkspacePreviewCaches,
  removeWorkspacePreviewCache,
} from "./workspace-project-cache";
import { broadcastWorkspaceProjectsChanged } from "./workspace-project-sync";

export { listWorkspaceProjects };
export type { WorkspaceProjectListItem } from "./workspace-project-db";

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
  return items.length;
}
