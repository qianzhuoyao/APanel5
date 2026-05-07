import React, { useMemo, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Input,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@arron/ui";
import type { PanelElement, ReferenceCopyMode } from "../types";
import type { PanelLayer } from "../hooks/usePanelElements";

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

const MATERIAL_LABEL_MAP: Record<string, string> = {
  bar: "柱状图",
  line: "折线图",
  pie: "饼图",
  area: "面积图",
  scatter: "散点图",
  radar: "雷达图",
  gauge: "仪表盘",
  funnel: "漏斗图",
  text: "文本",
  rect: "矩形",
  image: "图片",
  video: "视频",
  audio: "音频",
  reference: "引用组件",
};

function MaterialPreview({ id }: { id: string }) {
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

  if (id === "rect") {
    return (
      <div className={common}>
        <div className="absolute inset-2 rounded-md border-2 border-primary/80 bg-primary/15" />
      </div>
    );
  }

  if (id === "reference") {
    return (
      <div className={common}>
        <div className="absolute inset-2 rounded-md border border-dashed border-primary/70 bg-primary/10" />
        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-primary/80">
          引用组件
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

  return <div className={common} />;
}

const defaultCategories: MaterialCategory[] = [
  {
    id: "charts",
    title: "图表",
    items: [
      { id: "bar", title: "柱状图" },
      { id: "line", title: "折线图" },
      { id: "pie", title: "饼图" },
      { id: "area", title: "面积图" },
      { id: "scatter", title: "散点图" },
      { id: "radar", title: "雷达图" },
      { id: "gauge", title: "仪表盘" },
      { id: "funnel", title: "漏斗图" },
    ],
  },
  {
    id: "basic",
    title: "基础",
    items: [
      { id: "text", title: "文本" },
      { id: "rect", title: "矩形" },
      { id: "image", title: "图片" },
      { id: "reference", title: "引用组件" },
    ],
  },
  {
    id: "media",
    title: "媒体",
    items: [
      { id: "video", title: "视频" },
      { id: "audio", title: "音频" },
    ],
  },
];

export type MaterialSidebarProps = {
  className?: string;
  onDragMaterialStart?: (material: MaterialItem) => void;
  layers?: PanelLayer[];
  allElements?: PanelElement[];
  selectedIds?: string[];
  onSelectNode?: (nodeId: string, layerId: string) => void;
  onDeleteNode?: (nodeId: string) => void;
  onCopyNode?: (nodeId: string, mode?: ReferenceCopyMode) => void;
};

export function MaterialSidebar({
  className,
  onDragMaterialStart,
  layers = [],
  allElements = [],
  selectedIds = [],
  onSelectNode,
  onDeleteNode,
  onCopyNode,
}: MaterialSidebarProps) {
  const categories = useMemo(() => defaultCategories, []);
  const [leftTab, setLeftTab] = useState<"materials" | "tree">("materials");
  const [activeCategoryId, setActiveCategoryId] =
    useState<MaterialCategoryId>("charts");
  const [keyword, setKeyword] = useState("");
  const [referenceOnlyTree, setReferenceOnlyTree] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({
    root: true,
  });

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeCategoryId) ?? categories[0],
    [activeCategoryId, categories]
  );
  const normalizedKeyword = keyword.trim().toLowerCase();
  const isSearching = normalizedKeyword.length > 0;

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

  const getNodeDisplayName = (node: PanelElement) => {
    const base = node.chart?.title || MATERIAL_LABEL_MAP[node.materialType ?? ""] || node.id;
    if (node.materialType !== "reference") return base;
    const modeLabel = (node.refCopyMode ?? "shallow") === "deep" ? "深" : "浅";
    return `${base}[${modeLabel}]`;
  };

  const isExpanded = (key: string, defaultValue = false) =>
    expandedKeys[key] ?? defaultValue;

  const setExpanded = (key: string, next: boolean) => {
    setExpandedKeys((prev) => ({ ...prev, [key]: next }));
  };

  const renderTreeNode = (
    node: PanelElement,
    level: number,
    path: string,
    visited: Set<string>,
    sourceOverride?: PanelElement[]
  ) => {
    const selected = selectedIds.includes(node.id);
    const isRef = node.materialType === "reference";
    const children = isRef
      ? node.refCopyMode === "deep"
        ? node.refSnapshot ?? sourceOverride ?? []
        : node.refLayerId
          ? elementsByLayer.get(node.refLayerId) ?? []
          : []
      : [];
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
            title={getNodeDisplayName(node)}
          >
            {getNodeDisplayName(node)}
          </button>
          {isRef ? (
            <>
              <button
                type="button"
                className="rounded border border-border px-1 text-[10px] hover:bg-accent"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyNode?.(node.id, "shallow");
                }}
              >
                浅拷
              </button>
              <button
                type="button"
                className="rounded border border-border px-1 text-[10px] hover:bg-accent"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyNode?.(node.id, "deep");
                }}
              >
                深拷
              </button>
            </>
          ) : (
            <button
              type="button"
              className="rounded border border-border px-1 text-[10px] hover:bg-accent"
              onClick={(e) => {
                e.stopPropagation();
                onCopyNode?.(node.id);
              }}
            >
              复制
            </button>
          )}
          <button
            type="button"
            className="rounded border border-border px-1 text-[10px] hover:bg-accent"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNode?.(node.id);
            }}
          >
            删除
          </button>
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
                    title="检测到循环引用，已停止向下展开"
                  >
                    {getNodeDisplayName(child)}（循环引用）
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
    if (node.materialType === "reference") return true;
    if (node.materialType !== "reference") return false;
    if (visited.has(node.id)) return false;
    const nextVisited = new Set(visited);
    nextVisited.add(node.id);
    const children =
      node.refCopyMode === "deep"
        ? node.refSnapshot ?? []
        : node.refLayerId
          ? elementsByLayer.get(node.refLayerId) ?? []
          : [];
    return children.some((child) => hasRefInSubtree(child, nextVisited));
  };

  return (
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
          placeholder="搜索物料（名称 / 分类）"
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
            <TabsTrigger value="materials">物料</TabsTrigger>
            <TabsTrigger value="tree">节点树</TabsTrigger>
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
                {isSearching ? `搜索结果（${matchedItems.length}）` : activeCategory.title}
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
                        "application/x-arron-material",
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
                  <div className="rounded-lg border border-dashed border-border px-2.5 py-3 text-xs text-muted-foreground">
                    没有匹配到物料
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="tree" className="mt-0 min-h-0 flex-1 overflow-hidden">
          <div className={`h-full overflow-auto px-2 py-2 text-xs ${themedScrollbarClass}`}>
            <div className="mb-2 flex items-center justify-between rounded border border-border bg-card px-2 py-1.5">
              <span className="text-[11px] text-muted-foreground">仅看引用子树</span>
              <Switch
                checked={referenceOnlyTree}
                onCheckedChange={setReferenceOnlyTree}
                aria-label="仅看引用子树"
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
                  const layerKey = `layer:${layer.id}`;
                  return (
                    <Collapsible
                      key={layer.id}
                      open={isExpanded(layerKey, true)}
                      onOpenChange={(open) => setExpanded(layerKey, open)}
                    >
                      <div className="flex items-center gap-1 py-1 text-muted-foreground" style={{ paddingLeft: 20 }}>
                        <CollapsibleTrigger asChild>
                          <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center rounded text-sm hover:bg-accent"
                          >
                            {isExpanded(layerKey, true) ? "▾" : "▸"}
                          </button>
                        </CollapsibleTrigger>
                        <span className="truncate">
                          {layer.name}（{layerNodes.length}）
                        </span>
                      </div>
                      <CollapsibleContent>
                        {layerNodes.length === 0 ? (
                          <div className="py-1 text-[11px] text-muted-foreground" style={{ paddingLeft: 38 }}>
                            空图层
                          </div>
                        ) : (
                          layerNodes
                            .filter((node) => !referenceOnlyTree || hasRefInSubtree(node, new Set<string>()))
                            .map((node) =>
                            renderTreeNode(node, 2, `${layer.id}/${node.id}`, new Set<string>())
                            )
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}

