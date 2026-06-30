<script setup lang="ts">
import { Button, Dropdown, Menu, Modal, Tooltip } from "ant-design-vue";
import { computed, h, ref } from "vue";
import type { WorkspaceProjectListItem } from "../library/workspace-project-db";

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
}>();

const emit = defineEmits<{
  createProject: [];
  openProject: [id: string];
  syncProject: [];
  deleteProject: [id: string];
  previewProject: [id: string, options?: { syncFirst?: boolean }];
}>();

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
          ? [h(Menu.Item, { key: "empty", disabled: true }, () => "暂无已保存工作区")]
          : props.projects.map((project) =>
              h(
                "div",
                { key: project.id, class: "px-1 py-0.5" },
                h("div", { class: "flex items-center gap-1" }, [
                  h(
                    "button",
                    {
                      type: "button",
                      class: [
                        "min-w-0 flex-1 rounded px-2 py-1.5 text-left text-xs hover:bg-accent",
                        props.activeProjectId === project.id
                          ? "bg-accent/60 font-medium"
                          : "",
                      ].join(" "),
                      onClick: () =>
                        void runAction(() => emit("openProject", project.id)),
                    },
                    [
                      h("div", { class: "truncate" }, project.name),
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
                    () => "预览"
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
                    () => "删除"
                  ),
                ])
              )
            ),
    }
  )
);
</script>

<template>
  <div class="flex items-center gap-1.5 border-l border-border pl-2">
    <Tooltip
      title="以当前产物名称新建一条 IndexedDB 工作区记录，不会覆盖已有工作区"
      :overlay-style="{ zIndex: 10100 }"
      :mouse-enter-delay="0.15"
    >
      <Button
        size="small"
        class="h-7 px-2 text-xs"
        :disabled="busy"
        @click="runAction(() => emit('createProject'))"
      >
        创建工作区
      </Button>
    </Tooltip>

    <Tooltip
      v-if="activeProjectId"
      :title="
        dirty
          ? `同步更新「${activeProjectName ?? '当前工作区'}」到 IndexedDB`
          : '当前工作区已与 IndexedDB 同步'
      "
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
        同步{{ dirty ? " *" : "" }}
      </Button>
    </Tooltip>

    <Dropdown :trigger="['click']" :disabled="busy" :overlay-style="{ zIndex: 10100 }">
      <Button size="small" class="h-7 max-w-[200px] truncate px-2 text-xs">
        {{ activeProjectName ? `工作区：${activeProjectName}` : "已保存工作区" }}
      </Button>
      <template #overlay>
        <component :is="projectMenu" />
      </template>
    </Dropdown>
  </div>

  <Modal
    v-model:open="deleteModalOpen"
    title="删除工作区？"
    ok-text="删除"
    cancel-text="取消"
    ok-type="danger"
    :z-index="10150"
    @ok="confirmDelete"
  >
    <p class="text-sm text-muted-foreground">
      将永久删除 IndexedDB 中的「{{ pendingDeleteProject?.name ?? "" }}」，此操作不可恢复。
    </p>
  </Modal>
</template>
