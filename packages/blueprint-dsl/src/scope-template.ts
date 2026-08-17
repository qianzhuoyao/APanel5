const SCOPE_TEMPLATE_RE = /\{[^}]+\}/;

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

export function stringifyScopeValue(value: unknown): string {
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

/** 将 `{scope?.a}` 替换为求值结果；无模板时原样返回 */
export function evaluateScopeTemplate(template: string, scope: unknown): string {
  if (!hasScopeTemplate(template)) return template;
  return template.replace(/\{([^}]+)\}/g, (_match, rawExpr: string) =>
    stringifyScopeValue(evaluateScopeExpression(rawExpr, scope))
  );
}
