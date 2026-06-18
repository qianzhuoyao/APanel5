const CHANNEL_PREFIX = "arronqzy-workspace-project";

export type WorkspaceProjectSyncMessage = {
  type: "updated";
  projectId: string;
  updatedAt: number;
};

export function getWorkspaceProjectChannelName(projectId: string): string {
  return `${CHANNEL_PREFIX}:${projectId}`;
}

export function broadcastWorkspaceProjectUpdate(
  projectId: string,
  updatedAt: number
): void {
  if (typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(getWorkspaceProjectChannelName(projectId));
  channel.postMessage({
    type: "updated",
    projectId,
    updatedAt,
  } satisfies WorkspaceProjectSyncMessage);
  channel.close();
}

export function subscribeWorkspaceProjectUpdates(
  projectId: string,
  onUpdate: (message: WorkspaceProjectSyncMessage) => void
): () => void {
  if (typeof BroadcastChannel === "undefined") {
    return () => {};
  }
  const channel = new BroadcastChannel(getWorkspaceProjectChannelName(projectId));
  channel.onmessage = (event: MessageEvent<WorkspaceProjectSyncMessage>) => {
    const data = event.data;
    if (!data || data.type !== "updated" || data.projectId !== projectId) return;
    onUpdate(data);
  };
  return () => channel.close();
}
