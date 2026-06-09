import { useCallback, useState, type ChangeEvent } from "react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@arron/ui";
import type {
  FetchHttpMethod,
  FetchRequestConfig,
  FetchResponseType,
} from "@arron/blueprint-dsl";
import {
  FETCH_CACHES,
  FETCH_CREDENTIALS,
  FETCH_HTTP_METHODS,
  FETCH_MODES,
  FETCH_REDIRECTS,
  FETCH_RESPONSE_TYPES,
} from "@arron/blueprint-dsl";

import type { BlueprintGraphNode } from "../graph/document";
import { resolveNodeFetchConfig } from "../graph/document";
import {
  cancelSwaggerLoadTask,
  startSwaggerLoadTask,
  useSwaggerLoadTask,
} from "../fetch-config-task-store";
import { FetchUrlAutocomplete } from "./FetchUrlAutocomplete";

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4z" />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
  );
}

function LoaderIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("animate-spin", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  );
}

export type FetchNodeConfigPanelProps = {
  node: BlueprintGraphNode;
  onUpdateNode: (
    nodeId: string,
    patch: Partial<Pick<BlueprintGraphNode, "fetchConfig" | "configSource">>
  ) => void;
};

function patchFetchConfig(
  node: BlueprintGraphNode,
  patch: Partial<FetchRequestConfig>
) {
  return {
    fetchConfig: { ...resolveNodeFetchConfig(node), ...patch },
    configSource: "fetch" as const,
  };
}

export function FetchNodeConfigPanel({
  node,
  onUpdateNode,
}: FetchNodeConfigPanelProps) {
  const fetchConfig = resolveNodeFetchConfig(node);
  const endpoints = fetchConfig.swaggerEndpoints ?? [];
  const hasSwaggerEndpoints = endpoints.length > 0;
  const urlInputMode =
    fetchConfig.urlInputMode ?? (hasSwaggerEndpoints ? "swagger" : "manual");
  const swaggerTask = useSwaggerLoadTask(node.id);
  const loadingSwagger = swaggerTask.status === "loading";
  const swaggerTaskError =
    swaggerTask.status === "error" ? swaggerTask.error : null;
  const [validationError, setValidationError] = useState<string | null>(null);
  const swaggerError = validationError ?? swaggerTaskError;

  const setUrlInputMode = useCallback(
    (mode: "swagger" | "manual") => {
      onUpdateNode(node.id, patchFetchConfig(node, { urlInputMode: mode }));
    },
    [node, onUpdateNode]
  );

  const handleLoadSwagger = useCallback(() => {
    const docsUrl = fetchConfig.swaggerDocsUrl?.trim();
    if (!docsUrl) {
      setValidationError("请先填写 Swagger 文档 URL");
      return;
    }

    setValidationError(null);
    startSwaggerLoadTask({
      nodeId: node.id,
      docsUrl,
      onSuccess: (parsed, url) => {
        onUpdateNode(
          node.id,
          patchFetchConfig(node, {
            swaggerDocsUrl: url,
            apiBaseUrl: parsed.apiBaseUrl,
            swaggerEndpoints: parsed.endpoints,
            urlInputMode: "swagger",
          })
        );
      },
    });
  }, [fetchConfig.swaggerDocsUrl, node, onUpdateNode]);

  const handleAbortSwagger = useCallback(() => {
    cancelSwaggerLoadTask(node.id);
    setValidationError(null);
  }, [node.id]);

  return (
    <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
      <div className="font-medium text-foreground">数据源获取 (Fetch)</div>
      <p className="text-[11px] text-muted-foreground">
        收到<strong>真信号</strong>后发起 HTTP 请求；可导入 Swagger 文档后从接口列表联想选择
        URL。
      </p>

      <label className="block space-y-1">
        <span className="text-muted-foreground">Swagger 文档 URL（可选）</span>
        <div className="flex gap-1.5">
          <Input
            value={fetchConfig.swaggerDocsUrl ?? ""}
            disabled={loadingSwagger}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onUpdateNode(
                node.id,
                patchFetchConfig(node, { swaggerDocsUrl: e.target.value })
              )
            }
            placeholder="https://example.com/v3/api-docs"
            className="h-8 flex-1 font-mono text-[11px]"
          />
          {loadingSwagger ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
              title="中止解析"
              aria-label="中止 Swagger 解析"
              onClick={handleAbortSwagger}
            >
              <StopIcon className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0"
              title="解析 Swagger 文档"
              onClick={() => handleLoadSwagger()}
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        {loadingSwagger ? (
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <LoaderIcon className="h-3.5 w-3.5 shrink-0" />
            正在解析 Swagger 文档，点击右侧按钮可中止…
          </p>
        ) : null}
        {swaggerError ? (
          <p className="text-[11px] text-destructive">{swaggerError}</p>
        ) : null}
        {endpoints.length > 0 ? (
          <p className="text-[11px] text-muted-foreground">
            已解析 {endpoints.length} 个接口
          </p>
        ) : null}
      </label>

      <label className="block space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">请求 URL</span>
          {hasSwaggerEndpoints ? (
            <div className="flex rounded-md border border-border p-0.5">
              <button
                type="button"
                disabled={loadingSwagger}
                className={cn(
                  "rounded px-2 py-0.5 text-[10px] transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                  urlInputMode === "swagger"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setUrlInputMode("swagger")}
              >
                接口联想
              </button>
              <button
                type="button"
                disabled={loadingSwagger}
                className={cn(
                  "rounded px-2 py-0.5 text-[10px] transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                  urlInputMode === "manual"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setUrlInputMode("manual")}
              >
                手动输入
              </button>
            </div>
          ) : null}
        </div>

        {urlInputMode === "swagger" && hasSwaggerEndpoints ? (
          <div
            className={cn(
              "space-y-2",
              loadingSwagger && "pointer-events-none opacity-60"
            )}
          >
            <label className="block space-y-1">
              <span className="text-muted-foreground">API 主机 / Base URL</span>
              <Input
                value={fetchConfig.apiBaseUrl ?? ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onUpdateNode(
                    node.id,
                    patchFetchConfig(node, { apiBaseUrl: e.target.value })
                  )
                }
                placeholder="https://api.example.com/v1"
                className="h-8 font-mono text-[11px]"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-muted-foreground">选择接口</span>
              <FetchUrlAutocomplete
                value={fetchConfig.url}
                apiBaseUrl={fetchConfig.apiBaseUrl ?? ""}
                endpoints={endpoints}
                selectOnly
                placeholder="点击选择或搜索接口"
                onChange={(url) =>
                  onUpdateNode(node.id, patchFetchConfig(node, { url }))
                }
                onSelectEndpoint={(endpoint) =>
                  onUpdateNode(
                    node.id,
                    patchFetchConfig(node, {
                      url: endpoint.path,
                      method: endpoint.method,
                    })
                  )
                }
              />
            </label>
          </div>
        ) : (
          <Input
            value={fetchConfig.url}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onUpdateNode(node.id, patchFetchConfig(node, { url: e.target.value }))
            }
            placeholder="https://api.example.com/data"
            className="h-8 font-mono text-[11px]"
          />
        )}
      </label>

      <label className="block space-y-1">
        <span className="text-muted-foreground">请求方法</span>
        <Select
          value={fetchConfig.method ?? "GET"}
          onValueChange={(value: string) =>
            onUpdateNode(
              node.id,
              patchFetchConfig(node, { method: value as FetchHttpMethod })
            )
          }
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FETCH_HTTP_METHODS.map((method) => (
              <SelectItem key={method} value={method}>
                {method}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>

      <label className="block space-y-1">
        <span className="text-muted-foreground">请求头 (JSON)</span>
        <textarea
          defaultValue={JSON.stringify(fetchConfig.headers ?? {}, null, 2)}
          key={`${node.id}-headers-${JSON.stringify(fetchConfig.headers)}`}
          onBlur={(e) => {
            try {
              const headers = JSON.parse(e.target.value || "{}") as Record<
                string,
                string
              >;
              onUpdateNode(node.id, patchFetchConfig(node, { headers }));
            } catch {
              /* 保留上次有效值 */
            }
          }}
          rows={4}
          className="w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
          placeholder='{"Content-Type":"application/json"}'
        />
      </label>

      <label className="block space-y-1">
        <span className="text-muted-foreground">请求体</span>
        <textarea
          value={fetchConfig.body ?? ""}
          onChange={(e) =>
            onUpdateNode(node.id, patchFetchConfig(node, { body: e.target.value }))
          }
          rows={4}
          className="w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
          placeholder='{"key":"value"}'
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="block space-y-1">
          <span className="text-muted-foreground">Credentials</span>
          <Select
            value={fetchConfig.credentials ?? "same-origin"}
            onValueChange={(value: string) =>
              onUpdateNode(
                node.id,
                patchFetchConfig(node, {
                  credentials: value as RequestCredentials,
                })
              )
            }
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FETCH_CREDENTIALS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className="block space-y-1">
          <span className="text-muted-foreground">Mode</span>
          <Select
            value={fetchConfig.mode ?? "cors"}
            onValueChange={(value: string) =>
              onUpdateNode(
                node.id,
                patchFetchConfig(node, { mode: value as RequestMode })
              )
            }
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FETCH_MODES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className="block space-y-1">
          <span className="text-muted-foreground">Cache</span>
          <Select
            value={fetchConfig.cache ?? "default"}
            onValueChange={(value: string) =>
              onUpdateNode(
                node.id,
                patchFetchConfig(node, { cache: value as RequestCache })
              )
            }
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FETCH_CACHES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className="block space-y-1">
          <span className="text-muted-foreground">Redirect</span>
          <Select
            value={fetchConfig.redirect ?? "follow"}
            onValueChange={(value: string) =>
              onUpdateNode(
                node.id,
                patchFetchConfig(node, { redirect: value as RequestRedirect })
              )
            }
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FETCH_REDIRECTS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="block space-y-1">
          <span className="text-muted-foreground">响应解析</span>
          <Select
            value={fetchConfig.responseType ?? "json"}
            onValueChange={(value: string) =>
              onUpdateNode(
                node.id,
                patchFetchConfig(node, {
                  responseType: value as FetchResponseType,
                })
              )
            }
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FETCH_RESPONSE_TYPES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className="block space-y-1">
          <span className="text-muted-foreground">超时 (ms)</span>
          <Input
            type="number"
            min={0}
            step={1000}
            value={fetchConfig.timeoutMs ?? 30000}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onUpdateNode(
                node.id,
                patchFetchConfig(node, {
                  timeoutMs: Number(e.target.value) || 0,
                })
              )
            }
            className="h-8"
          />
        </label>
      </div>
    </div>
  );
}
