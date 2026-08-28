import React, { useMemo, useState } from "react";
import { useI18n } from "@arronqzy/i18n/react";
import {
  Card,
  CardContent,
  CardHeader,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Empty,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
  Input,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@arronqzy/ui";
import type { PanelElement, ReferenceCopyMode } from "../types";
import type { PanelLayer } from "../types";
import { getPanelMessages } from "../constants/messages";
import {
  concreteGridParentIdForLayer,
  logicalGridParentIdFromConcrete,
} from "../utils/mappingLayerOps";

type MaterialCategoryId = "charts" | "basic" | "media";

type MaterialItem = {
  id: string;
  title: string;
};

type MaterialCategory = {
  id: MaterialCategoryId;
  title: string;
  items: MaterialItem[];
};

/** 节点树中网格子节点顺序：与画布槽位一致，嵌套任意深度一致 */
function compareGridTreeChildOrder(a: PanelElement, b: PanelElement): number {
  const ai = typeof a.gridSlotIndex === "number" ? a.gridSlotIndex : 0;
  const bi = typeof b.gridSlotIndex === "number" ? b.gridSlotIndex : 0;
  if (ai !== bi) return ai - bi;
  return a.id.localeCompare(b.id);
}

const MATERIAL_LABEL_KEYS: Record<string, string> = {
  bar: "panel.material.bar",
  line: "panel.material.line",
  pie: "panel.material.pie",
  area: "panel.material.area",
  scatter: "panel.material.scatter",
  radar: "panel.material.radar",
  gauge: "panel.material.gauge",
  funnel: "panel.material.funnel",
  text: "panel.material.text",
  rect: "panel.material.rect",
  grid: "panel.material.grid",
  viewport: "panel.material.viewport",
  image: "panel.material.image",
  video: "panel.material.video",
  audio: "panel.material.audio",
  reference: "panel.material.reference",
  geometry: "panel.material.geometry",
  scene3d: "panel.material.scene3d",
  table: "panel.material.table",
};

function getMaterialLabelMap(t: (key: string) => string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [id, key] of Object.entries(MATERIAL_LABEL_KEYS)) {
    map[id] = t(key);
  }
  return map;
}

function LockGlyph({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <circle cx="12" cy="15.5" r="1.2" />
    </svg>
  );
}

function IconCopy({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className}>
      <rect x="9" y="9" width="10" height="10" rx="2" />
      <rect x="5" y="5" width="10" height="10" rx="2" />
    </svg>
  );
}

function IconDelete({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className}>
      <path d="M4 7h16" />
      <path d="M9 7V5h6v2" />
      <path d="M7 7l1 12h8l1-12" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}

function IconShallowCopy({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className}>
      <rect x="8.5" y="8.5" width="10" height="10" rx="2" />
      <rect x="5.5" y="5.5" width="10" height="10" rx="2" />
      <path d="M7.5 16.5 16.5 7.5" strokeDasharray="2 2" />
    </svg>
  );
}

function IconDeepCopy({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className}>
      <rect x="4.5" y="4.5" width="15" height="4.2" rx="1.6" />
      <rect x="4.5" y="9.9" width="15" height="4.2" rx="1.6" />
      <rect x="4.5" y="15.3" width="15" height="4.2" rx="1.6" />
    </svg>
  );
}

function MaterialPreview({ id }: { id: string }) {
  const { t } = useI18n();
  const common =
    "relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-md border border-border bg-gradient-to-br from-card to-muted/40";

  if (id === "bar") {
    return (
      <div className={common}>
        <div className="absolute inset-0 grid grid-cols-5 items-end gap-1 px-2 pb-2 pt-1.5">
          <div className="h-2 rounded-sm bg-primary/55" />
          <div className="h-4 rounded-sm bg-primary/65" />
          <div className="h-7 rounded-sm bg-primary/80" />
          <div className="h-5 rounded-sm bg-primary/70" />
          <div className="h-3 rounded-sm bg-primary/60" />
        </div>
      </div>
    );
  }

  if (id === "line" || id === "area") {
    return (
      <div className={common}>
        <svg viewBox="0 0 80 60" className="h-full w-full">
          {id === "area" ? (
            <polygon
              points="6,42 18,28 34,34 50,20 66,24 74,18 74,56 6,56"
              className="fill-primary/30"
            />
          ) : null}
          <polyline
            points="6,42 18,28 34,34 50,20 66,24 74,18"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (id === "pie") {
    return (
      <div className={common}>
        <svg viewBox="0 0 80 60" className="h-full w-full">
          <circle cx="40" cy="30" r="16" className="fill-primary/20" />
          <path d="M40 30 L40 14 A16 16 0 0 1 55 39 Z" className="fill-primary/75" />
          <path d="M40 30 L55 39 A16 16 0 0 1 27 43 Z" className="fill-primary/45" />
        </svg>
      </div>
    );
  }

  if (id === "scatter") {
    return (
      <div className={common}>
        <svg viewBox="0 0 80 60" className="h-full w-full">
          <circle cx="14" cy="42" r="2.5" className="fill-primary/80" />
          <circle cx="24" cy="34" r="2.5" className="fill-primary/70" />
          <circle cx="36" cy="28" r="2.5" className="fill-primary/75" />
          <circle cx="48" cy="20" r="2.5" className="fill-primary/65" />
          <circle cx="62" cy="14" r="2.5" className="fill-primary/85" />
        </svg>
      </div>
    );
  }

  if (id === "radar") {
    return (
      <div className={common}>
        <svg viewBox="0 0 80 60" className="h-full w-full">
          <polygon points="40,10 58,20 54,40 26,40 22,20" className="fill-primary/20 stroke-primary/60" />
          <polygon points="40,16 52,23 49,36 31,36 28,24" className="fill-primary/45 stroke-primary/80" />
        </svg>
      </div>
    );
  }

  if (id === "gauge") {
    return (
      <div className={common}>
        <svg viewBox="0 0 80 60" className="h-full w-full">
          <path d="M12 44a28 28 0 0 1 56 0" className="fill-none stroke-primary/35" strokeWidth="6" />
          <path d="M12 44a28 28 0 0 1 40-24" className="fill-none stroke-primary/80" strokeWidth="6" />
          <line x1="40" y1="44" x2="54" y2="28" className="stroke-primary" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  if (id === "funnel") {
    return (
      <div className={common}>
        <svg viewBox="0 0 80 60" className="h-full w-full">
          <polygon points="10,10 70,10 58,22 22,22" className="fill-primary/80" />
          <polygon points="22,24 58,24 50,34 30,34" className="fill-primary/65" />
          <polygon points="30,36 50,36 44,44 36,44" className="fill-primary/50" />
        </svg>
      </div>
    );
  }

  if (id === "text") {
    return (
      <div className={common}>
        <div className="space-y-1.5 px-2 py-2">
          <div className="h-2 w-10 rounded bg-primary/70" />
          <div className="h-1.5 w-full rounded bg-muted-foreground/45" />
          <div className="h-1.5 w-11/12 rounded bg-muted-foreground/45" />
          <div className="h-1.5 w-8/12 rounded bg-muted-foreground/45" />
        </div>
      </div>
    );
  }

  if (id === "table") {
    return (
      <div className={common}>
        <div className="absolute inset-0 flex flex-col gap-1 p-2">
          <div className="grid h-3 flex-none grid-cols-3 gap-1">
            <div className="rounded-sm bg-primary/75" />
            <div className="rounded-sm bg-primary/65" />
            <div className="rounded-sm bg-primary/70" />
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-3 gap-1">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-sm border border-primary/25 bg-primary/10"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (id === "rect") {
    return (
      <div className={common}>
        <div className="absolute inset-2 rounded-md border-2 border-primary/80 bg-primary/15" />
      </div>
    );
  }

  if (id === "geometry") {
    return (
      <div className={common}>
        <svg viewBox="0 0 80 60" className="h-full w-full">
          <circle cx="22" cy="18" r="8" className="fill-primary/75" />
          <rect x="36" y="10" width="16" height="16" rx="3" className="fill-primary/55" />
          <polygon points="62,10 70,26 54,26" className="fill-primary/65" />
          <polygon points="24,36 34,42 24,48 14,42" className="fill-primary/50" />
          <polygon points="50,36 54,42 50,48 42,48 38,42 42,36" className="fill-primary/70" />
        </svg>
      </div>
    );
  }

  if (id === "scene3d") {
    return (
      <div className={common}>
        <svg viewBox="0 0 80 60" className="h-full w-full">
          <polygon points="40,8 62,22 62,44 40,56 18,44 18,22" className="fill-primary/20 stroke-primary/80" strokeWidth="1.5" />
          <polygon points="40,8 62,22 40,32 18,22" className="fill-primary/45" />
          <polygon points="40,32 62,22 62,44 40,56" className="fill-primary/30" />
          <polygon points="40,32 18,22 18,44 40,56" className="fill-primary/55" />
        </svg>
      </div>
    );
  }

  if (id === "reference") {
    return (
      <div className={common}>
        <div className="absolute inset-2 rounded-md border border-dashed border-primary/70 bg-primary/10" />
        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-primary/80">
          {t("panel.material.reference")}
        </div>
      </div>
    );
  }

  if (id === "image") {
    return (
      <div className={common}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-muted/60 to-card" />
        <svg viewBox="0 0 80 60" className="absolute inset-0 h-full w-full">
          <circle cx="16" cy="14" r="5" className="fill-primary/70" />
          <polygon points="0,60 24,34 38,50 52,30 80,60" className="fill-primary/35" />
          <polygon points="0,60 18,42 30,54 44,36 62,60" className="fill-primary/55" />
        </svg>
      </div>
    );
  }

  if (id === "video") {
    return (
      <div className={common}>
        <div className="absolute inset-0 bg-primary/12" />
        <div className="absolute left-2 right-2 top-2 h-1.5 rounded bg-primary/35" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-background/80 p-1">
            <div className="h-0 w-0 border-b-[7px] border-l-[11px] border-t-[7px] border-b-transparent border-l-primary/85 border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  if (id === "audio") {
    return (
      <div className={common}>
        <div className="absolute inset-0 flex items-center justify-center gap-1">
          <div className="h-3 w-1.5 rounded bg-primary/50" />
          <div className="h-6 w-1.5 rounded bg-primary/75" />
          <div className="h-8 w-1.5 rounded bg-primary/90" />
          <div className="h-5 w-1.5 rounded bg-primary/70" />
          <div className="h-4 w-1.5 rounded bg-primary/55" />
        </div>
      </div>
    );
  }
  if (id === "grid") {
    return (
      <div className={common}>
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1.5 p-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="rounded-sm border border-dashed border-primary/55 bg-primary/10" />
          ))}
        </div>
      </div>
    );
  }
  if (id === "viewport") {
    return (
      <div className={common}>
        <div className="absolute inset-1.5 overflow-hidden rounded-sm border border-primary/70 bg-primary/10">
          <div className="absolute left-1 top-1 h-6 w-8 rounded-[2px] bg-primary/45" />
          <div className="absolute left-6 top-4 h-7 w-10 rounded-[2px] bg-primary/30" />
          <div className="absolute bottom-0 right-0 h-1.5 w-6 rounded-tl bg-primary/55" />
          <div className="absolute bottom-0 right-0 top-2 w-1.5 rounded-l bg-primary/40" />
        </div>
      </div>
    );
  }

  return <div className={common} />;
}

function getDefaultCategories(t: (key: string) => string): MaterialCategory[] {
  return [
    {
      id: "charts",
      title: t("panel.material.charts"),
      items: [
        { id: "bar", title: t("panel.material.bar") },
        { id: "line", title: t("panel.material.line") },
        { id: "pie", title: t("panel.material.pie") },
        { id: "area", title: t("panel.material.area") },
        { id: "scatter", title: t("panel.material.scatter") },
        { id: "radar", title: t("panel.material.radar") },
        { id: "gauge", title: t("panel.material.gauge") },
        { id: "funnel", title: t("panel.material.funnel") },
      ],
    },
    {
      id: "basic",
      title: t("panel.material.basic"),
      items: [
        { id: "text", title: t("panel.material.text") },
        { id: "table", title: t("panel.material.table") },
        { id: "geometry", title: t("panel.material.geometry") },
        { id: "scene3d", title: t("panel.material.scene3d") },
        { id: "grid", title: t("panel.material.grid") },
        { id: "viewport", title: t("panel.material.viewport") },
        { id: "image", title: t("panel.material.image") },
        { id: "reference", title: t("panel.material.reference") },
      ],
    },
    {
      id: "media",
      title: t("panel.material.media"),
      items: [
        { id: "video", title: t("panel.material.video") },
        { id: "audio", title: t("panel.material.audio") },
      ],
    },
  ];
}

export type MaterialSidebarProps = {
  className?: string;
  onDragMaterialStart?: (material: MaterialItem) => void;
  layers?: PanelLayer[];
  allElements?: PanelElement[];
  selectedIds?: string[];
  onSelectNode?: (nodeId: string, layerId: string) => void;
  onNodeContextMenu?: (payload: { nodeId: string; layerId: string; x: number; y: number }) => void;
  onDeleteNode?: (nodeId: string) => void;
  onCopyNode?: (nodeId: string, mode?: ReferenceCopyMode) => void;
  onMoveNodeToLayer?: (nodeId: string, targetLayerId: string) => void;
};

export function MaterialSidebar({
  className,
  onDragMaterialStart,
  layers = [],
  allElements = [],
  selectedIds = [],
  onSelectNode,
  onNodeContextMenu,
  onDeleteNode,
  onCopyNode,
  onMoveNodeToLayer,
}: MaterialSidebarProps) {
  const { t } = useI18n();
  const messages = useMemo(() => getPanelMessages(t), [t]);
  const materialLabels = useMemo(() => getMaterialLabelMap(t), [t]);

  const categories = useMemo(() => getDefaultCategories(t), [t]);
  const [leftTab, setLeftTab] = useState<"materials" | "tree">("materials");
  const [activeCategoryId, setActiveCategoryId] =
    useState<MaterialCategoryId>("charts");
  const [keyword, setKeyword] = useState("");
  const [treeKeyword, setTreeKeyword] = useState("");
  const [referenceOnlyTree, setReferenceOnlyTree] = useState(false);
  const [draggingTreeNodeId, setDraggingTreeNodeId] = useState<string | null>(null);
  const [dragOverLayerId, setDragOverLayerId] = useState<string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({
    root: true,
  });

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeCategoryId) ?? categories[0],
    [activeCategoryId, categories]
  );
  const normalizedKeyword = keyword.trim().toLowerCase();
  const isSearching = normalizedKeyword.length > 0;
  const normalizedTreeKeyword = treeKeyword.trim().toLowerCase();
  const isTreeSearching = normalizedTreeKeyword.length > 0;

  const matchedItems = useMemo(() => {
    if (!isSearching) return [];
    const result: Array<MaterialItem & { categoryTitle: string }> = [];
    categories.forEach((category) => {
      category.items.forEach((item) => {
        const haystack = `${item.title} ${item.id} ${category.title}`.toLowerCase();
        if (haystack.includes(normalizedKeyword)) {
          result.push({ ...item, categoryTitle: category.title });
        }
      });
    });
    return result;
  }, [categories, isSearching, normalizedKeyword]);

  const themedScrollbarClass =
    "scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/80 [&::-webkit-scrollbar-thumb]:hover:bg-border";

  const elementsByLayer = useMemo(() => {
    const map = new Map<string, PanelElement[]>();
    for (const layer of layers) map.set(layer.id, []);
    for (const el of allElements) {
      const list = map.get(el.layerId) ?? [];
      list.push(el);
      map.set(el.layerId, list);
    }
    return map;
  }, [allElements, layers]);
  const elementsById = useMemo(() => {
    const map = new Map<string, PanelElement>();
    for (const el of allElements) map.set(el.id, el);
    return map;
  }, [allElements]);
  const layerById = useMemo(() => {
    const map = new Map<string, PanelLayer>();
    for (const layer of layers) map.set(layer.id, layer);
    return map;
  }, [layers]);

  /**
   * 节点树展示用的「本图层父网格 id」：
   * parentGridId 若指向其它图层的同源克隆网格，仍解析到当前图层上对应的网格，层级与映射同步语义一致。
   */
  const effectiveGridParentByElementId = useMemo(() => {
    const byId = new Map<string, PanelElement>();
    for (const el of allElements) byId.set(el.id, el);
    const map = new Map<string, string | undefined>();
    for (const el of allElements) {
      const pg = el.parentGridId;
      if (!pg) {
        map.set(el.id, undefined);
        continue;
      }
      const parent = byId.get(pg);
      if (parent?.layerId === el.layerId && parent.materialType === "grid") {
        map.set(el.id, pg);
        continue;
      }
      const logical = logicalGridParentIdFromConcrete(pg, byId);
      if (logical !== undefined) {
        const concrete = concreteGridParentIdForLayer(logical, el.layerId, allElements);
        map.set(el.id, concrete ?? undefined);
        continue;
      }
      map.set(el.id, undefined);
    }
    return map;
  }, [allElements]);

  /** 网格 → 直接子节点（槽位顺序），键为展示用有效父网格 id */
  const childrenByGridByLayer = useMemo(() => {
    const outer = new Map<string, Map<string, PanelElement[]>>();
    for (const el of allElements) {
      const gridParentId = effectiveGridParentByElementId.get(el.id);
      if (!gridParentId) continue;
      let inner = outer.get(el.layerId);
      if (!inner) {
        inner = new Map();
        outer.set(el.layerId, inner);
      }
      const list = inner.get(gridParentId) ?? [];
      list.push(el);
      inner.set(gridParentId, list);
    }
    return outer;
  }, [allElements, effectiveGridParentByElementId]);

  const getNodeDisplayName = (node: PanelElement) => {
    const customName = node.name?.trim();
    return customName || node.chart?.title || materialLabels[node.materialType ?? ""] || node.id;
  };

  const isExpanded = (key: string, defaultValue = false) =>
    expandedKeys[key] ?? defaultValue;

  const setExpanded = (key: string, next: boolean) => {
    setExpandedKeys((prev) => ({ ...prev, [key]: next }));
  };

  const getNodeChildren = (node: PanelElement, sourceOverride?: PanelElement[]) => {
    const isRef = node.materialType === "reference" || node.materialType === "viewport";
    const isGrid = node.materialType === "grid";
    const gridChildren = isGrid
      ? [...(childrenByGridByLayer.get(node.layerId)?.get(node.id) ?? [])].sort(
          compareGridTreeChildOrder
        )
      : [];
    return isRef
      ? node.refCopyMode === "deep"
        ? node.refSnapshot ?? sourceOverride ?? []
        : node.refLayerId
          ? elementsByLayer.get(node.refLayerId) ?? []
          : []
      : gridChildren;
  };

  const nodeMatchesTreeSearch = (
    node: PanelElement,
    visited: Set<string>,
    sourceOverride?: PanelElement[]
  ): boolean => {
    if (!isTreeSearching) return true;
    const selfText = `${getNodeDisplayName(node)} ${node.materialType ?? ""} ${node.id}`.toLowerCase();
    if (selfText.includes(normalizedTreeKeyword)) return true;
    if (visited.has(node.id)) return false;
    const nextVisited = new Set(visited);
    nextVisited.add(node.id);
    const children = getNodeChildren(node, sourceOverride);
    return children.some((child) =>
      nodeMatchesTreeSearch(child, nextVisited, node.refSnapshot)
    );
  };

  const renderTreeNode = (
    node: PanelElement,
    level: number,
    path: string,
    visited: Set<string>,
    sourceOverride?: PanelElement[]
  ) => {
    const selected = selectedIds.includes(node.id);
    if (!nodeMatchesTreeSearch(node, visited, sourceOverride)) return null;
    const isRef = node.materialType === "reference" || node.materialType === "viewport";
    const refMode = node.refCopyMode ?? "shallow";
    const isDeepRef = isRef && refMode === "deep";
    const children = getNodeChildren(node, sourceOverride);
    const nodeHomeLayer = layerById.get(node.layerId);
    const hasChildren = children.length > 0;
    const nextVisited = new Set(visited);
    nextVisited.add(node.id);
    const nodeKey = `node:${path}`;
    return (
      <Collapsible
        key={nodeKey}
        open={isExpanded(nodeKey, true)}
        onOpenChange={(open) => setExpanded(nodeKey, open)}
      >
        <div
          className={[
            "mb-1 flex items-center gap-1 rounded py-1",
            selected ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-accent/60",
          ].join(" ")}
          style={{ paddingLeft: 6 + level * 14, paddingRight: 6 }}
        >
          {hasChildren ? (
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded text-sm hover:bg-accent"
              >
                {isExpanded(nodeKey, true) ? "▾" : "▸"}
              </button>
            </CollapsibleTrigger>
          ) : (
            <span className="inline-flex h-7 w-7 items-center justify-center text-sm opacity-40">•</span>
          )}
          <button
            type="button"
            className="min-w-0 flex-1 truncate text-left"
            onClick={() => onSelectNode?.(node.id, node.layerId)}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onNodeContextMenu?.({
                nodeId: node.id,
                layerId: node.layerId,
                x: e.clientX,
                y: e.clientY,
              });
            }}
            title={getNodeDisplayName(node)}
            draggable={!node.locked}
            onDragStart={(e) => {
              e.stopPropagation();
              if (node.locked) {
                e.preventDefault();
                return;
              }
              setDraggingTreeNodeId(node.id);
              e.dataTransfer.setData(
                "application/x-arronqzy-tree-node",
                JSON.stringify({ nodeId: node.id, sourceLayerId: node.layerId })
              );
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => {
              setDraggingTreeNodeId(null);
              setDragOverLayerId(null);
            }}
          >
            {getNodeDisplayName(node)}
          </button>
          {nodeHomeLayer?.isMapping ? (
            <span
              className="inline-flex shrink-0 items-center rounded-md border-2 border-violet-600 bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-violet-950 shadow-sm dark:border-violet-400 dark:bg-violet-500/35 dark:text-violet-50 dark:shadow-[0_0_14px_-3px_rgba(167,139,250,0.65)]"
              title={
                nodeHomeLayer.mappingBaseLayerId
                  ? t("panel.material.mappingLayerWithBase", {
                      name: nodeHomeLayer.name,
                      base:
                        layerById.get(nodeHomeLayer.mappingBaseLayerId)?.name ??
                        nodeHomeLayer.mappingBaseLayerId,
                    })
                  : t("panel.material.mappingLayerTitle", { name: nodeHomeLayer.name })
              }
            >
              {t("panel.material.mappingLayerNode")}
            </span>
          ) : null}
          {node.mappingSourceNodeId ? (
            <span
              className="inline-flex shrink-0 items-center rounded border border-primary/40 bg-primary/10 px-1 text-[10px] text-primary"
              title={t("panel.material.sameSourceTitle", {
                id: `${node.mappingSourceNodeId}${
                  node.mappingSourceLayerId
                    ? ` · ${layerById.get(node.mappingSourceLayerId)?.name ?? node.mappingSourceLayerId}`
                    : ""
                }`,
              })}
            >
              {t("panel.material.sameSource")}
            </span>
          ) : null}
          {node.locked ? (
            <span
              className="inline-flex h-5 w-5 items-center justify-center rounded border border-border/80 bg-background/80 text-muted-foreground"
              title={t("panel.material.nodeLocked")}
            >
              <LockGlyph />
            </span>
          ) : null}
          {isRef ? (
            <>
              <span
                className={[
                  "rounded border px-1 text-[10px]",
                  isDeepRef
                    ? "border-violet-500/50 bg-violet-500/15 text-violet-300"
                    : "border-sky-500/40 bg-sky-500/10 text-sky-300",
                ].join(" ")}
                title={isDeepRef ? t("panel.material.deepCopyTitle") : t("panel.material.shallowCopyTitle")}
              >
                {isDeepRef ? t("panel.material.deepCopy") : t("panel.material.shallowCopy")}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-5 w-5 items-center justify-center rounded border border-border hover:bg-accent"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopyNode?.(node.id, "shallow");
                    }}
                    aria-label={t("panel.material.shallowCopy")}
                  >
                    <IconShallowCopy />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{t("panel.material.shallowCopy")}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-5 w-5 items-center justify-center rounded border border-border hover:bg-accent"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopyNode?.(node.id, "deep");
                    }}
                    aria-label={t("panel.material.deepCopy")}
                  >
                    <IconDeepCopy />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{t("panel.material.deepCopy")}</TooltipContent>
              </Tooltip>
            </>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-5 w-5 items-center justify-center rounded border border-border hover:bg-accent"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyNode?.(node.id);
                  }}
                  aria-label={t("panel.material.duplicateNode")}
                >
                  <IconCopy />
                </button>
              </TooltipTrigger>
              <TooltipContent>{t("panel.material.duplicateNode")}</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                disabled={node.locked}
                className="inline-flex h-5 w-5 items-center justify-center rounded border border-border hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                onClick={(e) => {
                  e.stopPropagation();
                  if (node.locked) return;
                  onDeleteNode?.(node.id);
                }}
                aria-label={node.locked ? t("panel.material.lockedNodeCannotDelete") : t("panel.material.deleteNode")}
              >
                <IconDelete />
              </button>
            </TooltipTrigger>
            <TooltipContent>{node.locked ? t("panel.material.lockedNodeCannotDelete") : t("panel.material.deleteNode")}</TooltipContent>
          </Tooltip>
        </div>
        {hasChildren ? (
          <CollapsibleContent>
            {children.map((child) => {
              const childPath = `${path}->${child.id}`;
              if (nextVisited.has(child.id)) {
                return (
                  <div
                    key={`cycle:${childPath}`}
                    className="py-1 text-[10px] text-muted-foreground/80"
                    style={{ paddingLeft: 6 + (level + 1) * 14 }}
                    title={t("panel.material.circularRefStopped")}
                  >
                    {getNodeDisplayName(child)}
                    {t("panel.material.circularRefSuffix")}
                  </div>
                );
              }
              return renderTreeNode(child, level + 1, childPath, nextVisited, node.refSnapshot);
            })}
          </CollapsibleContent>
        ) : null}
      </Collapsible>
    );
  };

  const hasRefInSubtree = (node: PanelElement, visited: Set<string>): boolean => {
    if (node.materialType === "reference" || node.materialType === "viewport") return true;
    if (visited.has(node.id)) return false;
    const nextVisited = new Set(visited);
    nextVisited.add(node.id);
    const children = getNodeChildren(node);
    return children.some((child) => hasRefInSubtree(child, nextVisited));
  };

  return (
    <TooltipProvider delayDuration={120}>
    <aside
      className={[
        "grid h-full w-full border-r border-border bg-muted/30 text-foreground",
        className ?? "",
      ].join(" ")}
      style={{ gridTemplateRows: "auto 1fr" }}
    >
      <div className="border-b border-border bg-background/80 px-3 py-2 backdrop-blur-sm">
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={t("panel.material.searchPlaceholder")}
          className="h-8 text-xs"
        />
      </div>

      <Tabs
        value={leftTab}
        onValueChange={(v) => setLeftTab(v as "materials" | "tree")}
        className="flex min-h-0 h-full flex-col"
      >
        <div className="border-b border-border px-2 pb-2 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="materials">{t("panel.material.tabMaterials")}</TabsTrigger>
            <TabsTrigger value="tree">{t("panel.material.tabTree")}</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="materials" className="mt-0 min-h-0 flex-1 overflow-hidden">
          <div className="grid h-full min-h-0 grid-cols-[110px_1fr]">
            <div className={`overflow-auto border-r border-border ${themedScrollbarClass}`}>
              {categories.map((c) => {
                const active = c.id === activeCategoryId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveCategoryId(c.id)}
                    className={[
                      "w-full cursor-pointer border-b border-border/40 px-2.5 py-2.5 text-left text-xs",
                      active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground",
                    ].join(" ")}
                  >
                    {c.title}
                  </button>
                );
              })}
            </div>

            <div className={`overflow-auto ${themedScrollbarClass}`}>
              <div className="px-2.5 py-2.5 text-xs font-semibold">
                {isSearching
                  ? t("panel.material.searchResults", { count: matchedItems.length })
                  : activeCategory.title}
              </div>
              <div className="grid gap-2 px-2.5 pb-3">
                {(isSearching ? matchedItems : activeCategory.items).map((it) => (
                  <button
                    key={isSearching ? `${it.id}-${(it as any).categoryTitle}` : it.id}
                    type="button"
                    draggable
                    className="cursor-pointer rounded-xl border border-border bg-card px-2 py-2 text-left text-xs text-card-foreground hover:bg-accent/60"
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        "application/x-arronqzy-material",
                        JSON.stringify({ id: it.id, title: it.title })
                      );
                      e.dataTransfer.effectAllowed = "copy";
                      onDragMaterialStart?.(it);
                    }}
                  >
                    <div className="flex flex-col items-stretch gap-2">
                      <MaterialPreview id={it.id} />
                      <div className="min-w-0">
                        <div className="truncate">{it.title}</div>
                        {isSearching ? (
                          <div className="mt-1 text-[11px] text-muted-foreground">
                            {(it as any).categoryTitle}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </button>
                ))}
                {isSearching && matchedItems.length === 0 ? (
                  <Empty className="py-5">
                    <EmptyIcon className="h-8 w-8">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                      >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                      </svg>
                    </EmptyIcon>
                    <EmptyTitle className="text-xs">{t("panel.material.emptyMaterialsTitle")}</EmptyTitle>
                    <EmptyDescription className="text-[11px]">
                      {t("panel.material.emptyMaterialsDesc")}
                    </EmptyDescription>
                  </Empty>
                ) : null}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="tree" className="mt-0 min-h-0 flex-1 overflow-hidden">
          <div className={`h-full overflow-auto px-2 py-2 text-xs ${themedScrollbarClass}`}>
            <div className="mb-2">
              <Input
                value={treeKeyword}
                onChange={(e) => setTreeKeyword(e.target.value)}
                placeholder={t("panel.material.treeSearchPlaceholder")}
                className="h-8 text-xs"
              />
            </div>
            <div className="mb-2 flex items-center justify-between rounded border border-border bg-card px-2 py-1.5">
              <span className="text-[11px] text-muted-foreground">{t("panel.material.referenceOnlyTree")}</span>
              <Switch
                checked={referenceOnlyTree}
                onCheckedChange={setReferenceOnlyTree}
                aria-label={t("panel.material.referenceOnlyTree")}
              />
            </div>
            <Collapsible
              open={isExpanded("root", true)}
              onOpenChange={(open) => setExpanded("root", open)}
              className="rounded border border-border bg-card"
            >
              <div className="flex items-center gap-1 px-2 py-1.5 font-medium">
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded text-sm hover:bg-accent"
                  >
                    {isExpanded("root", true) ? "▾" : "▸"}
                  </button>
                </CollapsibleTrigger>
                <span>root</span>
              </div>
              <CollapsibleContent className="space-y-1 border-t border-border/60 py-1">
                {layers.map((layer) => {
                  const layerNodes = elementsByLayer.get(layer.id) ?? [];
                  const draggingNode = draggingTreeNodeId ? elementsById.get(draggingTreeNodeId) ?? null : null;
                  const draggingSourceLayer = draggingNode
                    ? (layerById.get(draggingNode.layerId) ?? null)
                    : null;
                  const dropBlockReason = !draggingNode
                    ? ""
                    : draggingNode.locked
                      ? messages.nodeMoveLocked
                      : draggingSourceLayer?.locked
                        ? messages.nodeMoveSourceLayerLocked
                        : layer.locked
                          ? messages.nodeMoveTargetLayerLocked
                          : draggingNode.layerId === layer.id
                            ? messages.nodeMoveSameLayer
                            : "";
                  const canDropIntoLayer = Boolean(draggingNode) && !dropBlockReason;
                  const isCurrentDropLayer = dragOverLayerId === layer.id;
                  const rootNodes = layerNodes
                    .filter((node) => !effectiveGridParentByElementId.get(node.id))
                    .filter((node) => !referenceOnlyTree || hasRefInSubtree(node, new Set<string>()))
                    .filter((node) => nodeMatchesTreeSearch(node, new Set<string>()));
                  if (isTreeSearching && rootNodes.length === 0) return null;
                  const layerKey = `layer:${layer.id}`;
                  return (
                    <Collapsible
                      key={layer.id}
                      open={isExpanded(layerKey, true)}
                      onOpenChange={(open) => setExpanded(layerKey, open)}
                    >
                      <Card
                        className={[
                          "mb-2 overflow-hidden transition-shadow",
                          layer.isMapping
                            ? "border-2 border-violet-500/70 bg-gradient-to-br from-violet-500/14 via-violet-600/10 to-fuchsia-500/12 shadow-[inset_0_1px_0_0_rgba(139,92,246,0.22)] dark:border-violet-400/65 dark:from-violet-500/20 dark:via-violet-950/35 dark:to-fuchsia-950/25 dark:shadow-[inset_0_0_0_1px_rgba(167,139,250,0.12),0_0_20px_-8px_rgba(139,92,246,0.35)]"
                            : "",
                          isCurrentDropLayer
                            ? canDropIntoLayer
                              ? "ring-2 ring-primary/45 ring-offset-2 ring-offset-background"
                              : "ring-2 ring-destructive/45 ring-offset-2 ring-offset-background"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <CardHeader className="flex flex-row flex-wrap items-center gap-1 space-y-0 p-2.5 pb-1.5">
                          {isCurrentDropLayer ? (
                            <span
                              className={[
                                "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px]",
                                canDropIntoLayer
                                  ? "bg-primary/15 text-primary"
                                  : "bg-destructive/15 text-destructive",
                              ].join(" ")}
                              title={canDropIntoLayer ? t("panel.material.targetLayer") : dropBlockReason}
                            >
                              ➜
                            </span>
                          ) : null}
                          <CollapsibleTrigger asChild>
                            <button
                              type="button"
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-sm text-muted-foreground hover:bg-accent"
                            >
                              {isExpanded(layerKey, true) ? "▾" : "▸"}
                            </button>
                          </CollapsibleTrigger>
                          <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
                            {layer.name}
                            <span className="font-normal text-muted-foreground">
                              （{rootNodes.length}）
                            </span>
                          </span>
                          {layer.isMapping ? (
                            <span
                              className="shrink-0 rounded-md border-2 border-violet-600 bg-violet-500/22 px-1.5 py-0.5 text-[10px] font-semibold text-violet-950 shadow-sm dark:border-violet-400 dark:bg-violet-500/35 dark:text-violet-50 dark:shadow-[0_0_12px_-2px_rgba(167,139,250,0.55)]"
                              title={
                                layer.mappingBaseLayerId
                                  ? t("panel.material.mappingLayerWithBaseShort", {
                                      base:
                                        layerById.get(layer.mappingBaseLayerId)?.name ??
                                        layer.mappingBaseLayerId,
                                    })
                                  : t("panel.material.mappingLayer")
                              }
                            >
                              {t("panel.material.mappingLayer")}
                            </span>
                          ) : null}
                          {isCurrentDropLayer ? (
                            <span
                              className={[
                                "ml-auto shrink-0 rounded px-1.5 py-0.5 text-[10px]",
                                canDropIntoLayer
                                  ? "bg-primary/15 text-primary"
                                  : "bg-destructive/15 text-destructive",
                              ].join(" ")}
                            >
                              {canDropIntoLayer ? t("panel.material.willMoveToLayer") : dropBlockReason}
                            </span>
                          ) : null}
                        </CardHeader>
                        <CardContent className="space-y-1.5 p-2.5 pt-0">
                          <div
                            className={[
                              "rounded-md border border-dashed px-2 py-1.5 text-[10px] transition-colors",
                              isCurrentDropLayer
                                ? canDropIntoLayer
                                  ? "border-primary/50 bg-primary/10 text-primary"
                                  : "border-destructive/50 bg-destructive/10 text-destructive"
                                : "border-border/50 bg-muted/20 text-muted-foreground hover:border-border hover:bg-muted/35",
                            ].join(" ")}
                            onDragOver={(e) => {
                              const hasNodeData =
                                e.dataTransfer.types.includes("application/x-arronqzy-tree-node");
                              if (!hasNodeData) return;
                              if (canDropIntoLayer) {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = "move";
                              } else {
                                e.dataTransfer.dropEffect = "none";
                              }
                              if (dragOverLayerId !== layer.id) setDragOverLayerId(layer.id);
                            }}
                            onDragLeave={() => {
                              if (dragOverLayerId === layer.id) setDragOverLayerId(null);
                            }}
                            onDrop={(e) => {
                              const payload = e.dataTransfer.getData("application/x-arronqzy-tree-node");
                              if (!payload) return;
                              e.preventDefault();
                              try {
                                const data = JSON.parse(payload) as {
                                  nodeId?: string;
                                  sourceLayerId?: string;
                                };
                                if (!data.nodeId || !layer.id) return;
                                if (!canDropIntoLayer) return;
                                if (data.sourceLayerId === layer.id) return;
                                onMoveNodeToLayer?.(data.nodeId, layer.id);
                              } catch {
                                // ignore invalid payload
                              } finally {
                                setDraggingTreeNodeId(null);
                                setDragOverLayerId(null);
                              }
                            }}
                            title={t("panel.material.dragToThisLayer")}
                          >
                            {draggingTreeNodeId
                              ? canDropIntoLayer
                                ? t("panel.material.releaseToMove")
                                : dropBlockReason || t("panel.material.cannotMoveToLayer")
                              : t("panel.material.dragToLayer")}
                          </div>
                          <CollapsibleContent>
                            {rootNodes.length === 0 ? (
                              <div className="rounded border border-border/40 bg-muted/15 py-2 pl-3 text-[11px] text-muted-foreground">
                                {t("panel.material.emptyLayer")}
                              </div>
                            ) : (
                              rootNodes.map((node) =>
                                renderTreeNode(node, 2, `${layer.id}/${node.id}`, new Set<string>())
                              )
                            )}
                          </CollapsibleContent>
                        </CardContent>
                      </Card>
                    </Collapsible>
                  );
                })}
                {isTreeSearching &&
                layers.every((layer) => {
                  const layerNodes = elementsByLayer.get(layer.id) ?? [];
                  const rootNodes = layerNodes
                    .filter((node) => !effectiveGridParentByElementId.get(node.id))
                    .filter((node) => !referenceOnlyTree || hasRefInSubtree(node, new Set<string>()))
                    .filter((node) => nodeMatchesTreeSearch(node, new Set<string>()));
                  return rootNodes.length === 0;
                }) ? (
                  <div className="mx-2 my-2">
                    <Empty className="py-5">
                      <EmptyIcon className="h-8 w-8">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          aria-hidden="true"
                        >
                          <rect x="4" y="4" width="16" height="16" rx="2.5" />
                          <path d="M8 10h8M8 14h5" />
                        </svg>
                      </EmptyIcon>
                      <EmptyTitle className="text-xs">{t("panel.material.emptyNodesTitle")}</EmptyTitle>
                      <EmptyDescription className="text-[11px]">
                        {t("panel.material.emptyNodesDesc")}
                      </EmptyDescription>
                    </Empty>
                  </div>
                ) : null}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
    </TooltipProvider>
  );
}

