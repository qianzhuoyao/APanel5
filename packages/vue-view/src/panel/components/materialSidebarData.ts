import type { TranslateFn } from "@arronqzy/i18n";
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

export function getMaterialLabelMap(t: TranslateFn): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [id, key] of Object.entries(MATERIAL_LABEL_KEYS)) {
    map[id] = t(key);
  }
  return map;
}

export function getDefaultCategories(t: TranslateFn): MaterialCategory[] {
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

export const themedScrollbarClass =
  "scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/80 [&::-webkit-scrollbar-thumb]:hover:bg-border";

/** 节点树中网格子节点顺序：与画布槽位一致 */
export function compareGridTreeChildOrder(a: PanelElement, b: PanelElement): number {
  const ai = typeof a.gridSlotIndex === "number" ? a.gridSlotIndex : 0;
  const bi = typeof b.gridSlotIndex === "number" ? b.gridSlotIndex : 0;
  if (ai !== bi) return ai - bi;
  return a.id.localeCompare(b.id);
}

export function getNodeDisplayName(node: PanelElement, t?: TranslateFn) {
  const customName = node.name?.trim();
  if (customName) return customName;
  if (node.chart?.title) return node.chart.title;
  if (t) {
    const key = MATERIAL_LABEL_KEYS[node.materialType ?? ""];
    if (key) return t(key);
  }
  return node.materialType || node.id;
}
