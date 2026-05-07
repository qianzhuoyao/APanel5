import React, { useMemo, useState } from "react";

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
};

export function MaterialSidebar({ className }: MaterialSidebarProps) {
  const categories = useMemo(() => defaultCategories, []);
  const [activeCategoryId, setActiveCategoryId] =
    useState<MaterialCategoryId>("charts");

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeCategoryId) ?? categories[0],
    [activeCategoryId, categories]
  );

  return (
    <aside
      className={[
        "grid h-full w-full border-r border-black/10 bg-slate-950 text-white/85",
        className ?? "",
      ].join(" ")}
      style={{ gridTemplateRows: "auto 1fr" }}
    >
      <div className="border-b border-white/10 px-3 py-2 text-xs font-semibold">
        物料
      </div>

      {/* 2 columns: category + type */}
      <div className="grid min-h-0 grid-cols-[110px_1fr]">
        <div className="overflow-auto border-r border-white/10">
          {categories.map((c) => {
            const active = c.id === activeCategoryId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategoryId(c.id)}
                className={[
                  "w-full cursor-pointer border-b border-white/5 px-2.5 py-2.5 text-left text-xs",
                  active ? "bg-blue-500/20 text-white" : "text-white/75 hover:bg-white/5",
                ].join(" ")}
              >
                {c.title}
              </button>
            );
          })}
        </div>

        <div className="overflow-auto">
          <div className="px-2.5 py-2.5 text-xs font-semibold">
            {activeCategory.title}
          </div>
          <div className="grid gap-2 px-2.5 pb-3">
            {activeCategory.items.map((it) => (
              <button
                key={it.id}
                type="button"
                className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-2.5 py-2.5 text-left text-xs text-white/85 hover:bg-white/10"
                onClick={() => {
                  // placeholder: later we can emit "add material" events
                }}
              >
                {it.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

