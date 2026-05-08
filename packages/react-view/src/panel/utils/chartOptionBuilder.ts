import type { EChartsOption } from "echarts";
import type { PanelElement } from "../types";

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

export function buildChartOption(element: PanelElement): EChartsOption {
  const chartType = (element.materialType ?? "") as ChartType;
  const labels = element.chart?.labels?.length ? element.chart.labels : ["A", "B", "C", "D"];
  const values = element.chart?.values?.length ? element.chart.values : [12, 18, 9, 24];
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
    const baseOption: EChartsOption = {
      animation: false,
      title: { text: title, left: "center", top: 6, textStyle: { fontSize: 12 } },
      color: [chartColor as any],
      tooltip: tooltipOption,
      series: [
        {
          type: "pie",
          radius: [`${inner}%`, `${outer}%`],
          center: ["50%", "58%"],
          label: { fontSize: 10 },
          data: labels.map((name, i) => ({ name, value: values[i] ?? 0 })),
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
        barWidth: chartType === "bar" ? (element.chart?.barWidth ?? 24) : undefined,
        areaStyle: chartType === "area" ? { opacity: 0.25 } : undefined,
        itemStyle: { color: chartColor as any },
        lineStyle: { color: chartColor as any },
      },
    ],
  };
  return deepMerge(baseOption as Record<string, any>, element.chart?.option) as EChartsOption;
}

