/** Compact product handbook baked into the offline assistant system prompt. */
export const ABUILDER_HANDBOOK = `
# 产品
左物料 / 中画布 / 右属性 / 底蓝图。Scope 用 {scope?.x}。工作区可保存与预览。

# materialType
text(文本) table(表格) grid image video audio geometry reference
图表: bar line pie area scatter radar gauge funnel

# 常用 patch
name / width / height / x / y / textHtml
table.rowsText(JSON数组字符串) table.source table.columns table.emptyText
chart.title chart.color chart.labelsText chart.valuesText
饼图改色：patch.chart.color（不要改 style.backgroundColor）

# 蓝图 nodeType
blueprint lifecycle event clock/timer logic fetch json and；连线 blueprint.connect
`.trim();
