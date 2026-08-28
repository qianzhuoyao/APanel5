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
import { AbuilderEvents, emitAbuilderEvent } from "../library/event-subscription";
import { parseBlueprintData } from "@arronqzy/react-blueprint";
import { createEmptyPanelState, normalizeImportedPanelState } from "../utils/panelStateIO";

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
  /** 外部传入的初始工作区，挂载后自动加载（不触发 onProjectApplied） */
  initialWorkspace?: WorkspaceProjectRecord | null;
  /** 隔离 IndexedDB / 预览缓存 / 同步频道 */
  nameSpace?: string | null;
};

export function buildOnlinePreviewUrl(
  projectId: string,
  nameSpace?: string | null
): string {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("preview", "online");
  url.searchParams.set("projectId", projectId);
  const ns = (nameSpace ?? "").trim();
  if (ns) url.searchParams.set("ns", ns);
  const previewInstanceId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `pv-${Date.now()}`;
  url.searchParams.set("pid", previewInstanceId);
  return url.toString();
}

function previewWindowName(projectId: string, nameSpace?: string | null): string {
  const ns = (nameSpace ?? "").trim();
  return ns ? `abuilder-preview-${ns}-${projectId}` : `abuilder-preview-${projectId}`;
}

function hasWorkspacePayload(
  record?: WorkspaceProjectRecord | null
): record is WorkspaceProjectRecord {
  if (!record || typeof record !== "object") return false;
  return Boolean(
    record.panelState ||
      record.blueprintDocument ||
      record.id ||
      record.productName ||
      record.titleIconDataUrl
  );
}

function workspaceApplyKey(record: WorkspaceProjectRecord): string {
  return `${record.id ?? "anon"}:${record.updatedAt ?? 0}`;
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
  initialWorkspace,
  nameSpace = null,
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
    return (typeof productName === "string" ? productName : "").trim() ||
      t("panel.defaults.unnamedProduct");
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
    const items = await listWorkspaceProjects(nameSpace);
    setProjects(items);
  }, [nameSpace]);

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
    (record: WorkspaceProjectRecord, options?: { notifyApplied?: boolean }) => {
      const parsedBlueprint = parseBlueprintData(record.blueprintDocument);
      const blueprintDocument =
        parsedBlueprint.value ?? BlueprintGraph.empty().document;
      const blueprintMeta: BlueprintMetaDraft = {
        name: record.blueprintMeta?.name ?? t("panel.defaults.unnamedBlueprint"),
        remark: record.blueprintMeta?.remark ?? "",
      };
      const panelState =
        normalizeImportedPanelState(record.panelState) ?? createEmptyPanelState();
      const productName =
        typeof record.productName === "string" && record.productName.trim()
          ? record.productName
          : t("panel.defaults.unnamedProduct");
      const titleIconDataUrl = record.titleIconDataUrl ?? "";

      importPanelData(panelState);
      setBlueprintGraph(BlueprintGraph.fromDocument(blueprintDocument));
      setBlueprintMeta(blueprintMeta);
      setProductName(productName);
      setTitleIconDataUrl(titleIconDataUrl);
      setActiveProjectId(record.id || null);
      setActiveProjectName(record.name ?? null);
      syncedSnapshotRef.current = cloneWorkspaceSnapshot({
        blueprintDocument,
        blueprintMeta,
        productName,
        titleIconDataUrl,
      });
      syncedPanelRevisionRef.current = panelRevision;
      pendingRevisionSyncRef.current = true;
      if (options?.notifyApplied !== false) {
        onProjectApplied?.({
          ...record,
          blueprintDocument,
          blueprintMeta,
          panelState,
          productName,
          titleIconDataUrl: titleIconDataUrl || undefined,
        });
      }
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

  const applyEmptyWorkspace = useCallback(() => {
    importPanelData(createEmptyPanelState());
    setBlueprintGraph(BlueprintGraph.empty());
    setBlueprintMeta({
      name: t("panel.defaults.unnamedBlueprint"),
      remark: "",
    });
    setProductName(t("panel.defaults.unnamedProduct"));
    setTitleIconDataUrl("");
    setActiveProjectId(null);
    setActiveProjectName(null);
    syncedSnapshotRef.current = null;
  }, [
    importPanelData,
    setBlueprintGraph,
    setBlueprintMeta,
    setProductName,
    setTitleIconDataUrl,
    t,
  ]);

  const initialWorkspaceAppliedKeyRef = useRef<string | null>(null);
  const bootstrappedRef = useRef(false);
  useEffect(() => {
    if (!bootstrappedRef.current) {
      bootstrappedRef.current = true;
      if (hasWorkspacePayload(initialWorkspace)) {
        applyProjectRecord(initialWorkspace, { notifyApplied: false });
        initialWorkspaceAppliedKeyRef.current = workspaceApplyKey(initialWorkspace);
      } else {
        applyEmptyWorkspace();
      }
      return;
    }
    if (!hasWorkspacePayload(initialWorkspace)) return;
    const key = workspaceApplyKey(initialWorkspace);
    if (initialWorkspaceAppliedKeyRef.current === key) return;
    initialWorkspaceAppliedKeyRef.current = key;
    applyProjectRecord(initialWorkspace, { notifyApplied: false });
  }, [applyEmptyWorkspace, applyProjectRecord, initialWorkspace]);

  const persistProject = useCallback(
    async (options: { id?: string; name: string; createdAt?: number }) => {
      const snapshot = cloneWorkspaceSnapshot(buildCurrentSnapshot());
      const now = Date.now();
      const id = options.id ?? createWorkspaceProjectId();
      const createdAt = options.createdAt ?? now;
      const name = (options.name ?? "").trim() || resolveProjectName();

      const record: WorkspaceProjectRecord = {
        id,
        name,
        createdAt,
        updatedAt: now,
        panelState: exportPanelData(),
        blueprintDocument: snapshot.blueprintDocument,
        blueprintMeta: snapshot.blueprintMeta,
        productName:
          typeof snapshot.productName === "string" ? snapshot.productName : resolveProjectName(),
        titleIconDataUrl: snapshot.titleIconDataUrl || undefined,
      };

      await putWorkspaceProject(record, nameSpace);
      writeWorkspacePreviewCache(record, nameSpace);
      broadcastWorkspaceProjectUpdate(id, now, nameSpace);
      setActiveProjectId(id);
      setActiveProjectName(name);
      syncedSnapshotRef.current = snapshot;
      syncedPanelRevisionRef.current = panelRevision;
      pendingRevisionSyncRef.current = false;
      await refreshProjects();
      return record;
    },
    [buildCurrentSnapshot, exportPanelData, nameSpace, panelRevision, resolveProjectName, refreshProjects]
  );

  const handleCreateProject = useCallback(async () => {
    return runBusyTask(t("common.savingWorkspace"), async () => {
      const name = resolveProjectName();
      const record = await persistProject({ name });
      emitAbuilderEvent(AbuilderEvents.workspaceAdd, record);
      return { name, id: record.id };
    });
  }, [persistProject, resolveProjectName, t]);

  const handleSaveProject = useCallback(async () => {
    if (!activeProjectId) {
      return handleCreateProject();
    }
    return runBusyTask(t("common.savingWorkspace"), async () => {
      const existing = await getWorkspaceProject(activeProjectId, nameSpace);
      const name = resolveProjectName();
      const record = await persistProject({
        id: activeProjectId,
        name,
        createdAt: existing?.createdAt,
      });
      return { name, id: record.id };
    });
  }, [activeProjectId, handleCreateProject, nameSpace, persistProject, resolveProjectName, t]);

  const handleOpenProject = useCallback(
    async (id: string) => {
      await runBusyTask(t("common.loadingWorkspace"), async () => {
        const record = await getWorkspaceProject(id, nameSpace);
        if (!record) {
          await refreshProjects();
          throw new Error(t("panel.messages.workspaceNotFound"));
        }
        applyProjectRecord(record);
      });
    },
    [applyProjectRecord, nameSpace, refreshProjects, t]
  );

  const handleSyncProject = useCallback(async () => {
    return runBusyTask(t("common.syncingWorkspace"), async () => {
      if (!activeProjectId) {
        throw new Error(t("panel.messages.saveWorkspaceFirst"));
      }
      const existing = await getWorkspaceProject(activeProjectId, nameSpace);
      if (!existing) {
        setActiveProjectId(null);
        setActiveProjectName(null);
        syncedSnapshotRef.current = null;
        await refreshProjects();
        throw new Error(t("panel.messages.workspaceNotFound"));
      }
      const name = resolveProjectName() || existing.name;
      const record = await persistProject({
        id: activeProjectId,
        name,
        createdAt: existing.createdAt,
      });
      emitAbuilderEvent(AbuilderEvents.workspaceSync, record);
      return name;
    });
  }, [activeProjectId, nameSpace, persistProject, refreshProjects, resolveProjectName, t]);

  const handleDeleteProject = useCallback(
    async (id: string) => {
      await runBusyTask(t("common.deletingWorkspace"), async () => {
        await deleteWorkspaceProject(id, nameSpace);
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
    [activeProjectId, nameSpace, refreshPreviewing, refreshProjects, t]
  );

  const handlePreviewProject = useCallback(
    async (id: string, options?: { syncFirst?: boolean }) => {
      await runBusyTask(t("common.openingPreview"), async () => {
        if (options?.syncFirst && activeProjectId === id && dirty) {
          await handleSyncProject();
        }
        const record =
          (await getWorkspaceProject(id, nameSpace)) ??
          readWorkspacePreviewCache(id, nameSpace);
        if (record) {
          writeWorkspacePreviewCache(record, nameSpace);
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
          buildOnlinePreviewUrl(id, nameSpace),
          previewWindowName(id, nameSpace)
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
    [activeProjectId, dirty, handleSyncProject, nameSpace, refreshPreviewing, t]
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
