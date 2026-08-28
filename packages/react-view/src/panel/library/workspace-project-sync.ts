import { appStorageKey } from "@arronqzy/blueprint-dsl";

const CHANNEL_PREFIX = "arronqzy-workspace-project";

export type WorkspaceProjectSyncMessage = {
  type: "updated";
  projectId: string;
  updatedAt: number;
};

export function getWorkspaceProjectChannelName(
  projectId: string,
  nameSpace?: string | null
): string {
  return appStorageKey(`${CHANNEL_PREFIX}:${projectId}`, nameSpace);
}

export function broadcastWorkspaceProjectUpdate(
  projectId: string,
  updatedAt: number,
  nameSpace?: string | null
): void {
  if (typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(
    getWorkspaceProjectChannelName(projectId, nameSpace)
  );
  channel.postMessage({
    type: "updated",
    projectId,
    updatedAt,
  } satisfies WorkspaceProjectSyncMessage);
  channel.close();
}

export function subscribeWorkspaceProjectUpdates(
  projectId: string,
  onUpdate: (message: WorkspaceProjectSyncMessage) => void,
  nameSpace?: string | null
): () => void {
  if (typeof BroadcastChannel === "undefined") {
    return () => {};
  }
  const channel = new BroadcastChannel(
    getWorkspaceProjectChannelName(projectId, nameSpace)
  );
  channel.onmessage = (event: MessageEvent<WorkspaceProjectSyncMessage>) => {
    const data = event.data;
    if (!data || data.type !== "updated" || data.projectId !== projectId) return;
    onUpdate(data);
  };
  return () => channel.close();
}
