<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { onUnmounted, ref, watch } from "vue";

const { t } = useI18n();
export type BlueprintContextMenuState =
  | {
      kind: "pane";
      clientX: number;
      clientY: number;
    }
  | {
      kind: "node";
      clientX: number;
      clientY: number;
      nodeId: string;
      role: "blueprint" | "logic" | "and" | "lifecycle" | "event" | "fetch" | "json" | "storage" | "clock";
    }
  | {
      kind: "edge";
      clientX: number;
      clientY: number;
      edgeId: string;
    };

const props = defineProps<{
  menu: BlueprintContextMenuState | null;
}>();

const emit = defineEmits<{
  close: [];
  addBlueprintNode: [clientX: number, clientY: number];
  deleteNode: [nodeId: string];
  deleteEdge: [edgeId: string];
}>();

const menuRef = ref<HTMLDivElement | null>(null);
let cleanupListeners: (() => void) | null = null;

function closeOnPointerDown(event: Event) {
  const target = event.target as globalThis.Node | null;
  if (target && menuRef.value?.contains(target)) return;
  emit("close");
}

watch(
  () => props.menu,
  (menu) => {
    cleanupListeners?.();
    cleanupListeners = null;
    if (!menu) return;

    const close = () => emit("close");
    window.addEventListener("pointerdown", closeOnPointerDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    cleanupListeners = () => {
      window.removeEventListener("pointerdown", closeOnPointerDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  },
  { immediate: true }
);

onUnmounted(() => {
  cleanupListeners?.();
});
</script>

<template>
  <div
    v-if="menu"
    ref="menuRef"
    class="bp-context-menu"
    :style="{ left: `${menu.clientX}px`, top: `${menu.clientY}px` }"
    @mousedown.stop
    @contextmenu.prevent
  >
    <button
      v-if="menu.kind === 'pane'"
      type="button"
      class="bp-context-menu__item"
      @click="
        emit('addBlueprintNode', menu.clientX, menu.clientY);
        emit('close');
      "
    >
      {{ t("blueprint.toolbar.addNode") }}
    </button>

    <button
      v-else-if="menu.kind === 'node'"
      type="button"
      class="bp-context-menu__item bp-context-menu__item--danger"
      @click="
        emit('deleteNode', menu.nodeId);
        emit('close');
      "
    >
      {{ t("blueprint.toolbar.deleteNode") }}
    </button>

    <button
      v-else-if="menu.kind === 'edge'"
      type="button"
      class="bp-context-menu__item bp-context-menu__item--danger"
      @click="
        emit('deleteEdge', menu.edgeId);
        emit('close');
      "
    >
      {{ t("blueprint.toolbar.deleteEdge") }}
    </button>
  </div>
</template>
