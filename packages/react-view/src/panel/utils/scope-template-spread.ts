/** 数组展开模版：[...{scope?.a?.b}] 从 scope 中定位数组并提取每项字段，输出逗号分隔值 */

import type { TranslateFn } from "@arronqzy/i18n";
import { tForLocale } from "@arronqzy/i18n";

export const SCOPE_SPREAD_TEMPLATE_RE = /\[\.\.\.\{([^}]+)\}\]/g;

export const SCOPE_SPREAD_TEMPLATE_DEMO = {
  scope: { a: [{ b: 1 }, { b: 2 }] },
  template: "[...{scope?.a?.b}]",
  output: "1,2",
} as const;

export function getScopeSpreadDeepTemplateDemo(t: TranslateFn = tForLocale("zh-CN")) {
  const inProgress = t("panel.scope.demoInProgress");
  const done = t("panel.scope.demoDone");
  return {
    scope: {
      data: {
        data: [{ statusName: inProgress }, { statusName: done }],
      },
    },
    template: "[...{scope?.data?.data?.statusName}]",
    output: t("panel.scope.demoJoined"),
  } as const;
}

/** @deprecated Prefer getScopeSpreadDeepTemplateDemo(t) */
export const SCOPE_SPREAD_DEEP_TEMPLATE_DEMO = getScopeSpreadDeepTemplateDemo();

export type ScopeSpreadEvalIssue =
  | "invalid-expression"
  | "path-missing"
  | "not-array";

export type ScopeSpreadEvalResult =
  | { ok: true; value: string }
  | { ok: false; issue: ScopeSpreadEvalIssue; arrayPath?: string };

export type SpreadScopePathResolution =
  | {
      ok: true;
      arrayPathSegments: string[];
      itemPathSegments: string[];
      arrayValue: unknown[];
    }
  | { ok: false; issue: ScopeSpreadEvalIssue; arrayPath?: string };

/** 解析 scope?.a?.b 形式的路径段（不含 scope 前缀） */
export function parseScopePathSegments(expression: string): string[] | null {
  const trimmed = expression.trim();
  if (!trimmed.startsWith("scope")) return null;

  let body = trimmed.slice("scope".length);
  if (body.startsWith("?.")) body = body.slice(2);
  else if (body.startsWith(".")) body = body.slice(1);
  else if (body.length > 0) return null;

  if (!body) return [];
  return body.split("?.").filter(Boolean);
}

export function formatScopePathSegments(segments: string[]): string {
  return segments.join(".");
}

export function getValueAtScopePath(scope: unknown, path: string[]): unknown {
  let current: unknown = scope;
  for (const part of path) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/**
 * 从完整路径中定位数组段与项内字段段。
 * 例如 scope?.data?.data?.statusName → 数组在 data.data，项字段为 statusName。
 */
export function resolveSpreadScopePath(
  expression: string,
  scope: unknown
): SpreadScopePathResolution {
  const segments = parseScopePathSegments(expression);
  if (segments === null || segments.length === 0) {
    return { ok: false, issue: "invalid-expression" };
  }

  if (segments.length === 1) {
    const arrayPathSegments = segments;
    const arrayValue = getValueAtScopePath(scope, arrayPathSegments);
    const arrayPath = formatScopePathSegments(arrayPathSegments);
    if (arrayValue === undefined) {
      return { ok: false, issue: "path-missing", arrayPath };
    }
    if (!Array.isArray(arrayValue)) {
      return { ok: false, issue: "not-array", arrayPath };
    }
    return {
      ok: true,
      arrayPathSegments,
      itemPathSegments: [],
      arrayValue,
    };
  }

  for (let splitAt = segments.length - 1; splitAt >= 1; splitAt--) {
    const arrayPathSegments = segments.slice(0, splitAt);
    const itemPathSegments = segments.slice(splitAt);
    const arrayValue = getValueAtScopePath(scope, arrayPathSegments);
    if (arrayValue === undefined) continue;
    if (Array.isArray(arrayValue)) {
      return {
        ok: true,
        arrayPathSegments,
        itemPathSegments,
        arrayValue,
      };
    }
  }

  const rootValue = getValueAtScopePath(scope, [segments[0]!]);
  if (rootValue === undefined) {
    return {
      ok: false,
      issue: "path-missing",
      arrayPath: segments[0],
    };
  }

  for (let splitAt = 1; splitAt < segments.length; splitAt++) {
    const arrayPathSegments = segments.slice(0, splitAt);
    const arrayValue = getValueAtScopePath(scope, arrayPathSegments);
    if (arrayValue === undefined) continue;
    if (!Array.isArray(arrayValue)) {
      return {
        ok: false,
        issue: "not-array",
        arrayPath: formatScopePathSegments(arrayPathSegments),
      };
    }
  }

  return {
    ok: false,
    issue: "path-missing",
    arrayPath: formatScopePathSegments(segments.slice(0, -1)),
  };
}

function formatSpreadItemValue(value: unknown): string {
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
}

export function evaluateSpreadScopeExpression(
  expression: string,
  scope: unknown
): ScopeSpreadEvalResult {
  const valuesResult = evaluateSpreadScopeExpressionValues(expression, scope);
  if (!valuesResult.ok) {
    return valuesResult;
  }
  return { ok: true, value: valuesResult.values.join(",") };
}

export function evaluateSpreadScopeExpressionValues(
  expression: string,
  scope: unknown
): { ok: true; values: string[] } | { ok: false; issue: ScopeSpreadEvalIssue; arrayPath?: string } {
  const resolved = resolveSpreadScopePath(expression, scope);
  if (!resolved.ok) {
    return {
      ok: false,
      issue: resolved.issue,
      arrayPath: resolved.arrayPath,
    };
  }

  const values = resolved.arrayValue
    .map((item) =>
      resolved.itemPathSegments.length === 0
        ? item
        : getValueAtScopePath(item, resolved.itemPathSegments)
    )
    .map(formatSpreadItemValue)
    .filter((value) => value.length > 0);

  return { ok: true, values };
}

export function isSpreadOnlyScopeTemplate(value: string): boolean {
  return /^\[\.\.\.\{[^}]+\}\]$/.test(value.trim());
}

export function extractSpreadScopeExpression(template: string): string | null {
  const match = /^\[\.\.\.\{([^}]+)\}\]$/.exec(template.trim());
  return match ? match[1]!.trim() : null;
}

export function isSpreadTemplateBrace(value: string, braceIndex: number): boolean {
  return value.slice(Math.max(0, braceIndex - 4), braceIndex) === "[...";
}

export function buildSpreadNotArrayWarningMessage(
  fieldLabel: string,
  template: string,
  expression: string,
  arrayPath: string,
  t: TranslateFn = tForLocale("zh-CN")
): string {
  void expression;
  const demoScope = JSON.stringify(SCOPE_SPREAD_TEMPLATE_DEMO.scope);
  const deepDemo = getScopeSpreadDeepTemplateDemo(t);
  return t("panel.scope.warnSpreadNotArray", {
    fieldLabel,
    template,
    arrayPath,
    demoScope,
    demoTemplate: SCOPE_SPREAD_TEMPLATE_DEMO.template,
    demoOutput: SCOPE_SPREAD_TEMPLATE_DEMO.output,
    deepTemplate: deepDemo.template,
    deepScope: JSON.stringify(deepDemo.scope),
    deepOutput: deepDemo.output,
  });
}

export function buildSpreadInvalidExpressionWarningMessage(
  fieldLabel: string,
  template: string,
  t: TranslateFn = tForLocale("zh-CN")
): string {
  const demoScope = JSON.stringify(SCOPE_SPREAD_TEMPLATE_DEMO.scope);
  const deepDemo = getScopeSpreadDeepTemplateDemo(t);
  return t("panel.scope.warnSpreadInvalid", {
    fieldLabel,
    template,
    demoTemplate: SCOPE_SPREAD_TEMPLATE_DEMO.template,
    deepTemplate: deepDemo.template,
    demoScope,
    demoOutput: SCOPE_SPREAD_TEMPLATE_DEMO.output,
  });
}
