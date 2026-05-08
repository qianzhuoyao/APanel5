export type PanelChartConfig = {
  title?: string;
  color?: string;
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
  labels?: string[];
  values?: number[];
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
  name?: string;
  materialType?: string;
  refLayerId?: string;
  refCopyMode?: ReferenceCopyMode;
  refSnapshot?: PanelElement[];
  chart?: PanelChartConfig;
  style?: PanelElementStyle;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: number;
};

