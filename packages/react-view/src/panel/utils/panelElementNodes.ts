import type { Node } from "@arronqzy/rx-store";
import type { PanelElement } from "../types";

export function isPanelElementNode(node: Node): boolean {
  const props = node.props as Partial<PanelElement> | undefined;
  return !!props && typeof props.id === "string" && typeof props.layerId === "string";
}

export function clonePanelElement(el: PanelElement): PanelElement {
  return {
    ...el,
    chart: el.chart ? { ...el.chart, option: el.chart.option ? { ...el.chart.option } : undefined } : undefined,
    style: el.style ? { ...el.style } : undefined,
    refSnapshot: el.refSnapshot ? el.refSnapshot.map(clonePanelElement) : undefined,
  };
}

export function buildDeepReferenceSnapshot(
  allElements: PanelElement[],
  layerId: string,
  visitedLayers = new Set<string>()
): PanelElement[] {
  if (visitedLayers.has(layerId)) return [];
  const nextVisited = new Set(visitedLayers);
  nextVisited.add(layerId);
  const layerNodes = allElements.filter((el) => el.layerId === layerId);
  return layerNodes.map((el) => {
    const cloned = clonePanelElement(el);
    if (cloned.materialType === "reference" && cloned.refLayerId) {
      cloned.refCopyMode = "deep";
      cloned.refSnapshot = buildDeepReferenceSnapshot(allElements, cloned.refLayerId, nextVisited);
    }
    return cloned;
  });
}
