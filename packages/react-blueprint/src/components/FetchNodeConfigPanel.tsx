import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@arronqzy/ui";
import type {
  ExecutionTraceEntry,
  FetchHttpMethod,
  FetchRequestConfig,
  FetchResponseType,
} from "@arronqzy/blueprint-dsl";
import {
  applyFetchConfigScope,
  draftFetchHeadersText,
  FETCH_CACHES,
  FETCH_CREDENTIALS,
  FETCH_HTTP_METHODS,
  FETCH_MODES,
  FETCH_NODE_TYPE,
  FETCH_REDIRECTS,
  FETCH_RESPONSE_TYPES,
  fetchConfigHasScopeTemplate,
  getFetchBodyValidationError,
  getFetchHeadersValidationError,
  latestTraceOutputsByNode,
  parseFetchHeadersJson,
  resolveFetchIncomingScope,
  resolveFetchRequestUrl,
  resolveFetchScopeAutocompleteRoot,
} from "@arronqzy/blueprint-dsl";

import type { BlueprintGraphEdge, BlueprintGraphNode } from "../graph/document";
import { resolveNodeFetchConfig } from "../graph/document";
import {
  cancelSwaggerLoadTask,
  cancelFetchDebugTask,
  startFetchDebugTask,
  startSwaggerLoadTask,
  useFetchDebugTask,
  useSwaggerLoadTask,
} from "../fetch-config-task-store";
import { useI18n } from "@arronqzy/i18n/react";

import { ConfigFieldLabel, ConfigHintIcon, ConfigSectionTitle } from "./ConfigHintIcon";
import { FetchUrlAutocomplete } from "./FetchUrlAutocomplete";
import { ScopeTemplateAutocompleteHost } from "./ScopeTemplateAutocompleteHost";

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

function ChevronIcon({ className, expanded }: { className?: string; expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("transition-transform", expanded && "rotate-180", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function AsyncSendButton({
  loading,
  disabled,
  onSend,
  onAbort,
  sendTitle,
  abortTitle,
  sendAriaLabel,
  abortAriaLabel,
}: {
  loading: boolean;
  disabled?: boolean;
  onSend: () => void;
  onAbort: () => void;
  sendTitle: string;
  abortTitle: string;
  sendAriaLabel: string;
  abortAriaLabel: string;
}) {
  if (loading) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
        title={abortTitle}
        aria-label={abortAriaLabel}
        onClick={onAbort}
      >
        <StopIcon className="h-3.5 w-3.5" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="h-8 w-8 shrink-0"
      title={sendTitle}
      aria-label={sendAriaLabel}
      disabled={disabled}
      onClick={onSend}
    >
      <SendIcon className="h-4 w-4" />
    </Button>
  );
}

function formatFetchDebugData(data: unknown): string {
  if (typeof data === "string") return data;
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

function FetchDebugResponsePanel({
  task,
}: {
  task: ReturnType<typeof useFetchDebugTask>;
}) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  if (task.status === "idle" || task.status === "loading") return null;

  if (task.status === "error") {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/5 p-2">
        <p className="text-[11px] text-destructive">{task.error ?? t("blueprint.config.requestFailed")}</p>
      </div>
    );
  }

  const result = task.result;
  if (!result) return null;

  const bodyText = formatFetchDebugData(result.data);
  const preview =
    bodyText.length > 120 ? `${bodyText.slice(0, 120).trimEnd()}…` : bodyText;
  const ok = result.status >= 200 && result.status < 300;

  return (
    <div className="rounded-md border border-border/70 bg-background/80">
      <button
        type="button"
        className="flex w-full items-center gap-2 px-2 py-1.5 text-left"
        onClick={() => setExpanded((value) => !value)}
      >
        <ChevronIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" expanded={expanded} />
        <span className="text-[11px] font-medium text-foreground">{t("blueprint.config.debugResponse")}</span>
        <span
          className={cn(
            "rounded px-1.5 py-0.5 font-mono text-[10px]",
            ok
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
              : "bg-destructive/15 text-destructive"
          )}
        >
          {result.status} {result.statusText}
        </span>
        {!expanded ? (
          <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-muted-foreground">
            {preview}
          </span>
        ) : null}
      </button>
      {expanded ? (
        <div className="border-t border-border/60 px-2 py-2">
          <div className="mb-1 truncate font-mono text-[10px] text-muted-foreground">
            {result.url}
          </div>
          <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-all rounded bg-muted/30 p-2 font-mono text-[10px] leading-relaxed text-foreground">
            {bodyText}
          </pre>
        </div>
      ) : null}
    </div>
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
  graphNodes?: BlueprintGraphNode[];
  graphEdges?: BlueprintGraphEdge[];
  traceEntries?: ExecutionTraceEntry[];
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
    role: "fetch" as const,
    nodeType: FETCH_NODE_TYPE,
    configSource: "fetch" as const,
    fetchConfig: { ...resolveNodeFetchConfig(node), ...patch },
  };
}

export function FetchNodeConfigPanel({
  node,
  graphNodes = [],
  graphEdges = [],
  traceEntries = [],
  onUpdateNode,
}: FetchNodeConfigPanelProps) {
  const { t } = useI18n();
  const fetchConfig = resolveNodeFetchConfig(node);
  const endpoints = fetchConfig.swaggerEndpoints ?? [];
  const hasSwaggerEndpoints = endpoints.length > 0;
  const urlInputMode =
    fetchConfig.urlInputMode ?? (hasSwaggerEndpoints ? "swagger" : "manual");
  const swaggerTask = useSwaggerLoadTask(node.id);
  const fetchDebugTask = useFetchDebugTask(node.id);
  const loadingSwagger = swaggerTask.status === "loading";
  const loadingFetchDebug = fetchDebugTask.status === "loading";
  const swaggerTaskError =
    swaggerTask.status === "error" ? swaggerTask.error : null;
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fetchValidationError, setFetchValidationError] = useState<string | null>(null);
  const swaggerError = validationError ?? swaggerTaskError;
  const incomingScope = useMemo(() => {
    const outputs = latestTraceOutputsByNode(traceEntries);
    return resolveFetchIncomingScope({
      fetchNodeId: node.id,
      nodes: graphNodes,
      edges: graphEdges,
      getOutput: (sourceId, port) => outputs[sourceId]?.[port],
    });
  }, [graphEdges, graphNodes, node.id, traceEntries]);
  const usesScopeTemplate = fetchConfigHasScopeTemplate(fetchConfig);
  const resolvedFetchConfig = useMemo(
    () => applyFetchConfigScope(fetchConfig, incomingScope),
    [fetchConfig, incomingScope]
  );
  const resolvedUrlPreview = useMemo(() => {
    if (!usesScopeTemplate) return "";
    try {
      return resolveFetchRequestUrl(resolvedFetchConfig);
    } catch {
      return resolvedFetchConfig.url?.trim() ?? "";
    }
  }, [resolvedFetchConfig, usesScopeTemplate]);
  const incomingScopeJson = useMemo(() => {
    if (incomingScope === undefined) return "";
    try {
      return JSON.stringify(incomingScope, null, 2);
    } catch {
      return String(incomingScope);
    }
  }, [incomingScope]);
  const headersDraft = draftFetchHeadersText(fetchConfig);
  const resolvedHeadersPreview = useMemo(() => {
    if (!usesScopeTemplate) return "";
    const headers = resolvedFetchConfig.headers;
    if (!headers || Object.keys(headers).length === 0) return "";
    try {
      return JSON.stringify(headers, null, 2);
    } catch {
      return "";
    }
  }, [resolvedFetchConfig.headers, usesScopeTemplate]);
  const resolvedBodyPreview = useMemo(() => {
    if (!usesScopeTemplate) return "";
    return resolvedFetchConfig.body?.trim() ?? "";
  }, [resolvedFetchConfig.body, usesScopeTemplate]);
  const headersJsonError = useMemo(
    () => getFetchHeadersValidationError(fetchConfig, incomingScope),
    [fetchConfig, incomingScope]
  );
  const bodyJsonError = useMemo(
    () => getFetchBodyValidationError(fetchConfig.body, resolvedFetchConfig.body),
    [fetchConfig.body, resolvedFetchConfig.body]
  );
  const incomingHasPendingValue = useMemo(() => {
    if (!incomingScope || typeof incomingScope !== "object") return false;
    const entries =
      "kind" in incomingScope
        ? [incomingScope]
        : Object.values(incomingScope as Record<string, { kind?: string }>);
    return entries.some((entry) => entry && entry.kind === "pending");
  }, [incomingScope]);
  const autocompleteScope = resolveFetchScopeAutocompleteRoot(incomingScope);
  const [formEl, setFormEl] = useState<HTMLDivElement | null>(null);

  const setUrlInputMode = useCallback(
    (mode: "swagger" | "manual") => {
      onUpdateNode(node.id, patchFetchConfig(node, { urlInputMode: mode }));
    },
    [node, onUpdateNode]
  );

  const handleLoadSwagger = useCallback(() => {
    const docsUrl = fetchConfig.swaggerDocsUrl?.trim();
    if (!docsUrl) {
      setValidationError(t("blueprint.config.fillSwaggerUrlFirst"));
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

  const handleSendFetchDebug = useCallback(() => {
    const resolved = applyFetchConfigScope(fetchConfig, incomingScope);
    const url = resolved.url?.trim();
    if (!url) {
      setFetchValidationError(
        usesScopeTemplate && fetchConfig.url?.trim()
          ? t("blueprint.config.fetchScopeUnresolved")
          : t("blueprint.config.fillRequestUrlFirst")
      );
      return;
    }
    const headersError = getFetchHeadersValidationError(fetchConfig, incomingScope);
    if (headersError) {
      setFetchValidationError(
        t("blueprint.config.fetchHeadersInvalidJson", { error: headersError })
      );
      return;
    }
    const bodyError = getFetchBodyValidationError(fetchConfig.body, resolved.body);
    if (bodyError) {
      setFetchValidationError(
        t("blueprint.config.fetchBodyInvalidJson", { error: bodyError })
      );
      return;
    }

    setFetchValidationError(null);
    startFetchDebugTask({
      nodeId: node.id,
      config: resolved,
    });
  }, [fetchConfig, incomingScope, node.id, t, usesScopeTemplate]);

  const handleAbortFetchDebug = useCallback(() => {
    cancelFetchDebugTask(node.id);
    setFetchValidationError(null);
  }, [node.id]);

  const handleHeadersChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const headersJson = e.target.value;
      const parsed = parseFetchHeadersJson(headersJson);
      onUpdateNode(
        node.id,
        patchFetchConfig(node, {
          headersJson,
          ...(parsed ? { headers: parsed } : {}),
        })
      );
    },
    [node, onUpdateNode]
  );

  return (
    <div
      ref={setFormEl}
      className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5"
    >
      <ScopeTemplateAutocompleteHost
        scope={autocompleteScope}
        container={formEl}
      />
      <ConfigSectionTitle
        title={t("blueprint.config.fetchTitle")}
        hint={t("blueprint.config.fetchHint")}
      />
      <div className="space-y-1 rounded-md border border-border/60 bg-background/70 p-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
          {t("blueprint.config.fetchScopeTitle")}
          <ConfigHintIcon label={t("blueprint.config.fetchScopeTitle")}>
            <p>{t("blueprint.config.fetchScopeHint")}</p>
            <p>{t("blueprint.config.fetchScopeEmpty")}</p>
            <p>{t("blueprint.config.fetchScopePending")}</p>
          </ConfigHintIcon>
        </div>
        {incomingScope === undefined ? null : (
          <>
            {incomingHasPendingValue ? (
              <p className="text-[11px] text-amber-700 dark:text-amber-300">
                {t("blueprint.config.fetchScopePending")}
              </p>
            ) : null}
            <pre className="max-h-[180px] overflow-auto rounded border border-border/60 bg-muted/30 p-2 font-mono text-[10px] leading-relaxed text-foreground">
              {incomingScopeJson}
            </pre>
          </>
        )}
      </div>

      <label className="block space-y-1">
        <span className="text-muted-foreground">{t("blueprint.config.swaggerUrlOptional")}</span>
        <div className="flex gap-1.5">
          <Input
            value={fetchConfig.swaggerDocsUrl ?? ""}
            disabled={loadingSwagger}
            data-scope-autocomplete="off"
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
              title={t("blueprint.config.abortParse")}
              aria-label={t("blueprint.config.abortSwaggerAria")}
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
              title={t("blueprint.config.parseSwagger")}
              onClick={() => handleLoadSwagger()}
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        {loadingSwagger ? (
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <LoaderIcon className="h-3.5 w-3.5 shrink-0" />
            {t("blueprint.config.parsingSwagger")}
          </p>
        ) : null}
        {swaggerError ? (
          <p className="text-[11px] text-destructive">{swaggerError}</p>
        ) : null}
        {endpoints.length > 0 ? (
          <p className="text-[11px] text-muted-foreground">
            {t("blueprint.config.parsedEndpoints", { count: endpoints.length })}
          </p>
        ) : null}
      </label>

      <label className="block space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">{t("blueprint.config.requestUrl")}</span>
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
                {t("blueprint.config.suggestApi")}
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
                {t("blueprint.config.manualInput")}
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
              <span className="text-muted-foreground">{t("blueprint.config.apiHostBaseUrl")}</span>
              <Input
                value={fetchConfig.apiBaseUrl ?? ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onUpdateNode(
                    node.id,
                    patchFetchConfig(node, { apiBaseUrl: e.target.value })
                  )
                }
                placeholder="https://api.example.com/v1/{scope?.value?.tenant}"
                className="h-8 font-mono text-[11px]"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-muted-foreground">{t("blueprint.config.selectEndpoint")}</span>
              <div className="flex gap-1.5">
                <div className="min-w-0 flex-1">
                  <FetchUrlAutocomplete
                    value={fetchConfig.url}
                    apiBaseUrl={fetchConfig.apiBaseUrl ?? ""}
                    endpoints={endpoints}
                    selectOnly
                    placeholder={t("blueprint.config.selectOrSearchEndpoint")}
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
                </div>
                <AsyncSendButton
                  loading={loadingFetchDebug}
                  disabled={loadingSwagger}
                  onSend={handleSendFetchDebug}
                  onAbort={handleAbortFetchDebug}
                  sendTitle={t("blueprint.config.sendDebugRequest")}
                  abortTitle={t("blueprint.config.abortRequest")}
                  sendAriaLabel={t("blueprint.config.sendDebugRequest")}
                  abortAriaLabel={t("blueprint.config.abortDebugAria")}
                />
              </div>
            </label>
          </div>
        ) : (
          <div className="flex gap-1.5">
            <Input
              value={fetchConfig.url}
              disabled={loadingFetchDebug}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onUpdateNode(node.id, patchFetchConfig(node, { url: e.target.value }))
              }
              placeholder="https://api.example.com/users/{scope?.value?.id}"
              className="h-8 flex-1 font-mono text-[11px]"
            />
            <AsyncSendButton
              loading={loadingFetchDebug}
              disabled={loadingSwagger}
              onSend={handleSendFetchDebug}
              onAbort={handleAbortFetchDebug}
              sendTitle={t("blueprint.config.sendDebugRequest")}
              abortTitle={t("blueprint.config.abortRequest")}
              sendAriaLabel={t("blueprint.config.sendDebugRequest")}
              abortAriaLabel={t("blueprint.config.abortDebugAria")}
            />
          </div>
        )}
        {usesScopeTemplate && resolvedUrlPreview ? (
          <p className="break-all font-mono text-[10px] text-muted-foreground">
            {t("blueprint.config.fetchScopeResolvedUrl")}: {resolvedUrlPreview}
          </p>
        ) : null}
        {loadingFetchDebug ? (
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <LoaderIcon className="h-3.5 w-3.5 shrink-0" />
            {t("blueprint.config.sendingDebug")}
          </p>
        ) : null}
        {fetchValidationError ? (
          <p className="text-[11px] text-destructive">{fetchValidationError}</p>
        ) : null}
        <FetchDebugResponsePanel task={fetchDebugTask} />
      </label>

      <label className="block space-y-1">
        <span className="text-muted-foreground">{t("blueprint.config.requestMethod")}</span>
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
        <ConfigFieldLabel
          label={t("blueprint.config.requestHeadersJson")}
          hint={t("blueprint.config.fetchHeadersHint")}
        />
        <textarea
          value={headersDraft}
          onChange={handleHeadersChange}
          rows={4}
          className={cn(
            "w-full rounded-md border bg-background px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary",
            headersJsonError ? "border-destructive" : "border-input"
          )}
          placeholder='{"Authorization":"Bearer {scope?.value?.token}"}'
        />
        {headersJsonError ? (
          <p className="text-[11px] text-destructive">
            {t("blueprint.config.fetchHeadersInvalidJson", { error: headersJsonError })}
          </p>
        ) : null}
        {usesScopeTemplate && resolvedHeadersPreview ? (
          <p className="whitespace-pre-wrap break-all font-mono text-[10px] text-muted-foreground">
            {t("blueprint.config.fetchScopeResolvedHeaders")}: {resolvedHeadersPreview}
          </p>
        ) : null}
      </label>

      <label className="block space-y-1">
        <ConfigFieldLabel
          label={t("blueprint.config.requestBody")}
          hint={t("blueprint.config.fetchBodyHint")}
        />
        <textarea
          value={fetchConfig.body ?? ""}
          onChange={(e) =>
            onUpdateNode(node.id, patchFetchConfig(node, { body: e.target.value }))
          }
          rows={4}
          className={cn(
            "w-full rounded-md border bg-background px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary",
            bodyJsonError ? "border-destructive" : "border-input"
          )}
          placeholder='{"id":"{scope?.value?.id}"}'
        />
        {bodyJsonError ? (
          <p className="text-[11px] text-destructive">
            {t("blueprint.config.fetchBodyInvalidJson", { error: bodyJsonError })}
          </p>
        ) : null}
        {usesScopeTemplate && resolvedBodyPreview ? (
          <p className="whitespace-pre-wrap break-all font-mono text-[10px] text-muted-foreground">
            {t("blueprint.config.fetchScopeResolvedBody")}: {resolvedBodyPreview}
          </p>
        ) : null}
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
          <span className="text-muted-foreground">{t("blueprint.config.responseParse")}</span>
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
          <span className="text-muted-foreground">{t("blueprint.config.timeoutMs")}</span>
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
