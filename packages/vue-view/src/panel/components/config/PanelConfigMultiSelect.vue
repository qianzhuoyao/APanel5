<script setup lang="ts">
import { computed, ref } from "vue";
import { Card, Checkbox, Input, InputNumber, Select } from "ant-design-vue";
import type { PanelElement, PanelLayer, ReferenceCopyMode } from "../../types";
import { CHART_TYPES } from "../../utils/chartOptionBuilder";

const props = defineProps<{
  elements: PanelElement[];
  layers: PanelLayer[];
  normalizedSearch: string;
  hasSearch: boolean;
  updateElement: (
    id: string,
    patch: Partial<PanelElement>,
    options?: { batchId?: string; meta?: Record<string, unknown> }
  ) => void;
  setReferenceCopyMode?: (id: string, mode: ReferenceCopyMode) => void;
  onExcludeSelectedNode?: (nodeId: string) => void;
  onAdjustNodeZOrder?: (
    nodeId: string,
    action: "bringForward" | "sendBackward" | "bringToFront" | "sendToBack"
  ) => void;
}>();

const expandedNodeCards = ref<Record<string, boolean>>({});

const filteredElements = computed(() =>
  props.elements.filter((el) => {
    if (!props.hasSearch) return true;
    const text = `${el.name ?? ""} ${el.id} ${el.materialType ?? ""} zIndex style layer`.toLowerCase();
    return text.includes(props.normalizedSearch);
  })
);

const noSearchMatch = computed(
  () =>
    props.hasSearch &&
    props.elements.every((el) => {
      const text = `${el.name ?? ""} ${el.id} ${el.materialType ?? ""} zIndex style layer`.toLowerCase();
      return !text.includes(props.normalizedSearch);
    })
);

function isNodeCardExpanded(id: string) {
  return expandedNodeCards.value[id] ?? true;
}

function setNodeCardExpanded(id: string, open: boolean) {
  expandedNodeCards.value = { ...expandedNodeCards.value, [id]: open };
}
</script>

<template>
  <div class="space-y-3">
    <Card size="small" title="批量设置">
      <template #title>
        <span class="text-xs">批量设置（{{ elements.length }} 个）</span>
      </template>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <button
          type="button"
          class="rounded border border-gray-200 bg-white px-2 py-1 hover:bg-gray-50"
          @click="elements.forEach((el) => updateElement(el.id, { locked: true }))"
        >
          全部锁定
        </button>
        <button
          type="button"
          class="rounded border border-gray-200 bg-white px-2 py-1 hover:bg-gray-50"
          @click="elements.forEach((el) => updateElement(el.id, { locked: false }))"
        >
          全部解锁
        </button>
        <button
          v-if="onAdjustNodeZOrder"
          type="button"
          class="rounded border border-gray-200 bg-white px-2 py-1 hover:bg-gray-50"
          @click="elements.forEach((el) => onAdjustNodeZOrder?.(el.id, 'bringForward'))"
        >
          全部上移一层
        </button>
        <button
          v-if="onAdjustNodeZOrder"
          type="button"
          class="rounded border border-gray-200 bg-white px-2 py-1 hover:bg-gray-50"
          @click="elements.forEach((el) => onAdjustNodeZOrder?.(el.id, 'sendBackward'))"
        >
          全部下移一层
        </button>
        <button
          type="button"
          class="rounded border border-gray-200 bg-white px-2 py-1 hover:bg-gray-50"
          @click="elements.forEach((el) => updateElement(el.id, { zIndex: 1 }))"
        >
          全部 zIndex 设为 1
        </button>
        <button
          type="button"
          class="rounded border border-gray-200 bg-white px-2 py-1 hover:bg-gray-50"
          @click="
            elements.forEach((el) =>
              updateElement(el.id, {
                style: { ...(el.style ?? {}), backgroundColor: '#3b82f6' },
              })
            )
          "
        >
          全部背景色设为蓝色
        </button>
      </div>
    </Card>

    <Card
      v-for="el in filteredElements"
      :key="el.id"
      size="small"
      :class="el.locked ? 'border-amber-500/40 bg-amber-500/5' : ''"
    >
      <template #title>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-[11px] hover:bg-gray-50"
            @click="setNodeCardExpanded(el.id, !isNodeCardExpanded(el.id))"
          >
            {{ isNodeCardExpanded(el.id) ? "▾" : "▸" }}
          </button>
          <span class="min-w-0 flex-1 truncate text-xs">
            {{ el.name?.trim() || el.materialType || "节点" }} · {{ el.id }}
          </span>
          <button
            v-if="onExcludeSelectedNode"
            type="button"
            class="inline-flex h-6 items-center rounded border border-gray-200 px-2 text-[11px] text-gray-500 hover:bg-gray-50"
            @click="onExcludeSelectedNode(el.id)"
          >
            剔除
          </button>
        </div>
      </template>
      <div v-if="isNodeCardExpanded(el.id)" class="space-y-2 text-xs">
        <label class="flex items-center gap-2">
          <Checkbox
            :checked="el.locked === true"
            @update:checked="(v) => updateElement(el.id, { locked: v === true })"
          />
          <span>锁定节点</span>
        </label>
        <div
          v-if="el.locked"
          class="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1.5 text-[11px] text-amber-700"
        >
          当前节点已锁定，仅可操作锁定开关。
        </div>
        <fieldset :disabled="el.locked" :class="el.locked ? 'opacity-60' : ''">
          <div class="space-y-2">
            <label class="block space-y-1">
              <div>名称</div>
              <Input
                size="small"
                :value="el.name ?? ''"
                @update:value="(v: string) => updateElement(el.id, { name: v || undefined })"
              />
            </label>
            <div class="grid grid-cols-2 gap-2">
              <label class="block space-y-1">
                <div>zIndex</div>
                <InputNumber
                  size="small"
                  class="w-full"
                  :value="el.zIndex ?? 1"
                  @update:value="(v) => updateElement(el.id, { zIndex: Number(v) || 1 })"
                />
              </label>
              <label class="block space-y-1">
                <div>图层</div>
                <Select
                  size="small"
                  class="w-full"
                  :value="el.layerId"
                  @update:value="(v) => updateElement(el.id, { layerId: String(v) })"
                >
                  <Select.Option v-for="layer in layers" :key="layer.id" :value="layer.id">
                    {{ layer.name }}
                  </Select.Option>
                </Select>
              </label>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <label class="block space-y-1">
                <div>X</div>
                <InputNumber size="small" class="w-full" :value="el.x" @update:value="(v) => updateElement(el.id, { x: Number(v) || 0 })" />
              </label>
              <label class="block space-y-1">
                <div>Y</div>
                <InputNumber size="small" class="w-full" :value="el.y" @update:value="(v) => updateElement(el.id, { y: Number(v) || 0 })" />
              </label>
              <label class="block space-y-1">
                <div>旋转角度</div>
                <InputNumber size="small" class="w-full" :value="el.rotate ?? 0" @update:value="(v) => updateElement(el.id, { rotate: Number(v) || 0 })" />
              </label>
              <label class="block space-y-1">
                <div>宽</div>
                <InputNumber size="small" class="w-full" :min="1" :value="el.width" @update:value="(v) => updateElement(el.id, { width: Math.max(1, Number(v) || 1) })" />
              </label>
              <label class="block space-y-1">
                <div>高</div>
                <InputNumber size="small" class="w-full" :min="1" :value="el.height" @update:value="(v) => updateElement(el.id, { height: Math.max(1, Number(v) || 1) })" />
              </label>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <label class="block space-y-1">
                <div>背景色</div>
                <Input
                  size="small"
                  :value="el.style?.backgroundColor ?? ''"
                  @update:value="(v: string) => updateElement(el.id, { style: { ...(el.style ?? {}), backgroundColor: v || undefined } })"
                />
              </label>
              <label class="block space-y-1">
                <div>边框色</div>
                <Input
                  size="small"
                  :value="el.style?.borderColor ?? ''"
                  @update:value="(v: string) => updateElement(el.id, { style: { ...(el.style ?? {}), borderColor: v || undefined } })"
                />
              </label>
            </div>

            <template v-if="CHART_TYPES.has(el.materialType ?? '')">
              <div class="grid grid-cols-2 gap-2">
                <label class="col-span-2 block space-y-1">
                  <div>图表标题</div>
                  <Input
                    size="small"
                    :value="el.chart?.title ?? ''"
                    @update:value="(v: string) => updateElement(el.id, { chart: { ...(el.chart ?? {}), title: v } })"
                  />
                </label>
                <label class="block space-y-1">
                  <div>主色</div>
                  <Input
                    size="small"
                    :value="el.chart?.color ?? ''"
                    @update:value="(v: string) => updateElement(el.id, { chart: { ...(el.chart ?? {}), color: v || undefined } })"
                  />
                </label>
              </div>
            </template>

            <template v-if="el.materialType === 'text'">
              <div class="grid grid-cols-2 gap-2">
                <label class="col-span-2 block space-y-1">
                  <div>文本内容(HTML)</div>
                  <Input.TextArea
                    :value="el.textHtml ?? ''"
                    :rows="3"
                    @update:value="(v: string) => updateElement(el.id, { textHtml: v || '<p><br/></p>' })"
                  />
                </label>
                <label class="block space-y-1">
                  <div>字体大小</div>
                  <InputNumber
                    size="small"
                    class="w-full"
                    :min="8"
                    :value="el.textFontSize ?? 14"
                    @update:value="(v) => updateElement(el.id, { textFontSize: Math.max(8, Number(v) || 14) })"
                  />
                </label>
                <label class="block space-y-1">
                  <div>文字颜色</div>
                  <Input
                    size="small"
                    :value="el.textColor ?? ''"
                    @update:value="(v: string) => updateElement(el.id, { textColor: v || undefined })"
                  />
                </label>
              </div>
            </template>

            <template v-if="el.materialType === 'audio'">
              <div class="grid grid-cols-2 gap-2">
                <label class="col-span-2 block space-y-1">
                  <div>音频 URL</div>
                  <Input
                    size="small"
                    :value="el.audioRemoteUrl ?? ''"
                    @update:value="(v: string) => updateElement(el.id, { audioRemoteUrl: v || undefined })"
                  />
                </label>
                <label class="block space-y-1">
                  <div>动效</div>
                  <Select
                    size="small"
                    class="w-full"
                    :value="el.audioVisualEffect ?? 'pulse'"
                    @update:value="(v) => updateElement(el.id, { audioVisualEffect: v as PanelElement['audioVisualEffect'] })"
                  >
                    <Select.Option value="none">none</Select.Option>
                    <Select.Option value="pulse">pulse</Select.Option>
                    <Select.Option value="ripple">ripple</Select.Option>
                  </Select>
                </label>
              </div>
            </template>

            <template v-if="el.materialType === 'video'">
              <label class="block space-y-1">
                <div>视频 URL</div>
                <Input
                  size="small"
                  :value="el.videoRemoteUrl ?? ''"
                  @update:value="(v: string) => updateElement(el.id, { videoRemoteUrl: v || undefined })"
                />
              </label>
            </template>

            <template v-if="el.materialType === 'grid'">
              <div class="grid grid-cols-2 gap-2 rounded-lg border border-gray-200/60 bg-gray-50/50 p-3">
                <label class="block space-y-1">
                  <div>行</div>
                  <InputNumber size="small" class="w-full" :min="1" :value="el.gridRows ?? 2" @update:value="(v) => updateElement(el.id, { gridRows: Math.max(1, Number(v) || 2) })" />
                </label>
                <label class="block space-y-1">
                  <div>列</div>
                  <InputNumber size="small" class="w-full" :min="1" :value="el.gridCols ?? 3" @update:value="(v) => updateElement(el.id, { gridCols: Math.max(1, Number(v) || 3) })" />
                </label>
              </div>
            </template>

            <template v-if="el.materialType === 'geometry'">
              <div class="grid grid-cols-2 gap-2 rounded-lg border border-gray-200/60 bg-gray-50/50 p-3">
                <label class="block space-y-1">
                  <div>形状</div>
                  <Select
                    size="small"
                    class="w-full"
                    :value="el.geometryShape ?? 'rect'"
                    @update:value="(v) => updateElement(el.id, { geometryShape: v as PanelElement['geometryShape'] })"
                  >
                    <Select.Option value="rect">矩形</Select.Option>
                    <Select.Option value="circle">圆形</Select.Option>
                    <Select.Option value="triangle">三角形</Select.Option>
                  </Select>
                </label>
                <label class="block space-y-1">
                  <div>颜色</div>
                  <Input
                    size="small"
                    :value="el.geometryColor ?? '#3b82f6'"
                    @update:value="(v: string) => updateElement(el.id, { geometryColor: v || '#3b82f6' })"
                  />
                </label>
              </div>
            </template>

            <template v-if="el.materialType === 'reference'">
              <div class="grid grid-cols-2 gap-2">
                <label class="block space-y-1">
                  <div>引用图层</div>
                  <Select
                    size="small"
                    class="w-full"
                    :value="el.refLayerId ?? '__none__'"
                    @update:value="(v) => updateElement(el.id, { refLayerId: v === '__none__' ? undefined : String(v) })"
                  >
                    <Select.Option value="__none__">无</Select.Option>
                    <Select.Option
                      v-for="layer in layers.filter((l) => l.id !== el.layerId)"
                      :key="layer.id"
                      :value="layer.id"
                    >
                      {{ layer.name }}
                    </Select.Option>
                  </Select>
                </label>
                <label class="block space-y-1">
                  <div>拷贝</div>
                  <Select
                    size="small"
                    class="w-full"
                    :value="el.refCopyMode ?? 'shallow'"
                    @update:value="(v) => setReferenceCopyMode?.(el.id, v as ReferenceCopyMode)"
                  >
                    <Select.Option value="shallow">shallow</Select.Option>
                    <Select.Option value="deep">deep</Select.Option>
                  </Select>
                </label>
              </div>
            </template>

            <template v-if="el.materialType === 'image'">
              <label class="block space-y-1">
                <div>背景图 / URL</div>
                <Input
                  size="small"
                  :value="el.style?.backgroundImageRemoteUrl ?? el.style?.backgroundImage ?? ''"
                  @update:value="(v: string) => updateElement(el.id, {
                    style: {
                      ...(el.style ?? {}),
                      backgroundImage: v.startsWith('url(') ? v : v ? `url('${v}')` : undefined,
                      backgroundImageRemoteUrl: v.startsWith('url(') ? undefined : v || undefined,
                    },
                  })"
                />
              </label>
              <label class="block space-y-1">
                <div>适应方式</div>
                <Select
                  size="small"
                  class="w-full"
                  :value="el.style?.backgroundSize ?? 'cover'"
                  @update:value="(v) => updateElement(el.id, { style: { ...(el.style ?? {}), backgroundSize: String(v) } })"
                >
                  <Select.Option value="cover">cover</Select.Option>
                  <Select.Option value="contain">contain</Select.Option>
                  <Select.Option value="100% 100%">fill</Select.Option>
                </Select>
              </label>
            </template>
          </div>
        </fieldset>
      </div>
    </Card>

    <div
      v-if="noSearchMatch"
      class="rounded border border-gray-200/60 bg-white px-2 py-1.5 text-[11px] text-gray-500"
    >
      未匹配到可编辑节点，请更换关键词。
    </div>
  </div>
</template>
