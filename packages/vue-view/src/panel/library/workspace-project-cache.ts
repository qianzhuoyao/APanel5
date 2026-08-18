import type { WorkspaceProjectRecord } from "./workspace-project-db";

const CACHE_PREFIX = "arronqzy-workspace-preview:";

export function writeWorkspacePreviewCache(record: WorkspaceProjectRecord): void {
  try {
    localStorage.setItem(
      CACHE_PREFIX + record.id,
      JSON.stringify({ id: record.id, updatedAt: record.updatedAt })
    );
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
    const parsed = JSON.parse(raw) as Partial<WorkspaceProjectRecord> | null;
    if (!parsed || typeof parsed !== "object" || !parsed.panelState) return null;
    return parsed as WorkspaceProjectRecord;
  } catch {
    return null;
  }
}
