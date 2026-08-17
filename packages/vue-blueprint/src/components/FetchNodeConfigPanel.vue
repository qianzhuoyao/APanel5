<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed, ref } from "vue";
import { Button, Input, Select } from "ant-design-vue";
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
  latestTraceOutputsByNode,
  parseFetchHeadersJson,
  resolveFetchIncomingScope,
  resolveFetchRequestUrl,
} from "@arronqzy/blueprint-dsl";

import type { BlueprintGraphEdge, BlueprintGraphNode } from "../graph/document";
import { resolveNodeFetchConfig } from "../graph/document";
import {
  cancelFetchDebugTask,
  cancelSwaggerLoadTask,
  startFetchDebugTask,
  startSwaggerLoadTask,
  useFetchDebugTask,
  useSwaggerLoadTask,
} from "../fetch-config-task-store";
import ConfigHintIcon from "./ConfigHintIcon.vue";
import FetchUrlAutocomplete from "./FetchUrlAutocomplete.vue";

const { t } = useI18n();

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

const props = withDefaults(defineProps<FetchNodeConfigPanelProps>(), {
  graphNodes: () => [],
  graphEdges: () => [],
  traceEntries: () => [],
});

const validationError = ref<string | null>(null);
const fetchValidationError = ref<string | null>(null);
const debugExpanded = ref(false);

const fetchConfig = computed(() => resolveNodeFetchConfig(props.node));
const incomingScope = computed(() => {
  const outputs = latestTraceOutputsByNode(props.traceEntries);
  return resolveFetchIncomingScope({
    fetchNodeId: props.node.id,
    nodes: props.graphNodes,
    edges: props.graphEdges,
    getOutput: (sourceId, port) => outputs[sourceId]?.[port],
  });
});
const usesScopeTemplate = computed(() => fetchConfigHasScopeTemplate(fetchConfig.value));
const resolvedFetchConfig = computed(() =>
  applyFetchConfigScope(fetchConfig.value, incomingScope.value)
);
const resolvedUrlPreview = computed(() => {
  if (!usesScopeTemplate.value) return "";
  try {
    return resolveFetchRequestUrl(resolvedFetchConfig.value);
  } catch {
    return resolvedFetchConfig.value.url?.trim() ?? "";
  }
});
const incomingScopeJson = computed(() => {
  if (incomingScope.value === undefined) return "";
  try {
    return JSON.stringify(incomingScope.value, null, 2);
  } catch {
    return String(incomingScope.value);
  }
});
const headersDraft = computed(() => draftFetchHeadersText(fetchConfig.value));
const resolvedHeadersPreview = computed(() => {
  if (!usesScopeTemplate.value) return "";
  const headers = resolvedFetchConfig.value.headers;
  if (!headers || Object.keys(headers).length === 0) return "";
  try {
    return JSON.stringify(headers, null, 2);
  } catch {
    return "";
  }
});
const incomingHasPendingValue = computed(() => {
  const scope = incomingScope.value;
  if (!scope || typeof scope !== "object") return false;
  const entries =
    "kind" in scope ? [scope] : Object.values(scope as Record<string, { kind?: string }>);
  return entries.some((entry) => entry && entry.kind === "pending");
});
const endpoints = computed(() => fetchConfig.value.swaggerEndpoints ?? []);
const hasSwaggerEndpoints = computed(() => endpoints.value.length > 0);
const urlInputMode = computed(
  () => fetchConfig.value.urlInputMode ?? (hasSwaggerEndpoints.value ? "swagger" : "manual")
);

const swaggerTask = useSwaggerLoadTask(props.node.id);
const fetchDebugTask = useFetchDebugTask(props.node.id);
const loadingSwagger = computed(() => swaggerTask.value.status === "loading");
const loadingFetchDebug = computed(() => fetchDebugTask.value.status === "loading");
const swaggerTaskError = computed(() =>
  swaggerTask.value.status === "error" ? swaggerTask.value.error : null
);
const swaggerError = computed(() => validationError.value ?? swaggerTaskError.value);

function patchFetchConfig(node: BlueprintGraphNode, patch: Partial<FetchRequestConfig>) {
  return {
    role: "fetch" as const,
    nodeType: FETCH_NODE_TYPE,
    configSource: "fetch" as const,
    fetchConfig: { ...resolveNodeFetchConfig(node), ...patch },
  };
}

function setUrlInputMode(mode: "swagger" | "manual") {
  props.onUpdateNode(props.node.id, patchFetchConfig(props.node, { urlInputMode: mode }));
}

function handleLoadSwagger() {
  const docsUrl = fetchConfig.value.swaggerDocsUrl?.trim();
  if (!docsUrl) {
    validationError.value = t("blueprint.config.fillSwaggerUrlFirst");
    return;
  }

  validationError.value = null;
  startSwaggerLoadTask({
    nodeId: props.node.id,
    docsUrl,
    onSuccess: (parsed, url) => {
      props.onUpdateNode(
        props.node.id,
        patchFetchConfig(props.node, {
          swaggerDocsUrl: url,
          apiBaseUrl: parsed.apiBaseUrl,
          swaggerEndpoints: parsed.endpoints,
          urlInputMode: "swagger",
        })
      );
    },
  });
}

function handleAbortSwagger() {
  cancelSwaggerLoadTask(props.node.id);
  validationError.value = null;
}

function handleSendFetchDebug() {
  const resolved = applyFetchConfigScope(fetchConfig.value, incomingScope.value);
  const url = resolved.url?.trim();
  if (!url) {
    fetchValidationError.value =
      usesScopeTemplate.value && fetchConfig.value.url?.trim()
        ? t("blueprint.config.fetchScopeUnresolved")
        : t("blueprint.config.fillRequestUrlFirst");
    return;
  }

  fetchValidationError.value = null;
  startFetchDebugTask({
    nodeId: props.node.id,
    config: resolved,
  });
}

function handleAbortFetchDebug() {
  cancelFetchDebugTask(props.node.id);
  fetchValidationError.value = null;
}

function formatFetchDebugData(data: unknown): string {
  if (typeof data === "string") return data;
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

const debugBodyText = computed(() => {
  const task = fetchDebugTask.value;
  if (task.status !== "success" || !task.result) return "";
  return formatFetchDebugData(task.result.data);
});

const debugPreview = computed(() => {
  const text = debugBodyText.value;
  return text.length > 120 ? `${text.slice(0, 120).trimEnd()}…` : text;
});

const debugOk = computed(() => {
  const result = fetchDebugTask.value.result;
  return result ? result.status >= 200 && result.status < 300 : false;
});

function handleHeadersBlur(event: Event) {
  const headersJson = (event.target as HTMLTextAreaElement).value;
  const parsed = parseFetchHeadersJson(headersJson);
  props.onUpdateNode(
    props.node.id,
    patchFetchConfig(props.node, {
      headersJson,
      ...(parsed ? { headers: parsed } : {}),
    })
  );
}
</script>

<template>
  <div class="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
    <div class="flex items-center gap-1.5">
      <div class="font-medium text-foreground">{{ t("blueprint.config.fetchTitle") }}</div>
      <ConfigHintIcon :label="t('blueprint.config.fetchTitle')">
        {{ t("blueprint.config.fetchHint") }}
      </ConfigHintIcon>
    </div>
    <div class="space-y-1 rounded-md border border-gray-200/80 bg-white/80 p-2">
      <div class="flex items-center gap-1.5 text-[11px] font-medium text-gray-800">
        {{ t("blueprint.config.fetchScopeTitle") }}
        <ConfigHintIcon :label="t('blueprint.config.fetchScopeTitle')">
          <p>{{ t("blueprint.config.fetchScopeHint") }}</p>
          <p>{{ t("blueprint.config.fetchScopeEmpty") }}</p>
          <p>{{ t("blueprint.config.fetchScopePending") }}</p>
        </ConfigHintIcon>
      </div>
      <template v-if="incomingScope !== undefined">
        <p v-if="incomingHasPendingValue" class="text-[11px] text-amber-700">
          {{ t("blueprint.config.fetchScopePending") }}
        </p>
        <pre class="max-h-[180px] overflow-auto rounded border border-gray-200 bg-gray-50 p-2 font-mono text-[10px] leading-relaxed text-gray-800">{{ incomingScopeJson }}</pre>
      </template>
    </div>

    <label class="block space-y-1">
      <span class="text-muted-foreground">{{ t("blueprint.config.swaggerUrlOptional") }}</span>
      <div class="flex gap-1.5">
        <Input
          size="small"
          :value="fetchConfig.swaggerDocsUrl ?? ''"
          :disabled="loadingSwagger"
          placeholder="https://example.com/v3/api-docs"
          class="flex-1 font-mono text-[11px]"
          @update:value="
            (v) =>
              onUpdateNode(node.id, patchFetchConfig(node, { swaggerDocsUrl: String(v) }))
          "
        />
        <Button
          v-if="loadingSwagger"
          size="small"
          class="h-8 w-8 shrink-0 text-destructive"
          :title="t('blueprint.config.abortParse')"
          :aria-label="t('blueprint.config.abortSwaggerAria')"
          @click="handleAbortSwagger"
        >
          ■
        </Button>
        <Button
          v-else
          size="small"
          class="h-8 w-8 shrink-0"
          :title="t('blueprint.config.parseSwagger')"
          @click="handleLoadSwagger"
        >
          ➤
        </Button>
      </div>
      <p v-if="loadingSwagger" class="text-[11px] text-muted-foreground">
        {{ t("blueprint.config.parsingSwagger") }}
      </p>
      <p v-if="swaggerError" class="text-[11px] text-destructive">{{ swaggerError }}</p>
      <p v-if="endpoints.length > 0" class="text-[11px] text-muted-foreground">
        {{ t("blueprint.config.parsedEndpoints", { count: endpoints.length }) }}
      </p>
    </label>

    <label class="block space-y-1">
      <div class="flex items-center justify-between gap-2">
        <span class="text-muted-foreground">{{ t("blueprint.config.requestUrl") }}</span>
        <div v-if="hasSwaggerEndpoints" class="flex rounded-md border border-border p-0.5">
          <button
            type="button"
            :disabled="loadingSwagger"
            class="rounded px-2 py-0.5 text-[10px] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            :class="
              urlInputMode === 'swagger'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="setUrlInputMode('swagger')"
          >
            {{ t("blueprint.config.suggestApi") }}
          </button>
          <button
            type="button"
            :disabled="loadingSwagger"
            class="rounded px-2 py-0.5 text-[10px] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            :class="
              urlInputMode === 'manual'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="setUrlInputMode('manual')"
          >
            {{ t("blueprint.config.manualInput") }}
          </button>
        </div>
      </div>

      <div
        v-if="urlInputMode === 'swagger' && hasSwaggerEndpoints"
        class="space-y-2"
        :class="loadingSwagger && 'pointer-events-none opacity-60'"
      >
        <label class="block space-y-1">
          <span class="text-muted-foreground">{{ t("blueprint.config.apiHostBaseUrl") }}</span>
          <Input
            size="small"
            :value="fetchConfig.apiBaseUrl ?? ''"
            placeholder="https://api.example.com/v1/{scope?.value?.tenant}"
            class="font-mono text-[11px]"
            @update:value="
              (v) => onUpdateNode(node.id, patchFetchConfig(node, { apiBaseUrl: String(v) }))
            "
          />
        </label>
        <label class="block space-y-1">
          <span class="text-muted-foreground">{{ t("blueprint.config.selectEndpoint") }}</span>
          <div class="flex gap-1.5">
            <div class="min-w-0 flex-1">
              <FetchUrlAutocomplete
                :value="fetchConfig.url"
                :api-base-url="fetchConfig.apiBaseUrl ?? ''"
                :endpoints="endpoints"
                select-only
                :placeholder="t('blueprint.config.selectOrSearchEndpoint')"
                @change="
                  (url) => onUpdateNode(node.id, patchFetchConfig(node, { url }))
                "
                @select-endpoint="
                  (endpoint) =>
                    onUpdateNode(
                      node.id,
                      patchFetchConfig(node, {
                        url: endpoint.path,
                        method: endpoint.method,
                      })
                    )
                "
              />
            </div>
            <Button
              v-if="loadingFetchDebug"
              size="small"
              class="h-8 w-8 shrink-0"
              :title="t('blueprint.config.abortRequest')"
              @click="handleAbortFetchDebug"
            >
              ■
            </Button>
            <Button
              v-else
              size="small"
              class="h-8 w-8 shrink-0"
              :disabled="loadingSwagger"
              :title="t('blueprint.config.sendDebugRequest')"
              @click="handleSendFetchDebug"
            >
              ➤
            </Button>
          </div>
        </label>
      </div>
      <div v-else class="flex gap-1.5">
        <Input
          size="small"
          :value="fetchConfig.url"
          :disabled="loadingFetchDebug"
          placeholder="https://api.example.com/users/{scope?.value?.id}"
          class="flex-1 font-mono text-[11px]"
          @update:value="(v) => onUpdateNode(node.id, patchFetchConfig(node, { url: String(v) }))"
        />
        <Button
          v-if="loadingFetchDebug"
          size="small"
          class="h-8 w-8 shrink-0"
          :title="t('blueprint.config.abortRequest')"
          @click="handleAbortFetchDebug"
        >
          ■
        </Button>
        <Button
          v-else
          size="small"
          class="h-8 w-8 shrink-0"
          :disabled="loadingSwagger"
          :title="t('blueprint.config.sendDebugRequest')"
          @click="handleSendFetchDebug"
        >
          ➤
        </Button>
      </div>

      <p
        v-if="usesScopeTemplate && resolvedUrlPreview"
        class="break-all font-mono text-[10px] text-gray-500"
      >
        {{ t("blueprint.config.fetchScopeResolvedUrl") }}: {{ resolvedUrlPreview }}
      </p>
      <p v-if="loadingFetchDebug" class="text-[11px] text-muted-foreground">
        {{ t("blueprint.config.sendingDebug") }}
      </p>
      <p v-if="fetchValidationError" class="text-[11px] text-destructive">
        {{ fetchValidationError }}
      </p>

      <div
        v-if="fetchDebugTask.status === 'error'"
        class="rounded-md border border-destructive/40 bg-destructive/5 p-2"
      >
        <p class="text-[11px] text-destructive">
          {{ fetchDebugTask.error ?? t("blueprint.config.requestFailed") }}
        </p>
      </div>
      <div
        v-else-if="fetchDebugTask.status === 'success' && fetchDebugTask.result"
        class="rounded-md border border-border/70 bg-background/80"
      >
        <button
          type="button"
          class="flex w-full items-center gap-2 px-2 py-1.5 text-left"
          @click="debugExpanded = !debugExpanded"
        >
          <span
            class="text-muted-foreground transition-transform"
            :class="debugExpanded && 'rotate-180'"
          >
            ▼
          </span>
          <span class="text-[11px] font-medium text-foreground">{{ t("blueprint.config.debugResponse") }}</span>
          <span
            class="rounded px-1.5 py-0.5 font-mono text-[10px]"
            :class="
              debugOk
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                : 'bg-destructive/15 text-destructive'
            "
          >
            {{ fetchDebugTask.result.status }} {{ fetchDebugTask.result.statusText }}
          </span>
          <span
            v-if="!debugExpanded"
            class="min-w-0 flex-1 truncate font-mono text-[10px] text-muted-foreground"
          >
            {{ debugPreview }}
          </span>
        </button>
        <div v-if="debugExpanded" class="border-t border-border/60 px-2 py-2">
          <div class="mb-1 truncate font-mono text-[10px] text-muted-foreground">
            {{ fetchDebugTask.result.url }}
          </div>
          <pre
            class="max-h-56 overflow-auto whitespace-pre-wrap break-all rounded bg-muted/30 p-2 font-mono text-[10px] leading-relaxed text-foreground"
          >{{ debugBodyText }}</pre>
        </div>
      </div>
    </label>

    <label class="block space-y-1">
      <span class="text-muted-foreground">{{ t("blueprint.config.requestMethod") }}</span>
      <Select
        size="small"
        class="w-full"
        :value="fetchConfig.method ?? 'GET'"
        @change="
          (v) =>
            onUpdateNode(
              node.id,
              patchFetchConfig(node, { method: v as FetchHttpMethod })
            )
        "
      >
        <Select.Option v-for="method in FETCH_HTTP_METHODS" :key="method" :value="method">
          {{ method }}
        </Select.Option>
      </Select>
    </label>

    <label class="block space-y-1">
      <span class="inline-flex items-center gap-1 text-muted-foreground">
        {{ t("blueprint.config.requestHeadersJson") }}
        <ConfigHintIcon :label="t('blueprint.config.requestHeadersJson')">
          {{ t("blueprint.config.fetchHeadersHint") }}
        </ConfigHintIcon>
      </span>
      <textarea
        :key="`${node.id}-headers-${headersDraft}`"
        :value="headersDraft"
        rows="4"
        class="w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
        placeholder='{"Authorization":"Bearer {scope?.value?.token}"}'
        @blur="handleHeadersBlur"
      />
      <p
        v-if="usesScopeTemplate && resolvedHeadersPreview"
        class="whitespace-pre-wrap break-all font-mono text-[10px] text-gray-500"
      >
        {{ t("blueprint.config.fetchScopeResolvedHeaders") }}: {{ resolvedHeadersPreview }}
      </p>
    </label>

    <label class="block space-y-1">
      <span class="text-muted-foreground">{{ t("blueprint.config.requestBody") }}</span>
      <textarea
        :value="fetchConfig.body ?? ''"
        rows="4"
        class="w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
        placeholder='{"id":"{scope?.value?.id}"}'
        @input="
          (e) =>
            onUpdateNode(
              node.id,
              patchFetchConfig(node, { body: (e.target as HTMLTextAreaElement).value })
            )
        "
      />
    </label>

    <div class="grid grid-cols-2 gap-2">
      <label class="block space-y-1">
        <span class="text-muted-foreground">Credentials</span>
        <Select
          size="small"
          class="w-full"
          :value="fetchConfig.credentials ?? 'same-origin'"
          @change="
            (v) =>
              onUpdateNode(
                node.id,
                patchFetchConfig(node, { credentials: v as RequestCredentials })
              )
          "
        >
          <Select.Option v-for="item in FETCH_CREDENTIALS" :key="item" :value="item">
            {{ item }}
          </Select.Option>
        </Select>
      </label>
      <label class="block space-y-1">
        <span class="text-muted-foreground">Mode</span>
        <Select
          size="small"
          class="w-full"
          :value="fetchConfig.mode ?? 'cors'"
          @change="
            (v) =>
              onUpdateNode(node.id, patchFetchConfig(node, { mode: v as RequestMode }))
          "
        >
          <Select.Option v-for="item in FETCH_MODES" :key="item" :value="item">
            {{ item }}
          </Select.Option>
        </Select>
      </label>
      <label class="block space-y-1">
        <span class="text-muted-foreground">Cache</span>
        <Select
          size="small"
          class="w-full"
          :value="fetchConfig.cache ?? 'default'"
          @change="
            (v) =>
              onUpdateNode(node.id, patchFetchConfig(node, { cache: v as RequestCache }))
          "
        >
          <Select.Option v-for="item in FETCH_CACHES" :key="item" :value="item">
            {{ item }}
          </Select.Option>
        </Select>
      </label>
      <label class="block space-y-1">
        <span class="text-muted-foreground">Redirect</span>
        <Select
          size="small"
          class="w-full"
          :value="fetchConfig.redirect ?? 'follow'"
          @change="
            (v) =>
              onUpdateNode(
                node.id,
                patchFetchConfig(node, { redirect: v as RequestRedirect })
              )
          "
        >
          <Select.Option v-for="item in FETCH_REDIRECTS" :key="item" :value="item">
            {{ item }}
          </Select.Option>
        </Select>
      </label>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <label class="block space-y-1">
        <span class="text-muted-foreground">{{ t("blueprint.config.responseParse") }}</span>
        <Select
          size="small"
          class="w-full"
          :value="fetchConfig.responseType ?? 'json'"
          @change="
            (v) =>
              onUpdateNode(
                node.id,
                patchFetchConfig(node, { responseType: v as FetchResponseType })
              )
          "
        >
          <Select.Option v-for="item in FETCH_RESPONSE_TYPES" :key="item" :value="item">
            {{ item }}
          </Select.Option>
        </Select>
      </label>
      <label class="block space-y-1">
        <span class="text-muted-foreground">{{ t("blueprint.config.timeoutMs") }}</span>
        <Input
          type="number"
          size="small"
          :min="0"
          :step="1000"
          :value="fetchConfig.timeoutMs ?? 30000"
          @update:value="
            (v) =>
              onUpdateNode(
                node.id,
                patchFetchConfig(node, { timeoutMs: Number(v) || 0 })
              )
          "
        />
      </label>
    </div>
  </div>
</template>
