import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@arronqzy/i18n/react";
import {
  BlueprintGraph,
  documentToRunnableGraph,
  getBlueprintLibraryRecord,
  listBlueprintLibrary,
  useBlueprintPageLifecycle,
  type BlueprintLibraryListItem,
  resolveRunnableNodeType,
  resolveViewElementIds,
} from "@arronqzy/react-blueprint";
import type { LibraryBlueprintResolver, PageLifecyclePhase } from "@arronqzy/blueprint-dsl";
import { collectArmedViewEventBindings, EVENT_NODE_TYPE, LIFECYCLE_NODE_TYPE } from "@arronqzy/blueprint-dsl";
import type { State } from "@arronqzy/rx-store";
import { ElementsLayer } from "./components/ElementsLayer";
import type { TableCellActionHandler } from "./components/table/TableNodeContent";
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
import { applyPreviewSceneFill, readOutputScale } from "./utils/outputScale";

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
  const { t } = useI18n();

  const [loadError, setLoadError] = useState<string | null>(null);
  const [panelState, setPanelState] = useState<State | null>(null);
  const [projectRevision, setProjectRevision] = useState(0);
  const [blueprintGraph, setBlueprintGraph] = useState(() => BlueprintGraph.empty());
  const [blueprintLibraryItems, setBlueprintLibraryItems] = useState<
    BlueprintLibraryListItem[]
  >([]);
  const [layoutRevision, setLayoutRevision] = useState(0);
  const [layoutReady, setLayoutReady] = useState(false);
  const [outputScale, setOutputScale] = useState(() => readOutputScale());
  const [fillScale, setFillScale] = useState({ scaleX: 1, scaleY: 1 });

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
      setLoadError(t("panel.messages.workspaceNotFound"));
      setPanelState(null);
      return;
    }

    const normalized = normalizeImportedPanelState(record.panelState);
    if (!normalized) {
      setLoadError(t("panel.messages.workspaceDataInvalid"));
      setPanelState(null);
      return;
    }

    setLoadError(null);
    clearViewElementScopes();
    setPanelState(normalized);
    setBlueprintGraph(BlueprintGraph.fromDocument(record.blueprintDocument));
    document.title = record.productName.trim() || record.name || t("panel.workspace.previewDocTitle");
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
      scopedLayerElements.map((el) => {
        const x = el.x - sceneBounds.minX;
        const y = el.y - sceneBounds.minY;
        if (outputScale) return { ...el, x, y };
        return {
          ...el,
          x: x * fillScale.scaleX,
          y: y * fillScale.scaleY,
          width: el.width * fillScale.scaleX,
          height: el.height * fillScale.scaleY,
        };
      }),
    [
      fillScale.scaleX,
      fillScale.scaleY,
      outputScale,
      sceneBounds.minX,
      sceneBounds.minY,
      scopedLayerElements,
    ]
  );

  const applySceneFit = useCallback(() => {
    const enabled = readOutputScale();
    setOutputScale(enabled);
    const fill = applyPreviewSceneFill(
      sceneRef.current,
      sceneBounds.width,
      sceneBounds.height,
      enabled
    );
    setFillScale({ scaleX: fill.scaleX, scaleY: fill.scaleY });
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

  const { triggerBlueprintNode, emitViewEvent, firedLifecyclePhases } = useBlueprintPageLifecycle({
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
  const onTableCellAction = useCallback<TableCellActionHandler>(
    (payload) => {
      void triggerBlueprintNode(payload.blueprintNodeId, payload);
    },
    [triggerBlueprintNode]
  );
  const boundViewEventTypes = useMemo(
    () =>
      collectArmedViewEventBindings(
        blueprintGraph.document.nodes.map((node) => ({
          id: node.id,
          nodeType: resolveRunnableNodeType(node),
          lifecyclePhase: node.lifecyclePhase,
          viewElementIds: resolveViewElementIds(node),
          eventConfig: node.eventConfig,
        })),
        blueprintGraph.document.edges,
        EVENT_NODE_TYPE,
        LIFECYCLE_NODE_TYPE,
        firedLifecyclePhases
      ),
    [blueprintGraph.document.nodes, blueprintGraph.document.edges, firedLifecyclePhases]
  );
  const onViewUiEvent = useCallback(
    (payload: Parameters<typeof emitViewEvent>[0]) => {
      void emitViewEvent(payload);
    },
    [emitViewEvent]
  );
  if (loadError) {
    return (
      <div className="flex min-h-[100vh] w-full items-center justify-center bg-white px-6 text-center text-sm text-gray-600">
        {loadError}
      </div>
    );
  }

  if (!panelState) {
    return (
      <div className="flex min-h-[100vh] w-full flex-col items-center justify-center gap-3 bg-white text-sm text-gray-600">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
        {t("panel.workspace.previewLoading")}
      </div>
    );
  }

  if (layerElements.length === 0) {
    return (
      <div className="flex min-h-[100vh] w-full flex-col items-center justify-center gap-2 bg-white px-6 text-center text-sm text-gray-600">
        <div>{t("panel.workspace.previewNoNodes")}</div>
        <div className="text-xs text-gray-400">
          {t("panel.workspace.previewHint")}
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
            width: outputScale
              ? sceneBounds.width
              : sceneBounds.width * fillScale.scaleX,
            height: outputScale
              ? sceneBounds.height
              : sceneBounds.height * fillScale.scaleY,
            transformOrigin: "left top",
            transform: outputScale
              ? `scale(${fillScale.scaleX}, ${fillScale.scaleY})`
              : "none",
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
            onTableCellAction={onTableCellAction}
            boundViewEventTypes={boundViewEventTypes}
            onViewUiEvent={onViewUiEvent}
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
