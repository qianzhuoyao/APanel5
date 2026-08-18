import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18nOptional } from "@arronqzy/i18n/react";
import { BlueprintGraph } from "@arronqzy/react-blueprint";
import type { BlueprintDocument, BlueprintMetaDraft } from "@arronqzy/react-blueprint";
import type { State } from "@arronqzy/rx-store";
import {
  createWorkspaceProjectId,
  deleteWorkspaceProject,
  getWorkspaceProject,
  listWorkspaceProjects,
  putWorkspaceProject,
  type WorkspaceProjectListItem,
  type WorkspaceProjectRecord,
} from "../library/workspace-project-db";
import { broadcastWorkspaceProjectUpdate } from "../library/workspace-project-sync";
import { writeWorkspacePreviewCache, readWorkspacePreviewCache } from "../library/workspace-project-cache";
import {
  cloneWorkspaceSnapshot,
  workspaceSnapshotsEqual,
  type WorkspaceSnapshot,
} from "../library/workspace-snapshot";
import { runBusyTask } from "../utils/async-work";

export type UseWorkspaceProjectsOptions = {
  exportPanelData: () => State;
  importPanelData: (state: State) => boolean;
  blueprintDocument: BlueprintDocument;
  blueprintMeta: BlueprintMetaDraft;
  setBlueprintGraph: (graph: ReturnType<typeof BlueprintGraph.fromDocument>) => void;
  setBlueprintMeta: (meta: BlueprintMetaDraft) => void;
  productName: string;
  setProductName: (name: string) => void;
  titleIconDataUrl: string;
  setTitleIconDataUrl: (url: string) => void;
  /** 视图面板修订号，用于检测未同步修改 */
  panelRevision: unknown;
  /** 工作区记录应用到编辑器后的回调（用于恢复蓝图面板等 UI 状态） */
  onProjectApplied?: (record: WorkspaceProjectRecord) => void;
};

export function buildOnlinePreviewUrl(projectId: string): string {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("preview", "online");
  url.searchParams.set("projectId", projectId);
  const previewInstanceId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `pv-${Date.now()}`;
  url.searchParams.set("pid", previewInstanceId);
  return url.toString();
}

export function useWorkspaceProjects({
  exportPanelData,
  importPanelData,
  blueprintDocument,
  blueprintMeta,
  setBlueprintGraph,
  setBlueprintMeta,
  productName,
  setProductName,
  titleIconDataUrl,
  setTitleIconDataUrl,
  panelRevision,
  onProjectApplied,
}: UseWorkspaceProjectsOptions) {
  const { t } = useI18nOptional();
  const [projects, setProjects] = useState<WorkspaceProjectListItem[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeProjectName, setActiveProjectName] = useState<string | null>(null);
  const syncedSnapshotRef = useRef<WorkspaceSnapshot | null>(null);
  const syncedPanelRevisionRef = useRef<unknown>(null);
  const pendingRevisionSyncRef = useRef(false);
  const previewWindowsRef = useRef(new Map<string, Window>());
  const [previewingProjectIds, setPreviewingProjectIds] = useState<string[]>([]);

  const refreshPreviewing = useCallback(() => {
    const ids: string[] = [];
    for (const [id, win] of previewWindowsRef.current) {
      if (!win.closed) ids.push(id);
      else previewWindowsRef.current.delete(id);
    }
    setPreviewingProjectIds((prev) => {
      if (prev.length === ids.length && prev.every((value, index) => value === ids[index])) {
        return prev;
      }
      return ids;
    });
  }, []);

  useEffect(() => {
    const timer = window.setInterval(refreshPreviewing, 2000);
    return () => window.clearInterval(timer);
  }, [refreshPreviewing]);

  const resolveProjectName = useCallback(() => {
    return productName.trim() || t("panel.defaults.unnamedProduct");
  }, [productName, t]);

  const buildCurrentSnapshot = useCallback((): WorkspaceSnapshot => {
    return {
      blueprintDocument,
      blueprintMeta: { ...blueprintMeta },
      productName,
      titleIconDataUrl,
    };
  }, [blueprintDocument, blueprintMeta, productName, titleIconDataUrl]);

  const refreshProjects = useCallback(async () => {
    const items = await listWorkspaceProjects();
    setProjects(items);
  }, []);

  useEffect(() => {
    void refreshProjects();
  }, [refreshProjects]);

  useEffect(() => {
    if (!pendingRevisionSyncRef.current) return;
    syncedPanelRevisionRef.current = panelRevision;
    pendingRevisionSyncRef.current = false;
  }, [panelRevision]);

  const dirty = useMemo(() => {
    if (!activeProjectId || !syncedSnapshotRef.current) return false;
    if (pendingRevisionSyncRef.current) return false;
    if (panelRevision !== syncedPanelRevisionRef.current) return true;
    return !workspaceSnapshotsEqual(buildCurrentSnapshot(), syncedSnapshotRef.current);
  }, [
    activeProjectId,
    blueprintDocument,
    blueprintMeta,
    productName,
    titleIconDataUrl,
    panelRevision,
    buildCurrentSnapshot,
  ]);

  const applyProjectRecord = useCallback(
    (record: WorkspaceProjectRecord) => {
      const blueprintDocument =
        record.blueprintDocument ?? BlueprintGraph.empty().document;
      const blueprintMeta: BlueprintMetaDraft = {
        name: record.blueprintMeta?.name ?? t("panel.defaults.unnamedBlueprint"),
        remark: record.blueprintMeta?.remark ?? "",
      };

      importPanelData(record.panelState);
      setBlueprintGraph(BlueprintGraph.fromDocument(blueprintDocument));
      setBlueprintMeta(blueprintMeta);
      setProductName(record.productName);
      setTitleIconDataUrl(record.titleIconDataUrl ?? "");
      setActiveProjectId(record.id);
      setActiveProjectName(record.name);
      syncedSnapshotRef.current = cloneWorkspaceSnapshot({
        blueprintDocument,
        blueprintMeta,
        productName: record.productName,
        titleIconDataUrl: record.titleIconDataUrl ?? "",
      });
      syncedPanelRevisionRef.current = panelRevision;
      pendingRevisionSyncRef.current = true;
      onProjectApplied?.({
        ...record,
        blueprintDocument,
        blueprintMeta,
      });
    },
    [
      importPanelData,
      onProjectApplied,
      setBlueprintGraph,
      setBlueprintMeta,
      setProductName,
      setTitleIconDataUrl,
      panelRevision,
      t,
    ]
  );

  const persistProject = useCallback(
    async (options: { id?: string; name: string; createdAt?: number }) => {
      const snapshot = cloneWorkspaceSnapshot(buildCurrentSnapshot());
      const now = Date.now();
      const id = options.id ?? createWorkspaceProjectId();
      const createdAt = options.createdAt ?? now;
      const name = options.name.trim() || resolveProjectName();

      const record: WorkspaceProjectRecord = {
        id,
        name,
        createdAt,
        updatedAt: now,
        panelState: exportPanelData(),
        blueprintDocument: snapshot.blueprintDocument,
        blueprintMeta: snapshot.blueprintMeta,
        productName: snapshot.productName,
        titleIconDataUrl: snapshot.titleIconDataUrl || undefined,
      };

      await putWorkspaceProject(record);
      writeWorkspacePreviewCache(record);
      broadcastWorkspaceProjectUpdate(id, now);
      setActiveProjectId(id);
      setActiveProjectName(name);
      syncedSnapshotRef.current = snapshot;
      syncedPanelRevisionRef.current = panelRevision;
      pendingRevisionSyncRef.current = false;
      await refreshProjects();
      return record;
    },
    [buildCurrentSnapshot, exportPanelData, panelRevision, resolveProjectName, refreshProjects]
  );

  const handleCreateProject = useCallback(async () => {
    return runBusyTask(t("common.savingWorkspace"), async () => {
      const name = resolveProjectName();
      const record = await persistProject({ name });
      return { name, id: record.id };
    });
  }, [persistProject, resolveProjectName, t]);

  const handleSaveProject = useCallback(async () => {
    if (!activeProjectId) {
      return handleCreateProject();
    }
    return runBusyTask(t("common.savingWorkspace"), async () => {
      const existing = await getWorkspaceProject(activeProjectId);
      const name = resolveProjectName();
      const record = await persistProject({
        id: activeProjectId,
        name,
        createdAt: existing?.createdAt,
      });
      return { name, id: record.id };
    });
  }, [activeProjectId, handleCreateProject, persistProject, resolveProjectName, t]);

  const handleOpenProject = useCallback(
    async (id: string) => {
      await runBusyTask(t("common.loadingWorkspace"), async () => {
        const record = await getWorkspaceProject(id);
        if (!record) {
          await refreshProjects();
          throw new Error(t("panel.messages.workspaceNotFound"));
        }
        applyProjectRecord(record);
      });
    },
    [applyProjectRecord, refreshProjects, t]
  );

  const handleSyncProject = useCallback(async () => {
    return runBusyTask(t("common.syncingWorkspace"), async () => {
      if (!activeProjectId) {
        throw new Error(t("panel.messages.saveWorkspaceFirst"));
      }
      const existing = await getWorkspaceProject(activeProjectId);
      if (!existing) {
        setActiveProjectId(null);
        setActiveProjectName(null);
        syncedSnapshotRef.current = null;
        await refreshProjects();
        throw new Error(t("panel.messages.workspaceNotFound"));
      }
      const name = resolveProjectName() || existing.name;
      await persistProject({
        id: activeProjectId,
        name,
        createdAt: existing.createdAt,
      });
      return name;
    });
  }, [activeProjectId, persistProject, refreshProjects, resolveProjectName, t]);

  const handleDeleteProject = useCallback(
    async (id: string) => {
      await runBusyTask(t("common.deletingWorkspace"), async () => {
        await deleteWorkspaceProject(id);
        if (activeProjectId === id) {
          setActiveProjectId(null);
          setActiveProjectName(null);
          syncedSnapshotRef.current = null;
        }
        previewWindowsRef.current.delete(id);
        refreshPreviewing();
        await refreshProjects();
      });
    },
    [activeProjectId, refreshPreviewing, refreshProjects, t]
  );

  const handlePreviewProject = useCallback(
    async (id: string, options?: { syncFirst?: boolean }) => {
      await runBusyTask(t("common.openingPreview"), async () => {
        if (options?.syncFirst && activeProjectId === id && dirty) {
          await handleSyncProject();
        }
        const record =
          (await getWorkspaceProject(id)) ?? readWorkspacePreviewCache(id);
        if (record) {
          writeWorkspacePreviewCache(record);
        }
        const existing = previewWindowsRef.current.get(id);
        if (existing && !existing.closed) {
          try {
            existing.focus();
          } catch {
            /* ignore */
          }
          refreshPreviewing();
          return;
        }
        const win = window.open(
          buildOnlinePreviewUrl(id),
          `abuilder-preview-${id}`
        );
        if (win) {
          previewWindowsRef.current.set(id, win);
          try {
            win.opener = null;
            win.focus();
          } catch {
            /* ignore */
          }
        }
        refreshPreviewing();
      });
    },
    [activeProjectId, dirty, handleSyncProject, refreshPreviewing, t]
  );

  return {
    projects,
    activeProjectId,
    activeProjectName,
    dirty,
    previewingProjectIds,
    handleCreateProject,
    handleSaveProject,
    handleOpenProject,
    handleSyncProject,
    handleDeleteProject,
    handlePreviewProject,
    refreshProjects,
  };
}
