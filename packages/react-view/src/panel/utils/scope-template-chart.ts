import type { PanelChartConfig } from "../types";
import { hasScopeTemplate, evaluateScopeTemplate } from "./scope-template";
import {
  evaluateSpreadScopeExpressionValues,
  extractSpreadScopeExpression,
  isSpreadOnlyScopeTemplate,
} from "./scope-template-spread";

function splitCommaSeparatedLabels(text: string): string[] {
  return text
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function materializeSpreadTemplate(template: string, scope: unknown): string[] {
  const expression = extractSpreadScopeExpression(template);
  if (!expression) return [];
  const result = evaluateSpreadScopeExpressionValues(expression, scope);
  return result.ok ? result.values : [];
}

function materializeLabelToken(token: string, scope: unknown): string[] {
  const trimmed = token.trim();
  if (!trimmed) return [];

  if (isSpreadOnlyScopeTemplate(trimmed)) {
    return materializeSpreadTemplate(trimmed, scope);
  }

  if (hasScopeTemplate(trimmed)) {
    return [evaluateScopeTemplate(trimmed, scope)];
  }

  return [trimmed];
}

/** 将类目模版文本展开为图表所需的字符串数组 */
export function materializeChartLabelsText(
  text: string,
  scope: unknown
): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  if (isSpreadOnlyScopeTemplate(trimmed)) {
    return materializeSpreadTemplate(trimmed, scope);
  }

  if (hasScopeTemplate(trimmed)) {
    return splitCommaSeparatedLabels(evaluateScopeTemplate(trimmed, scope));
  }

  return splitCommaSeparatedLabels(trimmed);
}

/** 兼容旧数据：labels 数组中每项可含展开模版 */
export function materializeChartLabelsArray(
  labels: string[],
  scope: unknown
): string[] {
  const result: string[] = [];
  for (const label of labels) {
    result.push(...materializeLabelToken(label, scope));
  }
  return result;
}

/** 将数值模版文本展开为图表所需的数字数组 */
export function materializeChartValuesText(
  text: string,
  scope: unknown
): number[] {
  return materializeChartLabelsText(text, scope).map((part) => {
    const value = Number(part);
    return Number.isFinite(value) ? value : 0;
  });
}

export function materializeChartLabelsFromScope(
  chart: PanelChartConfig | undefined,
  scope: unknown
): string[] | undefined {
  if (!chart) return undefined;
  if (chart.labelsText !== undefined) {
    return materializeChartLabelsText(chart.labelsText, scope);
  }
  if (chart.labels?.length) {
    return materializeChartLabelsArray(chart.labels, scope);
  }
  return undefined;
}
