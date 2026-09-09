<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import {
  filterStorageKeySuggestions,
  listBrowserStorageKeys,
  type StorageKind,
} from "@arronqzy/blueprint-dsl";
import { computed, onUnmounted, ref, watch } from "vue";

import { cn } from "../utils/cn";

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    value: string;
    storages: StorageKind | readonly StorageKind[];
    placeholder?: string;
  }>(),
  {
    placeholder: "",
  }
);

const emit = defineEmits<{
  change: [value: string];
}>();

const open = ref(false);
const activeIndex = ref(0);
const keys = ref<string[]>([]);
const containerRef = ref<HTMLDivElement | null>(null);

const storageList = computed(() =>
  Array.isArray(props.storages) ? [...props.storages] : [props.storages]
);

function refreshKeys() {
  keys.value = listBrowserStorageKeys(storageList.value);
}

watch(
  storageList,
  () => {
    refreshKeys();
  },
  { immediate: true, deep: true }
);

const filtered = computed(() =>
  filterStorageKeySuggestions(keys.value, props.value)
);

watch([() => props.value, () => filtered.value.length], () => {
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
    }
  };
  window.addEventListener("pointerdown", onPointerDown);
  pointerCleanup = () => window.removeEventListener("pointerdown", onPointerDown);
});

onUnmounted(() => {
  pointerCleanup?.();
});

const showSuggestions = computed(() => open.value && keys.value.length > 0);

function selectSuggestion(index: number) {
  const item = filtered.value[index];
  if (!item) return;
  emit("change", item);
  open.value = false;
}

function openDropdown() {
  refreshKeys();
  open.value = true;
}

function handleInput(event: Event) {
  emit("change", (event.target as HTMLInputElement).value);
  open.value = true;
}

function handleKeyDown(event: KeyboardEvent) {
  if (!showSuggestions.value || filtered.value.length === 0) {
    if (event.key === "Escape") open.value = false;
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
    open.value = false;
  }
}
</script>

<template>
  <div ref="containerRef" class="relative">
    <input
      :value="value"
      :placeholder="placeholder"
      spellcheck="false"
      class="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 font-mono text-[11px] text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
      @input="handleInput"
      @focus="openDropdown"
      @click="openDropdown"
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
        {{ t("blueprint.config.noMatchingStorageKey") }}
      </div>
      <button
        v-for="(key, index) in filtered"
        :key="key"
        type="button"
        class="flex w-full items-center px-2 py-1.5 text-left font-mono text-[11px] hover:bg-accent"
        :class="cn(index === activeIndex && 'bg-accent')"
        @mousedown.prevent
        @click="selectSuggestion(index)"
      >
        {{ key }}
      </button>
    </div>
    <div
      v-else-if="open && keys.length === 0"
      class="absolute z-[10150] mt-1 w-full rounded-md border border-border bg-popover px-2 py-1.5 text-[11px] text-muted-foreground shadow-md"
    >
      {{ t("blueprint.config.noStorageKeys") }}
    </div>
  </div>
</template>
