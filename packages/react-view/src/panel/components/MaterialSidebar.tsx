import React, { useMemo, useState } from "react";
import { Input } from "@arron/ui";

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
    ],
  },
  {
    id: "basic",
    title: "基础",
    items: [
      { id: "text", title: "文本" },
      { id: "rect", title: "矩形" },
      { id: "image", title: "图片" },
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
};

export function MaterialSidebar({ className, onDragMaterialStart }: MaterialSidebarProps) {
  const categories = useMemo(() => defaultCategories, []);
  const [activeCategoryId, setActiveCategoryId] =
    useState<MaterialCategoryId>("charts");
  const [keyword, setKeyword] = useState("");

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

      {/* 2 columns: category + type */}
      <div className="grid min-h-0 grid-cols-[110px_1fr]">
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
                onClick={() => {
                  // placeholder: later we can emit "add material" events
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
    </aside>
  );
}

