import { normalizeAppNameSpace } from "@arronqzy/blueprint-dsl";
import {
  clearAllExecutionRunRecords,
  clearApiCollections as clearApiCollectionsRaw,
  clearBlueprintLibrary as clearBlueprintLibraryRecords,
  deleteApiCollection as deleteApiCollectionRaw,
  deleteBlueprintLibraryRecord as deleteBlueprintLibraryRecordRaw,
  putApiCollection as putApiCollectionRaw,
  putBlueprintLibraryRecord as putBlueprintLibraryRecordRaw,
  putExecutionRunRecord as putExecutionRunRecordRaw,
  upsertApiCollectionFromJson as upsertApiCollectionFromJsonRaw,
  type BlueprintLibraryRecord,
  type ExecutionRunRecord,
  type UpsertApiCollectionInput,
  type UpsertApiCollectionResult,
} from "@arronqzy/vue-blueprint";
import type { ApiCollectionRecord } from "@arronqzy/blueprint-dsl";
import { broadcastBlueprintLibraryChanged } from "./blueprint-library-sync";
import { AbuilderEvents, emitAbuilderEvent } from "./event-subscription";
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
} from "@arronqzy/vue-blueprint";
export type {
  BlueprintLibraryListItem,
  BlueprintLibraryRecord,
  ExecutionRunRecord,
  ExecutionLogSettings,
  UpsertApiCollectionInput,
  UpsertApiCollectionResult,
} from "@arronqzy/vue-blueprint";
export type { ApiCollectionRecord } from "@arronqzy/blueprint-dsl";

function resolvedNameSpace(nameSpace?: string | null): string | null {
  return normalizeAppNameSpace(nameSpace) || null;
}

/** 写入 / 覆盖蓝图库记录；已挂载的编辑器会刷新蓝图库列表 */
export async function putBlueprintLibraryRecord(
  record: BlueprintLibraryRecord,
  nameSpace?: string | null
): Promise<BlueprintLibraryRecord> {
  const saved = await putBlueprintLibraryRecordRaw(record, nameSpace);
  broadcastBlueprintLibraryChanged(nameSpace);
  emitAbuilderEvent(AbuilderEvents.blueprintLibraryChanged, {
    nameSpace: resolvedNameSpace(nameSpace),
    action: "put",
    ids: [saved.id],
  });
  return saved;
}

/** 删除蓝图库中的一条蓝图；已挂载的编辑器会刷新蓝图库列表 */
export async function deleteBlueprintLibraryRecord(
  id: string,
  nameSpace?: string | null
): Promise<void> {
  await deleteBlueprintLibraryRecordRaw(id, nameSpace);
  broadcastBlueprintLibraryChanged(nameSpace);
  emitAbuilderEvent(AbuilderEvents.blueprintLibraryChanged, {
    nameSpace: resolvedNameSpace(nameSpace),
    action: "delete",
    ids: [id],
  });
}

/** 清空该 nameSpace 下的蓝图库，返回删除数量；已挂载的编辑器会刷新蓝图库列表 */
export async function clearBlueprintLibrary(nameSpace?: string | null): Promise<number> {
  const count = await clearBlueprintLibraryRecords(nameSpace);
  broadcastBlueprintLibraryChanged(nameSpace);
  emitAbuilderEvent(AbuilderEvents.blueprintLibraryChanged, {
    nameSpace: resolvedNameSpace(nameSpace),
    action: "clear",
  });
  return count;
}

/** 写入一条蓝图执行日志 */
export async function putExecutionRunRecord(
  record: ExecutionRunRecord,
  nameSpace?: string | null
): Promise<ExecutionRunRecord> {
  return putExecutionRunRecordRaw(record, nameSpace);
}

/** 写入接口集合；persistLocal 时落 IndexedDB，并同步已挂载编辑器的内存列表 */
export async function putApiCollection(
  record: ApiCollectionRecord,
  nameSpace?: string | null
): Promise<ApiCollectionRecord> {
  const saved = await putApiCollectionRaw(record, nameSpace);
  emitAbuilderEvent(AbuilderEvents.apiCollectionChanged, {
    nameSpace: resolvedNameSpace(nameSpace),
    action: "put",
    ids: [saved.id],
  });
  return saved;
}

/** 从 JSON 文本 upsert 接口集合；可传 nameSpace */
export async function upsertApiCollectionFromJson(
  input: UpsertApiCollectionInput
): Promise<UpsertApiCollectionResult> {
  const result = await upsertApiCollectionFromJsonRaw(input);
  if (result.ok) {
    emitAbuilderEvent(AbuilderEvents.apiCollectionChanged, {
      nameSpace: resolvedNameSpace(input.nameSpace),
      action: "put",
      ids: [result.record.id],
    });
  }
  return result;
}

export async function deleteApiCollection(
  id: string,
  nameSpace?: string | null
): Promise<void> {
  await deleteApiCollectionRaw(id, nameSpace);
  emitAbuilderEvent(AbuilderEvents.apiCollectionChanged, {
    nameSpace: resolvedNameSpace(nameSpace),
    action: "delete",
    ids: [id],
  });
}

export async function clearApiCollections(nameSpace?: string | null): Promise<number> {
  const count = await clearApiCollectionsRaw(nameSpace);
  emitAbuilderEvent(AbuilderEvents.apiCollectionChanged, {
    nameSpace: resolvedNameSpace(nameSpace),
    action: "clear",
  });
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
