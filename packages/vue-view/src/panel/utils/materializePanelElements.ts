import type { PanelElement } from "../types";
import { isPanelElementNode } from "./panelElementNodes";
import type { Node } from "@arronqzy/rx-store";

/**
 * Preserve Immer structural sharing: unchanged nodes keep the same props
 * object reference so React.memo / Vue can skip re-rendering them.
 */
export function materializePanelElements(
  nodes: Node[] | undefined,
  previous?: readonly PanelElement[] | null
): PanelElement[] {
  const list = nodes ?? [];
  const prevById = previous?.length
    ? new Map(previous.map((el) => [el.id, el] as const))
    : null;
  const next: PanelElement[] = [];

  for (const n of list) {
    if (!isPanelElementNode(n) || !n.props) continue;
    const props = n.props as PanelElement;
    const normalized: PanelElement =
      typeof props.zIndex === "number" ? props : { ...props, zIndex: 1 };

    const prev = prevById?.get(normalized.id);
    if (prev && prev === normalized) {
      next.push(prev);
      continue;
    }
    if (
      prev &&
      prev.id === normalized.id &&
      prev.x === normalized.x &&
      prev.y === normalized.y &&
      prev.width === normalized.width &&
      prev.height === normalized.height &&
      prev.rotate === normalized.rotate &&
      prev.zIndex === normalized.zIndex &&
      prev.layerId === normalized.layerId &&
      prev.locked === normalized.locked &&
      prev.materialType === normalized.materialType &&
      prev.name === normalized.name &&
      prev.chart === normalized.chart &&
      prev.table === normalized.table &&
      prev.style === normalized.style &&
      prev.textHtml === normalized.textHtml &&
      prev.textAllowInput === normalized.textAllowInput &&
      prev.gridRows === normalized.gridRows &&
      prev.gridCols === normalized.gridCols &&
      prev.gridGap === normalized.gridGap &&
      prev.gridPadding === normalized.gridPadding &&
      prev.parentGridId === normalized.parentGridId &&
      prev.gridSlotIndex === normalized.gridSlotIndex &&
      prev.gridColSpan === normalized.gridColSpan &&
      prev.gridRowSpan === normalized.gridRowSpan &&
      prev.viewportOverflow === normalized.viewportOverflow &&
      prev.scene3d === normalized.scene3d &&
      prev.refLayerId === normalized.refLayerId &&
      prev.refCopyMode === normalized.refCopyMode &&
      prev.refSnapshot === normalized.refSnapshot &&
      prev.audioSrc === normalized.audioSrc &&
      prev.videoSrc === normalized.videoSrc &&
      prev.geometryShape === normalized.geometryShape &&
      prev.geometryColor === normalized.geometryColor &&
      prev.geometrySketchDataUrl === normalized.geometrySketchDataUrl
    ) {
      next.push(prev);
      continue;
    }
    next.push(normalized);
  }

  if (
    previous &&
    previous.length === next.length &&
    previous.every((el, i) => el === next[i])
  ) {
    return previous as PanelElement[];
  }
  return next;
}

/** Keep previous array identity when item references are unchanged (order-sensitive). */
export function stabilizeElementList(
  next: PanelElement[],
  previous?: readonly PanelElement[] | null
): PanelElement[] {
  if (
    previous &&
    previous.length === next.length &&
    previous.every((el, i) => el === next[i])
  ) {
    return previous as PanelElement[];
  }
  return next;
}
