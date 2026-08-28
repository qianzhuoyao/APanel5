import { appStorageKey } from "@arronqzy/blueprint-dsl";
import type { WorkspaceProjectRecord } from "./workspace-project-db";

const CACHE_PREFIX = "arronqzy-workspace-preview:";

function previewCacheKey(projectId: string, nameSpace?: string | null): string {
  return appStorageKey(CACHE_PREFIX + projectId, nameSpace);
}

export function writeWorkspacePreviewCache(
  record: WorkspaceProjectRecord,
  nameSpace?: string | null
): void {
  try {
    // 只写轻量标记，避免把含 data URL 的整包再塞进 localStorage（配额小、内存翻倍）
    localStorage.setItem(
      previewCacheKey(record.id, nameSpace),
      JSON.stringify({ id: record.id, updatedAt: record.updatedAt })
    );
  } catch {
    // ignore quota / private mode
  }
}

export function readWorkspacePreviewCache(
  projectId: string,
  nameSpace?: string | null
): WorkspaceProjectRecord | null {
  try {
    const raw = localStorage.getItem(previewCacheKey(projectId, nameSpace));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WorkspaceProjectRecord> | null;
    if (!parsed || typeof parsed !== "object" || !parsed.panelState) return null;
    return parsed as WorkspaceProjectRecord;
  } catch {
    return null;
  }
}
