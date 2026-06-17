export type PanelChartConfig = {
  title?: string;
  color?: string;
  colorMode?: "solid" | "gradient";
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: "to-right" | "to-bottom" | "to-bottom-right" | "to-top-right";
  renderMode?: "canvas" | "svg";
  xAxisName?: string;
  yAxisName?: string;
  xAxisTickShow?: boolean;
  yAxisTickShow?: boolean;
  xAxisTickColor?: string;
  yAxisTickColor?: string;
  xAxisSplitLineShow?: boolean;
  yAxisSplitLineShow?: boolean;
  xAxisSplitLineColor?: string;
  yAxisSplitLineColor?: string;
  xAxisLabelColor?: string;
  yAxisLabelColor?: string;
  xAxisLabelFontSize?: number;
  yAxisLabelFontSize?: number;
  xAxisLabelAutoEllipsis?: boolean;
  yAxisLabelAutoEllipsis?: boolean;
  tooltipShow?: boolean;
  tooltipTrigger?: "axis" | "item";
  tooltipBackgroundColor?: string;
  tooltipTextColor?: string;
  tooltipFormatter?: string;
  labels?: string[];
  values?: number[];
  /** 逗号分隔的原始数值文本，支持 scope 模版；存在时优先于 values */
  valuesText?: string;
  smooth?: boolean;
  barWidth?: number;
  pieInnerRadius?: number;
  pieOuterRadius?: number;
  option?: Record<string, unknown>;
};

export type PanelElementStyle = {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundImageRemoteUrl?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  borderWidth?: number;
  borderStyle?: "none" | "solid" | "dashed" | "dotted" | "double";
  borderColor?: string;
  borderRadius?: number;
};

export type ReferenceCopyMode = "shallow" | "deep";

export type PanelElement = {
  id: string;
  layerId: string;
  zIndex?: number;
  name?: string;
  locked?: boolean;
  materialType?: string;
  refLayerId?: string;
  refCopyMode?: ReferenceCopyMode;
  refSnapshot?: PanelElement[];
  chart?: PanelChartConfig;
  textHtml?: string;
  textAllowInput?: boolean;
  textFontFamily?: string;
  textFontSize?: number;
  textFontWeight?: string;
  textColor?: string;
  textLineHeight?: number;
  textAlign?: "left" | "center" | "right" | "justify";
  gridRows?: number;
  gridCols?: number;
  gridGap?: number;
  gridPadding?: number;
  gridSnapThreshold?: number;
  parentGridId?: string;
  gridSlotIndex?: number;
  gridColSpan?: number;
  gridRowSpan?: number;
  mappingSourceNodeId?: string;
  mappingSourceLayerId?: string;
  audioSrc?: string;
  audioRemoteUrl?: string;
  audioPosterImage?: string;
  audioIconPreset?: "speaker" | "music" | "headphone" | "wave";
  audioVisualEffect?: "none" | "pulse" | "ripple";
  audioVisualSpeed?: "slow" | "normal" | "fast";
  mediaAutoPauseOnEdit?: boolean;
  videoSrc?: string;
  videoRemoteUrl?: string;
  geometryShape?: "rect" | "circle" | "triangle" | "diamond" | "hexagon" | "star" | "heart";
  geometryColor?: string;
  geometryScript?: string;
  geometrySketchDataUrl?: string;
  style?: PanelElementStyle;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: number;
};

export type PanelLayer = {
  id: string;
  name: string;
  locked: boolean;
  editable: boolean;
  isPrimary?: boolean;
  isMapping?: boolean;
  mappingBaseLayerId?: string;
  mergeSelected?: boolean;
};

export type PanelHistoryItem = {
  index: number;
  timestamp: number;
  label: string;
  active: boolean;
};

export type PanelActionResult = { ok: true } | { ok: false; reason: string };

