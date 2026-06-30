export function parseOnlinePreviewSearchParams(search: string): {
  projectId: string;
  previewInstanceId?: string;
} | null {
  const params = new URLSearchParams(search);
  if (params.get("preview") !== "online") return null;
  const projectId = params.get("projectId") ?? params.get("id");
  if (!projectId) return null;
  return {
    projectId,
    previewInstanceId: params.get("pid") ?? undefined,
  };
}
