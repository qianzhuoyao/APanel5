import {
  evaluateScopeTemplateInJson,
  hasScopeTemplate,
} from "./scope-template.js";
import { lintJsonString, type JsonErrorRange } from "./json-lint.js";

export type JsonNodeConfig = {
  jsonString: string;
};

export const DEFAULT_JSON_NODE_CONFIG: JsonNodeConfig = {
  jsonString: "{}",
};

export type { JsonErrorRange };
export {
  lintJsonString,
  findSuspectCharRanges,
  extractJsonErrorPosition,
  findJsonSyntaxErrorOffset,
  renderJsonWithErrorHighlights,
} from "./json-lint.js";

export function validateJsonString(
  jsonString: string
): { ok: true; value: unknown } | { ok: false; error: string; ranges?: JsonErrorRange[] } {
  const result = lintJsonString(jsonString);
  if (!result.ok) {
    return { ok: false, error: result.error, ranges: result.ranges };
  }
  return { ok: true, value: result.value };
}

/**
 * 配置期校验：
 * - 先做语法 lint（含错误区间）
 * - 语法通过且含 scope/system 模版时标记 deferred（运行时再替换）
 */
export function validateJsonStringAllowingScope(
  jsonString: string
):
  | { ok: true; value: unknown; deferred?: false }
  | { ok: true; deferred: true }
  | { ok: false; error: string; ranges: JsonErrorRange[] } {
  const lint = lintJsonString(jsonString ?? "");
  if (!lint.ok) {
    return { ok: false, error: lint.error, ranges: lint.ranges };
  }
  if (hasScopeTemplate(jsonString ?? "")) {
    return { ok: true, deferred: true };
  }
  return { ok: true, value: lint.value };
}

export function parseJsonConfig(
  config: JsonNodeConfig,
  scope?: unknown
): unknown {
  let raw = config.jsonString ?? "";
  if (hasScopeTemplate(raw)) {
    raw = evaluateScopeTemplateInJson(raw, scope);
  }
  const result = validateJsonString(raw);
  if (!result.ok) {
    throw new Error(result.error);
  }
  return result.value;
}
