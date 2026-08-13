<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { computed, onWatcherCleanup, shallowRef, toValue, watch, type MaybeRef } from "vue";
import type { PanelElement } from "../../types";
import { hasScopeTemplate } from "../../utils/scope-template";
import {
  collectElementScopeTemplateFields,
  matchScopeTemplateFieldId,
} from "../../utils/scope-template-preview";
import ScopeTemplatePreviewPanel from "./ScopeTemplatePreviewPanel.vue";

const { t, locale } = useI18n();

const PREVIEW_SLOT_ATTR = "data-scope-preview-slot";
const PREVIEW_KEY_ATTR = "data-scope-preview-key";

type PreviewAnchor = {
  key: string;
  template: string;
  fieldId?: string;
  slot: HTMLElement;
};

const props = defineProps<{
  scope: unknown;
  element: PanelElement | null;
  containerRef?: MaybeRef<HTMLElement | null | undefined>;
}>();

const keySeed = `scope-preview-${Math.random().toString(36).slice(2, 9)}`;
const anchors = shallowRef<PreviewAnchor[]>([]);

const templateFields = computed(() =>
  props.element ? collectElementScopeTemplateFields(props.element) : []
);

function isPreviewTarget(
  node: Element
): node is HTMLInputElement | HTMLTextAreaElement {
  if (node instanceof HTMLTextAreaElement) {
    return node.dataset.scopeAutocomplete !== "off";
  }
  if (node instanceof HTMLInputElement) {
    if (node.dataset.scopeAutocomplete === "off") return false;
    const type = node.type;
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

function ensurePreviewKey(
  input: HTMLInputElement | HTMLTextAreaElement
): string {
  const existing = input.getAttribute(PREVIEW_KEY_ATTR);
  if (existing) return existing;
  const key = `${keySeed}-${Math.random().toString(36).slice(2, 9)}`;
  input.setAttribute(PREVIEW_KEY_ATTR, key);
  return key;
}

function ensurePreviewSlot(
  input: HTMLInputElement | HTMLTextAreaElement
): HTMLElement {
  const host = input.closest("label") ?? input.parentElement;
  if (!host) return input;

  const existing = host.querySelector(`[${PREVIEW_SLOT_ATTR}]`);
  if (existing instanceof HTMLElement) return existing;

  const slot = document.createElement("div");
  slot.setAttribute(PREVIEW_SLOT_ATTR, "1");
  input.insertAdjacentElement("afterend", slot);
  return slot;
}

function removeOrphanPreviewSlots(container: HTMLElement) {
  container.querySelectorAll(`[${PREVIEW_SLOT_ATTR}]`).forEach((slot) => {
    const host = slot.parentElement;
    const input = host?.querySelector("input, textarea");
    if (
      !input ||
      !(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) ||
      !hasScopeTemplate(input.value)
    ) {
      slot.remove();
    }
  });
}

function inferFieldIdFromDom(
  input: HTMLInputElement | HTMLTextAreaElement
): string | undefined {
  const label = input.closest("label");
  const labelText = label?.textContent ?? "";
  if (labelText.includes(t("panel.scope.fieldChartLabelsText")) || labelText.includes("类目") || /labels?/i.test(labelText))
    return "chart.labelsText";
  if (labelText.includes(t("panel.scope.fieldChartValuesText")) || labelText.includes("数值") || /values?/i.test(labelText))
    return "chart.valuesText";
  return undefined;
}

function scanAnchors() {
  const container = toValue(props.containerRef);
  if (!container || props.scope === undefined) {
    anchors.value = [];
    return;
  }

  const next: PreviewAnchor[] = [];
  const inputs = container.querySelectorAll("input, textarea");
  for (const node of inputs) {
    if (!isPreviewTarget(node)) continue;
    const template = node.value;
    if (!hasScopeTemplate(template)) continue;

    const fieldId =
      matchScopeTemplateFieldId(template, templateFields.value) ??
      inferFieldIdFromDom(node);
    next.push({
      key: ensurePreviewKey(node),
      template,
      fieldId,
      slot: ensurePreviewSlot(node),
    });
  }

  removeOrphanPreviewSlots(container);

  const prev = anchors.value;
  if (
    prev.length === next.length &&
    prev.every(
      (item, index) =>
        item.key === next[index]?.key &&
        item.template === next[index]?.template &&
        item.fieldId === next[index]?.fieldId
    )
  ) {
    return;
  }
  anchors.value = next;
}

watch(
  [() => toValue(props.containerRef), () => props.element, () => props.scope, templateFields],
  () => {
    scanAnchors();
  },
  { flush: "post" }
);

watch(
  () => toValue(props.containerRef),
  (container) => {
    if (!container || props.scope === undefined) return;

    const onInput = () => {
      window.requestAnimationFrame(scanAnchors);
    };

    container.addEventListener("input", onInput, true);
    const observer = new MutationObserver(onInput);
    observer.observe(container, { childList: true, subtree: true });

    onWatcherCleanup(() => {
      container.removeEventListener("input", onInput, true);
      observer.disconnect();
      container
        .querySelectorAll(`[${PREVIEW_SLOT_ATTR}]`)
        .forEach((node) => node.remove());
    });
  },
  { immediate: true }
);
</script>

<template>
  <template v-if="scope !== undefined && anchors.length > 0">
    <Teleport
      v-for="anchor in anchors"
      :key="anchor.key"
      :to="anchor.slot"
    >
      <ScopeTemplatePreviewPanel
        :template="anchor.template"
        :scope="scope"
        :field-id="anchor.fieldId"
      />
    </Teleport>
  </template>
</template>
