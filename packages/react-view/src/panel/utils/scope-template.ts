import type { PanelElement } from "../types";
import { materializeChartLabelsFromScope } from "./scope-template-chart";
import {
  SCOPE_SPREAD_TEMPLATE_RE,
  evaluateSpreadScopeExpression,
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
