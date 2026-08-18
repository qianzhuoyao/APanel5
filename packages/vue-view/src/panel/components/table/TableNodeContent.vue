<script setup lang="ts">
import { computed, defineComponent, h, ref, type PropType, type VNode } from "vue";
import { useVirtualizer } from "@tanstack/vue-virtual";
import { Tooltip } from "ant-design-vue";
import { useI18n } from "@arronqzy/i18n/vue";
import {
  transformToTableCached,
  resolveCellDisplay,
  resolveRowDisplay,
  stylePropsToCss,
  tableTextStyleToCss,
  resolveRawTableInput,
  resolveProgressDisplay,
  resolveTableBodyBackground,
  resolveTableHeaderBackground,
  type PanelTableConfig,
  type NormalizedColumn,
  type NormalizedRow,
  type CellDisplay,
  type TableCellActionPayload,
} from "@arronqzy/view-table";
import type { PanelElement } from "../../types";

export type TableCellActionHandler = (payload: TableCellActionPayload) => void;

function wrapCellTooltip(cell: CellDisplay, node: VNode): VNode {
  if (!cell.tooltip?.enabled || !cell.tooltip.text) return node;
  return h(
    Tooltip,
    {
      title: cell.tooltip.text,
      placement: cell.tooltip.placement ?? "top",
    },
    { default: () => node }
  );
}

const props = withDefaults(
  defineProps<{
    element: PanelElement;
    interactive?: boolean;
    onCellAction?: TableCellActionHandler;
  }>(),
  { interactive: false }
);

const { t } = useI18n();
const parentRef = ref<HTMLDivElement | null>(null);

const config = computed(
  () => (props.element.table ?? {}) as PanelTableConfig
);

const model = computed(() => {
  try {
    const raw = resolveRawTableInput(config.value);
    return transformToTableCached(raw, config.value);
  } catch {
    return { columns: [], rows: [] };
  }
});

const columns = computed(() => model.value.columns);
const rowHeight = computed(() => Math.max(24, config.value.rowHeight ?? 36));
const showHeader = computed(() => config.value.showHeader !== false);
const emptyText = computed(
  () => config.value.emptyText || t("panel.config.tableEmpty")
);

const gridTemplate = computed(() =>
  columns.value
    .map((c) => {
      if (c.width) return `${c.width}px`;
      if (c.minWidth) return `minmax(${c.minWidth}px, 1fr)`;
      return "minmax(96px, 1fr)";
    })
    .join(" ")
);

const virtualizerOptions = computed(() => ({
  count: model.value.rows.length,
  getScrollElement: () => parentRef.value,
  estimateSize: () => rowHeight.value,
  overscan: 8,
}));

const virtualizer = useVirtualizer(virtualizerOptions);
const virtualItems = computed(() => virtualizer.value.getVirtualItems());
const totalSize = computed(() => virtualizer.value.getTotalSize());

const tableStyle = computed(() => stylePropsToCss(config.value.tableStyle ?? {}));
const headerStyle = computed(() => stylePropsToCss(config.value.headerStyle ?? {}));

const tableTextColor = computed(
  () =>
    (typeof tableStyle.value.color === "string" && tableStyle.value.color.trim()) ||
    (typeof config.value.tableStyle?.color === "string" && config.value.tableStyle.color.trim()) ||
    "#111827"
);
const headerTextColor = computed(
  () =>
    (typeof headerStyle.value.color === "string" && headerStyle.value.color.trim()) ||
    (typeof config.value.headerStyle?.color === "string" && config.value.headerStyle.color.trim()) ||
    tableTextColor.value
);

const rootStyle = computed(() => ({
  background: resolveTableBodyBackground(config.value.tableStyle?.backgroundColor),
  border:
    config.value.tableStyle?.borderWidth != null
      ? `${config.value.tableStyle.borderWidth}px solid ${config.value.tableStyle.borderColor ?? "rgba(0,0,0,0.12)"}`
      : "1px solid rgba(0,0,0,0.08)",
  borderRadius: config.value.tableStyle?.borderRadius ?? 6,
  fontSize: config.value.tableStyle?.fontSize ?? 12,
  ...tableStyle.value,
  color: tableTextColor.value,
  display: "flex" as const,
  flexDirection: "column" as const,
}));

const headerRowStyle = computed(() => ({
  display: "grid" as const,
  gridTemplateColumns: gridTemplate.value,
  height: `${rowHeight.value}px`,
  flex: "0 0 auto",
  position:
    config.value.tableStyle?.stickyHeader === false
      ? ("relative" as const)
      : ("sticky" as const),
  top: 0,
  zIndex: 2,
  background: resolveTableHeaderBackground(config.value.headerStyle?.backgroundColor),
  borderBottom: "1px solid rgba(0,0,0,0.1)",
  ...headerStyle.value,
  color: headerTextColor.value,
}));

function headerLabelOf(col: NormalizedColumn) {
  return (col.title ?? "").trim() || col.field || col.id;
}

function headerJustify(align: NormalizedColumn["align"]) {
  if (align === "center") return "center";
  if (align === "right") return "flex-end";
  return "flex-start";
}

function cellCommonStyle(cell: CellDisplay): Record<string, string | number> {
  const style = stylePropsToCss(cell.style);
  const textOverflow = cell.widgetProps?.textStyle?.overflow ?? "ellipsis";
  const isWrap =
    textOverflow === "wrap" && cell.widget !== "image" && cell.widget !== "progress";
  return {
    ...style,
    overflow: "hidden",
    ...(isWrap
      ? { whiteSpace: "normal", wordBreak: "break-word" }
      : { textOverflow: "ellipsis", whiteSpace: "nowrap" }),
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: isWrap ? "flex-start" : "center",
    boxSizing: "border-box",
    padding: (style.padding as string | number | undefined) ?? "0 8px",
  };
}

const TableCellView = defineComponent({
  name: "TableCellView",
  props: {
    cell: { type: Object as PropType<CellDisplay>, required: true },
    row: { type: Object as PropType<NormalizedRow>, required: true },
    column: { type: Object as PropType<NormalizedColumn>, required: true },
    elementId: { type: String, required: true },
    interactive: { type: Boolean, default: false },
    onCellAction: { type: Function as PropType<TableCellActionHandler | undefined>, default: undefined },
  },
  setup(p) {
    const emit = (kind: TableCellActionPayload["kind"], blueprintNodeId?: string) => {
      const id = blueprintNodeId?.trim();
      if (!id || !p.onCellAction) return;
      p.onCellAction({
        kind,
        blueprintNodeId: id,
        elementId: p.elementId,
        columnField: p.column.field,
        rowId: p.row.id,
        row: p.row.values,
        value: p.cell.raw,
      });
    };

    return (): VNode => {
      const cell = p.cell;
      const common = cellCommonStyle(cell);
      const textCss = tableTextStyleToCss(cell.widgetProps?.textStyle);
      let node: VNode;

      if (cell.widget === "tag" || cell.widget === "badge") {
        const bg = cell.color ?? "#3b82f6";
        node = h("div", { style: common }, [
          h(
            "span",
            {
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                maxWidth: "100%",
                borderRadius: cell.widget === "badge" ? 999 : 4,
                padding: cell.widget === "badge" ? "0 8px" : "1px 8px",
                fontSize: 12,
                lineHeight: "20px",
                color: "#fff",
                background: bg,
                ...textCss,
              },
            },
            [
              cell.widget === "badge"
                ? h("span", {
                    style: {
                      width: 6,
                      height: 6,
                      borderRadius: 99,
                      background: "rgba(255,255,255,0.9)",
                      flex: "0 0 auto",
                    },
                  })
                : null,
              h("span", { style: { overflow: "hidden", textOverflow: "ellipsis" } }, cell.text),
            ]
          ),
        ]);
      } else if (cell.widget === "link") {
        node = h("div", { style: common }, [
          h(
            "a",
            {
              href: cell.href || "#",
              target: cell.widgetProps?.openInNewTab === false ? undefined : "_blank",
              rel: "noreferrer",
              onClick: (e: Event) => {
                e.stopPropagation();
                emit("click", cell.widgetProps?.actions?.onClickBlueprintNodeId);
              },
              style: {
                color: "#2563eb",
                textDecoration: "underline",
                overflow: "hidden",
                textOverflow: "ellipsis",
                ...textCss,
              },
            },
            cell.text || cell.href
          ),
        ]);
      } else if (cell.widget === "progress") {
        const pct = cell.progress ?? 0;
        const display = resolveProgressDisplay(cell.widgetProps);
        const trackColor = cell.color ?? "#3b82f6";
        const label = h(
          "span",
          {
            style: {
              fontSize: 11,
              color: "rgba(0,0,0,0.55)",
              flex: "0 0 auto",
              ...textCss,
            },
          },
          cell.text
        );

        if (display === "label") {
          node = h("div", { style: common }, [label]);
        } else if (display === "circle") {
          const size = Math.max(16, cell.widgetProps?.progressSize ?? 28);
          const stroke = Math.max(2, cell.widgetProps?.progressStrokeWidth ?? 3);
          const r = (size - stroke) / 2;
          const c = 2 * Math.PI * r;
          const offset = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
          node = h("div", { style: { ...common, gap: 6, justifyContent: "center" } }, [
            h("svg", { width: size, height: size, style: { flex: "0 0 auto" } }, [
              h("circle", {
                cx: size / 2,
                cy: size / 2,
                r,
                fill: "none",
                stroke: "rgba(0,0,0,0.08)",
                "stroke-width": stroke,
              }),
              h("circle", {
                cx: size / 2,
                cy: size / 2,
                r,
                fill: "none",
                stroke: trackColor,
                "stroke-width": stroke,
                "stroke-linecap": "round",
                "stroke-dasharray": c,
                "stroke-dashoffset": offset,
                transform: `rotate(-90 ${size / 2} ${size / 2})`,
              }),
              h(
                "text",
                {
                  x: "50%",
                  y: "50%",
                  "dominant-baseline": "central",
                  "text-anchor": "middle",
                  "font-size":
                    typeof textCss.fontSize === "number"
                      ? textCss.fontSize
                      : Math.max(8, Math.round(size * 0.32)),
                  fill: typeof textCss.color === "string" ? textCss.color : "rgba(0,0,0,0.65)",
                  "font-family":
                    typeof textCss.fontFamily === "string" ? textCss.fontFamily : undefined,
                  "font-weight": textCss.fontWeight,
                  "font-style":
                    typeof textCss.fontStyle === "string" ? textCss.fontStyle : undefined,
                },
                String(Math.round(pct))
              ),
            ]),
          ]);
        } else {
          const bar = h(
            "div",
            {
              style: {
                flex: 1,
                height: 8,
                borderRadius: 99,
                background: "rgba(0,0,0,0.08)",
                overflow: "hidden",
                minWidth: 24,
              },
            },
            [
              h("div", {
                style: { width: `${pct}%`, height: "100%", background: trackColor },
              }),
            ]
          );

          node = h("div", { style: { ...common, gap: 8 } }, [
            bar,
            display === "barLabel" ? label : null,
          ]);
        }
      } else if (cell.widget === "image") {
        const w = cell.widgetProps?.imageWidth ?? 28;
        const hImg = cell.widgetProps?.imageHeight ?? 28;
        node = h("div", { style: common }, [
          cell.imageUrl
            ? h("img", {
                src: cell.imageUrl,
                alt: "",
                style: {
                  width: w,
                  height: hImg,
                  objectFit: (cell.widgetProps?.imageObjectFit as string) || "cover",
                  borderRadius: 4,
                },
                draggable: false,
              })
            : h("span", { style: { fontSize: 11, opacity: 0.5, ...textCss } }, "—"),
        ]);
      } else if (cell.widget === "boolean") {
        const on = Boolean(cell.booleanValue);
        const canToggle = Boolean(p.interactive && p.onCellAction);
        node = h("div", { style: common }, [
          h(
            "button",
            {
              type: "button",
              disabled: !canToggle,
              onMousedown: (e: Event) => e.stopPropagation(),
              onClick: (e: Event) => {
                e.stopPropagation();
                if (!canToggle) return;
                if (on) {
                  emit("toggleOff", cell.widgetProps?.actions?.onFalseBlueprintNodeId);
                } else {
                  emit("toggleOn", cell.widgetProps?.actions?.onTrueBlueprintNodeId);
                }
              },
              style: {
                width: 28,
                height: 16,
                borderRadius: 99,
                background: on ? "#16a34a" : "rgba(0,0,0,0.2)",
                position: "relative",
                display: "inline-block",
                flex: "0 0 auto",
                border: "none",
                padding: 0,
                cursor: canToggle ? "pointer" : "default",
              },
              "aria-pressed": on,
            },
            [
              h("span", {
                style: {
                  position: "absolute",
                  top: 2,
                  left: on ? 14 : 2,
                  width: 12,
                  height: 12,
                  borderRadius: 99,
                  background: "#fff",
                },
              }),
            ]
          ),
          h("span", { style: { marginLeft: 6, fontSize: 12, ...textCss } }, cell.text),
        ]);
      } else {
        const canClickText = Boolean(cell.widgetProps?.actions?.onClickBlueprintNodeId);
        node = h(
          "div",
          {
            style: {
              ...common,
              ...textCss,
              cursor: canClickText ? "pointer" : undefined,
              color:
                canClickText && !(common as { color?: string }).color && !textCss.color
                  ? "#2563eb"
                  : (textCss.color as string | undefined) ?? (common as { color?: string }).color,
            },
            onClick: (e: Event) => {
              if (!canClickText) return;
              e.stopPropagation();
              emit("click", cell.widgetProps?.actions?.onClickBlueprintNodeId);
            },
          },
          cell.text
        );
      }

      return wrapCellTooltip(cell, node);
    };
  },
});

const TableRowView = defineComponent({
  name: "TableRowView",
  props: {
    row: { type: Object as PropType<NormalizedRow>, required: true },
    columns: { type: Array as PropType<NormalizedColumn[]>, required: true },
    config: { type: Object as PropType<PanelTableConfig>, required: true },
    rowHeight: { type: Number, required: true },
    gridTemplate: { type: String, required: true },
    elementId: { type: String, required: true },
    interactive: { type: Boolean, default: false },
    onCellAction: { type: Function as PropType<TableCellActionHandler | undefined>, default: undefined },
  },
  setup(p) {
    return (): VNode => {
      const rowDisplay = resolveRowDisplay(p.row, p.config);
      return h(
        "div",
        {
          role: "row",
          style: {
            display: "grid",
            gridTemplateColumns: p.gridTemplate,
            height: p.rowHeight,
            boxSizing: "border-box",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            ...stylePropsToCss(rowDisplay.style),
          },
        },
        p.columns.map((col) => {
          const cell = resolveCellDisplay(p.row, col, p.config);
          return h(
            "div",
            {
              key: col.id,
              role: "cell",
              style: { minWidth: 0, borderRight: "1px solid rgba(0,0,0,0.04)" },
            },
            [
              h(TableCellView, {
                cell,
                row: p.row,
                column: col,
                elementId: p.elementId,
                interactive: p.interactive,
                onCellAction: p.onCellAction,
              }),
            ]
          );
        })
      );
    };
  },
});
</script>

<template>
  <div class="rv-table-node h-full w-full overflow-hidden" :style="rootStyle">
    <div v-if="showHeader" role="row" :style="headerRowStyle">
      <div
        v-for="col in columns"
        :key="col.id"
        role="columnheader"
        :title="headerLabelOf(col)"
        :style="{
          padding: '0 8px',
          display: 'flex',
          alignItems: 'center',
          fontWeight: config.headerStyle?.fontWeight ?? 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          borderRight: '1px solid rgba(0,0,0,0.04)',
          textAlign: col.align,
          justifyContent: headerJustify(col.align),
        }"
      >
        {{ headerLabelOf(col) }}
      </div>
    </div>

    <div ref="parentRef" class="min-h-0 flex-1 overflow-auto" style="background: transparent">
      <div
        v-if="model.rows.length === 0"
        class="flex h-full flex-col items-center justify-center gap-2 px-3 text-center text-xs text-gray-400"
      >
        <svg
          viewBox="0 0 48 48"
          class="h-10 w-10 opacity-45"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          aria-hidden="true"
        >
          <rect x="8" y="12" width="32" height="24" rx="3" />
          <path d="M8 20h32M20 12v24M28 12v24" stroke-opacity="0.55" />
          <circle cx="24" cy="30" r="1.2" fill="currentColor" stroke="none" />
        </svg>
        <div>{{ emptyText }}</div>
      </div>
      <div
        v-else
        :style="{ height: `${totalSize}px`, position: 'relative', width: '100%' }"
      >
        <div
          v-for="item in virtualItems"
          :key="model.rows[item.index]?.id ?? item.key"
          :style="{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${item.size}px`,
            transform: `translateY(${item.start}px)`,
          }"
        >
          <TableRowView
            v-if="model.rows[item.index]"
            :row="model.rows[item.index]!"
            :columns="columns"
            :config="config"
            :row-height="rowHeight"
            :grid-template="gridTemplate"
            :element-id="element.id"
            :interactive="interactive"
            :on-cell-action="onCellAction"
          />
        </div>
      </div>
    </div>
  </div>
</template>
