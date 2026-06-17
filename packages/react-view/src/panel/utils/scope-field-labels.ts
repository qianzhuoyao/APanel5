const LABELS: Record<string, string> = {
  name: "节点名称",
  textHtml: "文本内容",
  textFontFamily: "文本字体",
  textFontWeight: "文本字重",
  textColor: "文本颜色",
  "chart.title": "图表标题",
  "chart.color": "图表颜色",
  "chart.gradientFrom": "渐变起始色",
  "chart.gradientTo": "渐变结束色",
  "chart.xAxisName": "X 轴名称",
  "chart.yAxisName": "Y 轴名称",
  "chart.xAxisTickColor": "X 轴刻度颜色",
  "chart.yAxisTickColor": "Y 轴刻度颜色",
  "chart.xAxisSplitLineColor": "X 轴分割线颜色",
  "chart.yAxisSplitLineColor": "Y 轴分割线颜色",
  "chart.xAxisLabelColor": "X 轴标签颜色",
  "chart.yAxisLabelColor": "Y 轴标签颜色",
  "chart.tooltipBackgroundColor": "Tooltip 背景色",
  "chart.tooltipTextColor": "Tooltip 文字色",
  "chart.tooltipFormatter": "Tooltip 格式化",
  "style.backgroundColor": "背景色",
  "style.backgroundImage": "背景图",
  "style.backgroundImageRemoteUrl": "背景图远程地址",
  "style.backgroundSize": "背景尺寸",
  "style.backgroundPosition": "背景位置",
  "style.borderColor": "边框颜色",
  audioSrc: "音频地址",
  audioRemoteUrl: "音频远程地址",
  videoSrc: "视频地址",
  videoRemoteUrl: "视频远程地址",
  geometryColor: "几何颜色",
  geometryScript: "几何脚本",
};

export function resolveScopeFieldLabel(fieldId: string): string {
  if (LABELS[fieldId]) return LABELS[fieldId];
  const leaf = fieldId.split(".").pop() ?? fieldId;
  return LABELS[fieldId] ?? leaf;
}

export function scopeFieldDomId(fieldId: string): string {
  return `scope-field-${fieldId.replace(/\./g, "--")}`;
}
