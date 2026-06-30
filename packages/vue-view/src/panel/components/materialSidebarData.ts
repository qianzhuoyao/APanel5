import type { PanelElement } from "../types";

export type MaterialCategoryId = "charts" | "basic" | "media";

export type MaterialItem = {
  id: string;
  title: string;
};

export type MaterialCategory = {
  id: MaterialCategoryId;
  title: string;
  items: MaterialItem[];
};

export const MATERIAL_LABEL_MAP: Record<string, string> = {
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
  grid: "网格布局",
  image: "图片",
  video: "视频",
  audio: "音频",
  reference: "引用组件",
  geometry: "几何",
};

export const defaultCategories: MaterialCategory[] = [
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
      { id: "geometry", title: "几何" },
      { id: "grid", title: "网格布局" },
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

export const themedScrollbarClass =
  "scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/80 [&::-webkit-scrollbar-thumb]:hover:bg-border";

/** 节点树中网格子节点顺序：与画布槽位一致 */
export function compareGridTreeChildOrder(a: PanelElement, b: PanelElement): number {
  const ai = typeof a.gridSlotIndex === "number" ? a.gridSlotIndex : 0;
  const bi = typeof b.gridSlotIndex === "number" ? b.gridSlotIndex : 0;
  if (ai !== bi) return ai - bi;
  return a.id.localeCompare(b.id);
}

export function getNodeDisplayName(node: PanelElement) {
  const customName = node.name?.trim();
  return customName || node.chart?.title || MATERIAL_LABEL_MAP[node.materialType ?? ""] || node.id;
}
