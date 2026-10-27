<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "@arronqzy/i18n/vue";
import { Input, Modal } from "ant-design-vue";
import {
  TEMPLATE_DOC_BOOKS,
  TEMPLATE_DOC_CHROME,
  closeTemplateDoc,
  docText,
  getTemplateDocRequest,
  sectionSearchText,
  subscribeTemplateDoc,
  type DocMember,
  type DocSection,
  type TemplateDocRequest,
} from "@arronqzy/blueprint-dsl";

import {
  getVueDocHostOwner,
  retainVueDocHost,
  subscribeVueDocHost,
} from "./template-doc-host-owner";

const { locale } = useI18n();
const hostId = Symbol("template-doc-host");
const isOwner = ref(false);
const request = ref<TemplateDocRequest | null>(getTemplateDocRequest());
const query = ref("");
const activeSectionId = ref(request.value?.sectionId ?? "");
const scrollerRef = ref<HTMLElement | null>(null);

function scrollDocSection(anchorId: string) {
  const container = scrollerRef.value;
  const target = document.getElementById(anchorId);
  if (!container || !target) return;
  const top =
    target.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop;
  container.scrollTo({ top: Math.max(0, top) });
}

let releaseHost = () => {};
let unsubscribeOwner = () => {};
let unsubscribeDoc = () => {};

onMounted(() => {
  const syncOwner = () => {
    isOwner.value = getVueDocHostOwner() === hostId;
  };
  unsubscribeOwner = subscribeVueDocHost(syncOwner);
  releaseHost = retainVueDocHost(hostId);
  syncOwner();
  unsubscribeDoc = subscribeTemplateDoc(() => {
    request.value = getTemplateDocRequest();
  });
});

onUnmounted(() => {
  releaseHost();
  unsubscribeOwner();
  unsubscribeDoc();
});

const book = computed(() =>
  request.value ? TEMPLATE_DOC_BOOKS[request.value.root] : null
);
const normalized = computed(() => query.value.trim().toLowerCase());

function sectionVisible(section: DocSection) {
  if (!normalized.value) return true;
  const plugin =
    section.id === "time"
      ? `${TEMPLATE_DOC_CHROME.pluginNote["zh-CN"]}\n${TEMPLATE_DOC_CHROME.pluginNote["en-US"]}`.toLowerCase()
      : "";
  return `${sectionSearchText(section)}\n${plugin}`.includes(normalized.value);
}

const sections = computed(() => book.value?.sections.filter(sectionVisible) ?? []);

function memberMatches(member: DocMember) {
  return [member.name, member.summary["zh-CN"], member.summary["en-US"], member.usage ?? ""]
    .join("\n")
    .toLowerCase()
    .includes(normalized.value);
}

function visibleMembers(section: DocSection) {
  const members = section.members ?? [];
  if (!normalized.value) return members;
  const matched = members.filter(memberMatches);
  if (matched.length > 0) return matched;
  const sectionHit = [
    section.title["zh-CN"],
    section.title["en-US"],
    section.body["zh-CN"],
    section.body["en-US"],
    ...(section.examples ?? []),
  ]
    .join("\n")
    .toLowerCase()
    .includes(normalized.value);
  return sectionHit ? members : [];
}

watch(
  () => request.value?.nonce,
  (nonce) => {
    if (nonce == null || !request.value) return;
    query.value = "";
    activeSectionId.value = request.value.sectionId;
    const anchorId = `template-doc-${request.value.root}-${request.value.sectionId}`;
    void nextTick(() => scrollDocSection(anchorId));
  }
);

watch(sections, (next) => {
  if (next.some((section) => section.id === activeSectionId.value)) return;
  if (next[0]) activeSectionId.value = next[0].id;
});

function selectSection(sectionId: string) {
  if (!request.value) return;
  activeSectionId.value = sectionId;
  void nextTick(() => {
    scrollDocSection(`template-doc-${request.value?.root}-${sectionId}`);
  });
}

function text(value: { "zh-CN": string; "en-US": string }) {
  return docText(value, locale.value);
}
</script>

<template>
  <Modal
    v-if="isOwner"
    :open="request != null"
    :footer="null"
    :width="760"
    :z-index="21000"
    :title="book ? text(book.title) : ''"
    @update:open="(open) => { if (!open) closeTemplateDoc(); }"
  >
    <div v-if="request && book" class="flex max-h-[70vh] flex-col gap-3">
      <p class="text-xs text-muted-foreground">{{ text(book.intro) }}</p>
      <p class="text-xs text-muted-foreground">
        {{ text(TEMPLATE_DOC_CHROME.current) }}
        <code class="ml-1 rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
          {{ request.token }}
        </code>
      </p>
      <Input
        v-model:value="query"
        :placeholder="text(TEMPLATE_DOC_CHROME.searchPlaceholder)"
        allow-clear
      />
      <div v-if="sections.length" class="flex flex-wrap gap-1">
        <button
          v-for="section in sections"
          :key="section.id"
          type="button"
          class="rounded-full px-2 py-0.5 text-[11px]"
          :aria-pressed="section.id === activeSectionId"
          :class="
            section.id === activeSectionId
              ? 'bg-[#0070cc] text-white dark:bg-[#44aaff] dark:text-[#062033]'
              : 'bg-muted text-muted-foreground'
          "
          @click="selectSection(section.id)"
        >
          {{ text(section.title) }}
        </button>
      </div>
      <div ref="scrollerRef" class="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        <p v-if="sections.length === 0" class="text-sm text-muted-foreground">
          {{ text(TEMPLATE_DOC_CHROME.empty) }}
        </p>
        <section
          v-for="section in sections"
          :id="`template-doc-${request.root}-${section.id}`"
          :key="section.id"
          class="scroll-mt-2 space-y-2 rounded-md border p-3"
          :class="
            section.id === activeSectionId
              ? 'border-[#0070cc] bg-[#0070cc]/10 dark:border-[#44aaff]'
              : 'border-border'
          "
        >
          <h3 class="text-sm font-medium text-foreground">{{ text(section.title) }}</h3>
          <p class="text-[13px] leading-6 text-muted-foreground">{{ text(section.body) }}</p>
          <p v-if="section.id === 'time'" class="text-[12px] leading-5 text-muted-foreground">
            {{ text(TEMPLATE_DOC_CHROME.pluginNote) }}
          </p>
          <div v-if="section.examples?.length" class="space-y-1">
            <div class="text-[11px] font-medium text-foreground">
              {{ text(TEMPLATE_DOC_CHROME.examples) }}
            </div>
            <code
              v-for="example in section.examples"
              :key="example"
              class="block overflow-x-auto rounded bg-muted px-2 py-1 font-mono text-[11px] text-foreground"
            >
              {{ example }}
            </code>
          </div>
          <div v-if="visibleMembers(section).length" class="space-y-1">
            <div class="text-[11px] font-medium text-foreground">
              {{ text(TEMPLATE_DOC_CHROME.members) }}
            </div>
            <ul class="divide-y divide-border rounded-md border border-border">
              <li
                v-for="member in visibleMembers(section)"
                :key="member.name"
                class="space-y-0.5 px-2 py-1.5"
              >
                <div class="font-mono text-[12px] font-medium text-[#0070cc] dark:text-[#44aaff]">
                  {{ member.name }}
                </div>
                <p class="text-[12px] leading-5 text-muted-foreground">{{ text(member.summary) }}</p>
                <code v-if="member.usage" class="block overflow-x-auto font-mono text-[11px] text-foreground">
                  {{ member.usage }}
                </code>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  </Modal>
</template>
