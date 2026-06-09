import type { FetchHttpMethod } from "./fetch-config.js";

export type SwaggerApiEndpoint = {
  method: FetchHttpMethod;
  path: string;
  summary?: string;
  operationId?: string;
};

export type ParsedSwaggerDocument = {
  apiBaseUrl: string;
  endpoints: SwaggerApiEndpoint[];
};

const HTTP_METHODS = new Set([
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
]);

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function joinBaseAndPath(base: string, path: string): string {
  const normalizedBase = normalizeBaseUrl(base);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function resolveAgainstDocsUrl(relativeOrAbsolute: string, docsUrl: string): string {
  const trimmed = relativeOrAbsolute.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    return normalizeBaseUrl(trimmed);
  }
  try {
    const docs = new URL(docsUrl);
    if (trimmed.startsWith("/")) {
      return normalizeBaseUrl(`${docs.origin}${trimmed}`);
    }
    return normalizeBaseUrl(new URL(trimmed, `${docs.origin}/`).href);
  } catch {
    return normalizeBaseUrl(trimmed);
  }
}

function extractEndpointsFromPaths(
  paths: unknown
): SwaggerApiEndpoint[] {
  if (!paths || typeof paths !== "object") return [];

  const endpoints: SwaggerApiEndpoint[] = [];

  for (const [path, item] of Object.entries(paths as Record<string, unknown>)) {
    if (!item || typeof item !== "object") continue;

    for (const [method, operation] of Object.entries(item as Record<string, unknown>)) {
      if (!HTTP_METHODS.has(method.toLowerCase())) continue;
      if (!operation || typeof operation !== "object") continue;

      const op = operation as Record<string, unknown>;
      endpoints.push({
        method: method.toUpperCase() as FetchHttpMethod,
        path,
        summary: typeof op.summary === "string" ? op.summary : undefined,
        operationId:
          typeof op.operationId === "string" ? op.operationId : undefined,
      });
    }
  }

  return endpoints.sort((a, b) =>
    `${a.path}:${a.method}`.localeCompare(`${b.path}:${b.method}`)
  );
}

function parseOpenApiV3(
  spec: Record<string, unknown>,
  docsUrl: string
): ParsedSwaggerDocument {
  const servers = Array.isArray(spec.servers) ? spec.servers : [];
  const firstServer =
    servers.find((item) => item && typeof item === "object") as
      | Record<string, unknown>
      | undefined;
  const serverUrl =
    typeof firstServer?.url === "string" ? firstServer.url : "";
  const apiBaseUrl = serverUrl
    ? resolveAgainstDocsUrl(serverUrl, docsUrl)
    : resolveAgainstDocsUrl(new URL(docsUrl).origin, docsUrl);

  return {
    apiBaseUrl,
    endpoints: extractEndpointsFromPaths(spec.paths),
  };
}

function parseSwaggerV2(
  spec: Record<string, unknown>,
  docsUrl: string
): ParsedSwaggerDocument {
  const schemes = Array.isArray(spec.schemes) ? spec.schemes : ["https"];
  const scheme =
    typeof schemes[0] === "string" ? schemes[0] : "https";
  const host = typeof spec.host === "string" ? spec.host : new URL(docsUrl).host;
  const basePath =
    typeof spec.basePath === "string" ? spec.basePath : "";
  const apiBaseUrl = normalizeBaseUrl(`${scheme}://${host}${basePath}`);

  return {
    apiBaseUrl,
    endpoints: extractEndpointsFromPaths(spec.paths),
  };
}

export function parseSwaggerDocument(
  spec: unknown,
  docsUrl: string
): ParsedSwaggerDocument {
  if (!spec || typeof spec !== "object") {
    throw new Error("Swagger 文档格式无效");
  }

  const document = spec as Record<string, unknown>;

  if (typeof document.openapi === "string") {
    const parsed = parseOpenApiV3(document, docsUrl);
    if (parsed.endpoints.length === 0) {
      throw new Error("未在 OpenAPI 文档中找到接口");
    }
    return parsed;
  }

  if (document.swagger === "2.0" || document.swagger === 2) {
    const parsed = parseSwaggerV2(document, docsUrl);
    if (parsed.endpoints.length === 0) {
      throw new Error("未在 Swagger 2.0 文档中找到接口");
    }
    return parsed;
  }

  throw new Error("仅支持 OpenAPI 3.x 与 Swagger 2.0 文档");
}

export function buildEndpointFullUrl(
  apiBaseUrl: string,
  pathOrEndpoint: string | Pick<SwaggerApiEndpoint, "path">
): string {
  const path =
    typeof pathOrEndpoint === "string" ? pathOrEndpoint : pathOrEndpoint.path;
  return joinBaseAndPath(apiBaseUrl, path);
}

export function buildEndpointSuggestions(
  apiBaseUrl: string,
  endpoints: SwaggerApiEndpoint[]
) {
  return endpoints.map((endpoint) => {
    const fullUrl = buildEndpointFullUrl(apiBaseUrl, endpoint);
    const labelParts = [
      endpoint.method,
      endpoint.path,
      endpoint.summary ? `· ${endpoint.summary}` : "",
    ].filter(Boolean);
    return {
      ...endpoint,
      fullUrl,
      label: labelParts.join(" "),
    };
  });
}

export function filterEndpointSuggestions(
  suggestions: ReturnType<typeof buildEndpointSuggestions>,
  query: string
) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return suggestions;
  return suggestions.filter(
    (item) =>
      item.fullUrl.toLowerCase().includes(keyword) ||
      item.path.toLowerCase().includes(keyword) ||
      item.method.toLowerCase().includes(keyword) ||
      item.summary?.toLowerCase().includes(keyword) ||
      item.operationId?.toLowerCase().includes(keyword)
  );
}
