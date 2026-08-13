import type { TranslateFn } from "@arronqzy/i18n";
import { tForLocale } from "@arronqzy/i18n";
import type { PanelChartConfig, PanelLayer } from "../types";
import { createDefaultTableConfig, type PanelTableConfig } from "@arronqzy/view-table";

const tFallback = tForLocale("zh-CN");

const DEFAULT_NODE_NAME_KEYS: Record<string, string> = {
  bar: "panel.defaults.bar",
  line: "panel.defaults.line",
  pie: "panel.defaults.pie",
  area: "panel.defaults.area",
  scatter: "panel.defaults.scatter",
  radar: "panel.defaults.radar",
  gauge: "panel.defaults.gauge",
  funnel: "panel.defaults.funnel",
  text: "panel.defaults.text",
  grid: "panel.defaults.grid",
  image: "panel.defaults.image",
  video: "panel.defaults.video",
  audio: "panel.defaults.audio",
  reference: "panel.defaults.reference",
  geometry: "panel.defaults.geometry",
  table: "panel.defaults.table",
};

export const DEFAULT_LAYER_ID = "layer-1";

export function getDefaultNodeName(materialType: string, t: TranslateFn = tFallback): string {
  const key = DEFAULT_NODE_NAME_KEYS[materialType];
  return key ? t(key) : materialType;
}

export function getDefaultLayer(t: TranslateFn = tFallback): PanelLayer {
  return {
    id: DEFAULT_LAYER_ID,
    name: t("panel.defaults.layer1"),
    locked: false,
    editable: false,
    isPrimary: true,
    isMapping: false,
    mappingBaseLayerId: undefined,
  };
}

/** @deprecated Prefer getDefaultLayer(t); kept for non-React call sites */
export const DEFAULT_LAYER: PanelLayer = getDefaultLayer();

export function normalizePrimaryLayer(layers: PanelLayer[]): PanelLayer[] {
  if (layers.length === 0) return [getDefaultLayer()];
  const explicitPrimary = layers.find((layer) => layer.isPrimary);
  const primaryId = explicitPrimary?.id ?? layers[0].id;
  return layers.map((layer) => {
    if (layer.id === primaryId) return { ...layer, isPrimary: true };
    return { ...layer, isPrimary: false };
  });
}

export function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getDefaultSizeByMaterial(materialType: string) {
  switch (materialType) {
    case "text":
      return { width: 180, height: 56 };
    case "rect":
      return { width: 180, height: 120 };
    case "grid":
      return { width: 320, height: 220 };
    case "image":
      return { width: 220, height: 140 };
    case "video":
      return { width: 260, height: 150 };
    case "audio":
      return { width: 260, height: 90 };
    case "gauge":
      return { width: 260, height: 180 };
    case "reference":
      return { width: 280, height: 180 };
    case "geometry":
      return { width: 220, height: 220 };
    case "table":
      return { width: 480, height: 280 };
    default:
      return { width: 220, height: 130 };
  }
}

export function getDefaultTextContent(materialType: string, t: TranslateFn = tFallback) {
  if (materialType !== "text") return {};
  return {
    textHtml: `<p>${t("panel.defaults.doubleClickTextHtml")}</p>`,
    textAllowInput: true,
    textFontSize: 14,
    textFontWeight: "400",
    textLineHeight: 1.6,
    textAlign: "left",
  } as const;
}

export function getDefaultGridConfig(materialType: string) {
  if (materialType !== "grid") return {};
  return {
    gridRows: 2,
    gridCols: 3,
    gridGap: 8,
    gridPadding: 10,
    gridSnapThreshold: 36,
  } as const;
}

export function getDefaultChartConfig(
  materialType: string,
  t: TranslateFn = tFallback
): PanelChartConfig | undefined {
  if (!["bar", "line", "pie", "area", "scatter", "radar", "gauge", "funnel"].includes(materialType))
    return undefined;
  const common = {
    color: "#3b82f6",
    renderMode: "canvas" as const,
    labels: ["A", "B", "C", "D"],
    values: [12, 18, 9, 24],
  };
  if (materialType === "bar") {
    return {
      title: t("panel.defaults.bar"),
      ...common,
      barWidth: 24,
    };
  }
  if (materialType === "line") {
    return {
      title: t("panel.defaults.line"),
      ...common,
      smooth: true,
    };
  }
  if (materialType === "area") {
    return {
      title: t("panel.defaults.area"),
      ...common,
      smooth: true,
    };
  }
  if (materialType === "scatter") {
    return {
      title: t("panel.defaults.scatter"),
      ...common,
    };
  }
  if (materialType === "radar") {
    return {
      title: t("panel.defaults.radar"),
      ...common,
    };
  }
  if (materialType === "gauge") {
    return {
      title: t("panel.defaults.gauge"),
      color: "#3b82f6",
      renderMode: "canvas",
      values: [68],
    };
  }
  if (materialType === "funnel") {
    return {
      title: t("panel.defaults.funnel"),
      ...common,
    };
  }
  return {
    title: t("panel.defaults.pie"),
    ...common,
    pieInnerRadius: 30,
    pieOuterRadius: 65,
  };
}

export function getDefaultTableConfig(
  materialType: string,
  t: TranslateFn = tFallback
): PanelTableConfig | undefined {
  if (materialType !== "table") return undefined;
  const cfg = createDefaultTableConfig();
  cfg.emptyText = t("panel.config.tableEmpty");
  if (cfg.columns?.[0]) cfg.columns[0].title = t("panel.config.tableColName");
  if (cfg.columns?.[1]) cfg.columns[1].title = t("panel.config.tableColStatus");
  if (cfg.columns?.[2]) cfg.columns[2].title = t("panel.config.tableColScore");
  return cfg;
}
