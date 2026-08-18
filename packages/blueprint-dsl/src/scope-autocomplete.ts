export type ScopeAutocompleteState = {
  templateStart: number;
  cursor: number;
  path: string[];
  partialKey: string;
};

function getValueAtPath(scope: unknown, path: string[]): unknown {
  let current: unknown = scope;
  for (const part of path) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function listObjectKeys(value: unknown): string[] {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }
  return Object.keys(value as Record<string, unknown>);
}

/** 解析光标处未闭合的 scope 模版表达式 */
export function parseScopeAutocomplete(
  text: string,
  cursor: number,
  scope: unknown
): ScopeAutocompleteState | null {
  const before = text.slice(0, cursor);
  const templateStart = before.lastIndexOf("{");
  if (templateStart < 0) return null;

  const inner = before.slice(templateStart + 1);
  if (inner.includes("}")) return null;
  if (!inner.startsWith("scope")) return null;

  let body = inner.slice("scope".length);
  if (body === "" || body === "?") {
    return { templateStart, cursor, path: [], partialKey: "" };
  }
  if (!body.startsWith("?.")) return null;

  body = body.slice(2);
  if (body === "") {
    return { templateStart, cursor, path: [], partialKey: "" };
  }

  const segments = body.split("?.");
  const endsWithSeparator = inner.endsWith("?.");

  if (endsWithSeparator) {
    const path = segments.filter((segment) => segment.length > 0);
    return { templateStart, cursor, path, partialKey: "" };
  }

  const lastSegment = segments[segments.length - 1] ?? "";
  const prefixSegments = segments.slice(0, -1).filter((segment) => segment.length > 0);
  const parent = getValueAtPath(scope, prefixSegments);
  const keys = listObjectKeys(parent);

  if (lastSegment.length === 0) {
    return { templateStart, cursor, path: prefixSegments, partialKey: "" };
  }

  if (keys.includes(lastSegment)) {
    return {
      templateStart,
      cursor,
      path: [...prefixSegments, lastSegment],
      partialKey: "",
    };
  }

  return {
    templateStart,
    cursor,
    path: prefixSegments,
    partialKey: lastSegment,
  };
}

export function getScopeAutocompleteSuggestions(
  scope: unknown,
  state: ScopeAutocompleteState
): string[] {
  const parent =
    state.partialKey.length > 0
      ? getValueAtPath(scope, state.path)
      : state.path.length > 0
        ? getValueAtPath(scope, state.path)
        : scope;

  const keys = listObjectKeys(parent);
  if (state.partialKey.length === 0) return keys;
  return keys.filter((key) => key.startsWith(state.partialKey));
}

export function buildScopeExpression(path: string[], selectedKey: string): string {
  return `scope?.${[...path, selectedKey].join("?.")}`;
}

export function applyScopeAutocompleteSelection(
  text: string,
  state: ScopeAutocompleteState,
  selectedKey: string
): { value: string; cursor: number } {
  const expr = buildScopeExpression(state.path, selectedKey);
  const before = text.slice(0, state.templateStart + 1);
  const after = text.slice(state.cursor);
  const value = `${before}${expr}${after}`;
  const cursor = before.length + expr.length;
  return { value, cursor };
}
