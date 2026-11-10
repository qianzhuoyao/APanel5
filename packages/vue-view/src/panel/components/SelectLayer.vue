<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, watch } from "vue";
import Selecto from "selecto";

const props = withDefaults(
  defineProps<{
    container: HTMLElement | null;
    dragContainer?: HTMLElement | null;
    rootContainer?: HTMLElement | null;
    selectableTargets?: string[];
    selectedIds: string[];
  }>(),
  { selectableTargets: () => [".rv-selectable"] }
);

const emit = defineEmits<{
  selectedIdsChange: [ids: string[]];
}>();

const selectoRef = shallowRef<Selecto | null>(null);
const portalElRef = shallowRef<HTMLElement | null>(null);
/** Keep a live Set so Selecto handlers see latest selection without recreating the instance. */
const selectedIdSetRef = shallowRef(new Set(props.selectedIds));

function ensurePortalEl(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  if (portalElRef.value?.isConnected) return portalElRef.value;
  const el = document.createElement("div");
  el.setAttribute("data-abuilder-selecto-portal", "");
  document.body.appendChild(el);
  portalElRef.value = el;
  return el;
}

function destroyPortalEl() {
  portalElRef.value?.remove();
  portalElRef.value = null;
}

function handleSelect(e: {
  selected?: Array<HTMLElement | SVGElement>;
  inputEvent?: MouseEvent;
}) {
  const input = e?.inputEvent;
  if (input && input.button !== 0) return;
  const selected = e?.selected ?? [];
  const idSet = new Set<string>();
  for (const el of selected) {
    const root = (el as Element).closest?.(".rv-selectable") as HTMLElement | null;
    const id = root?.dataset.elementId;
    if (id) idSet.add(id);
  }
  emit("selectedIdsChange", Array.from(idSet));
}

function destroySelecto() {
  selectoRef.value?.destroy();
  selectoRef.value = null;
  destroyPortalEl();
}

function createSelecto() {
  destroySelecto();
  const dragRoot = props.dragContainer ?? props.rootContainer ?? null;
  const portalContainer = ensurePortalEl();
  if (!props.container || !dragRoot || !portalContainer) return;

  const selecto = new Selecto({
    // 框选层挂在未 scale 的视口上，避免选区宽高被画布 transform 放大、线宽视觉变粗
    container: dragRoot,
    rootContainer: dragRoot,
    // Selecto 会把 selecto-selection（含 display:none）写到 portal 节点上，不能直接用 body
    portalContainer,
    dragContainer: dragRoot,
    selectableTargets: props.selectableTargets,
    selectByClick: false,
    selectFromInside: false,
    preventDragFromInside: false,
    preventDefault: false,
    continueSelect: false,
    toggleContinueSelect: "shift",
    ratio: 0,
    hitRate: 0,
    dragCondition: (e: { inputEvent?: MouseEvent }) => {
      const input = e?.inputEvent;
      if (input && input.button !== 0) return false;
      const target = (input?.target as HTMLElement | null) ?? null;
      if (target?.closest("[data-scene3d-orbit-active='true']")) return false;
      const isShift = !!input?.shiftKey;
      if (isShift) return true;

      const selectedIdSet = selectedIdSetRef.value;
      if (selectedIdSet.size > 0) {
        if (
          target?.closest(".moveable-control-box") ||
          target?.closest(".moveable-group") ||
          target?.closest(".moveable-area") ||
          target?.closest(".moveable-line") ||
          target?.closest(".moveable-control") ||
          target?.closest(".moveable-direction")
        ) {
          return false;
        }
        const selectable = target?.closest(".rv-selectable") as HTMLElement | null;
        const id = selectable?.dataset.elementId;
        if (id && selectedIdSet.has(id)) return false;
      }
      return true;
    },
  });

  selecto.on("dragStart", (e: { inputEvent: MouseEvent; stop: () => void }) => {
    const input = e.inputEvent;
    if (input && input.button !== 0) {
      e.stop();
      return;
    }
    const target = e.inputEvent.target as HTMLElement | null;
    if (target?.closest("[data-scene3d-orbit-active='true']")) {
      e.stop();
      return;
    }
    const selectable = target?.closest(".rv-selectable") as HTMLElement | null;
    const id = selectable?.dataset.elementId;
    const isShift = e.inputEvent?.shiftKey ?? false;
    if (id && selectedIdSetRef.value.has(id) && !isShift) e.stop();
  });

  selecto.on("select", handleSelect);
  selectoRef.value = selecto;
}

watch(
  () => props.selectedIds,
  (ids) => {
    selectedIdSetRef.value = new Set(ids);
  },
  { deep: true }
);

watch(
  () =>
    [props.container, props.dragContainer, props.rootContainer, props.selectableTargets] as const,
  () => createSelecto(),
  { deep: true }
);

onMounted(() => createSelecto());

onUnmounted(() => destroySelecto());
</script>

<template>
  <span class="hidden" aria-hidden="true" />
</template>
