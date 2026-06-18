import type { Node, State } from "@arronqzy/rx-store";
import type { PanelElement, PanelLayer } from "../types";
import { DEFAULT_LAYER_ID, DEFAULT_LAYER } from "./panelElementDefaults";
import { isPanelElementNode } from "./panelElementNodes";

/**
 * 沿 mappingSourceNodeId 追溯到「源画布节点」id。
 * 多层映射 / 中间克隆指向时仍与同源簇对齐；用于批量同步与节点树一致。
 */
export function canonicalMappingFamilyRootId(
  elementById: Map<string, PanelElement>,
  nodeId: string
): string {
  const visited = new Set<string>();
  let cur = nodeId;
  for (;;) {
    if (visited.has(cur)) return cur;
    visited.add(cur);
    const el = elementById.get(cur);
    const next = el?.mappingSourceNodeId;
    if (!next || next === cur) return cur;
    cur = next;
  }
}

/** 映射图层克隆节点：基准图层上的节点 id → 该映射图层上与之源一致的节点 id */
export function findCloneIdForSourceNodeOnMappingLayer(
  sourceElementId: string,
  mappingLayerId: string,
  elementsById: Map<string, PanelElement>
): string | undefined {
  const root = canonicalMappingFamilyRootId(elementsById, sourceElementId);
  for (const el of elementsById.values()) {
    if (el.layerId !== mappingLayerId) continue;
    if (!el.mappingSourceNodeId) continue;
    if (canonicalMappingFamilyRootId(elementsById, el.mappingSourceNodeId) !== root) continue;
    return el.id;
  }
  return undefined;
}

/** 克隆网格 id → 逻辑上的「源图层网格」同源 id（跨多层映射）；非法/缺失父节点时返回 undefined */
export function logicalGridParentIdFromConcrete(
  concreteParentGridId: string | undefined,
  elementById: Map<string, PanelElement>
): string | undefined {
  if (!concreteParentGridId) return undefined;
  const g = elementById.get(concreteParentGridId);
  if (!g || g.materialType !== "grid") return undefined;
  return canonicalMappingFamilyRootId(elementById, g.id);
}

/** 逻辑源网格同源 id → 在指定图层上的那张网格实例 id */
export function concreteGridParentIdForLayer(
  logicalSourceGridId: string | undefined,
  targetLayerId: string,
  elements: Iterable<PanelElement>
): string | undefined {
  if (!logicalSourceGridId) return undefined;
  const byId = new Map<string, PanelElement>();
  for (const el of elements) byId.set(el.id, el);
  for (const el of elements) {
    if (el.layerId !== targetLayerId || el.materialType !== "grid") continue;
    if (canonicalMappingFamilyRootId(byId, el.id) === logicalSourceGridId) return el.id;
  }
  return undefined;
}

/** 打开映射图层时：把选中节点在同图层内的网格子树一并纳入，避免出现「父网格+兄弟节点已克隆、中间嵌套网格丢失」的断层结构 */
export function expandMappingSeedsWithGridDescendants(nodeById: Map<string, PanelElement>, seedIds: string[]): string[] {
  const expanded = new Set<string>();
  const queue: string[] = [];
  for (const id of seedIds) {
    if (!id || !nodeById.has(id)) continue;
    expanded.add(id);
    queue.push(id);
  }
  while (queue.length > 0) {
    const id = queue.shift()!;
    const anchor = nodeById.get(id);
    const layerId = anchor?.layerId;
    for (const el of nodeById.values()) {
      if (el.parentGridId !== id) continue;
      if (layerId !== undefined && el.layerId !== layerId) continue;
      if (expanded.has(el.id)) continue;
      expanded.add(el.id);
      queue.push(el.id);
    }
  }
  return [...expanded];
}

export function removeMappingLayersBySourceIds(
  draft: State,
  sourceIds: Set<string>,
  fallbackActiveLayerId: string = DEFAULT_LAYER_ID
) {
  if (sourceIds.size === 0) return;
  const nodes = draft.root.children ?? [];
  const mappingLayerIds = new Set<string>();
  nodes.forEach((n) => {
    if (!isPanelElementNode(n) || !n.props) return;
    const props = n.props as PanelElement;
    if (!props.mappingSourceNodeId) return;
    if (!sourceIds.has(props.mappingSourceNodeId)) return;
    mappingLayerIds.add(props.layerId);
  });
  if (mappingLayerIds.size === 0) return;
  removeLayersByIds(draft, mappingLayerIds, fallbackActiveLayerId);
}

export function removeLayersByIds(draft: State, layerIds: Set<string>, fallbackActiveLayerId: string = DEFAULT_LAYER_ID) {
  if (layerIds.size === 0) return;
  const nodes = draft.root.children ?? [];

  draft.root.children = nodes.filter((n) => {
    if (!isPanelElementNode(n) || !n.props) return true;
    const props = n.props as PanelElement;
    return !layerIds.has(props.layerId);
  });

  draft.variables = draft.variables ?? {};
  const layers = (draft.variables.layers as PanelLayer[] | undefined) ?? [DEFAULT_LAYER];
  draft.variables.layers = layers.filter((layer) => !layerIds.has(layer.id));
  const activeLayerId = (draft.variables.activeLayerId as string | undefined) ?? fallbackActiveLayerId;
  if (layerIds.has(activeLayerId)) {
    draft.variables.activeLayerId =
      (draft.variables.layers[0] as PanelLayer | undefined)?.id ?? fallbackActiveLayerId;
  }
}

export function getMaxZIndexByLayer(nodes: Node[], layerId: string): number {
  let maxZ = 0;
  nodes.forEach((n) => {
    if (!isPanelElementNode(n) || !n.props) return;
    const props = n.props as PanelElement;
    if (props.layerId !== layerId) return;
    const z = typeof props.zIndex === "number" ? props.zIndex : 1;
    if (z > maxZ) maxZ = z;
  });
  return maxZ;
}
