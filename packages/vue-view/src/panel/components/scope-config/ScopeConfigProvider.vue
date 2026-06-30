<script setup lang="ts">
import { computed, onWatcherCleanup, provide, reactive, toValue, watch, type MaybeRef } from "vue";
import type { PanelElement } from "../../types";
import { scopeFieldDomId } from "../../utils/scope-field-labels";
import { groupScopeWarningsByField } from "../../utils/scope-template-warnings";
import {
  scopeConfigKey,
  type ScopeConfigContextValue,
} from "./scopeConfigContext";
import ScopeTemplateAutocompleteHost from "./ScopeTemplateAutocompleteHost.vue";
import ScopeTemplatePreviewHost from "./ScopeTemplatePreviewHost.vue";
import type { ScopeTemplateWarning } from "../../utils/scope-template-warnings";

const INLINE_HINT_ATTR = "data-scope-inline-hint";

const props = defineProps<{
  scope?: unknown;
  element?: PanelElement | null;
  warnings: ScopeTemplateWarning[];
  scrollContainerRef?: MaybeRef<HTMLElement | null | undefined>;
}>();

const warningsByField = computed(() => groupScopeWarningsByField(props.warnings));

function findFieldAnchor(
  container: HTMLElement,
  fieldId: string,
  fieldWarnings: ScopeTemplateWarning[]
): HTMLElement | null {
  const existing = document.getElementById(scopeFieldDomId(fieldId));
  if (existing) return existing;

  const inputs = container.querySelectorAll("input, textarea");
  for (const input of inputs) {
    if (
      !(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)
    ) {
      continue;
    }
    const matched = fieldWarnings.some(
      (warning) =>
        input.value === warning.template ||
        input.value.includes(warning.expression)
    );
    if (!matched) continue;
    const host = input.closest("label") ?? input.parentElement;
    if (host instanceof HTMLElement) {
      host.id = scopeFieldDomId(fieldId);
      return host;
    }
  }

  return null;
}

function attachInlineHints(
  container: HTMLElement,
  byField: Map<string, ScopeTemplateWarning[]>
) {
  container
    .querySelectorAll(`[${INLINE_HINT_ATTR}]`)
    .forEach((node) => node.remove());

  for (const [fieldId, fieldWarnings] of byField) {
    const anchor = findFieldAnchor(container, fieldId, fieldWarnings);
    if (!anchor || anchor.querySelector(`[${INLINE_HINT_ATTR}]`)) continue;

    const hint = document.createElement("div");
    hint.setAttribute(INLINE_HINT_ATTR, "1");
    hint.className = "space-y-0.5";
    for (const warning of fieldWarnings) {
      const line = document.createElement("p");
      line.className =
        "text-[10px] leading-relaxed text-amber-700 dark:text-amber-300";
      line.textContent = warning.message;
      hint.appendChild(line);
    }
    anchor.appendChild(hint);
  }
}

function scrollContainer() {
  return toValue(props.scrollContainerRef) ?? null;
}

function scrollToField(fieldId: string) {
  const container = scrollContainer();
  const fieldWarnings = warningsByField.value.get(fieldId);
  if (container && fieldWarnings?.length) {
    findFieldAnchor(container, fieldId, fieldWarnings);
  }

  const target = document.getElementById(scopeFieldDomId(fieldId));
  if (!target) return;

  if (container && container.contains(target)) {
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const offset =
      targetRect.top -
      containerRect.top +
      container.scrollTop -
      container.clientHeight / 2 +
      targetRect.height / 2;
    container.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  target.classList.add("scope-field--highlight");
  window.setTimeout(() => {
    target.classList.remove("scope-field--highlight");
  }, 1600);
}

const api = reactive<ScopeConfigContextValue>({
  get warnings() {
    return props.warnings;
  },
  get warningsByField() {
    return warningsByField.value;
  },
  scrollToField,
});

provide(scopeConfigKey, api);

watch(
  [() => scrollContainer(), () => props.warnings, warningsByField],
  () => {
    const container = scrollContainer();
    if (!container || props.warnings.length === 0) return;

    attachInlineHints(container, warningsByField.value);
    onWatcherCleanup(() => {
      container
        .querySelectorAll(`[${INLINE_HINT_ATTR}]`)
        .forEach((node) => node.remove());
    });
  },
  { flush: "post" }
);
</script>

<template>
  <slot />
  <ScopeTemplateAutocompleteHost :scope="scope" :container-ref="scrollContainerRef" />
  <ScopeTemplatePreviewHost
    :scope="scope"
    :element="element ?? null"
    :container-ref="scrollContainerRef"
  />
</template>
