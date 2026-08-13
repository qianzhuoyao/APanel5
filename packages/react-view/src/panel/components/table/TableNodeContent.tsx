import React, { useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  transformToTableCached,
  resolveCellDisplay,
  resolveRowDisplay,
  stylePropsToCss,
  resolveRawTableInput,
  resolveProgressDisplay,
  type PanelTableConfig,
  type NormalizedColumn,
  type NormalizedRow,
  type CellDisplay,
  type TableCellActionPayload,
} from "@arronqzy/view-table";
import type { PanelElement } from "../../types";
import { useI18n } from "@arronqzy/i18n/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@arronqzy/ui";

export type TableCellActionHandler = (payload: TableCellActionPayload) => void;

function wrapCellTooltip(cell: CellDisplay, node: React.ReactElement) {
  if (!cell.tooltip?.enabled || !cell.tooltip.text) return node;
  return (
    <Tooltip delayDuration={250}>
      <TooltipTrigger asChild>{node}</TooltipTrigger>
      <TooltipContent
        side={cell.tooltip.placement}
        className="max-w-xs whitespace-pre-wrap break-words"
      >
        {cell.tooltip.text}
      </TooltipContent>
    </Tooltip>
  );
}

function TableCellView({
  cell,
  row,
  column,
  elementId,
  interactive,
  onCellAction,
}: {
  cell: CellDisplay;
  row: NormalizedRow;
  column: NormalizedColumn;
  elementId: string;
  interactive?: boolean;
  onCellAction?: TableCellActionHandler;
}) {
  const emit = (kind: TableCellActionPayload["kind"], blueprintNodeId?: string) => {
    const id = blueprintNodeId?.trim();
    if (!id || !onCellAction) return;
    onCellAction({
      kind,
      blueprintNodeId: id,
      elementId,
      columnField: column.field,
      rowId: row.id,
      row: row.values,
      value: cell.raw,
    });
  };

  const style = stylePropsToCss(cell.style);
  const textOverflow = cell.widgetProps?.textStyle?.overflow ?? "ellipsis";
  const isWrap = cell.widget === "text" && textOverflow === "wrap";
  const common: React.CSSProperties = {
    ...style,
    overflow: "hidden",
    textOverflow: isWrap ? undefined : "ellipsis",
    whiteSpace: isWrap ? "normal" : "nowrap",
    wordBreak: isWrap ? "break-word" : undefined,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: isWrap ? "flex-start" : "center",
    boxSizing: "border-box",
    padding: style.padding ?? "0 8px",
  };

  let content: React.ReactElement;

  if (cell.widget === "tag" || cell.widget === "badge") {
    const bg = cell.color ?? "#3b82f6";
    content = (
      <div style={common}>
        <span
          style={{
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
          }}
        >
          {cell.widget === "badge" ? (
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 99,
                background: "rgba(255,255,255,0.9)",
                flex: "0 0 auto",
              }}
            />
          ) : null}
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{cell.text}</span>
        </span>
      </div>
    );
  } else if (cell.widget === "link") {
    content = (
      <div style={common}>
        <a
          href={cell.href || "#"}
          target={cell.widgetProps?.openInNewTab === false ? undefined : "_blank"}
          rel="noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            emit("click", cell.widgetProps?.actions?.onClickBlueprintNodeId);
          }}
          style={{ color: "#2563eb", textDecoration: "underline", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {cell.text || cell.href}
        </a>
      </div>
    );
  } else if (cell.widget === "progress") {
    const pct = cell.progress ?? 0;
    const display = resolveProgressDisplay(cell.widgetProps);
    const trackColor = cell.color ?? "#3b82f6";
    const label = (
      <span style={{ fontSize: 11, color: "rgba(0,0,0,0.55)", flex: "0 0 auto" }}>
        {cell.text}
      </span>
    );

    if (display === "label") {
      content = <div style={common}>{label}</div>;
    } else if (display === "circle") {
      const size = Math.max(16, cell.widgetProps?.progressSize ?? 28);
      const stroke = Math.max(2, cell.widgetProps?.progressStrokeWidth ?? 3);
      const r = (size - stroke) / 2;
      const c = 2 * Math.PI * r;
      const offset = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
      content = (
        <div style={{ ...common, gap: 6, justifyContent: "center" }}>
          <svg width={size} height={size} style={{ flex: "0 0 auto" }}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth={stroke}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={trackColor}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            <text
              x="50%"
              y="50%"
              dominantBaseline="central"
              textAnchor="middle"
              fontSize={Math.max(8, Math.round(size * 0.32))}
              fill="rgba(0,0,0,0.65)"
            >
              {Math.round(pct)}
            </text>
          </svg>
        </div>
      );
    } else {
      const bar = (
        <div
          style={{
            flex: 1,
            height: 8,
            borderRadius: 99,
            background: "rgba(0,0,0,0.08)",
            overflow: "hidden",
            minWidth: 24,
          }}
        >
          <div style={{ width: `${pct}%`, height: "100%", background: trackColor }} />
        </div>
      );

      content = (
        <div style={{ ...common, gap: 8 }}>
          {bar}
          {display === "barLabel" ? label : null}
        </div>
      );
    }
  } else if (cell.widget === "image") {
    const w = cell.widgetProps?.imageWidth ?? 28;
    const h = cell.widgetProps?.imageHeight ?? 28;
    content = (
      <div style={common}>
        {cell.imageUrl ? (
          <img
            src={cell.imageUrl}
            alt=""
            style={{
              width: w,
              height: h,
              objectFit: cell.widgetProps?.imageObjectFit ?? "cover",
              borderRadius: 4,
            }}
            draggable={false}
          />
        ) : (
          <span style={{ fontSize: 11, opacity: 0.5 }}>—</span>
        )}
      </div>
    );
  } else if (cell.widget === "boolean") {
    const on = Boolean(cell.booleanValue);
    const canToggle = Boolean(interactive && onCellAction);
    content = (
      <div style={common}>
        <button
          type="button"
          disabled={!canToggle}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            if (!canToggle) return;
            if (on) {
              emit("toggleOff", cell.widgetProps?.actions?.onFalseBlueprintNodeId);
            } else {
              emit("toggleOn", cell.widgetProps?.actions?.onTrueBlueprintNodeId);
            }
          }}
          style={{
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
          }}
          aria-pressed={on}
        >
          <span
            style={{
              position: "absolute",
              top: 2,
              left: on ? 14 : 2,
              width: 12,
              height: 12,
              borderRadius: 99,
              background: "#fff",
            }}
          />
        </button>
        <span style={{ marginLeft: 6, fontSize: 12 }}>{cell.text}</span>
      </div>
    );
  } else {
    const textStyle = cell.widgetProps?.textStyle;
    const canClickText = Boolean(cell.widgetProps?.actions?.onClickBlueprintNodeId);
    content = (
      <div
        style={{
          ...common,
          fontFamily: textStyle?.fontFamily,
          fontStyle: textStyle?.fontStyle,
          textDecoration: textStyle?.textDecoration === "none" ? undefined : textStyle?.textDecoration,
          cursor: canClickText ? "pointer" : undefined,
          color: canClickText && !common.color ? "#2563eb" : common.color,
        }}
        onClick={(e) => {
          if (!canClickText) return;
          e.stopPropagation();
          emit("click", cell.widgetProps?.actions?.onClickBlueprintNodeId);
        }}
      >
        {cell.text}
      </div>
    );
  }

  return wrapCellTooltip(cell, content);
}

const MemoCell = React.memo(TableCellView);

function TableRow({
  row,
  columns,
  config,
  rowHeight,
  gridTemplate,
  elementId,
  interactive,
  onCellAction,
}: {
  row: NormalizedRow;
  columns: NormalizedColumn[];
  config: PanelTableConfig;
  rowHeight: number;
  gridTemplate: string;
  elementId: string;
  interactive?: boolean;
  onCellAction?: TableCellActionHandler;
}) {
  const rowDisplay = resolveRowDisplay(row, config);
  return (
    <div
      role="row"
      style={{
        display: "grid",
        gridTemplateColumns: gridTemplate,
        height: rowHeight,
        boxSizing: "border-box",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        ...stylePropsToCss(rowDisplay.style),
      }}
    >
      {columns.map((col) => {
        const cell = resolveCellDisplay(row, col, config);
        return (
          <div
            key={col.id}
            role="cell"
            style={{
              minWidth: 0,
              borderRight: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <MemoCell
              cell={cell}
              row={row}
              column={col}
              elementId={elementId}
              interactive={interactive}
              onCellAction={onCellAction}
            />
          </div>
        );
      })}
    </div>
  );
}

const MemoRow = React.memo(TableRow);

export function TableNodeContent({
  element,
  interactive = true,
  onCellAction,
}: {
  element: PanelElement;
  interactive?: boolean;
  onCellAction?: TableCellActionHandler;
}) {
  const { t } = useI18n();
  const parentRef = useRef<HTMLDivElement | null>(null);
  const config = element.table;

  const model = useMemo(() => {
    const cfg = config ?? {};
    try {
      const raw = resolveRawTableInput(cfg);
      return transformToTableCached(raw, cfg);
    } catch {
      return { columns: [], rows: [] };
    }
  }, [config]);

  const columns = model.columns;
  const tableConfig = config ?? {};
  const rowHeight = Math.max(24, tableConfig.rowHeight ?? 36);
  const showHeader = tableConfig.showHeader !== false;
  const emptyText = tableConfig.emptyText || t("panel.config.tableEmpty");

  const gridTemplate = useMemo(
    () =>
      columns
        .map((c) => {
          if (c.width) return `${c.width}px`;
          if (c.minWidth) return `minmax(${c.minWidth}px, 1fr)`;
          return "minmax(96px, 1fr)";
        })
        .join(" "),
    [columns]
  );

  const virtualizer = useVirtualizer({
    count: model.rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 8,
  });

  const tableStyle = stylePropsToCss(tableConfig.tableStyle ?? {});
  const headerStyle = stylePropsToCss(tableConfig.headerStyle ?? {});
  const tableTextColor =
    (typeof tableStyle.color === "string" && tableStyle.color.trim()) ||
    (typeof tableConfig.tableStyle?.color === "string" && tableConfig.tableStyle.color.trim()) ||
    "#111827";
  const headerTextColor =
    (typeof headerStyle.color === "string" && headerStyle.color.trim()) ||
    (typeof tableConfig.headerStyle?.color === "string" && tableConfig.headerStyle.color.trim()) ||
    tableTextColor;

  return (
    <TooltipProvider delayDuration={250}>
    <div
      className="rv-table-node h-full w-full overflow-hidden"
      style={{
        background: (tableConfig.tableStyle?.backgroundColor as string) || "#fff",
        border:
          tableConfig.tableStyle?.borderWidth != null
            ? `${tableConfig.tableStyle.borderWidth}px solid ${tableConfig.tableStyle.borderColor ?? "rgba(0,0,0,0.12)"}`
            : "1px solid rgba(0,0,0,0.08)",
        borderRadius: tableConfig.tableStyle?.borderRadius ?? 6,
        fontSize: tableConfig.tableStyle?.fontSize ?? 12,
        ...tableStyle,
        color: tableTextColor,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {showHeader ? (
        <div
          role="row"
          style={{
            display: "grid",
            gridTemplateColumns: gridTemplate,
            height: rowHeight,
            flex: "0 0 auto",
            position: tableConfig.tableStyle?.stickyHeader === false ? "relative" : "sticky",
            top: 0,
            zIndex: 2,
            background: (tableConfig.headerStyle?.backgroundColor as string) || "rgba(0,0,0,0.04)",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            ...headerStyle,
            color: headerTextColor,
          }}
        >
          {columns.map((col) => {
            const headerLabel = (col.title ?? "").trim() || col.field || col.id;
            return (
              <div
                key={col.id}
                role="columnheader"
                style={{
                  padding: "0 8px",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: tableConfig.headerStyle?.fontWeight ?? 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  borderRight: "1px solid rgba(0,0,0,0.04)",
                  textAlign: col.align,
                  justifyContent:
                    col.align === "center" ? "center" : col.align === "right" ? "flex-end" : "flex-start",
                }}
                title={headerLabel}
              >
                {headerLabel}
              </div>
            );
          })}
        </div>
      ) : null}

      <div ref={parentRef} className="min-h-0 flex-1 overflow-auto">
        {model.rows.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center text-xs text-muted-foreground">
            <svg
              viewBox="0 0 48 48"
              className="h-10 w-10 opacity-45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden
            >
              <rect x="8" y="12" width="32" height="24" rx="3" />
              <path d="M8 20h32M20 12v24M28 12v24" strokeOpacity="0.55" />
              <circle cx="24" cy="30" r="1.2" fill="currentColor" stroke="none" />
            </svg>
            <div>{emptyText}</div>
          </div>
        ) : (
          <div style={{ height: virtualizer.getTotalSize(), position: "relative", width: "100%" }}>
            {virtualizer.getVirtualItems().map((item) => {
              const row = model.rows[item.index];
              return (
                <div
                  key={row.id}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: item.size,
                    transform: `translateY(${item.start}px)`,
                  }}
                >
                  <MemoRow
                    row={row}
                    columns={columns}
                    config={tableConfig}
                    rowHeight={rowHeight}
                    gridTemplate={gridTemplate}
                    elementId={element.id}
                    interactive={interactive}
                    onCellAction={onCellAction}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </TooltipProvider>
  );
}
