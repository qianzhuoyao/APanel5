import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  BlueprintGraph,
  documentToRunnableGraph,
  getBlueprintLibraryRecord,
  listBlueprintLibrary,
  useBlueprintPageLifecycle,
  type BlueprintLibraryListItem,
} from "@arronqzy/react-blueprint";
import type { LibraryBlueprintResolver, PageLifecyclePhase } from "@arronqzy/blueprint-dsl";
import type { State } from "@arronqzy/rx-store";
import { ElementsLayer } from "./components/ElementsLayer";
import type { PanelElement } from "./types";
import {
  clearViewElementScopes,
  getViewElementScope,
  setViewElementScopes,
  useViewScopeStoreVersion,
} from "./scope/view-scope-store";
import { resolvePanelElementScope } from "./utils/scope-template";
import {
  getWorkspaceProject,
  type WorkspaceProjectRecord,
} from "./library/workspace-project-db";
import { readWorkspacePreviewCache } from "./library/workspace-project-cache";
import { subscribeWorkspaceProjectUpdates } from "./library/workspace-project-sync";
import {
  computePanelSceneBounds,
  getActiveLayerId,
  normalizeImportedPanelState,
  notifyPreviewLayoutChanged,
  parseAllPanelElements,
  parsePanelLayers,
  resolvePreviewLayerElements,
} from "./utils/panelStateIO";

const PREVIEW_BOOT_PHASES: PageLifecyclePhase[] = ["mounted"];

export type ReactViewOnlinePreviewProps = {
  projectId: string;
  previewInstanceId?: string;
};

function applyTitleIcon(titleIconDataUrl?: string) {
  if (!titleIconDataUrl) return;
  for (const rel of ["icon", "shortcut icon"]) {
    document.querySelector(`link[rel='${rel}']`)?.remove();
    const link = document.createElement("link");
    link.rel = rel;
    link.type = "image/png";
    link.href = titleIconDataUrl;
    document.head.appendChild(link);
  }
}

async function loadWorkspaceRecord(projectId: string): Promise<WorkspaceProjectRecord | null> {
  const fromDb = await getWorkspaceProject(projectId);
  if (fromDb) return fromDb;
  return readWorkspacePreviewCache(projectId);
}

export function ReactViewOnlinePreview({
  projectId,
  previewInstanceId,
}: ReactViewOnlinePreviewProps) {
  const [loadError, setLoadError] = useState<string | null>(null);
  const [panelState, setPanelState] = useState<State | null>(null);
  const [projectRevision, setProjectRevision] = useState(0);
  const [blueprintGraph, setBlueprintGraph] = useState(() => BlueprintGraph.empty());
  const [blueprintLibraryItems, setBlueprintLibraryItems] = useState<
    BlueprintLibraryListItem[]
  >([]);
  const [layoutRevision, setLayoutRevision] = useState(0);
  const [layoutReady, setLayoutReady] = useState(false);

  const sceneRef = useRef<HTMLDivElement | null>(null);

  const layers = useMemo(
    () => (panelState ? parsePanelLayers(panelState) : []),
    [panelState]
  );
  const activeLayerId = useMemo(
    () => (panelState ? getActiveLayerId(panelState) : "layer-1"),
    [panelState]
  );
  const allElements = useMemo(
    () => (panelState ? parseAllPanelElements(panelState) : []),
    [panelState]
  );

  const loadProject = useCallback(async () => {
    const record = await loadWorkspaceRecord(projectId);
    if (!record) {
      setLoadError("工作区不存在或已被删除");
      setPanelState(null);
      return;
    }

    const normalized = normalizeImportedPanelState(record.panelState);
    if (!normalized) {
      setLoadError("工作区数据格式无效");
      setPanelState(null);
      return;
    }

    setLoadError(null);
    clearViewElementScopes();
    setPanelState(normalized);
    setBlueprintGraph(BlueprintGraph.fromDocument(record.blueprintDocument));
    document.title = record.productName.trim() || record.name || "预览";
    applyTitleIcon(record.titleIconDataUrl);
    setProjectRevision((v) => v + 1);
  }, [projectId]);

  useEffect(() => {
    void loadProject();
  }, [loadProject]);

  useEffect(() => {
    return subscribeWorkspaceProjectUpdates(projectId, () => {
      void loadProject();
    });
  }, [loadProject, projectId]);

  useEffect(() => {
    let cancelled = false;
    void listBlueprintLibrary().then((items) => {
      if (!cancelled) setBlueprintLibraryItems(items);
    });
    return () => {
      cancelled = true;
    };
  }, [projectRevision]);

  const blueprintLibraryNameById = useMemo(
    () => new Map(blueprintLibraryItems.map((item) => [item.id, item.name])),
    [blueprintLibraryItems]
  );

  const resolveLibraryBlueprint = useCallback<LibraryBlueprintResolver>(
    async (libraryBlueprintId) => {
      const record = await getBlueprintLibraryRecord(libraryBlueprintId);
      if (!record) return null;
      const items = await listBlueprintLibrary();
      const nameById = new Map(items.map((item) => [item.id, item.name]));
      return documentToRunnableGraph(record.document, { libraryNameById: nameById });
    },
    []
  );

  const handleViewScopeUpdate = useCallback(
    (viewElementIds: string[], scope: unknown) => {
      setViewElementScopes(viewElementIds, scope);
    },
    []
  );

  const layerElements = useMemo(
    () => resolvePreviewLayerElements(allElements, layers, activeLayerId),
    [activeLayerId, allElements, layers]
  );

  const scopeStoreVersion = useViewScopeStoreVersion();
  const scopedLayerElements = useMemo(() => {
    void scopeStoreVersion;
    return layerElements.map((el) =>
      resolvePanelElementScope(el, getViewElementScope(el.id))
    );
  }, [layerElements, scopeStoreVersion]);

  const sceneBounds = useMemo(
    () => computePanelSceneBounds(scopedLayerElements),
    [scopedLayerElements]
  );

  const displayElements = useMemo(
    () =>
      scopedLayerElements.map((el) => ({
        ...el,
        x: el.x - sceneBounds.minX,
        y: el.y - sceneBounds.minY,
      })),
    [sceneBounds.minX, sceneBounds.minY, scopedLayerElements]
  );

  const applySceneFit = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const vw = window.innerWidth || 1;
    const vh = window.innerHeight || 1;
    const sw = Math.max(1, sceneBounds.width);
    const sh = Math.max(1, sceneBounds.height);
    const scaleX = vw / sw;
    const scaleY = vh / sh;
    if (!Number.isFinite(scaleX) || !Number.isFinite(scaleY)) return;
    scene.style.transform = `scale(${scaleX}, ${scaleY})`;
    setLayoutRevision((v) => v + 1);
    notifyPreviewLayoutChanged();
  }, [sceneBounds.height, sceneBounds.width]);

  useLayoutEffect(() => {
    if (!panelState || layerElements.length === 0) return;

    setLayoutReady(false);
    applySceneFit();
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      applySceneFit();
      raf2 = requestAnimationFrame(() => {
        notifyPreviewLayoutChanged();
        setLayoutReady(true);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [
    applySceneFit,
    displayElements.length,
    layerElements.length,
    panelState,
    projectRevision,
    sceneBounds.height,
    sceneBounds.width,
  ]);

  const lifecycleReady =
    !!panelState && layerElements.length > 0 && layoutReady;

  useBlueprintPageLifecycle({
    graph: blueprintGraph,
    active: true,
    enabled: lifecycleReady,
    bootPhases: PREVIEW_BOOT_PHASES,
    bootKey: projectRevision,
    waitForPageReady: true,
    onUpdated: `${activeLayerId}|${layerElements.length}|${projectRevision}|${layoutRevision}`,
    resolveLibraryBlueprint,
    libraryNameById: blueprintLibraryNameById,
    rootLibraryBlueprintId: null,
    onViewScopeUpdate: handleViewScopeUpdate,
  });

  useEffect(() => {
    window.addEventListener("resize", applySceneFit);
    return () => window.removeEventListener("resize", applySceneFit);
  }, [applySceneFit]);

  const noopUpdate = useCallback((_id: string, _patch: Partial<PanelElement>) => {}, []);
  const noopSelect = useCallback((_ids: string[]) => {}, []);

  if (loadError) {
    return (
      <div className="flex min-h-[100vh] w-full items-center justify-center bg-white px-6 text-center text-sm text-gray-600">
        {loadError}
      </div>
    );
  }

  if (!panelState) {
    return (
      <div className="flex min-h-[100vh] w-full items-center justify-center bg-white text-sm text-gray-600">
        加载预览中…
      </div>
    );
  }

  if (layerElements.length === 0) {
    return (
      <div className="flex min-h-[100vh] w-full flex-col items-center justify-center gap-2 bg-white px-6 text-center text-sm text-gray-600">
        <div>当前工作区没有可预览的视图节点</div>
        <div className="text-xs text-gray-400">
          请先在编辑器中点击「同步」或「创建工作区」后再预览
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-[100vh] w-full overflow-hidden bg-white text-gray-900"
      data-preview-mode="online"
      data-project-id={projectId}
      data-preview-instance-id={previewInstanceId ?? ""}
      data-preview-node-count={String(displayElements.length)}
    >
      <div
        id="preview-root"
        className="overflow-hidden"
        style={{ width: "100vw", height: "100vh" }}
      >
        <div
          ref={sceneRef}
          id="preview-scene"
          className="relative shrink-0 origin-top-left"
          style={{
            width: sceneBounds.width,
            height: sceneBounds.height,
            transformOrigin: "left top",
          }}
        >
          <ElementsLayer
            elements={displayElements}
            allElements={allElements}
            selectedIds={[]}
            onSelectIds={noopSelect}
            updateElement={noopUpdate}
            layerLocked
            previewMode
            previewLayoutKey={layoutRevision}
          />
        </div>
      </div>
    </div>
  );
}

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
