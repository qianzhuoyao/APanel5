<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
import { Button, Dropdown, Menu, Modal, Tooltip } from "ant-design-vue";
import { computed, h, ref } from "vue";
import type { WorkspaceProjectListItem } from "../library/workspace-project-db";

const { t, locale } = useI18n();

function formatUpdatedAt(ts: number): string {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

const props = defineProps<{
  projects: WorkspaceProjectListItem[];
  activeProjectId: string | null;
  activeProjectName: string | null;
  dirty: boolean;
  previewingProjectIds?: string[];
}>();

const emit = defineEmits<{
  createProject: [];
  openProject: [id: string];
  syncProject: [];
  deleteProject: [id: string];
  previewProject: [id: string, options?: { syncFirst?: boolean }];
}>();

const syncTooltip = computed(() => {
  void locale.value;
  if (!props.dirty) return t("panel.workspace.syncUpToDate");
  return t("panel.workspace.syncUpdate", {
    name: props.activeProjectName ?? t("panel.workspace.currentWorkspaceFallback"),
  });
});

const pendingDeleteId = ref<string | null>(null);
const busy = ref(false);

const pendingDeleteProject = computed(
  () => props.projects.find((p) => p.id === pendingDeleteId.value) ?? null
);

const deleteModalOpen = computed({
  get: () => pendingDeleteId.value !== null,
  set: (open: boolean) => {
    if (!open) pendingDeleteId.value = null;
  },
});

async function runAction(action: () => Promise<unknown> | unknown) {
  if (busy.value) return;
  busy.value = true;
  try {
    await action();
  } finally {
    busy.value = false;
  }
}

function confirmDelete() {
  const id = pendingDeleteId.value;
  pendingDeleteId.value = null;
  if (!id) return;
  void runAction(() => emit("deleteProject", id));
}

const projectMenu = computed(() =>
  h(
    Menu,
    {},
    {
      default: () =>
        props.projects.length === 0
          ? [h(Menu.Item, { key: "empty", disabled: true }, () => t("panel.workspace.noSavedWorkspaces"))]
          : props.projects.map((project) => {
              const isCurrent = props.activeProjectId === project.id;
              const isPreviewing = (props.previewingProjectIds ?? []).includes(project.id);
              return h(
                "div",
                { key: project.id, class: "px-1 py-0.5" },
                h("div", { class: "flex items-center gap-1" }, [
                  h(
                    "button",
                    {
                      type: "button",
                      class: [
                        "min-w-0 flex-1 rounded px-2 py-1.5 text-left text-xs hover:bg-gray-100",
                        isCurrent
                          ? "bg-blue-50 font-medium text-blue-700 ring-1 ring-inset ring-blue-300"
                          : "",
                        !isCurrent && isPreviewing
                          ? "bg-sky-50 ring-1 ring-inset ring-sky-300"
                          : "",
                      ].join(" "),
                      onClick: () =>
                        void runAction(() => emit("openProject", project.id)),
                    },
                    [
                      h("div", { class: "flex items-center gap-1" }, [
                        h("div", { class: "min-w-0 flex-1 truncate" }, project.name),
                        isCurrent
                          ? h(
                              "span",
                              {
                                class:
                                  "shrink-0 rounded bg-blue-600 px-1 py-px text-[9px] leading-none text-white",
                              },
                              t("panel.workspace.currentBadge")
                            )
                          : null,
                        isPreviewing
                          ? h(
                              "span",
                              {
                                class:
                                  "shrink-0 rounded bg-sky-600 px-1 py-px text-[9px] leading-none text-white",
                              },
                              t("panel.workspace.previewingBadge")
                            )
                          : null,
                      ]),
                      h(
                        "div",
                        { class: "truncate text-[10px] text-muted-foreground" },
                        formatUpdatedAt(project.updatedAt)
                      ),
                    ]
                  ),
                  h(
                    Button,
                    {
                      type: "text",
                      size: "small",
                      class: "h-7 shrink-0 px-2 text-[10px]",
                      onClick: () =>
                        void runAction(() =>
                          emit("previewProject", project.id, {
                            syncFirst: props.activeProjectId === project.id,
                          })
                        ),
                    },
                    () => t("panel.workspace.previewDocTitle")
                  ),
                  h(
                    Button,
                    {
                      type: "text",
                      size: "small",
                      danger: true,
                      class: "h-7 shrink-0 px-2 text-[10px]",
                      onClick: () => {
                        pendingDeleteId.value = project.id;
                      },
                    },
                    () => t("common.delete")
                  ),
                ])
              );
            }),
    }
  )
);
</script>

<template>
  <div class="flex items-center gap-1.5 border-l border-border pl-2">
    <Tooltip
      :title="t('panel.workspace.createHint')"
      :overlay-style="{ zIndex: 10100 }"
      :mouse-enter-delay="0.15"
    >
      <Button
        size="small"
        class="h-7 px-2 text-xs"
        :disabled="busy"
        @click="runAction(() => emit('createProject'))"
      >
        {{ t("panel.workspace.create") }}
      </Button>
    </Tooltip>

    <Tooltip
      v-if="activeProjectId"
      :title="syncTooltip"
      :overlay-style="{ zIndex: 10100 }"
      :mouse-enter-delay="0.15"
    >
      <Button
        size="small"
        class="h-7 px-2 text-xs"
        :type="dirty ? 'primary' : 'default'"
        :disabled="busy || !dirty"
        @click="runAction(() => emit('syncProject'))"
      >
        {{ dirty ? t("panel.workspace.syncDirty") : t("common.sync") }}
      </Button>
    </Tooltip>

    <Dropdown :trigger="['click']" :disabled="busy" :overlay-style="{ zIndex: 10100 }">
      <Button size="small" class="h-7 max-w-[200px] truncate px-2 text-xs">
        {{ activeProjectName ? t("panel.workspace.workspaceNamed", { name: activeProjectName }) : t("panel.workspace.savedWorkspaces") }}
      </Button>
      <template #overlay>
        <component :is="projectMenu" />
      </template>
    </Dropdown>
  </div>

  <Modal
    v-model:open="deleteModalOpen"
    :title="t('panel.workspace.deleteConfirmTitle')"
    :ok-text="t('common.delete')"
    :cancel-text="t('common.cancel')"
    ok-type="danger"
    :z-index="10150"
    @ok="confirmDelete"
  >
    <p class="text-sm text-muted-foreground">
      {{ t("panel.workspace.deleteConfirmBody", { name: pendingDeleteProject?.name ?? "" }) }}
    </p>
  </Modal>
</template>
