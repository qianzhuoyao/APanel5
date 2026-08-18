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
import TableNodeContent from "./table/TableNodeContent.vue";
import Scene3dNodeContent from "@arronqzy/view-scene3d/vue";
import { mergeScene3dConfig } from "@arronqzy/view-scene3d";
import type { TableCellActionHandler } from "./table/TableNodeContent.vue";
import { comparePanelElementsPaintOrder } from "../utils/gridPlacement";
import {
  createViewEventSignal,
  snapshotDomEvent,
  snapshotViewEventNode,
  type ViewEventSignal,
  type ViewEventType,
} from "@arronqzy/blueprint-dsl";

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
    onTableCellAction?: TableCellActionHandler;
    boundViewEventTypes?: ReadonlyMap<string, ReadonlySet<ViewEventType>>;
    onViewUiEvent?: (payload: ViewEventSignal) => void;
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
    onTableCellAction: {
      type: Function as PropType<TableCellActionHandler | undefined>,
      default: undefined,
    },
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
      if (el.materialType === "scene3d") {
        return h(Scene3dNodeContent, {
          config: el.scene3d,
          previewMode: p.previewMode,
          selected: p.selected,
          onUpdateConfig: (patch) =>
            p.updateElement(el.id, {
              scene3d: mergeScene3dConfig({ ...el.scene3d, ...patch }),
            }),
        });
      }
      if (el.materialType === "image") {
        return h(ImageNodeContent, { element: el });
      }
      if (el.materialType === "table") {
        return h(TableNodeContent, {
          element: el,
          interactive: p.previewMode || Boolean(p.onTableCellAction),
          onCellAction: p.onTableCellAction,
        });
      }
      return h(EmptyNodePlaceholder, { element: el });
    };
  },
});

const sortedElements = computed(() => {
  const byId = new Map<string, PanelElement>();
  for (const el of props.allElements) byId.set(el.id, el);
  return [...props.elements].sort((a, b) => comparePanelElementsPaintOrder(a, b, byId));
});

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

function emitViewUiEvent(el: PanelElement, eventType: ViewEventType, event: MouseEvent) {
  if (!props.onViewUiEvent) return;
  if (!props.boundViewEventTypes?.get(el.id)?.has(eventType)) return;
  props.onViewUiEvent(
    createViewEventSignal({
      eventType,
      event: snapshotDomEvent(event),
      node: snapshotViewEventNode(el),
    })
  );
}

function hasViewEvent(el: PanelElement) {
  const types = props.boundViewEventTypes?.get(el.id);
  return Boolean(types && types.size > 0 && props.onViewUiEvent);
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
      hasViewEvent(el) ? 'cursor-pointer' : '',
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
    @click="emitViewUiEvent(el, 'click', $event)"
    @dblclick="emitViewUiEvent(el, 'dblclick', $event)"
    @contextmenu="emitViewUiEvent(el, 'contextmenu', $event)"
    @mouseenter="emitViewUiEvent(el, 'mouseenter', $event)"
    @mouseleave="emitViewUiEvent(el, 'mouseleave', $event)"
  >
    <NodeContent
      :element="el"
      :all-elements="allElements"
      :selected="selectedIds.includes(el.id)"
      :layer-locked="layerLocked"
      :preview-mode="previewMode"
      :preview-layout-key="previewLayoutKey"
      :update-element="updateElement"
      :on-table-cell-action="onTableCellAction"
    />
  </div>
</template>
