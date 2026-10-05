import {
  FETCH_HTTP_METHODS,
  type FetchHttpMethod,
  type FetchRequestConfig,
} from "./fetch-config.js";
import { hasScopeTemplate } from "./scope-template.js";
import { dslMessage } from "./messages.js";

export const API_COLLECTION_DOCUMENT_VERSION = 1 as const;

/** 集合内单条接口 */
export type ApiCollectionEndpoint = {
  /** 下拉展示名，集合内建议唯一 */
  name: string;
  /** 请求路径或完整 URL，可含 `{scope?...}` */
  url: string;
  method: FetchHttpMethod;
  /** 查询参数；选中后会拼进 url；value 可含 `{scope?...}` */
  params?: Record<string, string>;
  /** 请求头；value 可含 `{scope?...}` */
  headers?: Record<string, string>;
  /** 请求体原文（多为 JSON 字符串），可含 `{scope?...}` */
  body?: string;
  /** 接口说明；配置侧栏选中时气泡展示 */
  description?: string;
};

/** 用户上传 / 编辑的 JSON 文档形状 */
export type ApiCollectionDocument = {
  version: typeof API_COLLECTION_DOCUMENT_VERSION;
  /** 集合显示名 */
  name: string;
  /** 可选 API 主机，写入 Fetch 的 apiBaseUrl；可含 `{scope?...}` */
  baseUrl?: string;
  apis: ApiCollectionEndpoint[];
};

/** 运行时 / IndexedDB 记录 */
export type ApiCollectionRecord = {
  id: string;
  name: string;
  /** true 时写入 IndexedDB；false 仅内存，刷新丢失 */
  persistLocal: boolean;
  document: ApiCollectionDocument;
  /** 编辑器里的原文，便于再编辑 */
  rawJson: string;
  createdAt: number;
  updatedAt: number;
};

export type ApiCollectionListItem = {
  id: string;
  name: string;
  persistLocal: boolean;
  apiCount: number;
  updatedAt: number;
};

export type ApiCollectionParseResult =
  | { ok: true; document: ApiCollectionDocument; rawJson: string }
  | { ok: false; error: string };

const HTTP_METHOD_SET = new Set<string>(FETCH_HTTP_METHODS);

function isPlainStringRecord(value: unknown): value is Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.values(value as Record<string, unknown>).every(
    (item) => typeof item === "string"
  );
}

function normalizeEndpoint(raw: unknown, index: number): ApiCollectionEndpoint | string {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return dslMessage("apiItemMustBeObject", { index });
  }
  const item = raw as Record<string, unknown>;
  const name = typeof item.name === "string" ? item.name.trim() : "";
  if (!name) return dslMessage("apiItemFieldRequired", { index, field: "name" });

  const url = typeof item.url === "string" ? item.url.trim() : "";
  if (!url) return dslMessage("apiItemFieldRequired", { index, field: "url" });

  const methodRaw =
    typeof item.method === "string" ? item.method.trim().toUpperCase() : "";
  if (!HTTP_METHOD_SET.has(methodRaw)) {
    return dslMessage("apiItemMethodInvalid", { index, methods: FETCH_HTTP_METHODS.join(" / ") });
  }

  if (item.params !== undefined && !isPlainStringRecord(item.params)) {
    return dslMessage("apiItemFieldStringMap", { index, field: "params" });
  }
  if (item.headers !== undefined && !isPlainStringRecord(item.headers)) {
    return dslMessage("apiItemFieldStringMap", { index, field: "headers" });
  }
  if (item.body !== undefined && typeof item.body !== "string") {
    return dslMessage("apiItemFieldString", { index, field: "body" });
  }
  if (item.description !== undefined && typeof item.description !== "string") {
    return dslMessage("apiItemFieldString", { index, field: "description" });
  }

  return {
    name,
    url,
    method: methodRaw as FetchHttpMethod,
    ...(item.params ? { params: item.params } : {}),
    ...(item.headers ? { headers: item.headers } : {}),
    ...(typeof item.body === "string" ? { body: item.body } : {}),
    ...(typeof item.description === "string"
      ? { description: item.description }
      : {}),
  };
}

/** 校验并规范化集合文档（对象或已 parse 的 JSON） */
export function validateApiCollectionDocument(
  input: unknown
): { ok: true; document: ApiCollectionDocument } | { ok: false; error: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: dslMessage("apiRootMustBeObject") };
  }
  const root = input as Record<string, unknown>;
  const version = root.version;
  if (version !== API_COLLECTION_DOCUMENT_VERSION && version !== "1") {
    return {
      ok: false,
      error: dslMessage("apiVersionMismatch", { version: API_COLLECTION_DOCUMENT_VERSION }),
    };
  }
  const name = typeof root.name === "string" ? root.name.trim() : "";
  if (!name) return { ok: false, error: dslMessage("apiNameRequired") };

  if (root.baseUrl !== undefined && typeof root.baseUrl !== "string") {
    return { ok: false, error: dslMessage("apiBaseUrlString") };
  }

  if (!Array.isArray(root.apis)) {
    return { ok: false, error: dslMessage("apiListMustBeArray") };
  }
  if (root.apis.length === 0) {
    return { ok: false, error: dslMessage("apiListEmpty") };
  }

  const apis: ApiCollectionEndpoint[] = [];
  const nameSet = new Set<string>();
  for (let i = 0; i < root.apis.length; i += 1) {
    const normalized = normalizeEndpoint(root.apis[i], i);
    if (typeof normalized === "string") {
      return { ok: false, error: normalized };
    }
    if (nameSet.has(normalized.name)) {
      return { ok: false, error: dslMessage("apiNameDuplicated", { name: normalized.name }) };
    }
    nameSet.add(normalized.name);
    apis.push(normalized);
  }

  return {
    ok: true,
    document: {
      version: API_COLLECTION_DOCUMENT_VERSION,
      name,
      ...(typeof root.baseUrl === "string" && root.baseUrl.trim()
        ? { baseUrl: root.baseUrl.trim() }
        : {}),
      apis,
    },
  };
}

/** 解析上传 / 编辑框里的 JSON 文本 */
export function parseApiCollectionJson(text: string): ApiCollectionParseResult {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: dslMessage("contentEmpty") };
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed) as unknown;
  } catch (error) {
    return {
      ok: false,
      error: dslMessage("invalidJson", {
        reason: error instanceof Error ? error.message : dslMessage("invalidFormat"),
      }),
    };
  }
  const validated = validateApiCollectionDocument(parsed);
  if (!validated.ok) return validated;
  return {
    ok: true,
    document: validated.document,
    rawJson: JSON.stringify(validated.document, null, 2),
  };
}

export function createApiCollectionId(): string {
  return `api_col_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function apiCollectionToListItem(
  record: ApiCollectionRecord
): ApiCollectionListItem {
  return {
    id: record.id,
    name: record.name,
    persistLocal: record.persistLocal,
    apiCount: record.document.apis.length,
    updatedAt: record.updatedAt,
  };
}

/** 可下载的示例模版（已通过校验；value 可写 `{scope?...}`） */
export function getApiCollectionTemplateDocument(): ApiCollectionDocument {
  return {
    version: API_COLLECTION_DOCUMENT_VERSION,
    name: dslMessage("apiTemplateName"),
    baseUrl: "https://api.example.com",
    apis: [
      {
        name: dslMessage("apiTemplateListUsers"),
        method: "GET",
        url: "/users",
        params: {
          page: "{scope?.value?.page}",
          pageSize: "20",
          tenant: "{scope?.value?.tenant}",
        },
        headers: {
          Accept: "application/json",
          Authorization: "Bearer {scope?.value?.token}",
        },
        description: dslMessage("apiTemplateListUsersDesc"),
      },
      {
        name: dslMessage("apiTemplateCreateUser"),
        method: "POST",
        url: "/tenants/{scope?.value?.tenant}/users",
        headers: { "Content-Type": "application/json" },
        body: '{\n  "name": "{scope?.value?.name}",\n  "role": "member"\n}',
        description: dslMessage("apiTemplateCreateUserDesc"),
      },
      {
        name: dslMessage("apiTemplateGetUser"),
        method: "GET",
        url: "/users/{scope?.value?.id}",
        headers: { Accept: "application/json" },
        description: dslMessage("apiTemplateGetUserDesc"),
      },
    ],
  };
}

export function getApiCollectionTemplateJson(): string {
  return `${JSON.stringify(getApiCollectionTemplateDocument(), null, 2)}\n`;
}

export function downloadApiCollectionTemplate(filename = "abuilder-api-collection-template.json") {
  if (typeof document === "undefined") return;
  const blob = new Blob([getApiCollectionTemplateJson()], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

/**
 * 编码 query value，但保留 `{scope...}` / `{system...}` 片段不编码，
 * 以便回填到 Fetch 后仍能被 applyFetchConfigScope 解析。
 */
function encodeQueryValuePreservingScope(value: string): string {
  if (!hasScopeTemplate(value)) return encodeURIComponent(value);
  const re = /\{((?:scope|system)[^}]*)\}/g;
  let result = "";
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(value)) !== null) {
    result += encodeURIComponent(value.slice(lastIndex, match.index));
    result += match[0];
    lastIndex = match.index + match[0].length;
  }
  result += encodeURIComponent(value.slice(lastIndex));
  return result;
}

/** 把 params 拼进 url（params 的 value 支持 Scope 模版） */
export function buildApiCollectionEndpointUrl(endpoint: ApiCollectionEndpoint): string {
  const base = endpoint.url.trim();
  const params = endpoint.params;
  if (!params || Object.keys(params).length === 0) return base;
  const search = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && String(value).length > 0)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeQueryValuePreservingScope(String(value))}`
    )
    .join("&");
  if (!search) return base;
  return base.includes("?") ? `${base}&${search}` : `${base}?${search}`;
}

/** 同步匹配用：去掉 query / hash，忽略末尾斜杠 */
export function normalizeApiCollectionUrlKey(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  const withoutHash = trimmed.split("#")[0] ?? trimmed;
  const queryIndex = withoutHash.indexOf("?");
  const pathOnly =
    queryIndex === -1 ? withoutHash : withoutHash.slice(0, queryIndex);
  const normalized = pathOnly.replace(/\/+$/, "");
  return normalized || "/";
}

export type ApiCollectionFetchNodeLike = {
  id: string;
  label?: string;
  fetchConfig?: FetchRequestConfig | null;
};

export type ApiCollectionSyncChangedField =
  | "url"
  | "method"
  | "headers"
  | "body"
  | "apiBaseUrl";

export type ApiCollectionSyncNodePatch = {
  nodeId: string;
  nodeLabel: string;
  changedFields: ApiCollectionSyncChangedField[];
  fetchConfigPatch: Partial<FetchRequestConfig>;
};

export type ApiCollectionSyncResult = {
  updatedCount: number;
  nodes: Array<{
    id: string;
    label: string;
    changedFields: ApiCollectionSyncChangedField[];
  }>;
};

function stableHeadersText(headers?: Record<string, string> | null): string {
  if (!headers || Object.keys(headers).length === 0) return "";
  const sorted = Object.keys(headers)
    .sort()
    .reduce<Record<string, string>>((acc, key) => {
      acc[key] = headers[key] ?? "";
      return acc;
    }, {});
  return JSON.stringify(sorted);
}

function diffFetchConfigChanges(
  prev: FetchRequestConfig | null | undefined,
  next: Partial<FetchRequestConfig>
): ApiCollectionSyncChangedField[] {
  const changed: ApiCollectionSyncChangedField[] = [];
  const prevUrl = prev?.url?.trim() ?? "";
  const nextUrl = next.url?.trim() ?? "";
  if (prevUrl !== nextUrl) changed.push("url");

  const prevMethod = (prev?.method ?? "GET").toUpperCase();
  const nextMethod = (next.method ?? "GET").toUpperCase();
  if (prevMethod !== nextMethod) changed.push("method");

  if (stableHeadersText(prev?.headers) !== stableHeadersText(next.headers)) {
    changed.push("headers");
  }

  if ((prev?.body ?? "").trim() !== (next.body ?? "").trim()) {
    changed.push("body");
  }

  if ((prev?.apiBaseUrl?.trim() ?? "") !== (next.apiBaseUrl?.trim() ?? "")) {
    changed.push("apiBaseUrl");
  }

  return changed;
}

function pickEndpointForNode(
  node: ApiCollectionFetchNodeLike,
  collectionId: string,
  candidates: ApiCollectionEndpoint[]
): ApiCollectionEndpoint | null {
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0] ?? null;

  const config = node.fetchConfig;
  if (
    config?.apiCollectionId === collectionId &&
    config.apiCollectionEndpointName
  ) {
    const byName = candidates.find(
      (item) => item.name === config.apiCollectionEndpointName
    );
    if (byName) return byName;
  }

  const method = config?.method?.toUpperCase();
  if (method) {
    const byMethod = candidates.filter((item) => item.method === method);
    if (byMethod.length === 1) return byMethod[0] ?? null;
    if (byMethod.length > 1) return byMethod[0] ?? null;
  }

  return candidates[0] ?? null;
}

/**
 * 按 URL（忽略 query）匹配 Fetch 节点，生成回填 patch。
 * URL 对不上的节点不会出现在结果里。
 */
export function buildApiCollectionSyncPatches(options: {
  collectionId: string;
  document: ApiCollectionDocument;
  nodes: ApiCollectionFetchNodeLike[];
}): ApiCollectionSyncNodePatch[] {
  const { collectionId, document, nodes } = options;
  const byUrl = new Map<string, ApiCollectionEndpoint[]>();
  for (const endpoint of document.apis) {
    const key = normalizeApiCollectionUrlKey(endpoint.url);
    if (!key) continue;
    const list = byUrl.get(key) ?? [];
    list.push(endpoint);
    byUrl.set(key, list);
  }

  const patches: ApiCollectionSyncNodePatch[] = [];
  const syncedAt = Date.now();
  for (const node of nodes) {
    const nodeUrl = node.fetchConfig?.url;
    if (!nodeUrl?.trim()) continue;
    const key = normalizeApiCollectionUrlKey(nodeUrl);
    if (!key) continue;
    const candidates = byUrl.get(key) ?? [];
    const endpoint = pickEndpointForNode(node, collectionId, candidates);
    if (!endpoint) continue;
    const fetchConfigPatch = applyApiCollectionEndpointToFetchConfig({
      collectionId,
      document,
      endpoint,
    });
    const changedFields = diffFetchConfigChanges(node.fetchConfig, fetchConfigPatch);
    fetchConfigPatch.apiCollectionSyncNotice = {
      source: "api-collection-sync",
      collectionName: document.name,
      endpointName: endpoint.name,
      changedFields,
      updatedAt: syncedAt,
    };
    patches.push({
      nodeId: node.id,
      nodeLabel: (node.label ?? "").trim() || node.id,
      changedFields,
      fetchConfigPatch,
    });
  }
  return patches;
}

export function toApiCollectionSyncResult(
  patches: ApiCollectionSyncNodePatch[]
): ApiCollectionSyncResult {
  return {
    updatedCount: patches.length,
    nodes: patches.map((patch) => ({
      id: patch.nodeId,
      label: patch.nodeLabel,
      changedFields: patch.changedFields,
    })),
  };
}

/** 选中集合接口后回填到 Fetch 配置 */
export function applyApiCollectionEndpointToFetchConfig(options: {
  collectionId: string;
  document: ApiCollectionDocument;
  endpoint: ApiCollectionEndpoint;
}): Partial<FetchRequestConfig> {
  const { collectionId, document, endpoint } = options;
  const headers = endpoint.headers ?? {};
  return {
    url: buildApiCollectionEndpointUrl(endpoint),
    method: endpoint.method,
    headers,
    headersJson:
      Object.keys(headers).length > 0
        ? JSON.stringify(headers, null, 2)
        : "",
    body: endpoint.body ?? "",
    apiBaseUrl: document.baseUrl?.trim() || undefined,
    urlInputMode: "collection",
    apiCollectionId: collectionId,
    apiCollectionEndpointName: endpoint.name,
  };
}
