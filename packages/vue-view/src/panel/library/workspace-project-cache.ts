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

export function removeWorkspacePreviewCache(
  projectId: string,
  nameSpace?: string | null
): void {
  try {
    localStorage.removeItem(previewCacheKey(projectId, nameSpace));
  } catch {
    // ignore private mode
  }
}

export function clearWorkspacePreviewCaches(nameSpace?: string | null): void {
  try {
    const suffix = appStorageKey("", nameSpace);
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(CACHE_PREFIX)) continue;
      // 无 nameSpace 时 key 不带 "__<ns>" 后缀，避免误删其他 nameSpace 的标记
      if (suffix ? key.endsWith(suffix) : !key.includes("__")) keys.push(key);
    }
    keys.forEach((key) => localStorage.removeItem(key));
  } catch {
    // ignore private mode
  }
}
