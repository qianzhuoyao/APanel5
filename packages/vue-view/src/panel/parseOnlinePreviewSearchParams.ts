export function parseOnlinePreviewSearchParams(search: string): {
  projectId: string;
  previewInstanceId?: string;
  nameSpace?: string;
} | null {
  const params = new URLSearchParams(search);
  if (params.get("preview") !== "online") return null;
  const projectId = params.get("projectId") ?? params.get("id");
  if (!projectId) return null;
  const nameSpace = (params.get("ns") ?? params.get("nameSpace") ?? "").trim();
  return {
    projectId,
    previewInstanceId: params.get("pid") ?? undefined,
    nameSpace: nameSpace || undefined,
  };
}
