import type { PanelElement } from "../types";
import type { PanelTableConfig } from "@arronqzy/view-table";
import { isUsableTableRawData } from "@arronqzy/view-table";
import { materializeChartLabelsFromScope } from "./scope-template-chart";
import {
  SCOPE_SPREAD_TEMPLATE_RE,
  evaluateSpreadScopeExpression,
  extractSpreadScopeExpression,
  getValueAtScopePath,
  isSpreadOnlyScopeTemplate,
  resolveSpreadScopePath,
} from "./scope-template-spread";

const SCOPE_TEMPLATE_RE = /\{[^}]+\}|\[\.\.\.\{[^}]+\}\]/;

export function hasScopeTemplate(value: string): boolean {
  return SCOPE_TEMPLATE_RE.test(value);
}

export function evaluateScopeExpression(
  expression: string,
  scope: unknown
): unknown {
  const trimmed = expression.trim();
  if (!trimmed) return undefined;
  try {
    const fn = new Function("scope", `"use strict"; return (${trimmed});`);
    return fn(scope);
  } catch {
    return undefined;
  }
}

export function evaluateScopeTemplate(
  template: string,
  scope: unknown
): string {
  if (!hasScopeTemplate(template)) return template;

  const withSpread = template.replace(
    SCOPE_SPREAD_TEMPLATE_RE,
    (_, rawExpr: string) => {
      const result = evaluateSpreadScopeExpression(rawExpr, scope);
      return result.ok ? result.value : "";
    }
  );

  return withSpread.replace(/\{([^}]+)\}/g, (_, rawExpr: string) => {
    const value = evaluateScopeExpression(rawExpr, scope);
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  });
}

function tryParseJson(text: string): unknown | undefined {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function materializeTemplateValue(template: string, scope: unknown): unknown {
  const trimmed = template.trim();
  if (!trimmed) return undefined;

  if (isSpreadOnlyScopeTemplate(trimmed)) {
    const expression = extractSpreadScopeExpression(trimmed);
    if (!expression) return undefined;
    const resolved = resolveSpreadScopePath(expression, scope);
    if (!resolved.ok) return undefined;
    if (resolved.itemPathSegments.length === 0) {
      return resolved.arrayValue;
    }
    return resolved.arrayValue.map((item) =>
      getValueAtScopePath(item, resolved.itemPathSegments)
    );
  }

  const singleMatch = /^\{([^}]+)\}$/.exec(trimmed);
  if (singleMatch) {
    return evaluateScopeExpression(singleMatch[1]!, scope);
  }

  if (hasScopeTemplate(trimmed)) {
    const text = evaluateScopeTemplate(trimmed, scope);
    const parsed = tryParseJson(text);
    return parsed !== undefined ? parsed : text;
  }

  return tryParseJson(trimmed);
}

/** 将 table.source / rowsText 模版解析为原始行数据（供 transform 使用） */
export function materializeTableSourceFromScope(
  table: PanelTableConfig | undefined,
  scope: unknown
): unknown | undefined {
  if (!table) return undefined;

  if (typeof table.source === "string" && table.source.trim()) {
    return materializeTemplateValue(table.source, scope);
  }

  if (typeof table.rowsText === "string" && table.rowsText.trim()) {
    const trimmed = table.rowsText.trim();
    if (hasScopeTemplate(trimmed) || isSpreadOnlyScopeTemplate(trimmed)) {
      return materializeTemplateValue(trimmed, scope);
    }
  }

  return undefined;
}

function resolveScopedValue<T>(value: T, scope: unknown): T {
  if (typeof value === "string" && hasScopeTemplate(value)) {
    return evaluateScopeTemplate(value, scope) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolveScopedValue(item, scope)) as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      out[key] = resolveScopedValue(nested, scope);
    }
    return out as T;
  }
  return value;
}

export function resolvePanelElementScope(
  element: PanelElement,
  scope: unknown | undefined
): PanelElement {
  if (scope === undefined) return element;
  const resolved = resolveScopedValue(structuredClone(element), scope);
  if (resolved.chart) {
    const labels = materializeChartLabelsFromScope(element.chart, scope);
    if (labels !== undefined) {
      resolved.chart.labels = labels;
      delete resolved.chart.labelsText;
    }
  }
  if (resolved.table) {
    const hasDynamicSource =
      typeof element.table?.source === "string" && element.table.source.trim().length > 0;
    if (hasDynamicSource) {
      const raw = materializeTableSourceFromScope(element.table, scope);
      if (isUsableTableRawData(raw)) {
        resolved.table = { ...resolved.table, rows: raw };
      } else {
        const next = { ...resolved.table };
        delete next.rows;
        resolved.table = next;
      }
    }
  }
  return resolved;
}

export function formatViewElementScope(scope: unknown): string {
  if (scope === undefined) return "";
  try {
    return JSON.stringify(scope, null, 2);
  } catch {
    return String(scope);
  }
}
