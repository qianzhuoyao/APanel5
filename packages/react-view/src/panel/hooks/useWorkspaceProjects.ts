import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18nOptional } from "@arronqzy/i18n/react";
import { BlueprintGraph } from "@arronqzy/react-blueprint";
import type { BlueprintDocument, BlueprintMetaDraft } from "@arronqzy/react-blueprint";
import type { State } from "@arronqzy/rx-store";
import {
  createWorkspaceProjectId,
  getWorkspaceProject,
  listWorkspaceProjects,
  type WorkspaceProjectListItem,
  type WorkspaceProjectRecord,
} from "../library/workspace-project-db";
import {
  deleteWorkspaceProject,
  putWorkspaceProject,
} from "../library/workspace-storage";
import { subscribeWorkspaceProjectsChanged } from "../library/workspace-project-sync";
import { writeWorkspacePreviewCache, readWorkspacePreviewCache } from "../library/workspace-project-cache";
import { normalizeAppNameSpace } from "@arronqzy/blueprint-dsl";
import {
  cloneWorkspaceSnapshot,
  workspaceSnapshotsEqual,
  type WorkspaceSnapshot,
} from "../library/workspace-snapshot";
import { mapWorkspaceStorageError } from "../library/workspace-storage-error";
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
  /**
   * 按 IndexedDB id 打开工作区。与 `initialWorkspace` 同时存在时：
   * 首次优先 `initialWorkspace`；之后 `workspaceId` 变化会从 IndexedDB 打开。
   */
  workspaceId?: string | null;
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
  workspaceId = null,
  nameSpace = null,
}: UseWorkspaceProjectsOptions) {
  const { t } = useI18nOptional();
  const [projects, setProjects] = useState<WorkspaceProjectListItem[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeProjectName, setActiveProjectName] = useState<string | null>(null);
  const activeCreatedAtRef = useRef<number | null>(null);
  const syncedSnapshotRef = useRef<WorkspaceSnapshot | null>(null);
  const syncedPanelRevisionRef = useRef<unknown>(null);
  const pendingRevisionSyncRef = useRef(false);
  const previewWindowsRef = useRef(new Map<string, Window>());
  const [previewingProjectIds, setPreviewingProjectIds] = useState<string[]>([]);
  const eventNameSpace = normalizeAppNameSpace(nameSpace) || null;

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
    try {
      const items = await listWorkspaceProjects(nameSpace);
      setProjects(items);
    } catch (error) {
      // Listing failure should not brick the editor; create/sync still surface errors.
      console.warn("[abuilder] listWorkspaceProjects failed", error);
    }
  }, [nameSpace]);

  useEffect(() => {
    void refreshProjects();
  }, [refreshProjects]);

  useEffect(() => {
    return subscribeWorkspaceProjectsChanged((message) => {
      const removedActive =
        message.type === "cleared" ||
        (message.type === "deleted" &&
          activeProjectId !== null &&
          message.projectIds.includes(activeProjectId));
      if (removedActive) {
        setActiveProjectId(null);
        setActiveProjectName(null);
        syncedSnapshotRef.current = null;
      }
      void refreshProjects();
    }, nameSpace);
  }, [activeProjectId, nameSpace, refreshProjects]);

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

  const ensureWorkspaceInIndexedDb = useCallback(
    async (record: WorkspaceProjectRecord) => {
      const id = typeof record.id === "string" ? record.id.trim() : "";
      if (!id) return;
      try {
        const existing = await getWorkspaceProject(id, nameSpace);
        const incomingUpdatedAt =
          typeof record.updatedAt === "number" && Number.isFinite(record.updatedAt)
            ? record.updatedAt
            : 0;
        if (existing && existing.updatedAt >= incomingUpdatedAt) {
          return;
        }
        const now = Date.now();
        const name =
          (typeof record.name === "string" && record.name.trim()) ||
          (typeof record.productName === "string" && record.productName.trim()) ||
          t("panel.defaults.unnamedProduct");
        const toStore: WorkspaceProjectRecord = {
          ...record,
          id,
          name,
          createdAt: existing?.createdAt ?? record.createdAt ?? now,
          updatedAt: incomingUpdatedAt || now,
          panelState:
            normalizeImportedPanelState(record.panelState) ??
            existing?.panelState ??
            createEmptyPanelState(),
          blueprintDocument:
            parseBlueprintData(record.blueprintDocument).value ??
            existing?.blueprintDocument ??
            BlueprintGraph.empty().document,
          blueprintMeta: {
            name:
              record.blueprintMeta?.name ??
              existing?.blueprintMeta?.name ??
              t("panel.defaults.unnamedBlueprint"),
            remark:
              record.blueprintMeta?.remark ?? existing?.blueprintMeta?.remark ?? "",
          },
          productName:
            typeof record.productName === "string" && record.productName.trim()
              ? record.productName
              : existing?.productName ?? t("panel.defaults.unnamedProduct"),
          titleIconDataUrl:
            record.titleIconDataUrl ?? existing?.titleIconDataUrl,
        };
        await putWorkspaceProject(toStore, nameSpace);
        await refreshProjects();
      } catch (error) {
        console.warn("[abuilder] ensureWorkspaceInIndexedDb failed", error);
      }
    },
    [nameSpace, refreshProjects, t]
  );

  const applyProjectRecord = useCallback(
    (
      record: WorkspaceProjectRecord,
      options?: { notifyApplied?: boolean; persistToIndexedDb?: boolean }
    ) => {
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
      activeCreatedAtRef.current =
        typeof record.createdAt === "number" && Number.isFinite(record.createdAt)
          ? record.createdAt
          : Date.now();
      syncedSnapshotRef.current = cloneWorkspaceSnapshot({
        blueprintDocument,
        blueprintMeta,
        productName,
        titleIconDataUrl,
      });
      syncedPanelRevisionRef.current = panelRevision;
      pendingRevisionSyncRef.current = true;
      const normalized: WorkspaceProjectRecord = {
        ...record,
        id: record.id,
        name: record.name ?? productName,
        createdAt: activeCreatedAtRef.current,
        updatedAt: record.updatedAt ?? Date.now(),
        blueprintDocument,
        blueprintMeta,
        panelState,
        productName,
        titleIconDataUrl: titleIconDataUrl || undefined,
      };
      if (options?.notifyApplied !== false) {
        onProjectApplied?.(normalized);
      }
      if (options?.persistToIndexedDb) {
        void ensureWorkspaceInIndexedDb(normalized);
      }
    },
    [
      ensureWorkspaceInIndexedDb,
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
    activeCreatedAtRef.current = null;
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
  const workspaceIdAppliedRef = useRef<string | null>(null);

  const persistProject = useCallback(
    async (options: { id?: string; name: string; createdAt?: number }) => {
      try {
        const snapshot = cloneWorkspaceSnapshot(buildCurrentSnapshot());
        const now = Date.now();
        const id = options.id ?? createWorkspaceProjectId();
        const createdAt = options.createdAt ?? activeCreatedAtRef.current ?? now;
        const name = (options.name ?? "").trim() || resolveProjectName();

        let panelState: State;
        try {
          panelState = exportPanelData();
        } catch (error) {
          throw mapWorkspaceStorageError(error, t);
        }

        const record: WorkspaceProjectRecord = {
          id,
          name,
          createdAt,
          updatedAt: now,
          panelState,
          blueprintDocument: snapshot.blueprintDocument,
          blueprintMeta: snapshot.blueprintMeta,
          productName:
            typeof snapshot.productName === "string"
              ? snapshot.productName
              : resolveProjectName(),
          titleIconDataUrl: snapshot.titleIconDataUrl || undefined,
        };

        await putWorkspaceProject(record, nameSpace);
        setActiveProjectId(id);
        setActiveProjectName(name);
        activeCreatedAtRef.current = createdAt;
        syncedSnapshotRef.current = snapshot;
        syncedPanelRevisionRef.current = panelRevision;
        pendingRevisionSyncRef.current = false;
        await refreshProjects();
        return record;
      } catch (error) {
        throw mapWorkspaceStorageError(error, t);
      }
    },
    [
      buildCurrentSnapshot,
      exportPanelData,
      nameSpace,
      panelRevision,
      resolveProjectName,
      refreshProjects,
      t,
    ]
  );

  const getCurrentWorkspaceRecord = useCallback((): WorkspaceProjectRecord | null => {
    if (!activeProjectId) return null;
    try {
      const snapshot = buildCurrentSnapshot();
      const panelState = exportPanelData();
      const now = Date.now();
      return {
        id: activeProjectId,
        name: activeProjectName || resolveProjectName(),
        createdAt: activeCreatedAtRef.current ?? now,
        updatedAt: now,
        panelState,
        blueprintDocument: snapshot.blueprintDocument,
        blueprintMeta: snapshot.blueprintMeta,
        productName:
          typeof snapshot.productName === "string"
            ? snapshot.productName
            : resolveProjectName(),
        titleIconDataUrl: snapshot.titleIconDataUrl || undefined,
      };
    } catch (error) {
      console.warn("[abuilder] getCurrentWorkspace failed", error);
      return null;
    }
  }, [
    activeProjectId,
    activeProjectName,
    buildCurrentSnapshot,
    exportPanelData,
    resolveProjectName,
  ]);

  const handleCreateProject = useCallback(async () => {
    return runBusyTask(t("common.savingWorkspace"), async () => {
      const name = resolveProjectName();
      const record = await persistProject({ name });
      emitAbuilderEvent(AbuilderEvents.workspaceAdd, {
        ...record,
        nameSpace: eventNameSpace,
      });
      return { name, id: record.id };
    });
  }, [eventNameSpace, persistProject, resolveProjectName, t]);

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
        createdAt: existing?.createdAt ?? activeCreatedAtRef.current ?? undefined,
      });
      emitAbuilderEvent(AbuilderEvents.workspaceSync, {
        ...record,
        nameSpace: eventNameSpace,
      });
      return { name, id: record.id };
    });
  }, [
    activeProjectId,
    eventNameSpace,
    handleCreateProject,
    nameSpace,
    persistProject,
    resolveProjectName,
    t,
  ]);

  const handleOpenProject = useCallback(
    async (idOrRecord: string | WorkspaceProjectRecord) => {
      try {
        await runBusyTask(t("common.loadingWorkspace"), async () => {
          if (typeof idOrRecord !== "string") {
            applyProjectRecord(idOrRecord, { persistToIndexedDb: true });
            return;
          }
          const record = await getWorkspaceProject(idOrRecord, nameSpace);
          if (!record) {
            await refreshProjects();
            throw new Error(t("panel.messages.workspaceNotFound"));
          }
          applyProjectRecord(record);
        });
      } catch (error) {
        throw mapWorkspaceStorageError(error, t);
      }
    },
    [applyProjectRecord, nameSpace, refreshProjects, t]
  );

  const handleSyncProject = useCallback(async () => {
    return runBusyTask(t("common.syncingWorkspace"), async () => {
      if (!activeProjectId) {
        throw new Error(t("panel.messages.saveWorkspaceFirst"));
      }
      // 本地无记录时 upsert，避免宿主 initialWorkspace 未落盘后同步报错
      const existing = await getWorkspaceProject(activeProjectId, nameSpace);
      const name = resolveProjectName() || existing?.name || activeProjectName || "";
      const record = await persistProject({
        id: activeProjectId,
        name,
        createdAt: existing?.createdAt ?? activeCreatedAtRef.current ?? undefined,
      });
      emitAbuilderEvent(AbuilderEvents.workspaceSync, {
        ...record,
        nameSpace: eventNameSpace,
      });
      return name;
    });
  }, [
    activeProjectId,
    activeProjectName,
    eventNameSpace,
    nameSpace,
    persistProject,
    resolveProjectName,
    t,
  ]);

  const handleDeleteProject = useCallback(
    async (id: string) => {
      try {
        await runBusyTask(t("common.deletingWorkspace"), async () => {
          await deleteWorkspaceProject(id, nameSpace);
          if (activeProjectId === id) {
            setActiveProjectId(null);
            setActiveProjectName(null);
            activeCreatedAtRef.current = null;
            syncedSnapshotRef.current = null;
          }
          previewWindowsRef.current.delete(id);
          refreshPreviewing();
          await refreshProjects();
        });
      } catch (error) {
        throw mapWorkspaceStorageError(error, t);
      }
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

  useEffect(() => {
    if (!bootstrappedRef.current) {
      bootstrappedRef.current = true;
      if (hasWorkspacePayload(initialWorkspace)) {
        applyProjectRecord(initialWorkspace, {
          notifyApplied: false,
          persistToIndexedDb: true,
        });
        initialWorkspaceAppliedKeyRef.current = workspaceApplyKey(initialWorkspace);
        if (initialWorkspace.id) {
          workspaceIdAppliedRef.current = initialWorkspace.id;
        }
      } else if (typeof workspaceId === "string" && workspaceId.trim()) {
        workspaceIdAppliedRef.current = workspaceId.trim();
        void handleOpenProject(workspaceId.trim());
      } else {
        applyEmptyWorkspace();
      }
      return;
    }
    if (!hasWorkspacePayload(initialWorkspace)) return;
    const key = workspaceApplyKey(initialWorkspace);
    if (initialWorkspaceAppliedKeyRef.current === key) return;
    initialWorkspaceAppliedKeyRef.current = key;
    if (initialWorkspace.id) {
      workspaceIdAppliedRef.current = initialWorkspace.id;
    }
    applyProjectRecord(initialWorkspace, {
      notifyApplied: false,
      persistToIndexedDb: true,
    });
  }, [
    applyEmptyWorkspace,
    applyProjectRecord,
    handleOpenProject,
    initialWorkspace,
    workspaceId,
  ]);

  useEffect(() => {
    if (!bootstrappedRef.current) return;
    const id = typeof workspaceId === "string" ? workspaceId.trim() : "";
    if (!id) return;
    if (workspaceIdAppliedRef.current === id) return;
    if (activeProjectId === id) {
      workspaceIdAppliedRef.current = id;
      return;
    }
    workspaceIdAppliedRef.current = id;
    void handleOpenProject(id);
  }, [activeProjectId, handleOpenProject, workspaceId]);

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
    getCurrentWorkspaceRecord,
    refreshProjects,
  };
}
