import type { SwaggerApiEndpoint } from "./swagger.js";

export const FETCH_HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
] as const;

export type FetchHttpMethod = (typeof FETCH_HTTP_METHODS)[number];

export const FETCH_RESPONSE_TYPES = ["json", "text"] as const;

export type FetchResponseType = (typeof FETCH_RESPONSE_TYPES)[number];

export const FETCH_CREDENTIALS = ["omit", "same-origin", "include"] as const;

export const FETCH_MODES = ["cors", "no-cors", "same-origin", "navigate"] as const;

export const FETCH_CACHES = [
  "default",
  "no-store",
  "reload",
  "no-cache",
  "force-cache",
  "only-if-cached",
] as const;

export const FETCH_REDIRECTS = ["follow", "error", "manual"] as const;

export type FetchUrlInputMode = "swagger" | "manual";

export type FetchRequestConfig = {
  url: string;
  method?: FetchHttpMethod;
  headers?: Record<string, string>;
  body?: string;
  credentials?: RequestCredentials;
  mode?: RequestMode;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  responseType?: FetchResponseType;
  timeoutMs?: number;
  /** Swagger / OpenAPI 文档 JSON 地址 */
  swaggerDocsUrl?: string;
  /** API 主机或基础路径，可与接口 path 组合 */
  apiBaseUrl?: string;
  /** 从 Swagger 文档解析出的接口列表 */
  swaggerEndpoints?: SwaggerApiEndpoint[];
  /** 请求 URL 输入方式：接口联想或手动输入 */
  urlInputMode?: FetchUrlInputMode;
};

export const DEFAULT_FETCH_REQUEST_CONFIG: FetchRequestConfig = {
  url: "",
  method: "GET",
  headers: {},
  body: "",
  credentials: "same-origin",
  mode: "cors",
  cache: "default",
  redirect: "follow",
  responseType: "json",
  timeoutMs: 30000,
};

export type FetchResultValue = {
  status: number;
  statusText: string;
  url: string;
  data: unknown;
};

function joinFetchUrl(base: string, path: string): string {
  const normalizedBase = base.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export async function executeFetch(
  config: FetchRequestConfig
): Promise<FetchResultValue> {
  const rawUrl = config.url?.trim();
  if (!rawUrl) {
    throw new Error("请求 URL 未配置");
  }

  const url =
    rawUrl.includes("://") || !config.apiBaseUrl?.trim()
      ? rawUrl
      : joinFetchUrl(config.apiBaseUrl, rawUrl);

  const method = config.method ?? "GET";
  const hasBody = method !== "GET" && method !== "HEAD";
  const body =
    hasBody && config.body?.trim() ? config.body : undefined;

  const timeoutMs = config.timeoutMs ?? 30000;
  const controller = new AbortController();
  const timer =
    timeoutMs > 0
      ? setTimeout(() => controller.abort(), timeoutMs)
      : undefined;

  try {
    const response = await fetch(url, {
      method,
      headers:
        config.headers && Object.keys(config.headers).length > 0
          ? config.headers
          : undefined,
      body,
      credentials: config.credentials,
      mode: config.mode,
      cache: config.cache,
      redirect: config.redirect,
      signal: controller.signal,
    });

    const responseType = config.responseType ?? "json";
    let data: unknown;

    if (responseType === "text") {
      data = await response.text();
    } else {
      const text = await response.text();
      if (!text) {
        data = null;
      } else {
        try {
          data = JSON.parse(text) as unknown;
        } catch {
          throw new Error("响应不是有效的 JSON");
        }
      }
    }

    if (!response.ok) {
      const detail =
        typeof data === "string"
          ? data.slice(0, 200)
          : JSON.stringify(data).slice(0, 200);
      throw new Error(
        `HTTP ${response.status} ${response.statusText}${detail ? `: ${detail}` : ""}`
      );
    }

    return {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      data,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`请求超时（${timeoutMs}ms）`);
    }
    throw error;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
