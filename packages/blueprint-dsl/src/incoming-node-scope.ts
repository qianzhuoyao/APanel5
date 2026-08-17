import type { FetchRequestConfig } from "./fetch-config.js";
import {
  evaluateScopeExpression,
  evaluateScopeTemplate,
  hasScopeTemplate,
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
  try {
    const parsed = asHeaderRecord(JSON.parse(trimmed));
    if (!parsed) return undefined;
    return applyScopeToHeaderRecord(parsed, scope);
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
  if (scope === undefined) {
    const headers = resolveFetchHeaders(config);
    return headers === config.headers ? config : { ...config, headers };
  }
  const headers = resolveFetchHeaders(config, scope);
  return {
    ...config,
    url: resolveTemplateString(config.url, scope) ?? "",
    apiBaseUrl: resolveTemplateString(config.apiBaseUrl, scope),
    body: resolveTemplateString(config.body, scope),
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
