<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import {
  buildEndpointSuggestions,
  filterEndpointSuggestions,
  type SwaggerApiEndpoint,
} from "@arronqzy/blueprint-dsl";

import { cn } from "../utils/cn";

const props = withDefaults(
  defineProps<{
    value: string;
    apiBaseUrl: string;
    endpoints: SwaggerApiEndpoint[];
    placeholder?: string;
    selectOnly?: boolean;
  }>(),
  {
    placeholder: "",
    selectOnly: false,
  }
);

const emit = defineEmits<{
  change: [value: string];
  selectEndpoint: [endpoint: SwaggerApiEndpoint, fullUrl: string];
}>();

const open = ref(false);
const activeIndex = ref(0);
const filterQuery = ref("");
const containerRef = ref<HTMLDivElement | null>(null);

const suggestions = computed(() =>
  buildEndpointSuggestions(props.apiBaseUrl, props.endpoints)
);

const query = computed(() => (props.selectOnly ? filterQuery.value : props.value));

const filtered = computed(() =>
  filterEndpointSuggestions(suggestions.value, query.value)
);

const selectedSuggestion = computed(() =>
  suggestions.value.find((item) => item.path === props.value)
);

const inputValue = computed(() => {
  if (!props.selectOnly) return props.value;
  if (open.value) return filterQuery.value;
  return selectedSuggestion.value?.label ?? props.value;
});

watch([query, () => filtered.value.length], () => {
  activeIndex.value = 0;
});

let pointerCleanup: (() => void) | null = null;

watch(open, (isOpen) => {
  pointerCleanup?.();
  pointerCleanup = null;
  if (!isOpen) return;

  const onPointerDown = (event: MouseEvent) => {
    if (!containerRef.value?.contains(event.target as globalThis.Node)) {
      open.value = false;
      filterQuery.value = "";
    }
  };
  window.addEventListener("pointerdown", onPointerDown);
  pointerCleanup = () => window.removeEventListener("pointerdown", onPointerDown);
});

onUnmounted(() => {
  pointerCleanup?.();
});

const showSuggestions = computed(() => open.value && props.endpoints.length > 0);

function selectSuggestion(index: number) {
  const item = filtered.value[index];
  if (!item) return;
  const nextValue = props.apiBaseUrl.trim() ? item.path : item.fullUrl;
  emit("change", nextValue);
  emit("selectEndpoint", item, item.fullUrl);
  filterQuery.value = "";
  open.value = false;
}

function openDropdown() {
  open.value = true;
  if (props.selectOnly) {
    filterQuery.value = "";
  }
}

function closeDropdown() {
  open.value = false;
  filterQuery.value = "";
}

function handleInput(event: Event) {
  const next = (event.target as HTMLInputElement).value;
  if (props.selectOnly) {
    filterQuery.value = next;
    open.value = true;
    return;
  }
  emit("change", next);
  open.value = true;
}

function handleKeyDown(event: KeyboardEvent) {
  if (!showSuggestions.value || filtered.value.length === 0) {
    if (props.selectOnly && event.key === "Escape") {
      closeDropdown();
    }
    return;
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    activeIndex.value = Math.min(activeIndex.value + 1, filtered.value.length - 1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    activeIndex.value = Math.max(activeIndex.value - 1, 0);
  } else if (event.key === "Enter") {
    event.preventDefault();
    selectSuggestion(activeIndex.value);
  } else if (event.key === "Escape") {
    closeDropdown();
  }
}
</script>

<template>
  <div ref="containerRef" class="relative">
    <input
      :value="inputValue"
      :readOnly="selectOnly && !open"
      :placeholder="placeholder"
      class="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-[11px] text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
      :class="selectOnly && !open ? 'cursor-pointer font-medium' : 'font-mono'"
      @input="handleInput"
      @focus="openDropdown"
      @blur="selectOnly ? closeDropdown() : undefined"
      @keydown="handleKeyDown"
    />
    <div
      v-if="showSuggestions"
      class="absolute z-[10150] mt-1 max-h-52 w-full overflow-auto rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-md"
    >
      <div
        v-if="filtered.length === 0"
        class="px-2 py-1.5 text-[11px] text-muted-foreground"
      >
        无匹配接口
      </div>
      <button
        v-for="(item, index) in filtered"
        :key="`${item.method}:${item.path}:${item.operationId ?? index}`"
        type="button"
        class="flex w-full flex-col items-start gap-0.5 px-2 py-1.5 text-left text-[11px] hover:bg-accent"
        :class="cn(index === activeIndex && 'bg-accent')"
        @mousedown.prevent
        @click="selectSuggestion(index)"
      >
        <span class="font-medium text-foreground">{{ item.label }}</span>
        <span class="truncate font-mono text-muted-foreground">{{ item.fullUrl }}</span>
      </button>
    </div>
  </div>
</template>
