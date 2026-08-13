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

  const resolveProjectName = useCallback(() => {
    return productName.trim() || t("panel.defaults.unnamedProduct");
  }, [productName, t]);

  const buildCurrentSnapshot = useCallback((): WorkspaceSnapshot => {
    return {
      panelState: exportPanelData(),
      blueprintDocument,
      blueprintMeta: { ...blueprintMeta },
      productName,
      titleIconDataUrl,
    };
  }, [
    blueprintDocument,
    blueprintMeta,
    exportPanelData,
    productName,
    titleIconDataUrl,
  ]);

  const refreshProjects = useCallback(async () => {
    const items = await listWorkspaceProjects();
    setProjects(items);
  }, []);

  useEffect(() => {
    void refreshProjects();
  }, [refreshProjects]);

  const dirty = useMemo(() => {
    if (!activeProjectId || !syncedSnapshotRef.current) return false;
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
        panelState: record.panelState,
        blueprintDocument,
        blueprintMeta,
        productName: record.productName,
        titleIconDataUrl: record.titleIconDataUrl ?? "",
      });
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
      t,
    ]
  );

  const persistProject = useCallback(
    async (options: { id?: string; name: string; createdAt?: number }) => {
      const snapshot = buildCurrentSnapshot();
      const now = Date.now();
      const id = options.id ?? createWorkspaceProjectId();
      const createdAt = options.createdAt ?? now;
      const name = options.name.trim() || resolveProjectName();

      const record: WorkspaceProjectRecord = {
        id,
        name,
        createdAt,
        updatedAt: now,
        panelState: snapshot.panelState,
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
      syncedSnapshotRef.current = cloneWorkspaceSnapshot(snapshot);
      await refreshProjects();
      return record;
    },
    [buildCurrentSnapshot, resolveProjectName, refreshProjects]
  );

  const handleCreateProject = useCallback(async () => {
    const name = resolveProjectName();
    const record = await persistProject({ name });
    return { name, id: record.id };
  }, [persistProject, resolveProjectName]);

  const handleSaveProject = useCallback(async () => {
    if (!activeProjectId) {
      return handleCreateProject();
    }
    const existing = await getWorkspaceProject(activeProjectId);
    const name = resolveProjectName();
    const record = await persistProject({
      id: activeProjectId,
      name,
      createdAt: existing?.createdAt,
    });
    return { name, id: record.id };
  }, [activeProjectId, handleCreateProject, persistProject, resolveProjectName]);

  const handleOpenProject = useCallback(
    async (id: string) => {
      const record = await getWorkspaceProject(id);
      if (!record) {
        await refreshProjects();
        throw new Error(t("panel.messages.workspaceNotFound"));
      }
      applyProjectRecord(record);
    },
    [applyProjectRecord, refreshProjects, t]
  );

  const handleSyncProject = useCallback(async () => {
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
  }, [activeProjectId, persistProject, refreshProjects, resolveProjectName, t]);

  const handleDeleteProject = useCallback(
    async (id: string) => {
      await deleteWorkspaceProject(id);
      if (activeProjectId === id) {
        setActiveProjectId(null);
        setActiveProjectName(null);
        syncedSnapshotRef.current = null;
      }
      await refreshProjects();
    },
    [activeProjectId, refreshProjects]
  );

  const handlePreviewProject = useCallback(
    async (id: string, options?: { syncFirst?: boolean }) => {
      if (options?.syncFirst && activeProjectId === id && dirty) {
        await handleSyncProject();
      }
      const record =
        (await getWorkspaceProject(id)) ?? readWorkspacePreviewCache(id);
      if (record) {
        writeWorkspacePreviewCache(record);
      }
      window.open(buildOnlinePreviewUrl(id), "_blank", "noopener,noreferrer");
    },
    [activeProjectId, dirty, handleSyncProject]
  );

  return {
    projects,
    activeProjectId,
    activeProjectName,
    dirty,
    handleCreateProject,
    handleSaveProject,
    handleOpenProject,
    handleSyncProject,
    handleDeleteProject,
    handlePreviewProject,
    refreshProjects,
  };
}
