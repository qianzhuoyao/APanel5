<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  toValue,
  watch,
  type MaybeRef,
} from "vue";
import {
  applyScopeAutocompleteSelection,
  buildScopeExpression,
  getScopeAutocompleteSuggestions,
  parseScopeAutocomplete,
  type ScopeAutocompleteState,
} from "../../utils/scope-autocomplete";

type DropdownState = {
  input: HTMLInputElement | HTMLTextAreaElement;
  state: ScopeAutocompleteState;
  suggestions: string[];
  activeIndex: number;
  rect: DOMRect;
};

const props = defineProps<{
  scope: unknown;
  containerRef?: MaybeRef<HTMLElement | null | undefined>;
}>();

const dropdown = shallowRef<DropdownState | null>(null);

function isAutocompleteTarget(
  target: EventTarget | null
): target is HTMLInputElement | HTMLTextAreaElement {
  if (target instanceof HTMLTextAreaElement) {
    return target.dataset.scopeAutocomplete !== "off";
  }
  if (target instanceof HTMLInputElement) {
    if (target.dataset.scopeAutocomplete === "off") return false;
    const type = target.type;
    return (
      !type ||
      type === "text" ||
      type === "search" ||
      type === "url" ||
      type === "password"
    );
  }
  return false;
}

function setNativeInputValue(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string
) {
  const proto =
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(proto, "value");
  descriptor?.set?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
}

function closeDropdown() {
  dropdown.value = null;
}

function refreshForInput(input: HTMLInputElement | HTMLTextAreaElement) {
  if (props.scope === undefined) {
    closeDropdown();
    return;
  }
  const cursor = input.selectionStart ?? input.value.length;
  const parsed = parseScopeAutocomplete(input.value, cursor, props.scope);
  if (!parsed) {
    closeDropdown();
    return;
  }
  const suggestions = getScopeAutocompleteSuggestions(props.scope, parsed);
  if (suggestions.length === 0) {
    closeDropdown();
    return;
  }
  dropdown.value = {
    input,
    state: parsed,
    suggestions,
    activeIndex: 0,
    rect: input.getBoundingClientRect(),
  };
}

function applySuggestion(index: number) {
  const current = dropdown.value;
  if (!current) return;
  const selected = current.suggestions[index];
  if (!selected) return;

  const { value, cursor } = applyScopeAutocompleteSelection(
    current.input.value,
    current.state,
    selected
  );
  setNativeInputValue(current.input, value);
  current.input.focus();
  current.input.setSelectionRange(cursor, cursor);
  closeDropdown();
  window.requestAnimationFrame(() => {
    refreshForInput(current.input);
  });
}

function onFocusIn(event: FocusEvent) {
  if (!isAutocompleteTarget(event.target)) return;
  refreshForInput(event.target);
}

function onInput(event: Event) {
  if (!isAutocompleteTarget(event.target)) return;
  refreshForInput(event.target);
}

function onKeyDown(event: KeyboardEvent) {
  const current = dropdown.value;
  if (!current || event.target !== current.input) return;

  if (event.key === "ArrowDown") {
    event.preventDefault();
    dropdown.value = {
      ...current,
      activeIndex: Math.min(current.activeIndex + 1, current.suggestions.length - 1),
    };
    return;
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    dropdown.value = {
      ...current,
      activeIndex: Math.max(current.activeIndex - 1, 0),
    };
    return;
  }
  if (event.key === "Enter" || event.key === "Tab") {
    if (current.suggestions.length > 0) {
      event.preventDefault();
      applySuggestion(current.activeIndex);
    }
    return;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    closeDropdown();
  }
}

function onPointerDown(event: MouseEvent) {
  const target = event.target as Node | null;
  if (
    dropdown.value?.input.contains(target ?? null) ||
    (target instanceof Element && target.closest("[data-scope-ac-list]"))
  ) {
    return;
  }
  const container = toValue(props.containerRef);
  if (container && !container.contains(target)) {
    closeDropdown();
  }
}

watch(
  () => toValue(props.containerRef),
  (container, _prev, onCleanup) => {
    if (!container || props.scope === undefined) return;

    container.addEventListener("focusin", onFocusIn);
    container.addEventListener("input", onInput, true);
    container.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("scroll", closeDropdown, true);
    window.addEventListener("resize", closeDropdown);

    onCleanup(() => {
      container.removeEventListener("focusin", onFocusIn);
      container.removeEventListener("input", onInput, true);
      container.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("scroll", closeDropdown, true);
      window.removeEventListener("resize", closeDropdown);
    });
  },
  { immediate: true }
);

watch(
  () => props.scope,
  () => {
    if (props.scope === undefined) closeDropdown();
  }
);
</script>

<template>
  <Teleport v-if="dropdown && scope !== undefined" to="body">
    <div
      data-scope-ac-list
      class="fixed z-[10120] max-h-44 min-w-[140px] overflow-auto rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-md"
      :style="{
        left: `${dropdown.rect.left}px`,
        top: `${dropdown.rect.bottom + 4}px`,
        width: `${Math.max(dropdown.rect.width, 160)}px`,
      }"
    >
      <button
        v-for="(key, index) in dropdown.suggestions"
        :key="key"
        type="button"
        :class="[
          'flex w-full flex-col items-start gap-0.5 px-2 py-1.5 text-left text-[11px] hover:bg-accent',
          index === dropdown.activeIndex && 'bg-accent',
        ]"
        @mousedown.prevent
        @click="applySuggestion(index)"
      >
        <span class="font-medium text-foreground">{{ key }}</span>
        <span class="font-mono text-[10px] text-muted-foreground">{{
          `{${buildScopeExpression(dropdown.state.path, key)}}`
        }}</span>
      </button>
    </div>
  </Teleport>
</template>
