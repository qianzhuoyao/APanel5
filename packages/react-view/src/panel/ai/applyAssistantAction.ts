import type { AssistantAction, CompactLayer, CompactWorkspace } from "@arronqzy/webllm-assistant";
import {
  isKnownMaterialType,
  normalizeBlueprintNodeAlias,
  normalizeMaterialType,
} from "@arronqzy/webllm-assistant";
import {
  BlueprintGraph,
  patchNodeConfigSource,
  type BlueprintConfigSource,
} from "@arronqzy/react-blueprint";
import { store } from "@arronqzy/rx-store";
import type { PanelElement, PanelLayer } from "../types";
import { isPanelElementNode } from "../utils/panelElementNodes";
import { DEFAULT_LAYER, DEFAULT_LAYER_ID } from "../utils/panelElementDefaults";

export type ApplyAssistantDeps = {
  /** @returns created element id, or null if layer locked / failed */
  addElementFromMaterial: (
    materialType: string,
    x: number,
    y: number
  ) => string | null;
  updateElement: (
    id: string,
    patch: Partial<PanelElement>,
    options?: { batchId?: string; meta?: Record<string, unknown> }
  ) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  /** Select on canvas + switch right sidebar to view config */
  setSelectedIds: (ids: string[]) => void;
  getSelectedIds: () => string[];
  /** Scroll/highlight config fields matching a panel.update patch */
  revealConfigFromPatch?: (patch: Record<string, unknown>) => void;
  focusWorkspace?: (area: "view" | "blueprint") => void;

  /** Live reads from store when possible */
  getElementIds: () => Set<string>;
  getElement: (id: string) => PanelElement | undefined;
  listElements: () => PanelElement[];
  getLayers: () => CompactLayer[];
  getActiveLayerId: () => string | null;
  setActiveLayer: (id: string) => void;
  addLayer: () => void;
  renameLayer: (id: string, name: string) => void;
  /** Set absolute lock; toggle if current differs */
  setLayerLocked: (id: string, locked: boolean) => void;
  deleteLayer: (id: string) => { ok: boolean; reason?: string };
  bringElementsToFront: (ids: string[]) => void;
  sendElementsToBack: (ids: string[]) => void;
  bringElementsForward: (ids: string[]) => void;
  sendElementsBackward: (ids: string[]) => void;
  getZoom: () => number;
  setZoomAbsolute: (value: number) => void;
  adjustZoomDelta: (delta: number) => void;
  fitViewport: () => void;
  undo: () => void;
  redo: () => void;
  setBlueprintGraph: (
    updater: (graph: BlueprintGraph) => BlueprintGraph
  ) => void;
  getBlueprintGraph: () => BlueprintGraph;
  setBlueprintOpen: (open: boolean) => void;
  getBlueprintOpen: () => boolean;
  runBlueprintAll: () => void | Promise<void>;
  getWorkspace: () => CompactWorkspace;
  workspaceSave: () => Promise<{ id: string; name: string }>;
  workspaceSync: () => Promise<string>;
  workspaceCreate: (name?: string) => Promise<{ id: string; name: string }>;
  workspaceOpen: (id: string) => Promise<void>;
  workspacePreview: (id?: string) => Promise<void>;
  exportPanelJson: () => string;
  importPanelJson: (json: string) => boolean;
  setTheme: (theme: "light" | "dark") => void;
  setLocale: (locale: "zh-CN" | "en-US") => void;
  setPanelFontSize: (size: "sm" | "md" | "lg") => void;
};

export type ApplyAssistantResult = {
  ok: boolean;
  message: string;
  createdIds?: string[];
};

const NESTED_MERGE_KEYS = new Set(["table", "style", "chart"]);

export function listPanelElementsFromStore(): PanelElement[] {
  const state = store.getState();
  return (state.root.children ?? [])
    .filter((n) => isPanelElementNode(n) && n.props)
    .map((n) => {
      const props = n.props as PanelElement;
      return {
        ...props,
        zIndex: typeof props.zIndex === "number" ? props.zIndex : 1,
      };
    });
}

export function listLayersFromStore(): CompactLayer[] {
  const state = store.getState();
  const list =
    (state.variables?.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
  const active =
    (state.variables?.activeLayerId as string | undefined) ?? DEFAULT_LAYER_ID;
  return list.map((l) => ({
    id: l.id,
    name: l.name,
    locked: !!l.locked,
    active: l.id === active,
  }));
}

export function getActiveLayerIdFromStore(): string | null {
  const state = store.getState();
  return (
    (state.variables?.activeLayerId as string | undefined) ?? DEFAULT_LAYER_ID
  );
}

function deepMergePatch(
  existing: PanelElement | undefined,
  patch: Record<string, unknown>
): Partial<PanelElement> {
  const next: Record<string, unknown> = { ...patch };
  for (const key of NESTED_MERGE_KEYS) {
    if (!isPlainObject(patch[key])) continue;
    const prev = existing?.[key as keyof PanelElement];
    if (isPlainObject(prev)) {
      next[key] = { ...prev, ...(patch[key] as Record<string, unknown>) };
    }
  }
  return next as Partial<PanelElement>;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function resolveElementId(
  requestedId: string,
  deps: ApplyAssistantDeps
): string | null {
  const ids = deps.getElementIds();
  if (ids.has(requestedId)) return requestedId;
  const selected = deps.getSelectedIds() ?? [];
  if (selected.length === 1 && ids.has(selected[0]!)) return selected[0]!;
  for (const id of ids) {
    const el = deps.getElement(id);
    if (el?.name && el.name === requestedId) return id;
  }
  return null;
}

function ensureBlueprintParent(graph: BlueprintGraph): {
  graph: BlueprintGraph;
  parentId: string;
} {
  const existing = graph.document.nodes.find((n) => n.role === "blueprint");
  if (existing) return { graph, parentId: existing.id };
  const next = graph.addBlueprintNode({ x: 80, y: 80 }, "Main");
  const parent = next.document.nodes.find((n) => n.role === "blueprint");
  if (!parent) throw new Error("failed_create_blueprint_root");
  return { graph: next, parentId: parent.id };
}

function applyBlueprintAddNode(
  graph: BlueprintGraph,
  action: Extract<AssistantAction, { type: "blueprint.addNode" }>
): { graph: BlueprintGraph; message: string } {
  const alias = normalizeBlueprintNodeAlias(action.nodeType);
  if (!alias) {
    throw new Error(`unknown_blueprint_node_type:${action.nodeType}`);
  }
  const position = action.position ?? {
    x: 180 + Math.round(Math.random() * 80),
    y: 120 + Math.round(Math.random() * 80),
  };

  if (alias === "blueprint") {
    const next = graph.addBlueprintNode(position, action.label);
    return { graph: next, message: `added blueprint node` };
  }

  const ensured = ensureBlueprintParent(graph);
  let next = ensured.graph;
  const parentId = ensured.parentId;

  if (alias === "lifecycle") {
    next = next.addLifecycleNode(parentId, position, "mounted", action.label);
    return { graph: next, message: `added lifecycle node` };
  }

  next = next.addLogicNode(parentId, position, action.label ?? alias);
  const created = next.document.nodes[next.document.nodes.length - 1];
  if (!created) throw new Error("failed_add_logic_node");

  const configSourceMap: Record<string, BlueprintConfigSource | undefined> = {
    logic: "logic",
    clock: "clock",
    fetch: "fetch",
    json: "json",
    and: "and",
  };
  const configSource = configSourceMap[alias];
  if (configSource && configSource !== "logic") {
    next = next.updateNode(created.id, patchNodeConfigSource(created, configSource));
  }
  if (typeof action.label === "string" && action.label) {
    next = next.updateNode(created.id, { label: action.label });
  }
  return { graph: next, message: `added ${alias} node ${created.id}` };
}

async function applyOne(
  action: AssistantAction,
  deps: ApplyAssistantDeps,
  depth = 0
): Promise<ApplyAssistantResult> {
  if (depth > 8) {
    return { ok: false, message: "batch_too_deep" };
  }

  switch (action.type) {
    case "reply":
    case "agent.done":
    case "agent.fail":
      return { ok: true, message: action.message };

    case "panel.add": {
      const materialType =
        normalizeMaterialType(action.materialType) ?? action.materialType;
      if (!isKnownMaterialType(materialType)) {
        return {
          ok: false,
          message: `unknown_material:${action.materialType}`,
        };
      }
      const x = action.x ?? 220;
      const y = action.y ?? 160;
      const createdId = deps.addElementFromMaterial(materialType, x, y);
      if (!createdId) {
        return {
          ok: false,
          message: "layer_locked_or_add_failed",
        };
      }
      if (action.patch && Object.keys(action.patch).length) {
        const existing = deps.getElement(createdId);
        deps.updateElement(createdId, deepMergePatch(existing, action.patch));
      }
      deps.setSelectedIds([createdId]);
      deps.focusWorkspace?.("view");
      if (action.patch && Object.keys(action.patch).length) {
        deps.revealConfigFromPatch?.(action.patch);
      }
      return {
        ok: true,
        message: action.message ?? `added ${materialType}`,
        createdIds: [createdId],
      };
    }

    case "panel.update": {
      const id = resolveElementId(action.id, deps);
      if (!id) {
        return { ok: false, message: `missing_element:${action.id}` };
      }
      const existing = deps.getElement(id);
      deps.updateElement(id, deepMergePatch(existing, action.patch));
      deps.setSelectedIds([id]);
      deps.focusWorkspace?.("view");
      deps.revealConfigFromPatch?.(action.patch);
      return {
        ok: true,
        message:
          action.message ??
          (id === action.id
            ? `updated ${id}`
            : `updated ${id} (resolved from ${action.id})`),
      };
    }

    case "panel.remove": {
      if (!deps.getElementIds().has(action.id)) {
        return { ok: false, message: `missing_element:${action.id}` };
      }
      deps.deleteElement(action.id);
      return { ok: true, message: action.message ?? `removed ${action.id}` };
    }

    case "panel.select": {
      const ids = action.ids.filter((id) => deps.getElementIds().has(id));
      if (!ids.length && action.ids.length) {
        return { ok: false, message: `missing_elements:${action.ids.join(",")}` };
      }
      deps.setSelectedIds(ids);
      deps.focusWorkspace?.("view");
      return {
        ok: true,
        message: action.message ?? `selected ${ids.join(",") || "(none)"}`,
      };
    }

    case "panel.duplicate": {
      if (!deps.getElementIds().has(action.id)) {
        return { ok: false, message: `missing_element:${action.id}` };
      }
      const before = deps.getElementIds();
      deps.duplicateElement(action.id);
      const created = [...deps.getElementIds()].find((id) => !before.has(id));
      if (created) deps.setSelectedIds([created]);
      return {
        ok: true,
        message: action.message ?? `duplicated ${action.id}`,
        createdIds: created ? [created] : undefined,
      };
    }

    case "panel.lock": {
      const id = resolveElementId(action.id, deps);
      if (!id) return { ok: false, message: `missing_element:${action.id}` };
      deps.updateElement(id, { locked: action.locked });
      return {
        ok: true,
        message:
          action.message ??
          (action.locked ? `locked ${id}` : `unlocked ${id}`),
      };
    }

    case "panel.zOrder": {
      const ids =
        action.ids?.filter((id) => deps.getElementIds().has(id)) ??
        deps.getSelectedIds();
      if (!ids.length) return { ok: false, message: "no_selection" };
      if (action.action === "front") deps.bringElementsToFront(ids);
      else if (action.action === "back") deps.sendElementsToBack(ids);
      else if (action.action === "forward") deps.bringElementsForward(ids);
      else deps.sendElementsBackward(ids);
      return {
        ok: true,
        message: action.message ?? `zOrder ${action.action}`,
      };
    }

    case "panel.batch": {
      const notes: string[] = [];
      const createdIds: string[] = [];
      for (const child of action.actions) {
        const result = await applyOne(child, deps, depth + 1);
        notes.push(result.message);
        if (result.createdIds) createdIds.push(...result.createdIds);
        if (!result.ok) {
          return {
            ok: false,
            message: action.message
              ? `${action.message}\n${notes.join("\n")}`
              : notes.join("\n"),
            createdIds,
          };
        }
      }
      return {
        ok: true,
        message: action.message ?? notes.join("\n"),
        createdIds,
      };
    }

    case "layer.setActive": {
      const layers = deps.getLayers();
      if (!layers.some((l) => l.id === action.id)) {
        return { ok: false, message: `missing_layer:${action.id}` };
      }
      deps.setActiveLayer(action.id);
      return { ok: true, message: action.message ?? `active layer ${action.id}` };
    }

    case "layer.add": {
      deps.addLayer();
      const activeId = deps.getActiveLayerId();
      if (action.name && activeId) {
        deps.renameLayer(activeId, action.name);
      }
      return {
        ok: true,
        message: action.message ?? `added layer ${activeId ?? ""}`,
      };
    }

    case "layer.rename": {
      if (!deps.getLayers().some((l) => l.id === action.id)) {
        return { ok: false, message: `missing_layer:${action.id}` };
      }
      deps.renameLayer(action.id, action.name);
      return { ok: true, message: action.message ?? `renamed layer ${action.id}` };
    }

    case "layer.lock": {
      if (!deps.getLayers().some((l) => l.id === action.id)) {
        return { ok: false, message: `missing_layer:${action.id}` };
      }
      deps.setLayerLocked(action.id, action.locked);
      return {
        ok: true,
        message:
          action.message ??
          (action.locked ? `locked layer ${action.id}` : `unlocked layer ${action.id}`),
      };
    }

    case "layer.delete": {
      const result = deps.deleteLayer(action.id);
      if (!result.ok) {
        return { ok: false, message: result.reason ?? `delete_layer_failed:${action.id}` };
      }
      return { ok: true, message: action.message ?? `deleted layer ${action.id}` };
    }

    case "viewport.zoom": {
      if (action.mode === "delta") {
        deps.adjustZoomDelta(action.value);
      } else {
        deps.setZoomAbsolute(action.value);
      }
      return {
        ok: true,
        message: action.message ?? `zoom ${deps.getZoom()}`,
      };
    }

    case "viewport.fit": {
      deps.fitViewport();
      return { ok: true, message: action.message ?? "viewport fit" };
    }

    case "history.undo": {
      deps.undo();
      return { ok: true, message: action.message ?? "undo" };
    }

    case "history.redo": {
      deps.redo();
      return { ok: true, message: action.message ?? "redo" };
    }

    case "blueprint.addNode": {
      try {
        let message = "";
        deps.setBlueprintOpen(true);
        deps.focusWorkspace?.("blueprint");
        deps.setBlueprintGraph((graph) => {
          const result = applyBlueprintAddNode(graph, action);
          message = result.message;
          return result.graph;
        });
        return { ok: true, message: action.message ?? message };
      } catch (err) {
        return {
          ok: false,
          message: err instanceof Error ? err.message : String(err),
        };
      }
    }

    case "blueprint.connect": {
      const graph = deps.getBlueprintGraph();
      if (!graph.getNode(action.sourceId) || !graph.getNode(action.targetId)) {
        return {
          ok: false,
          message: `missing_blueprint_endpoint:${action.sourceId}->${action.targetId}`,
        };
      }
      deps.setBlueprintGraph((g) =>
        g.addEdge({
          source: action.sourceId,
          target: action.targetId,
          sourceHandle: action.sourcePort,
          targetHandle: action.targetPort,
        })
      );
      return {
        ok: true,
        message:
          action.message ??
          `connected ${action.sourceId} -> ${action.targetId}`,
      };
    }

    case "blueprint.removeNode": {
      if (!deps.getBlueprintGraph().getNode(action.id)) {
        return { ok: false, message: `missing_blueprint_node:${action.id}` };
      }
      deps.setBlueprintGraph((g) => g.removeNode(action.id));
      return { ok: true, message: action.message ?? `removed node ${action.id}` };
    }

    case "blueprint.updateNode": {
      if (!deps.getBlueprintGraph().getNode(action.id)) {
        return { ok: false, message: `missing_blueprint_node:${action.id}` };
      }
      deps.setBlueprintGraph((g) =>
        g.updateNode(action.id, action.patch as Parameters<BlueprintGraph["updateNode"]>[1])
      );
      return { ok: true, message: action.message ?? `updated node ${action.id}` };
    }

    case "blueprint.removeEdge": {
      const edges = deps.getBlueprintGraph().document.edges;
      if (!edges.some((e) => e.id === action.id)) {
        return { ok: false, message: `missing_blueprint_edge:${action.id}` };
      }
      deps.setBlueprintGraph((g) => g.removeEdge(action.id));
      return { ok: true, message: action.message ?? `removed edge ${action.id}` };
    }

    case "blueprint.open": {
      const open = action.open !== false;
      deps.setBlueprintOpen(open);
      deps.focusWorkspace?.(open ? "blueprint" : "view");
      return {
        ok: true,
        message:
          action.message ??
          (open ? "blueprint opened" : "blueprint closed"),
      };
    }

    case "blueprint.runAll": {
      deps.setBlueprintOpen(true);
      deps.focusWorkspace?.("blueprint");
      await deps.runBlueprintAll();
      return { ok: true, message: action.message ?? "blueprint runAll" };
    }

    case "workspace.save": {
      try {
        const r = await deps.workspaceSave();
        return {
          ok: true,
          message: action.message ?? `saved workspace ${r.name} (${r.id})`,
        };
      } catch (err) {
        return {
          ok: false,
          message: err instanceof Error ? err.message : String(err),
        };
      }
    }

    case "workspace.sync": {
      try {
        const name = await deps.workspaceSync();
        return { ok: true, message: action.message ?? `synced ${name}` };
      } catch (err) {
        return {
          ok: false,
          message: err instanceof Error ? err.message : String(err),
        };
      }
    }

    case "workspace.create": {
      try {
        const r = await deps.workspaceCreate(action.name);
        return {
          ok: true,
          message: action.message ?? `created workspace ${r.name} (${r.id})`,
        };
      } catch (err) {
        return {
          ok: false,
          message: err instanceof Error ? err.message : String(err),
        };
      }
    }

    case "workspace.open": {
      try {
        await deps.workspaceOpen(action.id);
        return { ok: true, message: action.message ?? `opened ${action.id}` };
      } catch (err) {
        return {
          ok: false,
          message: err instanceof Error ? err.message : String(err),
        };
      }
    }

    case "workspace.preview": {
      try {
        await deps.workspacePreview(action.id);
        return { ok: true, message: action.message ?? "opened preview" };
      } catch (err) {
        return {
          ok: false,
          message: err instanceof Error ? err.message : String(err),
        };
      }
    }

    case "io.exportPanel": {
      const json = deps.exportPanelJson();
      return {
        ok: true,
        message:
          action.message ??
          `exported panel JSON (${json.length} chars)\n${json.slice(0, 400)}${json.length > 400 ? "…" : ""}`,
      };
    }

    case "io.importPanelJson": {
      try {
        const ok = deps.importPanelJson(action.json);
        if (!ok) return { ok: false, message: "import_panel_failed" };
        return { ok: true, message: action.message ?? "imported panel JSON" };
      } catch (err) {
        return {
          ok: false,
          message: err instanceof Error ? err.message : String(err),
        };
      }
    }

    case "ui.setTheme": {
      deps.setTheme(action.theme);
      return { ok: true, message: action.message ?? `theme ${action.theme}` };
    }

    case "ui.setLocale": {
      deps.setLocale(action.locale);
      return { ok: true, message: action.message ?? `locale ${action.locale}` };
    }

    case "ui.setPanelFontSize": {
      deps.setPanelFontSize(action.size);
      return { ok: true, message: action.message ?? `font ${action.size}` };
    }

    default:
      return { ok: false, message: "unsupported_action" };
  }
}

export async function applyAssistantAction(
  action: AssistantAction,
  deps: ApplyAssistantDeps
): Promise<ApplyAssistantResult> {
  return applyOne(action, deps);
}
