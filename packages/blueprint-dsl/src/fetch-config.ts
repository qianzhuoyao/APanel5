import type { SwaggerApiEndpoint } from "./swagger.js";
import { looksLikeJsonText } from "./scope-template.js";

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
  /**
   * 请求头编辑器原文。可写 JSON，也可整段写成 `{scope?...}`。
   * 运行时优先按该字段解析，避免未加引号的模板在 JSON.parse 时被丢掉。
   */
  headersJson?: string;
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

/** 合并默认项与节点上保存的 fetch 配置，供运行时发起请求 */
export function normalizeFetchRequestConfig(
  config?: FetchRequestConfig
): FetchRequestConfig {
  return {
    ...DEFAULT_FETCH_REQUEST_CONFIG,
    ...config,
    headers: {
      ...DEFAULT_FETCH_REQUEST_CONFIG.headers,
      ...config?.headers,
    },
    headersJson: config?.headersJson,
    swaggerEndpoints: config?.swaggerEndpoints,
  };
}

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

function getUrlAuthorityPart(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith("/")) return null;
  const slashIndex = trimmed.indexOf("/");
  return slashIndex === -1 ? trimmed : trimmed.slice(0, slashIndex);
}

function isAbsoluteHostAuthority(authority: string): boolean {
  if (/^localhost$/i.test(authority)) return true;
  if (/^localhost:\d+$/i.test(authority)) return true;
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(authority)) return true;
  if (/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(authority)) return true;
  if (/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(authority) && authority.includes(".")) {
    return true;
  }
  if (/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}(?::\d+)?$/i.test(authority)) {
    return true;
  }
  if (/^[a-z0-9-]+:\d+$/i.test(authority)) return true;
  return false;
}

function hasExplicitUrlScheme(url: string): boolean {
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(url) || url.startsWith("//");
}

/** 解析 fetch 节点的最终请求 URL，避免对已有主机信息的地址重复拼接 apiBaseUrl */
export function resolveFetchRequestUrl(
  config: Pick<FetchRequestConfig, "url" | "apiBaseUrl">
): string {
  const rawUrl = config.url?.trim() ?? "";
  if (!rawUrl) {
    throw new Error("请求 URL 未配置");
  }

  if (hasExplicitUrlScheme(rawUrl)) {
    return rawUrl;
  }

  const authority = getUrlAuthorityPart(rawUrl);
  if (authority && isAbsoluteHostAuthority(authority)) {
    return `http://${rawUrl}`;
  }

  const apiBaseUrl = config.apiBaseUrl?.trim();
  if (!apiBaseUrl) {
    return rawUrl;
  }

  return joinFetchUrl(apiBaseUrl, rawUrl);
}

export type ExecuteFetchOptions = {
  signal?: AbortSignal;
  /** 调试模式下 HTTP 非 2xx 仍返回响应体，不抛错 */
  allowHttpError?: boolean;
};

function linkAbortSignal(
  controller: AbortController,
  external?: AbortSignal
): () => void {
  if (!external) return () => {};
  if (external.aborted) {
    controller.abort();
    return () => {};
  }
  const onAbort = () => controller.abort();
  external.addEventListener("abort", onAbort);
  return () => external.removeEventListener("abort", onAbort);
}

export async function executeFetch(
  config: FetchRequestConfig,
  options?: ExecuteFetchOptions
): Promise<FetchResultValue> {
  const rawUrl = config.url?.trim();
  if (!rawUrl) {
    throw new Error("请求 URL 未配置");
  }

  const url = resolveFetchRequestUrl(config);

  const method = config.method ?? "GET";
  const hasBody = method !== "GET" && method !== "HEAD";
  const body =
    hasBody && config.body?.trim() ? config.body : undefined;

  if (body && looksLikeJsonText(body)) {
    try {
      JSON.parse(body);
    } catch (error) {
      throw new Error(
        `请求体不是有效 JSON：${error instanceof Error ? error.message : "格式无效"}`
      );
    }
  }

  const headers: Record<string, string> = { ...(config.headers ?? {}) };
  const hasContentType = Object.keys(headers).some(
    (key) => key.toLowerCase() === "content-type"
  );
  if (body && looksLikeJsonText(body) && !hasContentType) {
    headers["Content-Type"] = "application/json";
  }

  const timeoutMs = config.timeoutMs ?? 30000;
  const controller = new AbortController();
  const unlinkExternal = linkAbortSignal(controller, options?.signal);
  const timer =
    timeoutMs > 0
      ? setTimeout(() => controller.abort(), timeoutMs)
      : undefined;

  try {
    const response = await fetch(url, {
      method,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
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
          if (options?.allowHttpError) {
            data = text;
          } else {
            throw new Error("响应不是有效的 JSON");
          }
        }
      }
    }

    if (!response.ok && !options?.allowHttpError) {
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
      if (options?.signal?.aborted) {
        throw new Error("请求已中止");
      }
      throw new Error(`请求超时（${timeoutMs}ms）`);
    }
    throw error;
  } finally {
    unlinkExternal();
    if (timer) clearTimeout(timer);
  }
}
