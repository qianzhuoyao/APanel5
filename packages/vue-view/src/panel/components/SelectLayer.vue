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

function handleSelect(e: { selected?: Array<HTMLElement | SVGElement>; inputEvent?: MouseEvent }) {
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
}

function createSelecto() {
  destroySelecto();
  const dragRoot = props.dragContainer ?? props.rootContainer ?? null;
  if (!props.container || !dragRoot) return;

  const selectedIdSet = new Set(props.selectedIds);
  const selecto = new Selecto({
    container: props.container,
    rootContainer: dragRoot,
    portalContainer: document.body,
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
      const isShift = !!input?.shiftKey;
      if (isShift) return true;

      if (selectedIdSet.size > 0) {
        if (
          target?.closest(".moveable-control-box") ||
          target?.closest(".moveable-group") ||
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
    const selectable = target?.closest(".rv-selectable") as HTMLElement | null;
    const id = selectable?.dataset.elementId;
    const isShift = e.inputEvent?.shiftKey ?? false;
    if (id && selectedIdSet.has(id) && !isShift) e.stop();
  });

  selecto.on("select", handleSelect);
  selectoRef.value = selecto;
}

watch(
  () => [props.container, props.dragContainer, props.rootContainer, props.selectedIds] as const,
  () => createSelecto(),
  { deep: true }
);

onMounted(() => createSelecto());

onUnmounted(() => destroySelecto());
</script>

<template>
  <span class="hidden" aria-hidden="true" />
</template>
