import {
  evaluateScopeTemplateInJson,
  hasScopeTemplate,
} from "./scope-template.js";

export type JsonNodeConfig = {
  jsonString: string;
};

export const DEFAULT_JSON_NODE_CONFIG: JsonNodeConfig = {
  jsonString: "{}",
};

export function validateJsonString(
  jsonString: string
): { ok: true; value: unknown } | { ok: false; error: string } {
  const raw = jsonString?.trim();
  if (!raw) {
    return { ok: false, error: "JSON 不能为空" };
  }

  try {
    const value = JSON.parse(raw) as unknown;
    if (value === null || typeof value !== "object") {
      return { ok: false, error: "JSON 根节点必须是 object 或 array" };
    }
    return { ok: true, value };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "JSON 格式无效",
    };
  }
}

/** Config-time check: allow unresolved `{scope...}` templates until runtime. */
export function validateJsonStringAllowingScope(
  jsonString: string
):
  | { ok: true; value: unknown; deferred?: false }
  | { ok: true; deferred: true }
  | { ok: false; error: string } {
  if (hasScopeTemplate(jsonString ?? "")) {
    return { ok: true, deferred: true };
  }
  const result = validateJsonString(jsonString);
  if (!result.ok) return result;
  return { ok: true, value: result.value };
}

export function parseJsonConfig(
  config: JsonNodeConfig,
  scope?: unknown
): unknown {
  let raw = config.jsonString ?? "";
  if (scope !== undefined && hasScopeTemplate(raw)) {
    raw = evaluateScopeTemplateInJson(raw, scope);
  }
  const result = validateJsonString(raw);
  if (!result.ok) {
    throw new Error(result.error);
  }
  return result.value;
}
