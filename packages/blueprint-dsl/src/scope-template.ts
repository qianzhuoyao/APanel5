/** 仅匹配 `{scope...}`，避免把 JSON 对象 `{ "a": 1 }` 误当成模板 */
const SCOPE_TOKEN_RE = /\{(scope[^}]*)\}/g;

export function hasScopeTemplate(value: string): boolean {
  SCOPE_TOKEN_RE.lastIndex = 0;
  return SCOPE_TOKEN_RE.test(value);
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

function isInsideJsonString(before: string): boolean {
  let inString = false;
  let escape = false;
  for (const ch of before) {
    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === "\\") {
        escape = true;
        continue;
      }
      if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
  }
  return inString;
}

function replaceScopeTokens(
  template: string,
  scope: unknown,
  replacer: (value: unknown, offset: number) => string
): string {
  SCOPE_TOKEN_RE.lastIndex = 0;
  return template.replace(SCOPE_TOKEN_RE, (_match, rawExpr: string, offset: number) =>
    replacer(evaluateScopeExpression(rawExpr, scope), offset)
  );
}

/** 将 `{scope?.a}` 替换为求值结果；无模板时原样返回 */
export function evaluateScopeTemplate(template: string, scope: unknown): string {
  if (!hasScopeTemplate(template)) return template;
  return replaceScopeTokens(template, scope, (value) => stringifyScopeValue(value));
}

/**
 * 在 JSON 文本中替换 `{scope?...}`：
 * - 位于字符串内时写入转义后的内容
 * - 位于值位置时写入 JSON 字面量（对象/数组/字符串/数字）
 */
export function evaluateScopeTemplateInJson(template: string, scope: unknown): string {
  if (!hasScopeTemplate(template)) return template;
  return replaceScopeTokens(template, scope, (value, offset) => {
    if (isInsideJsonString(template.slice(0, offset))) {
      return JSON.stringify(stringifyScopeValue(value)).slice(1, -1);
    }
    if (value === undefined) return "null";
    return JSON.stringify(value);
  });
}

export function looksLikeJsonText(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.startsWith("{") || trimmed.startsWith("[");
}
