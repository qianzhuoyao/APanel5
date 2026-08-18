import type { FetchRequestConfig } from "./fetch-config.js";
import {
  evaluateScopeExpression,
  evaluateScopeTemplate,
  evaluateScopeTemplateInJson,
  hasScopeTemplate,
  looksLikeJsonText,
  stringifyScopeValue,
} from "./scope-template.js";
import { isFalseSignal, isTrueSignal } from "./node-signal.js";

export type IncomingNodeSource = {
  id: string;
  label?: string;
  name?: string;
  nodeType?: string;
  type?: string;
  role?: string;
};

export type IncomingGraphEdge = {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
};

export type IncomingNodeScopeEntry = {
  id: string;
  name: string;
  type: string;
  role?: string;
  port: string;
  kind: "true" | "false" | "pending";
  value?: unknown;
  error?: string;
  timestamp?: number;
  isoTime?: string;
};

export type IncomingNodeScope =
  | IncomingNodeScopeEntry
  | Record<string, IncomingNodeScopeEntry>;

/** 尚无上游数据时，仍可联想 scope 的固定字段 */
export const FETCH_SCOPE_AUTOCOMPLETE_FALLBACK: IncomingNodeScopeEntry = {
  id: "",
  name: "",
  type: "",
  role: "",
  port: "out",
  kind: "pending",
  value: {},
  error: "",
  timestamp: 0,
  isoTime: "",
};

export function resolveFetchScopeAutocompleteRoot(scope: unknown): unknown {
  return scope === undefined ? FETCH_SCOPE_AUTOCOMPLETE_FALLBACK : scope;
}

function readOutputSignal(output: unknown): Pick<
  IncomingNodeScopeEntry,
  "kind" | "value" | "error" | "timestamp" | "isoTime"
> {
  if (output === undefined) return { kind: "pending" };
  if (isTrueSignal(output)) {
    return {
      kind: "true",
      value: output.value,
      timestamp: output.timestamp,
      isoTime: output.isoTime,
    };
  }
  if (isFalseSignal(output)) {
    return {
      kind: "false",
      error: output.error,
      timestamp: output.timestamp,
      isoTime: output.isoTime,
    };
  }
  if (output && typeof output === "object" && "kind" in output) {
    const rec = output as {
      kind?: string;
      value?: unknown;
      error?: string;
      timestamp?: number;
      isoTime?: string;
    };
    if (rec.kind === "true") {
      return {
        kind: "true",
        value: rec.value,
        timestamp: rec.timestamp,
        isoTime: rec.isoTime,
      };
    }
    if (rec.kind === "false") {
      return {
        kind: "false",
        error: rec.error,
        timestamp: rec.timestamp,
        isoTime: rec.isoTime,
      };
    }
  }
  return { kind: "true", value: output };
}

export function createIncomingNodeScopeEntry(
  node: IncomingNodeSource | undefined,
  port: string,
  output: unknown
): IncomingNodeScopeEntry {
  const id = node?.id ?? "in";
  const signal = readOutputSignal(output);
  return {
    id,
    name: node?.label?.trim() || node?.name?.trim() || id,
    type: node?.nodeType || node?.type || "unknown",
    role: node?.role,
    port,
    ...signal,
  };
}

export function buildIncomingNodeScope(
  entries: IncomingNodeScopeEntry[]
): IncomingNodeScope | undefined {
  if (entries.length === 0) return undefined;
  if (entries.length === 1) return entries[0];
  const scoped: Record<string, IncomingNodeScopeEntry> = {};
  for (const entry of entries) {
    scoped[entry.id] = entry;
  }
  return scoped;
}

export function collectIncomingNodeScopeEntries(options: {
  targetNodeId: string;
  targetPort?: string;
  nodes: IncomingNodeSource[];
  edges: IncomingGraphEdge[];
  getOutput?: (nodeId: string, port: string) => unknown;
}): IncomingNodeScopeEntry[] {
  const targetPort = options.targetPort ?? "in";
  const nodeById = new Map(options.nodes.map((node) => [node.id, node]));
  const inbound = options.edges.filter(
    (edge) =>
      edge.target === options.targetNodeId &&
      (edge.targetHandle ?? "in") === targetPort
  );

  const seen = new Set<string>();
  const entries: IncomingNodeScopeEntry[] = [];
  for (const edge of inbound) {
    const port = edge.sourceHandle ?? "out";
    const key = `${edge.source}:${port}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const output = options.getOutput?.(edge.source, port);
    entries.push(
      createIncomingNodeScopeEntry(nodeById.get(edge.source), port, output)
    );
  }
  return entries;
}

export function resolveFetchIncomingScope(options: {
  fetchNodeId: string;
  inputPort?: string;
  nodes: IncomingNodeSource[];
  edges: IncomingGraphEdge[];
  getOutput?: (nodeId: string, port: string) => unknown;
  fallbackInput?: unknown;
}): IncomingNodeScope | undefined {
  const entries = collectIncomingNodeScopeEntries({
    targetNodeId: options.fetchNodeId,
    targetPort: options.inputPort,
    nodes: options.nodes,
    edges: options.edges,
    getOutput: options.getOutput,
  });
  if (entries.length > 0) return buildIncomingNodeScope(entries);
  if (options.fallbackInput === undefined) return undefined;
  return createIncomingNodeScopeEntry(
    { id: "in", label: "in", nodeType: "input" },
    options.inputPort ?? "in",
    options.fallbackInput
  );
}

export function latestTraceOutputsByNode(
  entries: Array<{ nodeId: string; outputs?: Record<string, unknown> }>
): Record<string, Record<string, unknown>> {
  const map: Record<string, Record<string, unknown>> = {};
  for (const entry of entries) {
    map[entry.nodeId] = entry.outputs ?? {};
  }
  return map;
}

function resolveTemplateString(
  value: string | undefined,
  scope: unknown
): string | undefined {
  if (value === undefined) return undefined;
  if (!hasScopeTemplate(value)) return value;
  return evaluateScopeTemplate(value, scope);
}

export function parseJsonText(
  text: string
): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "JSON 格式无效",
    };
  }
}

export function validateFetchJsonText(
  text: string,
  options?: { allowEmpty?: boolean }
): { ok: true } | { ok: false; error: string } {
  const trimmed = text.trim();
  if (!trimmed) {
    if (options?.allowEmpty === false) {
      return { ok: false, error: "内容不能为空" };
    }
    return { ok: true };
  }
  if (isWholeScopeExpression(trimmed)) {
    return { ok: true };
  }
  if (!looksLikeJsonText(trimmed)) {
    return { ok: true };
  }
  const parsed = parseJsonText(trimmed);
  return parsed.ok ? { ok: true } : parsed;
}

export function resolveFetchBody(
  body: string | undefined,
  scope?: unknown
): string | undefined {
  if (body === undefined) return undefined;
  const trimmed = body.trim();
  if (!trimmed) return body;
  if (scope !== undefined && isWholeScopeExpression(trimmed)) {
    const value = evaluateScopeExpression(trimmed.slice(1, -1), scope);
    if (value === undefined) return "";
    if (typeof value === "string") return value;
    return stringifyScopeValue(value);
  }
  if (scope === undefined || !hasScopeTemplate(body)) return body;
  if (looksLikeJsonText(trimmed)) {
    return evaluateScopeTemplateInJson(body, scope);
  }
  return evaluateScopeTemplate(body, scope);
}

export function getFetchBodyValidationError(
  body: string | undefined,
  resolvedBody?: string
): string | null {
  const source = (resolvedBody ?? body ?? "").trim();
  if (!source) return null;
  if (isWholeScopeExpression(source)) return null;
  if (!looksLikeJsonText(source)) return null;
  const parsed = parseJsonText(source);
  if (parsed.ok) return null;
  // 仍含未求值的 {scope?...} 时，等上游数据再校验
  if (hasScopeTemplate(source)) return null;
  return parsed.error;
}

export function getFetchHeadersValidationError(
  config: FetchRequestConfig,
  scope?: unknown
): string | null {
  const raw = (config.headersJson ?? "").trim();
  if (!raw) return null;
  if (isWholeScopeExpression(raw) || hasScopeTemplate(raw)) {
    if (scope === undefined) return null;
    const parsed = parseFetchHeadersJson(raw, scope);
    if (!parsed) return "请求头模板解析后不是有效的 JSON 对象";
    return null;
  }
  const result = validateFetchJsonText(raw);
  if (!result.ok) return result.error;
  const parsed = parseFetchHeadersJson(raw, scope);
  if (!parsed) return "请求头不是有效的 JSON 对象";
  return null;
}

/** `{scope?...}` 整段表达式，区别于 JSON 对象 `{ "Authorization": "..." }` */
export function isWholeScopeExpression(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return false;
  return trimmed.slice(1, -1).trim().startsWith("scope");
}

function asHeaderRecord(value: unknown): Record<string, string> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const headers: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (raw === undefined || raw === null) continue;
    headers[key] = typeof raw === "string" ? raw : stringifyScopeValue(raw);
  }
  return headers;
}

function applyScopeToHeaderRecord(
  headers: Record<string, string>,
  scope: unknown
): Record<string, string> {
  if (scope === undefined) return headers;
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [
      evaluateScopeTemplate(String(key), scope),
      evaluateScopeTemplate(value == null ? "" : String(value), scope),
    ])
  );
}

/** 将请求头编辑器原文解析为对象；支持 JSON 内模板，也支持整段 `{scope?...}` */
export function parseFetchHeadersJson(
  text: string,
  scope?: unknown
): Record<string, string> | undefined {
  const trimmed = text.trim();
  if (!trimmed) return {};
  if (isWholeScopeExpression(trimmed)) {
    if (scope === undefined) return undefined;
    const inner = trimmed.slice(1, -1);
    return asHeaderRecord(evaluateScopeExpression(inner, scope));
  }
  let jsonText = trimmed;
  if (scope !== undefined && hasScopeTemplate(trimmed) && looksLikeJsonText(trimmed)) {
    jsonText = evaluateScopeTemplateInJson(trimmed, scope);
  }
  try {
    const parsed = asHeaderRecord(JSON.parse(jsonText));
    if (!parsed) return undefined;
    if (jsonText === trimmed) {
      return applyScopeToHeaderRecord(parsed, scope);
    }
    return parsed;
  } catch {
    return undefined;
  }
}

export function draftFetchHeadersText(config: FetchRequestConfig): string {
  if (config.headersJson !== undefined) return config.headersJson;
  try {
    return JSON.stringify(config.headers ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

export function resolveFetchHeaders(
  config: FetchRequestConfig,
  scope?: unknown
): Record<string, string> | undefined {
  const rawJson = config.headersJson;
  if (rawJson !== undefined && rawJson.trim() !== "") {
    const parsed = parseFetchHeadersJson(rawJson, scope);
    if (parsed) return parsed;
  }
  if (!config.headers) return config.headers;
  return applyScopeToHeaderRecord(config.headers, scope);
}

/** 用上游 scope 解析 fetch 表单中的 URL / Base URL / headers / body */
export function applyFetchConfigScope(
  config: FetchRequestConfig,
  scope: unknown
): FetchRequestConfig {
  const headers = resolveFetchHeaders(config, scope);
  const body = resolveFetchBody(config.body, scope);
  if (scope === undefined) {
    if (headers === config.headers && body === config.body) return config;
    return { ...config, headers, body };
  }
  return {
    ...config,
    url: resolveTemplateString(config.url, scope) ?? "",
    apiBaseUrl: resolveTemplateString(config.apiBaseUrl, scope),
    body,
    headers,
  };
}

export function fetchConfigHasScopeTemplate(config: FetchRequestConfig): boolean {
  if (hasScopeTemplate(config.url ?? "")) return true;
  if (hasScopeTemplate(config.apiBaseUrl ?? "")) return true;
  if (hasScopeTemplate(config.body ?? "")) return true;
  if (hasScopeTemplate(config.headersJson ?? "")) return true;
  const headers = config.headers ?? {};
  return Object.entries(headers).some(
    ([key, value]) => hasScopeTemplate(key) || hasScopeTemplate(String(value ?? ""))
  );
}
