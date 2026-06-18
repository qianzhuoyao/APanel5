import type { State } from "@arronqzy/rx-store";
import type { PanelElement, PanelLayer } from "../types";
import {
  DEFAULT_LAYER,
  DEFAULT_LAYER_ID,
  normalizePrimaryLayer,
} from "./panelElementDefaults";

export function normalizeImportedPanelState(state: unknown): State | null {
  if (!state || typeof state !== "object") return null;
  const raw = state as State;
  if (!raw.root || typeof raw.root !== "object") return null;
  if (!raw.root.id || !raw.root.type) return null;

  const next = JSON.parse(JSON.stringify(raw)) as State;
  next.root.children = Array.isArray(next.root.children) ? next.root.children : [];
  next.variables = next.variables ?? {};
  if (!Array.isArray(next.variables.layers)) {
    next.variables.layers = [DEFAULT_LAYER];
  }
  next.variables.layers = normalizePrimaryLayer(next.variables.layers as PanelLayer[]);
  if (typeof next.variables.activeLayerId !== "string") {
    next.variables.activeLayerId =
      (next.variables.layers[0] as PanelLayer | undefined)?.id ?? DEFAULT_LAYER_ID;
  }
  return next;
}

export function parseAllPanelElements(state: State): PanelElement[] {
  return (state.root.children ?? [])
    .filter((node) => {
      const props = node.props as Partial<PanelElement> | undefined;
      if (!props || typeof props.layerId !== "string") return false;
      const id = props.id ?? node.id;
      return typeof id === "string" && id.length > 0;
    })
    .map((node) => {
      const props = node.props as PanelElement;
      return {
        ...props,
        id: props.id ?? node.id,
        zIndex: typeof props.zIndex === "number" ? props.zIndex : 1,
      };
    });
}

export function parsePanelLayers(state: State): PanelLayer[] {
  const raw = (state.variables?.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
  return normalizePrimaryLayer(raw);
}

export function getActiveLayerId(state: State): string {
  return (state.variables?.activeLayerId as string | undefined) ?? DEFAULT_LAYER_ID;
}

export function resolvePreviewLayerElements(
  allElements: PanelElement[],
  layers: PanelLayer[],
  activeLayerId: string
): PanelElement[] {
  const primary = layers.find((layer) => layer.isPrimary) ?? layers[0];
  if (primary) {
    const onPrimary = allElements.filter((el) => el.layerId === primary.id);
    if (onPrimary.length > 0) return onPrimary;
  }
  const onActive = allElements.filter((el) => el.layerId === activeLayerId);
  if (onActive.length > 0) return onActive;
  const mappingLayerIds = new Set(
    layers.filter((layer) => layer.isMapping).map((layer) => layer.id)
  );
  const nonMapping = allElements.filter((el) => !mappingLayerIds.has(el.layerId));
  return nonMapping.length > 0 ? nonMapping : allElements;
}

export type PanelSceneBounds = {
  minX: number;
  minY: number;
  width: number;
  height: number;
};

export function computePanelSceneBounds(elements: PanelElement[]): PanelSceneBounds {
  if (!elements.length) {
    return { minX: 0, minY: 0, width: 1, height: 1 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const el of elements) {
    const w = Math.max(1, el.width);
    const h = Math.max(1, el.height);
    const rad = ((el.rotate ?? 0) * Math.PI) / 180;
    const absCos = Math.abs(Math.cos(rad));
    const absSin = Math.abs(Math.sin(rad));
    const bw = w * absCos + h * absSin;
    const bh = w * absSin + h * absCos;
    const cx = el.x + w / 2;
    const cy = el.y + h / 2;
    const left = cx - bw / 2;
    const top = cy - bh / 2;
    const right = cx + bw / 2;
    const bottom = cy + bh / 2;
    minX = Math.min(minX, left);
    minY = Math.min(minY, top);
    maxX = Math.max(maxX, right);
    maxY = Math.max(maxY, bottom);
  }

  return {
    minX,
    minY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
  };
}

export const PREVIEW_LAYOUT_EVENT = "arronqzy-preview-layout";

export function notifyPreviewLayoutChanged() {
  window.dispatchEvent(new Event(PREVIEW_LAYOUT_EVENT));
}
