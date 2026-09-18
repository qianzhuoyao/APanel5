import {
  TEMPLATE_ROOT_NAMES,
  getSystemAutocompleteTree,
  type TemplateRootName,
} from "./system-root.js";

export type ScopeAutocompleteState = {
  templateStart: number;
  cursor: number;
  /** 正在补全根名 scope / system */
  suggestingRoot: boolean;
  root: TemplateRootName | null;
  path: string[];
  partialKey: string;
};

function getValueAtPath(root: unknown, path: string[]): unknown {
  let current: unknown = root;
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

function matchRootPrefix(inner: string): TemplateRootName | "partial" | null {
  if (!inner) return "partial";
  for (const name of TEMPLATE_ROOT_NAMES) {
    if (inner === name) return name;
    if (name.startsWith(inner) && !inner.includes("?") && !inner.includes(".")) {
      return "partial";
    }
  }
  return null;
}

/**
 * 将 `a?.b.c?.(1)?.d` 这类片段拆成属性路径段（忽略调用括号内容）。
 * 光标处若在括号内则返回 null（暂不联想参数）。
 */
function splitPathBody(body: string): {
  segments: string[];
  endsWithSeparator: boolean;
  partialOrComplete: string;
} | null {
  let depth = 0;
  let current = "";
  const segments: string[] = [];
  let i = 0;

  while (i < body.length) {
    const ch = body[i]!;
    if (ch === "(" || ch === "[" || ch === "{") {
      depth += 1;
      current += ch;
      i += 1;
      continue;
    }
    if (ch === ")" || ch === "]" || ch === "}") {
      depth = Math.max(0, depth - 1);
      current += ch;
      i += 1;
      continue;
    }
    if (depth > 0) {
      current += ch;
      i += 1;
      continue;
    }

    if (body.startsWith("?.", i)) {
      segments.push(current);
      current = "";
      i += 2;
      continue;
    }
    if (ch === ".") {
      segments.push(current);
      current = "";
      i += 1;
      continue;
    }

    current += ch;
    i += 1;
  }

  // 光标在未闭合调用内
  if (depth > 0) return null;

  const endsWithSeparator =
    body.endsWith("?.") ||
    (body.endsWith(".") && !body.endsWith("?.") && !body.endsWith(".."));

  if (endsWithSeparator) {
    const path = segments.map((s) => stripCallSuffix(s)).filter((s) => s.length > 0);
    return { segments: path, endsWithSeparator: true, partialOrComplete: "" };
  }

  const cleaned = segments.map((s) => stripCallSuffix(s)).filter((s) => s.length > 0);
  const lastRaw = current;
  const lastClean = stripCallSuffix(lastRaw);
  // 若最后一段是完整调用如 subtract(7,'d')，视为已完成该段
  if (lastRaw.includes("(") && lastRaw.endsWith(")")) {
    return {
      segments: [...cleaned, lastClean].filter(Boolean),
      endsWithSeparator: false,
      partialOrComplete: lastClean,
    };
  }

  return {
    segments: cleaned,
    endsWithSeparator: false,
    partialOrComplete: lastClean,
  };
}

/** `subtract(7,'d')` → `subtract`；`href` → `href` */
function stripCallSuffix(segment: string): string {
  const idx = segment.indexOf("(");
  if (idx < 0) return segment.trim();
  return segment.slice(0, idx).trim();
}

/** 解析光标处未闭合的 scope / system 模版表达式 */
export function parseScopeAutocomplete(
  text: string,
  cursor: number,
  scope: unknown
): ScopeAutocompleteState | null {
  void scope;
  const before = text.slice(0, cursor);
  const templateStart = before.lastIndexOf("{");
  if (templateStart < 0) return null;

  const inner = before.slice(templateStart + 1);
  if (inner.includes("}")) return null;

  const rootMatch = matchRootPrefix(inner);
  if (rootMatch === "partial" || (rootMatch && !inner.includes("?") && !inner.includes("."))) {
    // `{` / `{s` / `{scope` / `{system` — 尚未进入 ?. 路径
    if (!inner.includes("?") && !inner.includes(".") && !inner.includes("(")) {
      return {
        templateStart,
        cursor,
        suggestingRoot: true,
        root: typeof rootMatch === "string" && rootMatch !== "partial" ? rootMatch : null,
        path: [],
        partialKey: inner,
      };
    }
  }

  let root: TemplateRootName | null = null;
  let body = "";
  if (inner.startsWith("scope")) {
    root = "scope";
    body = inner.slice("scope".length);
  } else if (inner.startsWith("system")) {
    root = "system";
    body = inner.slice("system".length);
  } else {
    return null;
  }

  if (body === "" || body === "?") {
    return {
      templateStart,
      cursor,
      suggestingRoot: false,
      root,
      path: [],
      partialKey: "",
    };
  }

  // 允许 `?.` 或裸 `.` 开头
  if (body.startsWith("?.")) {
    body = body.slice(2);
  } else if (body.startsWith(".")) {
    body = body.slice(1);
  } else {
    return null;
  }

  if (body === "") {
    return {
      templateStart,
      cursor,
      suggestingRoot: false,
      root,
      path: [],
      partialKey: "",
    };
  }

  const split = splitPathBody(body);
  if (!split) return null;

  if (split.endsWithSeparator) {
    return {
      templateStart,
      cursor,
      suggestingRoot: false,
      root,
      path: split.segments,
      partialKey: "",
    };
  }

  const lastSegment = split.partialOrComplete;
  const prefixSegments = split.segments;

  // 若 last 已是完整 key（父对象上存在），推进 path（便于继续联想下一级）
  // 具体是否存在由 getScopeAutocompleteSuggestions 判断
  return {
    templateStart,
    cursor,
    suggestingRoot: false,
    root,
    path: prefixSegments,
    partialKey: lastSegment,
  };
}

function resolveAutocompleteRoot(
  state: ScopeAutocompleteState,
  scope: unknown
): unknown {
  if (state.root === "system") return getSystemAutocompleteTree();
  return scope;
}

export function getScopeAutocompleteSuggestions(
  scope: unknown,
  state: ScopeAutocompleteState
): string[] {
  if (state.suggestingRoot) {
    return TEMPLATE_ROOT_NAMES.filter((name) =>
      name.startsWith(state.partialKey)
    );
  }

  const dataRoot = resolveAutocompleteRoot(state, scope);
  if (dataRoot === undefined || dataRoot === null) return [];

  const parent =
    state.path.length > 0 ? getValueAtPath(dataRoot, state.path) : dataRoot;

  // path 上一段若刚好是完整 key，且 partial 为空，list parent keys
  // 若 partial 非空，过滤 parent keys
  // 若 partial 是完整 key 且 parent[partial] 是对象，也可把该 key 当已选——由 Host 插入后继续
  let keys = listObjectKeys(parent);

  // 当 partialKey 已是完整成员且其后无 separator 时，仍显示以它为前缀的同级（含自身）
  if (state.partialKey.length === 0) return keys;
  keys = keys.filter((key) => key.startsWith(state.partialKey));

  // 若 partial 精确匹配某一 key，且该 key 下还有子级，仍返回同级过滤结果；
  // 用户选中后再打 ?. 继续。若希望选中后自动展开，由 apply 插入 key。
  return keys;
}

export function buildScopeExpression(
  path: string[],
  selectedKey: string,
  root: TemplateRootName = "scope"
): string {
  return `${root}?.${[...path, selectedKey].join("?.")}`;
}

export function applyScopeAutocompleteSelection(
  text: string,
  state: ScopeAutocompleteState,
  selectedKey: string
): { value: string; cursor: number } {
  const before = text.slice(0, state.templateStart + 1);
  const after = text.slice(state.cursor);

  let expr: string;
  if (state.suggestingRoot) {
    // 选根后直接带上 ?.，方便继续联想
    expr = `${selectedKey}?.`;
  } else {
    const root = state.root ?? "scope";
    expr = buildScopeExpression(state.path, selectedKey, root);
  }

  const value = `${before}${expr}${after}`;
  const cursor = before.length + expr.length;
  return { value, cursor };
}
