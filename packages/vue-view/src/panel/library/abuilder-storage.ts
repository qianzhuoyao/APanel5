import {
  clearAllExecutionRunRecords,
  clearApiCollections,
  clearBlueprintLibrary as clearBlueprintLibraryRecords,
  deleteBlueprintLibraryRecord as deleteBlueprintLibraryRecordRaw,
} from "@arronqzy/vue-blueprint";
import { broadcastBlueprintLibraryChanged } from "./blueprint-library-sync";
import { clearWorkspaceProjects } from "./workspace-storage";

export {
  listBlueprintLibrary,
  getBlueprintLibraryRecord,
  listExecutionRunRecords,
  getExecutionRunRecord,
  deleteExecutionRunRecord,
  clearAllExecutionRunRecords,
  purgeExecutionRunsOlderThan,
  trimExecutionRunRecordsToMax,
  readExecutionLogSettings,
  writeExecutionLogSettings,
  listApiCollectionRecords,
  deleteApiCollection,
  clearApiCollections,
} from "@arronqzy/vue-blueprint";
export type {
  BlueprintLibraryListItem,
  BlueprintLibraryRecord,
  ExecutionRunRecord,
  ExecutionLogSettings,
} from "@arronqzy/vue-blueprint";
export type { ApiCollectionRecord } from "@arronqzy/blueprint-dsl";

/** 删除蓝图库中的一条蓝图；已挂载的编辑器会刷新蓝图库列表 */
export async function deleteBlueprintLibraryRecord(
  id: string,
  nameSpace?: string | null
): Promise<void> {
  await deleteBlueprintLibraryRecordRaw(id, nameSpace);
  broadcastBlueprintLibraryChanged(nameSpace);
}

/** 清空该 nameSpace 下的蓝图库，返回删除数量；已挂载的编辑器会刷新蓝图库列表 */
export async function clearBlueprintLibrary(nameSpace?: string | null): Promise<number> {
  const count = await clearBlueprintLibraryRecords(nameSpace);
  broadcastBlueprintLibraryChanged(nameSpace);
  return count;
}

export type AbuilderStorageClearResult = {
  workspaces: number;
  blueprints: number;
  executionRuns: number;
  apiCollections: number;
};

/**
 * 清空该 nameSpace 下编辑器写入浏览器的全部数据：工作区、蓝图库、执行日志、接口集合。
 * 主题、字号、日志保留设置等偏好不受影响。
 */
export async function clearAbuilderStorage(
  nameSpace?: string | null
): Promise<AbuilderStorageClearResult> {
  const [workspaces, blueprints, executionRuns, apiCollections] = await Promise.all([
    clearWorkspaceProjects(nameSpace),
    clearBlueprintLibrary(nameSpace),
    clearAllExecutionRunRecords(nameSpace),
    clearApiCollections(nameSpace),
  ]);
  return { workspaces, blueprints, executionRuns, apiCollections };
}
