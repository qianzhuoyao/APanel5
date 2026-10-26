import { normalizeAppNameSpace } from "@arronqzy/blueprint-dsl";
import type { WorkspaceProjectRecord } from "./workspace-project-db";

export const AbuilderEvents = {
  /** 添加工作区 */
  workspaceAdd: "workspace:add",
  /** 同步工作区 */
  workspaceSync: "workspace:sync",
  /** 删除工作区（界面删除，或调用 deleteWorkspaceProject / clearWorkspaceProjects） */
  workspaceDelete: "workspace:delete",
  /** 蓝图库写入 / 删除 / 清空 */
  blueprintLibraryChanged: "blueprint-library:changed",
  /** 开始上传接口集合 */
  apiCollectionUploadStart: "api-collection:upload-start",
  /** 上传接口集合成功 */
  apiCollectionUploadSuccess: "api-collection:upload-success",
  /** 接口集合写入 / 删除 / 清空 */
  apiCollectionChanged: "api-collection:changed",
} as const;

export type AbuilderEventName = (typeof AbuilderEvents)[keyof typeof AbuilderEvents];

/** 工作区完整数据（面板 + 蓝图），可用于外部持久化与再次加载 */
export type WorkspaceData = WorkspaceProjectRecord;

export type WorkspaceAddEventPayload = WorkspaceData & {
  /** 所属 nameSpace，默认库为 null */
  nameSpace: string | null;
};
export type WorkspaceSyncEventPayload = WorkspaceData & {
  /** 所属 nameSpace，默认库为 null */
  nameSpace: string | null;
};
export type WorkspaceDeleteEventPayload = {
  /** 被删除的工作区 id */
  ids: string[];
  /** 所属 nameSpace，默认库为 null */
  nameSpace: string | null;
};

export type BlueprintLibraryChangedEventPayload = {
  nameSpace: string | null;
  action: "put" | "delete" | "clear";
  /** 涉及的蓝图 id；clear 时可能为空 */
  ids?: string[];
};

export type ApiCollectionUploadStartEventPayload = {
  fileNames: string[];
  count: number;
  nameSpace: string | null;
};

export type ApiCollectionUploadSuccessEventPayload = {
  collections: Array<{
    id: string;
    name: string;
    apiCount: number;
    persistLocal: boolean;
  }>;
  nameSpace: string | null;
};

export type ApiCollectionChangedEventPayload = {
  nameSpace: string | null;
  action: "put" | "delete" | "clear";
  ids?: string[];
};

export type AbuilderEventPayloadMap = {
  [AbuilderEvents.workspaceAdd]: WorkspaceAddEventPayload;
  [AbuilderEvents.workspaceSync]: WorkspaceSyncEventPayload;
  [AbuilderEvents.workspaceDelete]: WorkspaceDeleteEventPayload;
  [AbuilderEvents.blueprintLibraryChanged]: BlueprintLibraryChangedEventPayload;
  [AbuilderEvents.apiCollectionUploadStart]: ApiCollectionUploadStartEventPayload;
  [AbuilderEvents.apiCollectionUploadSuccess]: ApiCollectionUploadSuccessEventPayload;
  [AbuilderEvents.apiCollectionChanged]: ApiCollectionChangedEventPayload;
};

export type AddEventSubscriptionOptions = {
  /**
   * 仅接收该 nameSpace 的事件。
   * 省略则接收全部；传入空字符串 / null 表示默认库。
   */
  nameSpace?: string | null;
};

type EventCallback = (payload: unknown) => void;

const listeners = new Map<string, Set<EventCallback>>();

function resolvePayloadNameSpace(payload: unknown): string | null | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  if (!("nameSpace" in payload)) return undefined;
  const value = (payload as { nameSpace?: unknown }).nameSpace;
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value;
  return undefined;
}

function matchesNameSpaceFilter(
  payload: unknown,
  filter: string | null | undefined
): boolean {
  if (filter === undefined) return true;
  const wanted = normalizeAppNameSpace(filter);
  const actual = resolvePayloadNameSpace(payload);
  if (actual === undefined) return true;
  return normalizeAppNameSpace(actual) === wanted;
}

export function emitAbuilderEvent<T extends AbuilderEventName>(
  eventName: T,
  payload: AbuilderEventPayloadMap[T]
): void {
  const set = listeners.get(eventName);
  if (!set) return;
  for (const callback of set) {
    try {
      callback(payload);
    } catch (error) {
      console.error(`[abuilder] event handler error (${eventName}):`, error);
    }
  }
}

export function addEventSubscription<T extends AbuilderEventName>(
  eventName: T,
  callback: (payload: AbuilderEventPayloadMap[T]) => void,
  options?: AddEventSubscriptionOptions
): { unsubscribe: () => void } {
  let set = listeners.get(eventName);
  if (!set) {
    set = new Set();
    listeners.set(eventName, set);
  }
  const filter =
    options && Object.prototype.hasOwnProperty.call(options, "nameSpace")
      ? options.nameSpace
      : undefined;
  const wrapped: EventCallback = (payload) => {
    if (!matchesNameSpaceFilter(payload, filter)) return;
    callback(payload as AbuilderEventPayloadMap[T]);
  };
  set.add(wrapped);
  return {
    unsubscribe: () => {
      set.delete(wrapped);
      if (set.size === 0) {
        listeners.delete(eventName);
      }
    },
  };
}
