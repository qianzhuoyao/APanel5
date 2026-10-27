<script setup lang="ts">
import { computed } from "vue";
import { openTemplateDoc, splitTemplateDocLinks } from "@arronqzy/blueprint-dsl";
import type { TemplateDocPiece } from "@arronqzy/blueprint-dsl";

const props = defineProps<{ text: string }>();
const pieces = computed(() => splitTemplateDocLinks(props.text));

function openPiece(piece: Extract<TemplateDocPiece, { type: "link" }>) {
  openTemplateDoc({
    root: piece.root,
    sectionId: piece.sectionId,
    token: piece.text,
  });
}
</script>

<template>
  <template v-for="(piece, index) in pieces" :key="index">
    <span v-if="piece.type === 'text'">{{ piece.text }}</span>
    <button
      v-else
      type="button"
      class="rv-doc-link inline cursor-pointer border-0 bg-transparent p-0 font-medium underline underline-offset-2"
      @mousedown.stop.prevent="openPiece(piece)"
      @click.stop.prevent
    >
      {{ piece.text }}
    </button>
  </template>
</template>

<style>
.rv-doc-link {
  color: #0070cc;
  text-decoration-color: rgb(0 112 204 / 45%);
}
.rv-doc-link:hover {
  color: #005ea8;
}
html.dark .rv-doc-link {
  color: #44aaff;
  text-decoration-color: rgb(68 170 255 / 45%);
}
html.dark .rv-doc-link:hover {
  color: #8cc8ff;
}
</style>
