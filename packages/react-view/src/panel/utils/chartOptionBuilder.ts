import type { EChartsOption } from "echarts";
import type { PanelChartConfig, PanelElement } from "../types";

const DEFAULT_CHART_VALUES = [12, 18, 9, 24];
const DEFAULT_CHART_LABELS = ["A", "B", "C", "D"];

export function getChartValuesDisplayText(chart?: PanelChartConfig): string {
  if (chart?.valuesText !== undefined) return chart.valuesText;
  return (chart?.values ?? []).join(",");
}

export function getChartLabelsDisplayText(chart?: PanelChartConfig): string {
  if (chart?.labelsText !== undefined) return chart.labelsText;
  return (chart?.labels ?? []).join(",");
}

export function parseChartLabelsFromText(
  text: string | undefined,
  fallback: string[] = DEFAULT_CHART_LABELS
): string[] {
  if (text === undefined) return fallback;
  const trimmed = text.trim();
  if (!trimmed) return fallback;
  const parts = trimmed.split(",").map((s) => s.trim()).filter(Boolean);
  if (!parts.length) return fallback;
  return parts;
}

export function resolveChartLabels(element: PanelElement): string[] {
  const chart = element.chart;
  if (chart?.labelsText !== undefined) {
    const parsed = parseChartLabelsFromText(chart.labelsText, []);
    return parsed.length ? parsed : DEFAULT_CHART_LABELS;
  }
  if (chart?.labels?.length) return chart.labels;
  return DEFAULT_CHART_LABELS;
}

export function parseChartValuesFromText(
  text: string | undefined,
  fallback: number[] = DEFAULT_CHART_VALUES
): number[] {
  if (text === undefined) return fallback;
  const trimmed = text.trim();
  if (!trimmed) return fallback;
  const parts = trimmed.split(",").map((s) => s.trim()).filter(Boolean);
  if (!parts.length) return fallback;
  return parts.map((s) => {
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  });
}

export function resolveChartValues(element: PanelElement): number[] {
  const chart = element.chart;
  if (chart?.valuesText !== undefined) {
    const parsed = parseChartValuesFromText(chart.valuesText, []);
    return parsed.length ? parsed : DEFAULT_CHART_VALUES;
  }
  return chart?.values?.length ? chart.values : DEFAULT_CHART_VALUES;
}

export const CHART_TYPES = new Set([
  "bar",
  "line",
  "pie",
  "area",
  "scatter",
  "radar",
  "gauge",
  "funnel",
]);

type ChartType =
  | "bar"
  | "line"
  | "pie"
  | "area"
  | "scatter"
  | "radar"
  | "gauge"
  | "funnel";

function deepMerge<T extends Record<string, any>>(base: T, patch?: Record<string, unknown>): T {
  if (!patch) return base;
  const next: Record<string, any> = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      next[key] &&
      typeof next[key] === "object" &&
      !Array.isArray(next[key])
    ) {
      next[key] = deepMerge(next[key], value as Record<string, unknown>);
    } else {
      next[key] = value;
    }
  }
  return next as T;
}

function resolveBarWidth(chart?: PanelChartConfig): number | undefined {
  const width = chart?.barWidth;
  return typeof width === "number" && Number.isFinite(width) && width > 0 ? width : undefined;
}

function mixHex(a: string, b: string, t: number): string {
  const pa = parseHex(a);
  const pb = parseHex(b);
  if (!pa || !pb) return a;
  const m = (i: number) => Math.round(pa[i]! * (1 - t) + pb[i]! * t);
  return `#${[m(0), m(1), m(2)].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function parseHex(hex: string): [number, number, number] | null {
  const s = hex.replace("#", "").trim();
  const full =
    s.length === 3
      ? s
          .split("")
          .map((c) => c + c)
          .join("")
      : s.slice(0, 6);
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ];
}

function pieSliceColors(base: string, count: number): string[] {
  const n = Math.max(count, 1);
  if (n === 1) return [base];
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0 : i / (n - 1);
    return mixHex(mixHex(base, "#111827", 0.12), "#fefce8", t * 0.45);
  });
}

export function buildChartOption(element: PanelElement): EChartsOption {
  const chartType = (element.materialType ?? "") as ChartType;
  const labels = resolveChartLabels(element);
  const values = resolveChartValues(element);
  const color = element.chart?.color || "#3b82f6";
  const gradientFrom = element.chart?.gradientFrom || color;
  const gradientTo = element.chart?.gradientTo || "#22d3ee";
  const gradientDirection = element.chart?.gradientDirection ?? "to-right";
  const useGradient = element.chart?.colorMode === "gradient";
  const gradientMeta =
    gradientDirection === "to-bottom"
      ? { x: 0, y: 0, x2: 0, y2: 1 }
      : gradientDirection === "to-bottom-right"
        ? { x: 0, y: 0, x2: 1, y2: 1 }
        : gradientDirection === "to-top-right"
          ? { x: 0, y: 1, x2: 1, y2: 0 }
          : { x: 0, y: 0, x2: 1, y2: 0 };
  const chartColor = useGradient
    ? ({
        type: "linear",
        ...gradientMeta,
        colorStops: [
          { offset: 0, color: gradientFrom },
          { offset: 1, color: gradientTo },
        ],
      } as const)
    : color;
  const title = element.chart?.title ?? "";
  const xAxisName = element.chart?.xAxisName ?? "";
  const yAxisName = element.chart?.yAxisName ?? "";
  const xAxisTickShow = element.chart?.xAxisTickShow ?? true;
  const yAxisTickShow = element.chart?.yAxisTickShow ?? true;
  const xAxisTickColor = element.chart?.xAxisTickColor ?? "#94a3b8";
  const yAxisTickColor = element.chart?.yAxisTickColor ?? "#94a3b8";
  const xAxisSplitLineShow = element.chart?.xAxisSplitLineShow ?? false;
  const yAxisSplitLineShow = element.chart?.yAxisSplitLineShow ?? true;
  const xAxisSplitLineColor = element.chart?.xAxisSplitLineColor ?? "#e2e8f0";
  const yAxisSplitLineColor = element.chart?.yAxisSplitLineColor ?? "#e2e8f0";
  const xAxisLabelColor = element.chart?.xAxisLabelColor ?? "#64748b";
  const yAxisLabelColor = element.chart?.yAxisLabelColor ?? "#64748b";
  const xAxisLabelFontSize = element.chart?.xAxisLabelFontSize ?? 10;
  const yAxisLabelFontSize = element.chart?.yAxisLabelFontSize ?? 10;
  const xAxisLabelAutoEllipsis = element.chart?.xAxisLabelAutoEllipsis ?? false;
  const yAxisLabelAutoEllipsis = element.chart?.yAxisLabelAutoEllipsis ?? false;
  const tooltipShow = element.chart?.tooltipShow ?? true;
  const tooltipTrigger = element.chart?.tooltipTrigger ?? (chartType === "pie" || chartType === "funnel" || chartType === "scatter" ? "item" : "axis");
  const tooltipBackgroundColor = element.chart?.tooltipBackgroundColor ?? "#0f172a";
  const tooltipTextColor = element.chart?.tooltipTextColor ?? "#f8fafc";
  const tooltipFormatter = element.chart?.tooltipFormatter;
  const tooltipOption = {
    show: tooltipShow,
    trigger: tooltipTrigger,
    backgroundColor: tooltipBackgroundColor,
    textStyle: { color: tooltipTextColor },
    formatter: tooltipFormatter || undefined,
  };

  if (chartType === "pie") {
    const inner = element.chart?.pieInnerRadius ?? 30;
    const outer = element.chart?.pieOuterRadius ?? 65;
    const sliceColors = pieSliceColors(color, labels.length);
    const baseOption: EChartsOption = {
      animation: false,
      title: { text: title, left: "center", top: 6, textStyle: { fontSize: 12 } },
      color: sliceColors as any,
      tooltip: tooltipOption,
      series: [
        {
          type: "pie",
          radius: [`${inner}%`, `${outer}%`],
          center: ["50%", "58%"],
          label: { fontSize: 10 },
          data: labels.map((name, i) => ({
            name,
            value: values[i] ?? 0,
            itemStyle: { color: sliceColors[i % sliceColors.length] as any },
          })),
        },
      ],
    };
    return deepMerge(baseOption as Record<string, any>, element.chart?.option) as EChartsOption;
  }

  if (chartType === "gauge") {
    const gaugeValue = values[0] ?? 0;
    const baseOption: EChartsOption = {
      animation: false,
      title: { text: title, left: "center", top: 6, textStyle: { fontSize: 12 } },
      tooltip: tooltipOption,
      series: [
        {
          type: "gauge",
          min: 0,
          max: 100,
          progress: { show: true, width: 10 },
          axisLine: { lineStyle: { width: 10 } },
          detail: { valueAnimation: false, formatter: "{value}%" },
          data: [{ value: gaugeValue, name: title }],
          itemStyle: { color: chartColor as any },
        },
      ],
    };
    return deepMerge(baseOption as Record<string, any>, element.chart?.option) as EChartsOption;
  }

  if (chartType === "radar") {
    const indicator = labels.map((name) => ({ name, max: 100 }));
    const baseOption: EChartsOption = {
      animation: false,
      title: { text: title, left: "center", top: 6, textStyle: { fontSize: 12 } },
      tooltip: tooltipOption,
      radar: { indicator, radius: "60%", center: ["50%", "58%"] },
      series: [
        {
          type: "radar",
          data: [{ value: values, name: title }],
          areaStyle: { opacity: 0.25 },
          lineStyle: { color: chartColor as any },
          itemStyle: { color: chartColor as any },
        },
      ],
    };
    return deepMerge(baseOption as Record<string, any>, element.chart?.option) as EChartsOption;
  }

  if (chartType === "funnel") {
    const baseOption: EChartsOption = {
      animation: false,
      title: { text: title, left: "center", top: 6, textStyle: { fontSize: 12 } },
      tooltip: tooltipOption,
      series: [
        {
          type: "funnel",
          top: 28,
          left: "10%",
          width: "80%",
          height: "65%",
          sort: "descending",
          data: labels.map((name, i) => ({ name, value: values[i] ?? 0 })),
          label: { fontSize: 10 },
          itemStyle: { color: chartColor as any },
        },
      ],
    };
    return deepMerge(baseOption as Record<string, any>, element.chart?.option) as EChartsOption;
  }

  if (chartType === "scatter") {
    const baseOption: EChartsOption = {
      animation: false,
      title: { text: title, left: 8, top: 6, textStyle: { fontSize: 12 } },
      grid: { left: 28, right: 10, top: 30, bottom: 20 },
      xAxis: {
        type: "value",
        name: xAxisName,
        nameTextStyle: { fontSize: 10 },
        axisLabel: {
          fontSize: xAxisLabelFontSize,
          color: xAxisLabelColor,
          overflow: xAxisLabelAutoEllipsis ? "truncate" : undefined,
          hideOverlap: xAxisLabelAutoEllipsis,
          width: xAxisLabelAutoEllipsis ? 80 : undefined,
        },
        axisTick: { show: xAxisTickShow, lineStyle: { color: xAxisTickColor } },
        splitLine: { show: xAxisSplitLineShow, lineStyle: { color: xAxisSplitLineColor } },
      },
      yAxis: {
        type: "value",
        name: yAxisName,
        nameTextStyle: { fontSize: 10 },
        axisLabel: {
          fontSize: yAxisLabelFontSize,
          color: yAxisLabelColor,
          overflow: yAxisLabelAutoEllipsis ? "truncate" : undefined,
          hideOverlap: yAxisLabelAutoEllipsis,
          width: yAxisLabelAutoEllipsis ? 80 : undefined,
        },
        axisTick: { show: yAxisTickShow, lineStyle: { color: yAxisTickColor } },
        splitLine: { show: yAxisSplitLineShow, lineStyle: { color: yAxisSplitLineColor } },
      },
      tooltip: tooltipOption,
      series: [
        {
          type: "scatter",
          data: values.map((v, i) => [i + 1, v]),
          itemStyle: { color: chartColor as any },
          symbolSize: 10,
        },
      ],
    };
    return deepMerge(baseOption as Record<string, any>, element.chart?.option) as EChartsOption;
  }

  const seriesType = chartType === "area" ? "line" : chartType;
  const baseOption: EChartsOption = {
    animation: false,
    title: { text: title, left: 8, top: 6, textStyle: { fontSize: 12 } },
    grid: { left: 28, right: 10, top: 30, bottom: 20 },
    xAxis: {
      type: "category",
      name: xAxisName,
      nameTextStyle: { fontSize: 10 },
      data: labels,
      axisLabel: {
        fontSize: xAxisLabelFontSize,
        color: xAxisLabelColor,
        overflow: xAxisLabelAutoEllipsis ? "truncate" : undefined,
        hideOverlap: xAxisLabelAutoEllipsis,
        width: xAxisLabelAutoEllipsis ? 80 : undefined,
      },
      axisTick: { show: xAxisTickShow, lineStyle: { color: xAxisTickColor } },
      splitLine: { show: xAxisSplitLineShow, lineStyle: { color: xAxisSplitLineColor } },
    },
    yAxis: {
      type: "value",
      name: yAxisName,
      nameTextStyle: { fontSize: 10 },
      axisLabel: {
        fontSize: yAxisLabelFontSize,
        color: yAxisLabelColor,
        overflow: yAxisLabelAutoEllipsis ? "truncate" : undefined,
        hideOverlap: yAxisLabelAutoEllipsis,
        width: yAxisLabelAutoEllipsis ? 80 : undefined,
      },
      axisTick: { show: yAxisTickShow, lineStyle: { color: yAxisTickColor } },
      splitLine: { show: yAxisSplitLineShow, lineStyle: { color: yAxisSplitLineColor } },
    },
    tooltip: tooltipOption,
    series: [
      {
        type: seriesType,
        data: values,
        smooth:
          chartType === "line" || chartType === "area"
            ? (element.chart?.smooth ?? true)
            : undefined,
        barWidth:
          chartType === "bar" ? resolveBarWidth(element.chart) : undefined,
        areaStyle: chartType === "area" ? { opacity: 0.25 } : undefined,
        itemStyle: { color: chartColor as any },
        lineStyle: { color: chartColor as any },
      },
    ],
  };
  return deepMerge(baseOption as Record<string, any>, element.chart?.option) as EChartsOption;
}

