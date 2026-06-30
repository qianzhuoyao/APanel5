import type { PanelChartConfig, PanelLayer } from "../types";

const DEFAULT_NODE_NAME_MAP: Record<string, string> = {
  bar: "柱状图",
  line: "折线图",
  pie: "饼图",
  area: "面积图",
  scatter: "散点图",
  radar: "雷达图",
  gauge: "仪表盘",
  funnel: "漏斗图",
  text: "文本",
  grid: "网格布局",
  image: "图片",
  video: "视频",
  audio: "音频",
  reference: "引用组件",
  geometry: "几何",
};

export const DEFAULT_LAYER_ID = "layer-1";

export function getDefaultNodeName(materialType: string): string {
  return DEFAULT_NODE_NAME_MAP[materialType] ?? materialType;
}

export const DEFAULT_LAYER: PanelLayer = {
  id: DEFAULT_LAYER_ID,
  name: "图层1",
  locked: false,
  editable: false,
  isPrimary: true,
  isMapping: false,
  mappingBaseLayerId: undefined,
};

export function normalizePrimaryLayer(layers: PanelLayer[]): PanelLayer[] {
  if (layers.length === 0) return [DEFAULT_LAYER];
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
    default:
      return { width: 220, height: 130 };
  }
}

export function getDefaultTextContent(materialType: string) {
  if (materialType !== "text") return {};
  return {
    textHtml: "<p>双击输入文本</p>",
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

export function getDefaultChartConfig(materialType: string): PanelChartConfig | undefined {
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
      title: "柱状图",
      ...common,
      barWidth: 24,
    };
  }
  if (materialType === "line") {
    return {
      title: "折线图",
      ...common,
      smooth: true,
    };
  }
  if (materialType === "area") {
    return {
      title: "面积图",
      ...common,
      smooth: true,
    };
  }
  if (materialType === "scatter") {
    return {
      title: "散点图",
      ...common,
    };
  }
  if (materialType === "radar") {
    return {
      title: "雷达图",
      ...common,
    };
  }
  if (materialType === "gauge") {
    return {
      title: "仪表盘",
      color: "#3b82f6",
      renderMode: "canvas",
      values: [68],
    };
  }
  if (materialType === "funnel") {
    return {
      title: "漏斗图",
      ...common,
    };
  }
  return {
    title: "饼图",
    ...common,
    pieInnerRadius: 30,
    pieOuterRadius: 65,
  };
}
