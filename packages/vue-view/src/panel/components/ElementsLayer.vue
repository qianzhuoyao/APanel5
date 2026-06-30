<script setup lang="ts">
import { computed, defineComponent, h, type PropType } from "vue";
import type { PanelElement } from "../types";
import {
  AudioNodeContent,
  ChartNodeContent,
  CHART_TYPES,
  EmptyNodePlaceholder,
  GeometryNodeContent,
  getNodeVisualStyle,
  GridNodeContent,
  ImageNodeContent,
  ReferenceNodeContent,
  TextNodeContent,
  VideoNodeContent,
} from "./elementsLayerNodes";

const props = withDefaults(
  defineProps<{
    elements: PanelElement[];
    allElements: PanelElement[];
    selectedIds: string[];
    updateElement: (
      id: string,
      patch: Partial<PanelElement>,
      options?: { batchId?: string; meta?: Record<string, unknown> }
    ) => void;
    layerLocked?: boolean;
    previewMode?: boolean;
    previewLayoutKey?: number;
  }>(),
  { layerLocked: false, previewMode: false }
);

const emit = defineEmits<{
  selectIds: [ids: string[]];
}>();

const NodeContent = defineComponent({
  name: "NodeContent",
  props: {
    element: { type: Object as PropType<PanelElement>, required: true },
    allElements: { type: Array as PropType<PanelElement[]>, required: true },
    selected: { type: Boolean, default: false },
    layerLocked: { type: Boolean, default: false },
    previewMode: { type: Boolean, default: false },
    previewLayoutKey: { type: Number, default: undefined },
    updateElement: {
      type: Function as PropType<
        (
          id: string,
          patch: Partial<PanelElement>,
          options?: { batchId?: string; meta?: Record<string, unknown> }
        ) => void
      >,
      required: true,
    },
  },
  setup(p) {
    return () => {
      const el = p.element;
      if (CHART_TYPES.has(el.materialType ?? "")) {
        return h(ChartNodeContent, {
          element: el,
          previewLayoutKey: p.previewLayoutKey,
          previewMode: p.previewMode,
        });
      }
      if (el.materialType === "reference") {
        return h(ReferenceNodeContent, {
          element: el,
          allElements: p.allElements,
          previewLayoutKey: p.previewLayoutKey,
          previewMode: p.previewMode,
        });
      }
      if (el.materialType === "grid") {
        return h(GridNodeContent, {
          element: el,
          allElements: p.allElements,
          previewMode: p.previewMode,
        });
      }
      if (el.materialType === "text") {
        return h(TextNodeContent, {
          element: el,
          editable: (el.textAllowInput ?? true) && !el.locked && !p.layerLocked,
          onChange: (nextHtml: string) => p.updateElement(el.id, { textHtml: nextHtml }),
        });
      }
      if (el.materialType === "audio") {
        return h(AudioNodeContent, { element: el, selected: p.selected });
      }
      if (el.materialType === "video") {
        return h(VideoNodeContent, { element: el, selected: p.selected });
      }
      if (el.materialType === "geometry") {
        return h(GeometryNodeContent, { element: el });
      }
      if (el.materialType === "image") {
        return h(ImageNodeContent, { element: el });
      }
      return h(EmptyNodePlaceholder, { element: el });
    };
  },
});

const sortedElements = computed(() =>
  [...props.elements].sort((a, b) => {
    const za = a.zIndex ?? 1;
    const zb = b.zIndex ?? 1;
    if (za !== zb) return za - zb;
    return a.id.localeCompare(b.id);
  })
);

function onSelect(id: string, event: MouseEvent) {
  if (props.previewMode) return;
  if (event.button !== 0) return;
  const isSelected = props.selectedIds.includes(id);
  if (event.shiftKey) {
    emit(
      "selectIds",
      isSelected ? props.selectedIds.filter((sid) => sid !== id) : [...props.selectedIds, id]
    );
    return;
  }
  emit("selectIds", [id]);
}
</script>

<template>
  <div
    v-for="el in sortedElements"
    :key="el.id"
    :class="[
      'absolute select-none',
      previewMode ? '' : 'rv-selectable',
      !previewMode && selectedIds.includes(el.id) ? 'ring-2 ring-blue-500/90 ring-offset-0' : '',
    ]"
    :data-element-id="el.id"
    :style="{
      left: `${el.x}px`,
      top: `${el.y}px`,
      width: `${Math.max(1, el.width)}px`,
      height: `${Math.max(1, el.height)}px`,
      zIndex: el.zIndex ?? 1,
      transform: `rotate(${el.rotate ?? 0}deg)`,
      transformOrigin: 'center center',
      boxSizing: 'border-box',
      ...getNodeVisualStyle(el),
    }"
    @mousedown="onSelect(el.id, $event)"
  >
    <NodeContent
      :element="el"
      :all-elements="allElements"
      :selected="selectedIds.includes(el.id)"
      :layer-locked="layerLocked"
      :preview-mode="previewMode"
      :preview-layout-key="previewLayoutKey"
      :update-element="updateElement"
    />
  </div>
</template>
