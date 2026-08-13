import type { TranslateFn } from "@arronqzy/i18n";

const FIELD_KEY_MAP: Record<string, string> = {
  name: "panel.scope.fieldName",
  textHtml: "panel.scope.fieldTextHtml",
  textFontFamily: "panel.scope.fieldTextFontFamily",
  textFontWeight: "panel.scope.fieldTextFontWeight",
  textColor: "panel.scope.fieldTextColor",
  "chart.title": "panel.scope.fieldChartTitle",
  "chart.color": "panel.scope.fieldChartColor",
  "chart.gradientFrom": "panel.scope.fieldChartGradientFrom",
  "chart.gradientTo": "panel.scope.fieldChartGradientTo",
  "chart.xAxisName": "panel.scope.fieldChartXAxisName",
  "chart.yAxisName": "panel.scope.fieldChartYAxisName",
  "chart.xAxisTickColor": "panel.scope.fieldChartXAxisTickColor",
  "chart.yAxisTickColor": "panel.scope.fieldChartYAxisTickColor",
  "chart.xAxisSplitLineColor": "panel.scope.fieldChartXAxisSplitLineColor",
  "chart.yAxisSplitLineColor": "panel.scope.fieldChartYAxisSplitLineColor",
  "chart.xAxisLabelColor": "panel.scope.fieldChartXAxisLabelColor",
  "chart.yAxisLabelColor": "panel.scope.fieldChartYAxisLabelColor",
  "chart.tooltipBackgroundColor": "panel.scope.fieldChartTooltipBackgroundColor",
  "chart.tooltipTextColor": "panel.scope.fieldChartTooltipTextColor",
  "chart.tooltipFormatter": "panel.scope.fieldChartTooltipFormatter",
  "chart.labelsText": "panel.scope.fieldChartLabelsText",
  "chart.valuesText": "panel.scope.fieldChartValuesText",
  "style.backgroundColor": "panel.scope.fieldStyleBackgroundColor",
  "style.backgroundImage": "panel.scope.fieldStyleBackgroundImage",
  "style.backgroundImageRemoteUrl": "panel.scope.fieldStyleBackgroundImageRemoteUrl",
  "style.backgroundSize": "panel.scope.fieldStyleBackgroundSize",
  "style.backgroundPosition": "panel.scope.fieldStyleBackgroundPosition",
  "style.borderColor": "panel.scope.fieldStyleBorderColor",
  audioSrc: "panel.scope.fieldAudioSrc",
  audioRemoteUrl: "panel.scope.fieldAudioRemoteUrl",
  videoSrc: "panel.scope.fieldVideoSrc",
  videoRemoteUrl: "panel.scope.fieldVideoRemoteUrl",
  geometryColor: "panel.scope.fieldGeometryColor",
  geometryScript: "panel.scope.fieldGeometryScript",
};

export function getScopeFieldLabels(t: TranslateFn): Record<string, string> {
  const labels: Record<string, string> = {};
  for (const [fieldId, key] of Object.entries(FIELD_KEY_MAP)) {
    labels[fieldId] = t(key);
  }
  return labels;
}

export function resolveScopeFieldLabel(fieldId: string, t?: TranslateFn): string {
  if (t) {
    const key = FIELD_KEY_MAP[fieldId];
    if (key) return t(key);
  }
  const leaf = fieldId.split(".").pop() ?? fieldId;
  return leaf;
}

export function scopeFieldDomId(fieldId: string): string {
  return `scope-field-${fieldId.replace(/\./g, "--")}`;
}
