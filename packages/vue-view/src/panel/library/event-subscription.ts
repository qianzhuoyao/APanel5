import type { WorkspaceProjectRecord } from "./workspace-project-db";

export const AbuilderEvents = {
  /** 添加工作区 */
  workspaceAdd: "workspace:add",
  /** 同步工作区 */
  workspaceSync: "workspace:sync",
  /** 开始上传接口集合 */
  apiCollectionUploadStart: "api-collection:upload-start",
  /** 上传接口集合成功 */
  apiCollectionUploadSuccess: "api-collection:upload-success",
} as const;

export type AbuilderEventName = (typeof AbuilderEvents)[keyof typeof AbuilderEvents];

/** 工作区完整数据（面板 + 蓝图），可用于外部持久化与再次加载 */
export type WorkspaceData = WorkspaceProjectRecord;

export type WorkspaceAddEventPayload = WorkspaceData;
export type WorkspaceSyncEventPayload = WorkspaceData;

export type ApiCollectionUploadStartEventPayload = {
  fileNames: string[];
  count: number;
};

export type ApiCollectionUploadSuccessEventPayload = {
  collections: Array<{
    id: string;
    name: string;
    apiCount: number;
    persistLocal: boolean;
  }>;
};

export type AbuilderEventPayloadMap = {
  [AbuilderEvents.workspaceAdd]: WorkspaceAddEventPayload;
  [AbuilderEvents.workspaceSync]: WorkspaceSyncEventPayload;
  [AbuilderEvents.apiCollectionUploadStart]: ApiCollectionUploadStartEventPayload;
  [AbuilderEvents.apiCollectionUploadSuccess]: ApiCollectionUploadSuccessEventPayload;
};

type EventCallback = (payload: unknown) => void;

const listeners = new Map<string, Set<EventCallback>>();

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
  callback: (payload: AbuilderEventPayloadMap[T]) => void
): { unsubscribe: () => void } {
  let set = listeners.get(eventName);
  if (!set) {
    set = new Set();
    listeners.set(eventName, set);
  }
  set.add(callback as EventCallback);
  return {
    unsubscribe: () => {
      set.delete(callback as EventCallback);
      if (set.size === 0) {
        listeners.delete(eventName);
      }
    },
  };
}
