<script setup lang="ts">
import { computed, ref } from "vue";
import { Button, Input, Select } from "ant-design-vue";
import type {
  FetchHttpMethod,
  FetchRequestConfig,
  FetchResponseType,
} from "@arronqzy/blueprint-dsl";
import {
  FETCH_CACHES,
  FETCH_CREDENTIALS,
  FETCH_HTTP_METHODS,
  FETCH_MODES,
  FETCH_NODE_TYPE,
  FETCH_REDIRECTS,
  FETCH_RESPONSE_TYPES,
} from "@arronqzy/blueprint-dsl";

import type { BlueprintGraphNode } from "../graph/document";
import { resolveNodeFetchConfig } from "../graph/document";
import {
  cancelFetchDebugTask,
  cancelSwaggerLoadTask,
  startFetchDebugTask,
  startSwaggerLoadTask,
  useFetchDebugTask,
  useSwaggerLoadTask,
} from "../fetch-config-task-store";
import FetchUrlAutocomplete from "./FetchUrlAutocomplete.vue";

export type FetchNodeConfigPanelProps = {
  node: BlueprintGraphNode;
  onUpdateNode: (
    nodeId: string,
    patch: Partial<Pick<BlueprintGraphNode, "fetchConfig" | "configSource">>
  ) => void;
};

const props = defineProps<FetchNodeConfigPanelProps>();

const validationError = ref<string | null>(null);
const fetchValidationError = ref<string | null>(null);
const debugExpanded = ref(false);

const fetchConfig = computed(() => resolveNodeFetchConfig(props.node));
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
    validationError.value = "请先填写 Swagger 文档 URL";
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
  const url = fetchConfig.value.url?.trim();
  if (!url) {
    fetchValidationError.value = "请先填写请求 URL";
    return;
  }

  fetchValidationError.value = null;
  startFetchDebugTask({
    nodeId: props.node.id,
    config: fetchConfig.value,
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
  try {
    const headers = JSON.parse((event.target as HTMLTextAreaElement).value || "{}") as Record<
      string,
      string
    >;
    props.onUpdateNode(props.node.id, patchFetchConfig(props.node, { headers }));
  } catch {
    /* 保留上次有效值 */
  }
}
</script>

<template>
  <div class="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
    <div class="font-medium text-foreground">数据源获取 (Fetch)</div>
    <p class="text-[11px] text-muted-foreground">
      收到<strong>真信号</strong>后发起 HTTP 请求；可导入 Swagger 文档后从接口列表联想选择
      URL。
    </p>

    <label class="block space-y-1">
      <span class="text-muted-foreground">Swagger 文档 URL（可选）</span>
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
          title="中止解析"
          aria-label="中止 Swagger 解析"
          @click="handleAbortSwagger"
        >
          ■
        </Button>
        <Button
          v-else
          size="small"
          class="h-8 w-8 shrink-0"
          title="解析 Swagger 文档"
          @click="handleLoadSwagger"
        >
          ➤
        </Button>
      </div>
      <p v-if="loadingSwagger" class="text-[11px] text-muted-foreground">
        正在解析 Swagger 文档，点击右侧按钮可中止…
      </p>
      <p v-if="swaggerError" class="text-[11px] text-destructive">{{ swaggerError }}</p>
      <p v-if="endpoints.length > 0" class="text-[11px] text-muted-foreground">
        已解析 {{ endpoints.length }} 个接口
      </p>
    </label>

    <label class="block space-y-1">
      <div class="flex items-center justify-between gap-2">
        <span class="text-muted-foreground">请求 URL</span>
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
            接口联想
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
            手动输入
          </button>
        </div>
      </div>

      <div
        v-if="urlInputMode === 'swagger' && hasSwaggerEndpoints"
        class="space-y-2"
        :class="loadingSwagger && 'pointer-events-none opacity-60'"
      >
        <label class="block space-y-1">
          <span class="text-muted-foreground">API 主机 / Base URL</span>
          <Input
            size="small"
            :value="fetchConfig.apiBaseUrl ?? ''"
            placeholder="https://api.example.com/v1"
            class="font-mono text-[11px]"
            @update:value="
              (v) => onUpdateNode(node.id, patchFetchConfig(node, { apiBaseUrl: String(v) }))
            "
          />
        </label>
        <label class="block space-y-1">
          <span class="text-muted-foreground">选择接口</span>
          <div class="flex gap-1.5">
            <div class="min-w-0 flex-1">
              <FetchUrlAutocomplete
                :value="fetchConfig.url"
                :api-base-url="fetchConfig.apiBaseUrl ?? ''"
                :endpoints="endpoints"
                select-only
                placeholder="点击选择或搜索接口"
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
              title="中止请求"
              @click="handleAbortFetchDebug"
            >
              ■
            </Button>
            <Button
              v-else
              size="small"
              class="h-8 w-8 shrink-0"
              :disabled="loadingSwagger"
              title="发送调试请求"
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
          placeholder="https://api.example.com/data"
          class="flex-1 font-mono text-[11px]"
          @update:value="(v) => onUpdateNode(node.id, patchFetchConfig(node, { url: String(v) }))"
        />
        <Button
          v-if="loadingFetchDebug"
          size="small"
          class="h-8 w-8 shrink-0"
          title="中止请求"
          @click="handleAbortFetchDebug"
        >
          ■
        </Button>
        <Button
          v-else
          size="small"
          class="h-8 w-8 shrink-0"
          :disabled="loadingSwagger"
          title="发送调试请求"
          @click="handleSendFetchDebug"
        >
          ➤
        </Button>
      </div>

      <p v-if="loadingFetchDebug" class="text-[11px] text-muted-foreground">
        正在发送调试请求，点击右侧按钮可中止…
      </p>
      <p v-if="fetchValidationError" class="text-[11px] text-destructive">
        {{ fetchValidationError }}
      </p>

      <div
        v-if="fetchDebugTask.status === 'error'"
        class="rounded-md border border-destructive/40 bg-destructive/5 p-2"
      >
        <p class="text-[11px] text-destructive">
          {{ fetchDebugTask.error ?? "请求失败" }}
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
          <span class="text-[11px] font-medium text-foreground">调试响应</span>
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
      <span class="text-muted-foreground">请求方法</span>
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
      <span class="text-muted-foreground">请求头 (JSON)</span>
      <textarea
        :key="`${node.id}-headers-${JSON.stringify(fetchConfig.headers)}`"
        :value="JSON.stringify(fetchConfig.headers ?? {}, null, 2)"
        rows="4"
        class="w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
        placeholder='{"Content-Type":"application/json"}'
        @blur="handleHeadersBlur"
      />
    </label>

    <label class="block space-y-1">
      <span class="text-muted-foreground">请求体</span>
      <textarea
        :value="fetchConfig.body ?? ''"
        rows="4"
        class="w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
        placeholder='{"key":"value"}'
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
        <span class="text-muted-foreground">响应解析</span>
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
        <span class="text-muted-foreground">超时 (ms)</span>
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
