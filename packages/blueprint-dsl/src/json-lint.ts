/**
 * JSON 文本静态检查：解析失败位置 + 常见全角/中文标点嫌疑字符。
 */

export type JsonErrorRange = {
  /** 含头不含尾的 UTF-16 下标 */
  start: number;
  end: number;
  /** suspect = 全角/中文标点；parse = 解析器报错位置 */
  kind: "suspect" | "parse";
};

export type JsonLintResult =
  | { ok: true; value: unknown }
  | { ok: false; error: string; ranges: JsonErrorRange[] };

/** 易导致 JSON 解析失败的全角 / 中文标点 */
const SUSPECT_CHAR_RE =
  /[\u201C\u201D\u2018\u2019\u300C\u300D\u300E\u300F\uFF0C\uFF1A\uFF1B\u3010\u3011\uFF08\uFF09\uFF01\uFF1F\u3001\u3002]/gu;

function lineColToOffset(text: string, line: number, column: number): number {
  const lines = text.split("\n");
  let offset = 0;
  const targetLine = Math.max(1, line) - 1;
  for (let i = 0; i < targetLine && i < lines.length; i += 1) {
    offset += lines[i]!.length + 1;
  }
  const col = Math.max(1, column) - 1;
  const lineText = lines[targetLine] ?? "";
  return offset + Math.min(col, lineText.length);
}

/** 从引擎错误信息中尽量取出出错下标 */
export function extractJsonErrorPosition(
  message: string,
  text: string
): number | null {
  let match = /position\s+(\d+)/i.exec(message);
  if (match) {
    const pos = Number(match[1]);
    if (Number.isFinite(pos) && pos >= 0) {
      return Math.min(pos, Math.max(0, text.length - 1));
    }
  }

  match = /line\s+(\d+)\s+column\s+(\d+)/i.exec(message);
  if (match) {
    const pos = lineColToOffset(text, Number(match[1]), Number(match[2]));
    return Math.min(pos, Math.max(0, text.length - 1));
  }

  match = /\bat\s+(\d+):(\d+)\b/.exec(message);
  if (match) {
    const pos = lineColToOffset(text, Number(match[1]), Number(match[2]));
    return Math.min(pos, Math.max(0, text.length - 1));
  }

  return null;
}

/**
 * 轻量扫描：找到第一个非法 token 的起始下标。
 * 用于 V8 等只报 `Unexpected token 'a'`、不带 position 的场景。
 */
export function findJsonSyntaxErrorOffset(text: string): number | null {
  const src = text;
  const len = src.length;
  let i = 0;

  const peek = () => (i < len ? src[i]! : "");
  const fail = () => (i < len ? i : Math.max(0, len - 1));

  const skipWs = () => {
    while (i < len && /[ \t\r\n]/.test(src[i]!)) i += 1;
  };

  const parseString = (): boolean => {
    if (peek() !== '"') return false;
    i += 1;
    while (i < len) {
      const c = src[i]!;
      if (c === '"') {
        i += 1;
        return true;
      }
      if (c === "\\") {
        i += 1;
        if (i >= len) return false;
        i += 1;
        continue;
      }
      i += 1;
    }
    return false;
  };

  const parseNumber = (): boolean => {
    const start = i;
    if (peek() === "-") i += 1;
    if (peek() === "0") {
      i += 1;
    } else if (/[1-9]/.test(peek())) {
      while (/[0-9]/.test(peek())) i += 1;
    } else {
      i = start;
      return false;
    }
    if (peek() === ".") {
      i += 1;
      if (!/[0-9]/.test(peek())) {
        return false;
      }
      while (/[0-9]/.test(peek())) i += 1;
    }
    if (peek() === "e" || peek() === "E") {
      i += 1;
      if (peek() === "+" || peek() === "-") i += 1;
      if (!/[0-9]/.test(peek())) return false;
      while (/[0-9]/.test(peek())) i += 1;
    }
    return i > start;
  };

  const parseLiteral = (word: string): boolean => {
    if (src.startsWith(word, i)) {
      i += word.length;
      return true;
    }
    return false;
  };

  const parseValue = (): boolean => {
    skipWs();
    if (i >= len) return false;
    const c = peek();
    if (c === "{") return parseObject();
    if (c === "[") return parseArray();
    if (c === '"') return parseString();
    if (c === "-" || /[0-9]/.test(c)) return parseNumber();
    if (parseLiteral("true") || parseLiteral("false") || parseLiteral("null")) {
      return true;
    }
    return false;
  };

  const parseObject = (): boolean => {
    if (peek() !== "{") return false;
    i += 1;
    skipWs();
    if (peek() === "}") {
      i += 1;
      return true;
    }
    while (i < len) {
      skipWs();
      if (peek() !== '"') return false;
      if (!parseString()) return false;
      skipWs();
      if (peek() !== ":") return false;
      i += 1;
      if (!parseValue()) return false;
      skipWs();
      if (peek() === ",") {
        i += 1;
        skipWs();
        if (peek() === "}" || i >= len) return false;
        continue;
      }
      if (peek() === "}") {
        i += 1;
        return true;
      }
      return false;
    }
    return false;
  };

  const parseArray = (): boolean => {
    if (peek() !== "[") return false;
    i += 1;
    skipWs();
    if (peek() === "]") {
      i += 1;
      return true;
    }
    while (i < len) {
      if (!parseValue()) return false;
      skipWs();
      if (peek() === ",") {
        i += 1;
        skipWs();
        if (peek() === "]" || i >= len) return false;
        continue;
      }
      if (peek() === "]") {
        i += 1;
        return true;
      }
      return false;
    }
    return false;
  };

  skipWs();
  if (i >= len) return 0;
  if (!parseValue()) return fail();
  skipWs();
  if (i < len) return i;
  return null;
}

function expandAround(text: string, pos: number): JsonErrorRange {
  const len = text.length;
  if (len === 0) return { start: 0, end: 0, kind: "parse" };
  const clamped = Math.max(0, Math.min(pos, len - 1));
  const ch = text[clamped]!;

  SUSPECT_CHAR_RE.lastIndex = 0;
  if (SUSPECT_CHAR_RE.test(ch)) {
    let start = clamped;
    let end = clamped + 1;
    while (start > 0) {
      SUSPECT_CHAR_RE.lastIndex = 0;
      if (!SUSPECT_CHAR_RE.test(text[start - 1]!)) break;
      start -= 1;
    }
    while (end < len) {
      SUSPECT_CHAR_RE.lastIndex = 0;
      if (!SUSPECT_CHAR_RE.test(text[end]!)) break;
      end += 1;
    }
    return { start, end, kind: "parse" };
  }

  // 标识符 / 数字：只扩当前 token，避免把 `"a":a` 扩成整段 `{"a"`
  const isTokenChar = (c: string) => /[A-Za-z0-9_$.+\-]/.test(c);
  if (isTokenChar(ch)) {
    let start = clamped;
    let end = clamped + 1;
    while (start > 0 && isTokenChar(text[start - 1]!)) start -= 1;
    while (end < len && isTokenChar(text[end]!)) end += 1;
    return { start, end, kind: "parse" };
  }

  return { start: clamped, end: clamped + 1, kind: "parse" };
}

export function findSuspectCharRanges(text: string): JsonErrorRange[] {
  const ranges: JsonErrorRange[] = [];
  SUSPECT_CHAR_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = SUSPECT_CHAR_RE.exec(text)) !== null) {
    ranges.push({
      start: match.index,
      end: match.index + match[0].length,
      kind: "suspect",
    });
  }
  return ranges;
}

function mergeRanges(ranges: JsonErrorRange[]): JsonErrorRange[] {
  if (ranges.length === 0) return [];
  const sorted = [...ranges].sort((a, b) => a.start - b.start || a.end - b.end);
  const out: JsonErrorRange[] = [];
  for (const range of sorted) {
    const last = out[out.length - 1];
    if (!last || range.start > last.end) {
      out.push({ ...range });
      continue;
    }
    last.end = Math.max(last.end, range.end);
    if (last.kind === "parse" || range.kind === "parse") last.kind = "parse";
  }
  return out;
}

/**
 * 检查 JSON 文本。失败时尽量给出可高亮的区间（含中文引号等嫌疑字符）。
 */
export function lintJsonString(jsonString: string): JsonLintResult {
  const raw = jsonString ?? "";
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "JSON 不能为空", ranges: [] };
  }

  const suspectRanges = findSuspectCharRanges(raw);
  const trimStart = raw.indexOf(trimmed);
  const offset = trimStart >= 0 ? trimStart : 0;

  try {
    const value = JSON.parse(trimmed) as unknown;
    if (value === null || typeof value !== "object") {
      return {
        ok: false,
        error: "JSON 根节点必须是 object 或 array",
        ranges: mergeRanges(suspectRanges),
      };
    }
    return { ok: true, value };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "JSON 格式无效";
    const ranges = [...suspectRanges];

    const fromEngine = extractJsonErrorPosition(message, trimmed);
    const fromScan = findJsonSyntaxErrorOffset(trimmed);
    // 优先用扫描器（更贴近真实非法 token）
    const pos = fromScan ?? fromEngine;

    if (pos != null) {
      ranges.push(expandAround(raw, offset + pos));
    } else if (ranges.length === 0 && raw.length > 0) {
      const first = raw.search(/\S/);
      ranges.push(expandAround(raw, first >= 0 ? first : 0));
    }
    return {
      ok: false,
      error: message,
      ranges: mergeRanges(ranges),
    };
  }
}

/** 将错误区间应用到文本，生成带 <mark> 的 HTML（调用方需保证样式） */
export function renderJsonWithErrorHighlights(
  text: string,
  ranges: JsonErrorRange[],
  markClass = "json-lint-error"
): string {
  const escape = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const source = text ?? "";
  const merged = mergeRanges(
    ranges.filter((r) => r.end > r.start && r.start < source.length)
  );
  if (merged.length === 0) return escape(source) || "\n";

  let html = "";
  let cursor = 0;
  for (const range of merged) {
    const start = Math.max(0, range.start);
    const end = Math.min(source.length, range.end);
    if (start > cursor) html += escape(source.slice(cursor, start));
    if (end > start) {
      html += `<mark class="${markClass}">${escape(source.slice(start, end))}</mark>`;
    }
    cursor = Math.max(cursor, end);
  }
  if (cursor < source.length) html += escape(source.slice(cursor));
  return html;
}
