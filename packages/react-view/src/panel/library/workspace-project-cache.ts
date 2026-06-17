import type { WorkspaceProjectRecord } from "./workspace-project-db";

const CACHE_PREFIX = "arron-workspace-preview:";

export function writeWorkspacePreviewCache(record: WorkspaceProjectRecord): void {
  try {
    localStorage.setItem(CACHE_PREFIX + record.id, JSON.stringify(record));
  } catch {
    // ignore quota / private mode
  }
}

export function readWorkspacePreviewCache(
  projectId: string
): WorkspaceProjectRecord | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + projectId);
    if (!raw) return null;
    return JSON.parse(raw) as WorkspaceProjectRecord;
  } catch {
    return null;
  }
}
