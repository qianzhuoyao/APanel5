import {
  createSystemRoot,
  isDayjsValue,
  type SystemRoot,
} from "./system-root.js";

/**
 * 匹配 `{scope...}` / `{system...}`。
 * 不吃普通 JSON `{ "a": 1 }`；token 内不可再含 `}`。
 */
const TEMPLATE_TOKEN_RE = /\{((?:scope|system)[^}]*)\}/g;

/** @deprecated 名称保留兼容；实际同时识别 scope 与 system */
export function hasScopeTemplate(value: string): boolean {
  TEMPLATE_TOKEN_RE.lastIndex = 0;
  return TEMPLATE_TOKEN_RE.test(value);
}

export const hasTemplateExpression = hasScopeTemplate;

export function evaluateScopeExpression(
  expression: string,
  scope: unknown,
  system: SystemRoot = createSystemRoot()
): unknown {
  const trimmed = expression.trim();
  if (!trimmed) return undefined;
  try {
    const fn = new Function(
      "scope",
      "system",
      `"use strict"; return (${trimmed});`
    );
    return fn(scope, system);
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
  if (isDayjsValue(value)) {
    return value.toISOString();
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

function replaceTemplateTokens(
  template: string,
  scope: unknown,
  system: SystemRoot,
  replacer: (value: unknown, offset: number) => string
): string {
  TEMPLATE_TOKEN_RE.lastIndex = 0;
  return template.replace(
    TEMPLATE_TOKEN_RE,
    (_match, rawExpr: string, offset: number) =>
      replacer(evaluateScopeExpression(rawExpr, scope, system), offset)
  );
}

/** 将 `{scope?...}` / `{system?...}` 替换为求值结果；无模板时原样返回 */
export function evaluateScopeTemplate(
  template: string,
  scope: unknown,
  system: SystemRoot = createSystemRoot()
): string {
  if (!hasScopeTemplate(template)) return template;
  return replaceTemplateTokens(template, scope, system, (value) =>
    stringifyScopeValue(value)
  );
}

/**
 * 在 JSON 文本中替换模板：
 * - 位于字符串内时写入转义后的内容
 * - 位于值位置时写入 JSON 字面量（对象/数组/字符串/数字）
 */
export function evaluateScopeTemplateInJson(
  template: string,
  scope: unknown,
  system: SystemRoot = createSystemRoot()
): string {
  if (!hasScopeTemplate(template)) return template;
  return replaceTemplateTokens(template, scope, system, (value, offset) => {
    if (isInsideJsonString(template.slice(0, offset))) {
      return JSON.stringify(stringifyScopeValue(value)).slice(1, -1);
    }
    if (value === undefined) return "null";
    if (isDayjsValue(value)) return JSON.stringify(value.toISOString());
    return JSON.stringify(value);
  });
}

export function looksLikeJsonText(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.startsWith("{") || trimmed.startsWith("[");
}

/** 编码时保留未解析的 scope/system 模版片段 */
export function preserveTemplateTokensInEncode(value: string): boolean {
  return hasScopeTemplate(value);
}
