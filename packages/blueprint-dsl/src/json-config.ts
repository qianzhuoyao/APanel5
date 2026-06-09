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

export function parseJsonConfig(config: JsonNodeConfig): unknown {
  const result = validateJsonString(config.jsonString ?? "");
  if (!result.ok) {
    throw new Error(result.error);
  }
  return result.value;
}
