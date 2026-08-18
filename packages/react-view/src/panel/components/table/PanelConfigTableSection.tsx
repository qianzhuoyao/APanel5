import type {
  PanelTableConfig,
  TableCellWidget,
  TableColumnConfig,
  TableStyleRule,
  TableValueMapRule,
  TableWidgetProps,
  TableColorMapEntry,
  TableHrefRule,
  TableProgressRule,
  TableTooltipPlacement,
} from "@arronqzy/view-table";
import {
  coerceBooleanMapTarget,
  createDefaultCondition,
  findBooleanValueMapConflicts,
  generateMockTableRows,
  stringifyMockTableRows,
  type TableMockLocale,
  isCssTransparent,
} from "@arronqzy/view-table";
import type { PanelElement } from "../../types";
import { ConfigHintIcon } from "../ConfigHintIcon";
import { ConditionEditor } from "./ConditionEditor";
import { JsonCodeEditor } from "./JsonCodeEditor";
import { useI18n } from "@arronqzy/i18n/react";
import React, { useMemo, useRef, useState } from "react";
import { readFileAsDataUrl, runBusyTask } from "../../utils/async-work";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from "@arronqzy/ui";

type UpdateElement = (
  id: string,
  patch: Partial<PanelElement>,
  options?: { batchId?: string; meta?: Record<string, unknown> }
) => void;

export type PanelConfigTableSectionProps = {
  element: PanelElement;
  disabled?: boolean;
  updateElement: UpdateElement;
  /** optional list of blueprint nodes for action selectors */
  blueprintNodeOptions?: { id: string; label: string }[];
};

const TRANSFORM_MODES = ["auto", "records", "matrix", "path"] as const;
const WIDGETS: TableCellWidget[] = [
  "text",
  "tag",
  "badge",
  "link",
  "progress",
  "image",
  "boolean",
];
function leafValueText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function parseLeafValue(text: string): unknown {
  const trimmed = text.trim();
  if (trimmed === "") return "";
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return text;
}

function booleanMapSelectValue(value: unknown): "true" | "false" {
  const parsed = coerceBooleanMapTarget(value);
  return parsed === false ? "false" : "true";
}

function BlueprintNodeSelect({
  value,
  onChange,
  options,
  className,
  noneLabel,
}: {
  value?: string;
  onChange: (next: string | undefined) => void;
  options: { id: string; label: string }[];
  className?: string;
  noneLabel: string;
}) {
  const current = value?.trim() || "";
  const orphan =
    current && !options.some((opt) => opt.id === current) ? current : null;
  return (
    <Select
      value={current || "__none__"}
      onValueChange={(next) => onChange(next === "__none__" ? undefined : next)}
    >
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__none__">{noneLabel}</SelectItem>
        {orphan ? <SelectItem value={orphan}>{orphan}</SelectItem> : null}
        {options.map((opt) => (
          <SelectItem key={opt.id} value={opt.id}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function PanelConfigTableSection({
  element,
  disabled = false,
  updateElement,
  blueprintNodeOptions = [],
}: PanelConfigTableSectionProps) {
  const { t } = useI18n();
  const table = element.table ?? {};
  const columns = table.columns ?? [];
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [rowsEditorOpen, setRowsEditorOpen] = useState(false);
  const [rowsEditorDraft, setRowsEditorDraft] = useState("");
  const [rowsEditorError, setRowsEditorError] = useState<string | null>(null);
  const [mockOpen, setMockOpen] = useState(false);
  const [mockRowCount, setMockRowCount] = useState(5);
  const [mockSeed, setMockSeed] = useState("");
  const [mockNamePrefix, setMockNamePrefix] = useState("");
  const [mockLocale, setMockLocale] = useState<TableMockLocale>("zh");
  const [mockIncludeId, setMockIncludeId] = useState(true);
  const [mockIncludeTimestamp, setMockIncludeTimestamp] = useState(false);
  const [mockIncludeExtras, setMockIncludeExtras] = useState(true);
  const [mockStatusValues, setMockStatusValues] = useState("active,idle,pending,done");
  const [mockScoreMin, setMockScoreMin] = useState(0);
  const [mockScoreMax, setMockScoreMax] = useState(100);

  const selectedIndex = useMemo(() => {
    if (columns.length === 0) return -1;
    if (selectedColumnId == null) return 0;
    const idx = columns.findIndex(
      (col, i) => (col.id ?? `col-${i}`) === selectedColumnId || col.field === selectedColumnId
    );
    return idx >= 0 ? idx : 0;
  }, [columns, selectedColumnId]);

  const selectedColumn = selectedIndex >= 0 ? columns[selectedIndex] : null;

  const booleanValueMapConflicts = useMemo(() => {
    if (selectedColumn?.widget !== "boolean") return [];
    return findBooleanValueMapConflicts(selectedColumn.valueMap);
  }, [selectedColumn]);

  const patchTable = (patch: Partial<PanelTableConfig>) => {
    updateElement(element.id, {
      table: { ...table, ...patch },
    });
  };

  const patchTransform = (patch: NonNullable<PanelTableConfig["transform"]>) => {
    patchTable({
      transform: { ...(table.transform ?? {}), ...patch },
    });
  };

  const patchTableStyle = (patch: NonNullable<PanelTableConfig["tableStyle"]>) => {
    patchTable({
      tableStyle: { ...(table.tableStyle ?? {}), ...patch },
    });
  };

  const patchHeaderStyle = (patch: NonNullable<PanelTableConfig["headerStyle"]>) => {
    patchTable({
      headerStyle: { ...(table.headerStyle ?? {}), ...patch },
    });
  };

  const setColumns = (next: TableColumnConfig[]) => {
    patchTable({ columns: next });
  };

  const updateColumnAt = (index: number, patch: Partial<TableColumnConfig>) => {
    const next = columns.map((col, i) => (i === index ? { ...col, ...patch } : col));
    setColumns(next);
  };

  const patchWidgetProps = (index: number, patch: Partial<TableWidgetProps>) => {
    const col = columns[index];
    if (!col) return;
    updateColumnAt(index, {
      widgetProps: { ...(col.widgetProps ?? {}), ...patch },
    });
  };

  const imageUploadRef = useRef<HTMLInputElement | null>(null);
  const [imageUploadHint, setImageUploadHint] = useState("");

  const uploadImageForColumn = async (index: number, file: File) => {
    try {
      await runBusyTask(t("common.uploadingFile"), async () => {
        const base64 = await readFileAsDataUrl(file, t("panel.messages.readImageFailed"), "image");
        patchWidgetProps(index, {
          imageUrlMode: "static",
          imageUrl: base64,
        });
        setImageUploadHint(t("panel.config.uploadWrittenBase64"));
        try {
          const form = new FormData();
          form.append("file", file);
          const resp = await fetch("/api/upload", { method: "POST", body: form });
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const data = (await resp.json()) as { url?: string };
          if (data.url) {
            patchWidgetProps(index, {
              imageUrlMode: "static",
              imageUrl: data.url,
            });
            setImageUploadHint(t("panel.config.uploadServerAndBase64"));
          }
        } catch {
          setImageUploadHint(t("panel.config.uploadServerFailedKeepBase64"));
        }
      });
    } catch (error) {
      setImageUploadHint(
        error instanceof Error ? error.message : t("panel.messages.readImageFailed")
      );
    }
  };

  const addColumn = () => {
    const n = columns.length + 1;
    const col: TableColumnConfig = {
      id: `col-${Date.now().toString(36)}`,
      field: `field${n}`,
      title: t("panel.config.tableColumnUntitled", { n }),
      width: 120,
      widget: "text",
    };
    setColumns([...columns, col]);
    setSelectedColumnId(col.id!);
  };

  const removeColumn = (index: number) => {
    const next = columns.filter((_, i) => i !== index);
    setColumns(next);
    if (selectedIndex === index) {
      setSelectedColumnId(next[0]?.id ?? next[0]?.field ?? null);
    }
  };

  const moveColumn = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= columns.length) return;
    const next = [...columns];
    const [item] = next.splice(index, 1);
    if (!item) return;
    next.splice(target, 0, item);
    setColumns(next);
    setSelectedColumnId(item.id ?? item.field ?? `col-${target}`);
  };

  const fieldClass = "block space-y-1 text-[11px]";
  const labelClass = "text-[11px] text-muted-foreground";
  const inputClass = "h-7";

  const fieldLabel = (labelKey: string, hintKey?: string) => {
    const label = t(labelKey);
    return (
      <div className="flex min-w-0 items-center gap-1">
        <Label className={labelClass}>{label}</Label>
        {hintKey ? (
          <ConfigHintIcon label={label}>
            <div>{t(hintKey)}</div>
          </ConfigHintIcon>
        ) : null}
      </div>
    );
  };

  const groupTitle = (titleKey: string, hintKey?: string) => {
    const title = t(titleKey);
    return (
      <div className="flex items-center gap-1">
        <div className="text-[11px] font-semibold text-muted-foreground">{title}</div>
        {hintKey ? (
          <ConfigHintIcon label={title}>
            <div>{t(hintKey)}</div>
          </ConfigHintIcon>
        ) : null}
      </div>
    );
  };

  const toPickerHex = (value: string | undefined, fallback = "#000000") =>
    /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value || "") ? (value as string) : fallback;

  const colorField = (
    labelKey: string,
    value: string,
    onChange: (next: string) => void,
    hintKey?: string,
    placeholder = "#000000",
    allowTransparent = false
  ) => {
    const label = t(labelKey);
    const transparent = allowTransparent && isCssTransparent(value);
    const fallbackHex = placeholder.startsWith("#") ? placeholder : "#ffffff";
    return (
      <div className={fieldClass}>
        {fieldLabel(labelKey, hintKey)}
        {allowTransparent ? (
          <label className="flex items-center gap-2 text-[11px]">
            <Switch
              checked={transparent}
              onCheckedChange={(checked) => onChange(checked ? "transparent" : fallbackHex)}
            />
            <span>{t("panel.config.tableBgTransparent")}</span>
          </label>
        ) : null}
        {transparent ? (
          <div className="text-[10px] text-muted-foreground">
            {t("panel.config.tableBgTransparentHint")}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`${inputClass} min-w-0 flex-1`}
            />
            <Input
              type="color"
              value={toPickerHex(value, fallbackHex)}
              onChange={(e) => onChange(e.target.value)}
              className="h-7 w-10 shrink-0 cursor-pointer p-1"
              aria-label={t("common.colorPickerAria", { label })}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
    <fieldset disabled={disabled} className={`space-y-3 ${disabled ? "opacity-60" : ""}`}>
      <div className="space-y-2.5 rounded-lg border border-border/55 bg-background/80 p-2.5">
        {groupTitle("panel.config.groupTableData", "panel.config.groupTableDataHint")}
        <label className={fieldClass} data-config-field="table.source">
          {fieldLabel("panel.config.tableSource", "panel.config.tableSourceHint")}
          <Input
            value={table.source ?? ""}
            onChange={(e) => patchTable({ source: e.target.value || undefined })}
            placeholder="{scope?.list}"
            className={inputClass}
          />
        </label>
        <div className={fieldClass} data-config-field="table.rowsText">
          <div className="flex items-center justify-between gap-2">
            {fieldLabel("panel.config.tableRowsText", "panel.config.tableRowsTextHint")}
            <div className="flex items-center gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 px-0"
                title={t("panel.config.tableRowsEdit")}
                aria-label={t("panel.config.tableRowsEdit")}
                onClick={() => {
                  setRowsEditorDraft(table.rowsText ?? "");
                  setRowsEditorError(null);
                  setRowsEditorOpen(true);
                }}
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 px-0"
                title={t("panel.config.tableRowsMock")}
                aria-label={t("panel.config.tableRowsMock")}
                onClick={() => setMockOpen(true)}
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                  <circle cx="12" cy="12" r="4" />
                  <path d="M5.6 5.6 7.7 7.7M16.3 16.3l2.1 2.1M16.3 7.7l2.1-2.1M5.6 18.4 7.7 16.3" />
                </svg>
              </Button>
            </div>
          </div>
          <Textarea
            value={table.rowsText ?? ""}
            onChange={(e) => patchTable({ rowsText: e.target.value })}
            placeholder='[{"name":"A"}]'
            className="min-h-[140px] font-mono text-[11px]"
          />
        </div>
        <details className="rounded-md border border-border/50 bg-muted/10 px-2 py-1.5">
          <summary className="cursor-pointer text-[11px] font-medium text-muted-foreground">
            {t("panel.config.tableAdvancedData")}
          </summary>
          <div className="mt-2 space-y-2 border-t border-border/40 pt-2">
            <p className="text-[10px] text-muted-foreground">{t("panel.config.tableAdvancedDataHint")}</p>
            <div className="grid grid-cols-2 gap-2">
              <label className={fieldClass}>
                {fieldLabel("panel.config.tableTransformMode", "panel.config.tableTransformModeHint")}
                <Select
                  value={table.transform?.mode ?? "auto"}
                  onValueChange={(value) =>
                    patchTransform({ mode: value as (typeof TRANSFORM_MODES)[number] })
                  }
                >
                  <SelectTrigger className={inputClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSFORM_MODES.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {t(`panel.config.tableMode.${mode}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              <label className={fieldClass}>
                {fieldLabel("panel.config.tableRowIdField", "panel.config.tableRowIdFieldHint")}
                <Input
                  value={table.transform?.rowIdField ?? ""}
                  onChange={(e) =>
                    patchTransform({ rowIdField: e.target.value || undefined })
                  }
                  placeholder="id"
                  className={inputClass}
                />
              </label>
            </div>
            <label className={fieldClass}>
              {fieldLabel("panel.config.tableTransformPath", "panel.config.tableTransformPathHint")}
              <Input
                value={table.transform?.path ?? ""}
                onChange={(e) => patchTransform({ path: e.target.value || undefined })}
                placeholder="data.list"
                className={inputClass}
              />
            </label>
          </div>
        </details>
      </div>

      <div className="space-y-2.5 rounded-lg border border-border/55 bg-background/80 p-2.5">
        <div className="flex items-center justify-between gap-2">
          {groupTitle("panel.config.groupTableColumns", "panel.config.groupTableColumnsHint")}
          <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-[11px]" onClick={addColumn}>
            {t("panel.config.tableAddColumn")}
          </Button>
        </div>
        <div className="space-y-1.5">
          {columns.map((col, index) => {
            const key = col.id ?? `col-${index}`;
            const active = index === selectedIndex;
            return (
              <div
                key={key}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedColumnId(key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedColumnId(key);
                  }
                }}
                className={`flex items-center gap-1.5 rounded-md border px-1.5 py-1.5 ${
                  active
                    ? "border-primary/55 bg-primary/5 ring-1 ring-primary/20"
                    : "border-border/60 hover:bg-muted/30"
                }`}
              >
                <div className="flex shrink-0 flex-col gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 px-0 text-[10px]"
                    disabled={index === 0}
                    title={t("panel.config.tableMoveColumnUp")}
                    aria-label={t("panel.config.tableMoveColumnUp")}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveColumn(index, -1);
                    }}
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 px-0 text-[10px]"
                    disabled={index >= columns.length - 1}
                    title={t("panel.config.tableMoveColumnDown")}
                    aria-label={t("panel.config.tableMoveColumnDown")}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveColumn(index, 1);
                    }}
                  >
                    ↓
                  </Button>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px] font-medium">
                    {col.title || col.field || key}
                  </div>
                  <div className="truncate text-[10px] text-muted-foreground">
                    {col.field}
                    {" · "}
                    {t(`panel.config.tableWidget.${col.widget ?? "text"}`)}
                  </div>
                </div>
                <label
                  className="flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="whitespace-nowrap">{t("panel.config.tableColumnWidth")}</span>
                  <Input
                    type="number"
                    min={40}
                    max={800}
                    value={col.width ?? ""}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      updateColumnAt(index, {
                        width: Number.isFinite(n) && n > 0 ? n : undefined,
                      });
                    }}
                    className="h-6 w-14 px-1 text-[11px]"
                    placeholder="—"
                  />
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 shrink-0 px-0 text-destructive"
                  title={t("panel.config.tableRemoveColumn")}
                  aria-label={t("panel.config.tableRemoveColumn")}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeColumn(index);
                  }}
                >
                  ×
                </Button>
              </div>
            );
          })}
          {columns.length === 0 ? (
            <div className="text-[11px] text-muted-foreground">{t("panel.config.tableNoColumns")}</div>
          ) : null}
        </div>
      </div>

      {selectedColumn && selectedIndex >= 0 ? (
        <div className="space-y-2.5 rounded-lg border border-border/55 bg-background/80 p-2.5">
          <div className="text-[11px] font-semibold text-muted-foreground">
            {t("panel.config.groupTableColumnDetail", {
              name: selectedColumn.title || selectedColumn.field,
            })}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className={fieldClass}>
              {fieldLabel("panel.config.tableColumnField", "panel.config.tableColumnFieldHint")}
              <Input
                value={selectedColumn.field}
                onChange={(e) => updateColumnAt(selectedIndex, { field: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className={fieldClass}>
              {fieldLabel("panel.config.tableColumnTitle", "panel.config.tableColumnTitleHint")}
              <Input
                value={selectedColumn.title ?? ""}
                onChange={(e) =>
                  updateColumnAt(selectedIndex, { title: e.target.value || undefined })
                }
                className={inputClass}
              />
            </label>
            <label className={fieldClass}>
              {fieldLabel("panel.config.tableColumnWidth")}
              <Input
                type="number"
                min={40}
                max={800}
                value={selectedColumn.width ?? ""}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  updateColumnAt(selectedIndex, {
                    width: Number.isFinite(n) && n > 0 ? n : undefined,
                  });
                }}
                className={inputClass}
              />
            </label>
            <label className={fieldClass}>
              {fieldLabel("panel.config.tableColumnWidget", "panel.config.tableColumnWidgetHint")}
              <Select
                value={selectedColumn.widget ?? "text"}
                onValueChange={(value) =>
                  updateColumnAt(selectedIndex, { widget: value as TableCellWidget })
                }
              >
                <SelectTrigger className={inputClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WIDGETS.map((widget) => (
                    <SelectItem key={widget} value={widget}>
                      {t(`panel.config.tableWidget.${widget}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          <div className="space-y-2 rounded-md border border-border/60 bg-muted/15 p-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <span>{t("panel.config.tableTooltipEnabled")}</span>
                <ConfigHintIcon label={t("panel.config.tableTooltipEnabled")}>
                  <div>{t("panel.config.tableTooltipEnabledHint")}</div>
                </ConfigHintIcon>
              </div>
              <Switch
                checked={Boolean(selectedColumn.tooltipEnabled)}
                onCheckedChange={(checked) =>
                  updateColumnAt(selectedIndex, { tooltipEnabled: checked || undefined })
                }
              />
            </div>
            {selectedColumn.tooltipEnabled ? (
              <>
                <label className={fieldClass}>
                  {fieldLabel("panel.config.tableTooltipPlacementLabel")}
                  <Select
                    value={selectedColumn.tooltipPlacement ?? "top"}
                    onValueChange={(value) =>
                      updateColumnAt(selectedIndex, {
                        tooltipPlacement: value as TableTooltipPlacement,
                      })
                    }
                  >
                    <SelectTrigger className={inputClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["top", "right", "bottom", "left"] as TableTooltipPlacement[]).map(
                        (side) => (
                          <SelectItem key={side} value={side}>
                            {t(`panel.config.tableTooltipPlacement.${side}`)}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </label>
                <label className={fieldClass}>
                  {fieldLabel(
                    "panel.config.tableTooltipTemplate",
                    "panel.config.tableTooltipTemplateHint"
                  )}
                  <Input
                    value={selectedColumn.tooltipTemplate ?? ""}
                    onChange={(e) =>
                      updateColumnAt(selectedIndex, {
                        tooltipTemplate: e.target.value.trim() ? e.target.value : undefined,
                      })
                    }
                    placeholder="{current}"
                    className={inputClass}
                  />
                </label>
              </>
            ) : null}
          </div>

          <div className="space-y-2 rounded-md border border-border/60 bg-muted/15 p-2">
              <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <span>{t("panel.config.tableWidgetProps")}</span>
                <ConfigHintIcon label={t("panel.config.tableWidgetProps")}>
                  <div>{t("panel.config.tableWidgetPropsHint")}</div>
                </ConfigHintIcon>
              </div>

              {(selectedColumn.widget ?? "text") !== "image" ? (
                <div className="grid grid-cols-2 gap-2">
                    <label className={fieldClass}>
                      {fieldLabel("panel.config.tableTextFontSize")}
                      <Input
                        type="number"
                        min={8}
                        max={72}
                        value={selectedColumn.widgetProps?.textStyle?.fontSize ?? ""}
                        onChange={(e) => {
                          const n = Number(e.target.value);
                          patchWidgetProps(selectedIndex, {
                            textStyle: {
                              ...(selectedColumn.widgetProps?.textStyle ?? {}),
                              fontSize: Number.isFinite(n) && n > 0 ? n : undefined,
                            },
                          });
                        }}
                        placeholder="12"
                        className={inputClass}
                      />
                    </label>
                    <label className={fieldClass}>
                      {fieldLabel("panel.config.tableTextFontWeight")}
                      <Select
                        value={String(selectedColumn.widgetProps?.textStyle?.fontWeight ?? "normal")}
                        onValueChange={(value) =>
                          patchWidgetProps(selectedIndex, {
                            textStyle: {
                              ...(selectedColumn.widgetProps?.textStyle ?? {}),
                              fontWeight: value === "normal" ? undefined : value,
                            },
                          })
                        }
                      >
                        <SelectTrigger className={inputClass}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">{t("panel.config.tableTextWeightNormal")}</SelectItem>
                          <SelectItem value="500">500</SelectItem>
                          <SelectItem value="600">600</SelectItem>
                          <SelectItem value="700">{t("panel.config.tableTextWeightBold")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                    {colorField(
                      "panel.config.tableTextColor",
                      selectedColumn.widgetProps?.textStyle?.color ?? "",
                      (next) =>
                        patchWidgetProps(selectedIndex, {
                          textStyle: {
                            ...(selectedColumn.widgetProps?.textStyle ?? {}),
                            color: next || undefined,
                          },
                        }),
                      undefined,
                      "#111827"
                    )}
                    <label className={fieldClass}>
                      {fieldLabel("panel.config.tableTextFontFamily")}
                      <Input
                        value={selectedColumn.widgetProps?.textStyle?.fontFamily ?? ""}
                        onChange={(e) =>
                          patchWidgetProps(selectedIndex, {
                            textStyle: {
                              ...(selectedColumn.widgetProps?.textStyle ?? {}),
                              fontFamily: e.target.value || undefined,
                            },
                          })
                        }
                        placeholder="inherit"
                        className={inputClass}
                      />
                    </label>
                    <label className={fieldClass}>
                      {fieldLabel("panel.config.tableTextFontStyle")}
                      <Select
                        value={selectedColumn.widgetProps?.textStyle?.fontStyle ?? "normal"}
                        onValueChange={(value) =>
                          patchWidgetProps(selectedIndex, {
                            textStyle: {
                              ...(selectedColumn.widgetProps?.textStyle ?? {}),
                              fontStyle: value as "normal" | "italic",
                            },
                          })
                        }
                      >
                        <SelectTrigger className={inputClass}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">{t("panel.config.tableTextStyleNormal")}</SelectItem>
                          <SelectItem value="italic">{t("panel.config.tableTextStyleItalic")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                    <label className={fieldClass}>
                      {fieldLabel("panel.config.tableTextDecoration")}
                      <Select
                        value={selectedColumn.widgetProps?.textStyle?.textDecoration ?? "none"}
                        onValueChange={(value) =>
                          patchWidgetProps(selectedIndex, {
                            textStyle: {
                              ...(selectedColumn.widgetProps?.textStyle ?? {}),
                              textDecoration: value as "none" | "underline" | "line-through",
                            },
                          })
                        }
                      >
                        <SelectTrigger className={inputClass}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t("panel.config.tableTextDecoNone")}</SelectItem>
                          <SelectItem value="underline">{t("panel.config.tableTextDecoUnderline")}</SelectItem>
                          <SelectItem value="line-through">{t("panel.config.tableTextDecoLineThrough")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                    <label className={fieldClass}>
                      {fieldLabel("panel.config.tableTextOverflow", "panel.config.tableTextOverflowHint")}
                      <Select
                        value={selectedColumn.widgetProps?.textStyle?.overflow ?? "ellipsis"}
                        onValueChange={(value) =>
                          patchWidgetProps(selectedIndex, {
                            textStyle: {
                              ...(selectedColumn.widgetProps?.textStyle ?? {}),
                              overflow: value as "ellipsis" | "wrap",
                            },
                          })
                        }
                      >
                        <SelectTrigger className={inputClass}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ellipsis">{t("panel.config.tableTextOverflowEllipsis")}</SelectItem>
                          <SelectItem value="wrap">{t("panel.config.tableTextOverflowWrap")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                  </div>
              ) : null}

              {(selectedColumn.widget ?? "text") === "text" ? (
                <>
                  <label className={fieldClass}>
                    {fieldLabel("panel.config.tableActionOnClick", "panel.config.tableActionBlueprintHint")}
                    <BlueprintNodeSelect
                      value={selectedColumn.widgetProps?.actions?.onClickBlueprintNodeId}
                      options={blueprintNodeOptions}
                      className={inputClass}
                      noneLabel={t("panel.config.tableActionBlueprintNone")}
                      onChange={(next) =>
                        patchWidgetProps(selectedIndex, {
                          actions: {
                            ...(selectedColumn.widgetProps?.actions ?? {}),
                            onClickBlueprintNodeId: next,
                          },
                        })
                      }
                    />
                  </label>
                </>
              ) : null}

              {selectedColumn.widget === "image" ? (
                <>
                  <label className={fieldClass}>
                    {fieldLabel("panel.config.tableImageUrlMode", "panel.config.tableImageUrlModeHint")}
                    <Select
                      value={selectedColumn.widgetProps?.imageUrlMode ?? "field"}
                      onValueChange={(value) =>
                        patchWidgetProps(selectedIndex, {
                          imageUrlMode: value as NonNullable<TableWidgetProps["imageUrlMode"]>,
                        })
                      }
                    >
                      <SelectTrigger className={inputClass}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="field">
                          {t("panel.config.tableImageUrlModeField")}
                        </SelectItem>
                        <SelectItem value="static">
                          {t("panel.config.tableImageUrlModeStatic")}
                        </SelectItem>
                        <SelectItem value="prefix">
                          {t("panel.config.tableImageUrlModePrefix")}
                        </SelectItem>
                        <SelectItem value="template">
                          {t("panel.config.tableImageUrlModeTemplate")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </label>

                  {(selectedColumn.widgetProps?.imageUrlMode ?? "field") === "field" ||
                  (selectedColumn.widgetProps?.imageUrlMode ?? "field") === "prefix" ? (
                    <label className={fieldClass}>
                      {fieldLabel(
                        "panel.config.tableImageUrlField",
                        "panel.config.tableImageUrlFieldHint"
                      )}
                      <Input
                        value={selectedColumn.widgetProps?.imageUrlField ?? ""}
                        onChange={(e) =>
                          patchWidgetProps(selectedIndex, {
                            imageUrlField: e.target.value || undefined,
                          })
                        }
                        placeholder={selectedColumn.field}
                        className={inputClass}
                      />
                    </label>
                  ) : null}

                  {(selectedColumn.widgetProps?.imageUrlMode ?? "field") === "static" ? (
                    <div className="space-y-1.5">
                      <label className={fieldClass}>
                        {fieldLabel("panel.config.tableImageUrl", "panel.config.tableImageUrlHint")}
                        <Input
                          value={selectedColumn.widgetProps?.imageUrl ?? ""}
                          onChange={(e) =>
                            patchWidgetProps(selectedIndex, {
                              imageUrl: e.target.value || undefined,
                            })
                          }
                          placeholder="{scope?.avatar} / https://…"
                          className={inputClass}
                        />
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => imageUploadRef.current?.click()}
                        >
                          {t("panel.config.tableImageUpload")}
                        </Button>
                        <input
                          ref={imageUploadRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            if (file) void uploadImageForColumn(selectedIndex, file);
                          }}
                        />
                        {imageUploadHint ? (
                          <span className="text-[11px] text-muted-foreground">{imageUploadHint}</span>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {(selectedColumn.widgetProps?.imageUrlMode ?? "field") === "prefix" ? (
                    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                      <label className={fieldClass}>
                        {fieldLabel(
                          "panel.config.tableImageUrlPrefix",
                          "panel.config.tableImageUrlPrefixHint"
                        )}
                        <Input
                          value={selectedColumn.widgetProps?.imageUrlPrefix ?? ""}
                          onChange={(e) =>
                            patchWidgetProps(selectedIndex, {
                              imageUrlPrefix: e.target.value || undefined,
                            })
                          }
                          placeholder="https://cdn.example.com/ 或 {scope?.cdn}/"
                          className={inputClass}
                        />
                      </label>
                      <label className={fieldClass}>
                        {fieldLabel(
                          "panel.config.tableImageUrlSuffix",
                          "panel.config.tableImageUrlSuffixHint"
                        )}
                        <Input
                          value={selectedColumn.widgetProps?.imageUrlSuffix ?? ""}
                          onChange={(e) =>
                            patchWidgetProps(selectedIndex, {
                              imageUrlSuffix: e.target.value || undefined,
                            })
                          }
                          placeholder=".png"
                          className={inputClass}
                        />
                      </label>
                    </div>
                  ) : null}

                  {(selectedColumn.widgetProps?.imageUrlMode ?? "field") === "template" ? (
                    <label className={fieldClass}>
                      {fieldLabel(
                        "panel.config.tableImageUrlTemplate",
                        "panel.config.tableImageUrlTemplateHint"
                      )}
                      <Input
                        value={selectedColumn.widgetProps?.imageUrlTemplate ?? ""}
                        onChange={(e) =>
                          patchWidgetProps(selectedIndex, {
                            imageUrlTemplate: e.target.value || undefined,
                          })
                        }
                        placeholder="https://cdn/{row.id}.png"
                        className={inputClass}
                      />
                    </label>
                  ) : null}

                  <div className="grid grid-cols-3 gap-1.5">
                    <label className={fieldClass}>
                      {fieldLabel("panel.config.tableImageWidth")}
                      <Input
                        type="number"
                        min={12}
                        max={240}
                        value={selectedColumn.widgetProps?.imageWidth ?? 28}
                        onChange={(e) =>
                          patchWidgetProps(selectedIndex, {
                            imageWidth: Math.max(12, Math.min(240, Number(e.target.value) || 28)),
                          })
                        }
                        className={inputClass}
                      />
                    </label>
                    <label className={fieldClass}>
                      {fieldLabel("panel.config.tableImageHeight")}
                      <Input
                        type="number"
                        min={12}
                        max={240}
                        value={selectedColumn.widgetProps?.imageHeight ?? 28}
                        onChange={(e) =>
                          patchWidgetProps(selectedIndex, {
                            imageHeight: Math.max(12, Math.min(240, Number(e.target.value) || 28)),
                          })
                        }
                        className={inputClass}
                      />
                    </label>
                    <label className={fieldClass}>
                      {fieldLabel("panel.config.tableImageObjectFit")}
                      <Select
                        value={selectedColumn.widgetProps?.imageObjectFit ?? "cover"}
                        onValueChange={(value) =>
                          patchWidgetProps(selectedIndex, {
                            imageObjectFit: value as NonNullable<
                              TableWidgetProps["imageObjectFit"]
                            >,
                          })
                        }
                      >
                        <SelectTrigger className={inputClass}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cover">
                            {t("panel.config.tableImageFitCover")}
                          </SelectItem>
                          <SelectItem value="contain">
                            {t("panel.config.tableImageFitContain")}
                          </SelectItem>
                          <SelectItem value="fill">
                            {t("panel.config.tableImageFitFill")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                  </div>
                </>
              ) : null}


              {selectedColumn.widget === "link" ? (
                <>
                  <label className={fieldClass}>
                    {fieldLabel("panel.config.tableLinkHrefField", "panel.config.tableLinkHrefFieldHint")}
                    <Input
                      value={selectedColumn.widgetProps?.hrefField ?? ""}
                      onChange={(e) =>
                        patchWidgetProps(selectedIndex, {
                          hrefField: e.target.value || undefined,
                        })
                      }
                      placeholder={selectedColumn.field}
                      className={inputClass}
                    />
                  </label>
                  <label className={fieldClass}>
                    {fieldLabel(
                      "panel.config.tableLinkHrefTemplate",
                      "panel.config.tableLinkHrefTemplateHint"
                    )}
                    <Input
                      value={selectedColumn.widgetProps?.hrefTemplate ?? ""}
                      onChange={(e) =>
                        patchWidgetProps(selectedIndex, {
                          hrefTemplate: e.target.value || undefined,
                        })
                      }
                      placeholder="/detail/{row.id}"
                      className={inputClass}
                    />
                  </label>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <span>{t("panel.config.tableHrefRules")}</span>
                        <ConfigHintIcon label={t("panel.config.tableHrefRules")}>
                          <div>{t("panel.config.tableHrefRulesHint")}</div>
                        </ConfigHintIcon>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-[11px]"
                        onClick={() => {
                          const rule: TableHrefRule = {
                            when: createDefaultCondition(),
                            href: "",
                          };
                          patchWidgetProps(selectedIndex, {
                            hrefRules: [...(selectedColumn.widgetProps?.hrefRules ?? []), rule],
                          });
                        }}
                      >
                        {t("panel.config.tableAddHrefRule")}
                      </Button>
                    </div>
                    {(selectedColumn.widgetProps?.hrefRules ?? []).map((rule, ruleIndex) => (
                        <div
                          key={`href-${ruleIndex}`}
                          className="space-y-1.5 rounded-md border border-border/60 bg-muted/20 p-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-muted-foreground">
                              {t("panel.config.tableHrefRuleItem", { n: ruleIndex + 1 })}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 px-1.5 text-destructive"
                              onClick={() => {
                                const next = (selectedColumn.widgetProps?.hrefRules ?? []).filter(
                                  (_, i) => i !== ruleIndex
                                );
                                patchWidgetProps(selectedIndex, {
                                  hrefRules: next.length ? next : undefined,
                                });
                              }}
                            >
                              ×
                            </Button>
                          </div>
                          <ConditionEditor
                            value={rule.when}
                            showField={false}
                            fieldClass={fieldClass}
                            inputClass={inputClass}
                            onChange={(when) => {
                              const next = [...(selectedColumn.widgetProps?.hrefRules ?? [])];
                              next[ruleIndex] = { ...rule, when };
                              patchWidgetProps(selectedIndex, { hrefRules: next });
                            }}
                          />
                          <label className={fieldClass}>
                            {fieldLabel("panel.config.tableHrefRuleHref")}
                            <Input
                              value={rule.href}
                              onChange={(e) => {
                                const next = [...(selectedColumn.widgetProps?.hrefRules ?? [])];
                                next[ruleIndex] = { ...rule, href: e.target.value };
                                patchWidgetProps(selectedIndex, { hrefRules: next });
                              }}
                              placeholder="/x/{row.id}"
                              className={inputClass}
                            />
                          </label>
                        </div>
                    ))}
                  </div>
                  <label className="flex items-center gap-2 text-[11px]">
                    <Switch
                      checked={selectedColumn.widgetProps?.openInNewTab !== false}
                      onCheckedChange={(checked) =>
                        patchWidgetProps(selectedIndex, { openInNewTab: checked })
                      }
                    />
                    <span>{t("panel.config.tableLinkOpenNewTab")}</span>
                  </label>
                  <label className={fieldClass}>
                    {fieldLabel("panel.config.tableActionOnClick", "panel.config.tableActionBlueprintHint")}
                    <BlueprintNodeSelect
                      value={selectedColumn.widgetProps?.actions?.onClickBlueprintNodeId}
                      options={blueprintNodeOptions}
                      className={inputClass}
                      noneLabel={t("panel.config.tableActionBlueprintNone")}
                      onChange={(next) =>
                        patchWidgetProps(selectedIndex, {
                          actions: {
                            ...(selectedColumn.widgetProps?.actions ?? {}),
                            onClickBlueprintNodeId: next,
                          },
                        })
                      }
                    />
                  </label>
                </>
              ) : null}

              {selectedColumn.widget === "progress" ? (
                <>
                  <label className={fieldClass}>
                    {fieldLabel("panel.config.tableProgressMode", "panel.config.tableProgressModeHint")}
                    <Select
                      value={selectedColumn.widgetProps?.progressMode ?? "field"}
                      onValueChange={(value) =>
                        patchWidgetProps(selectedIndex, {
                          progressMode: value as NonNullable<TableWidgetProps["progressMode"]>,
                        })
                      }
                    >
                      <SelectTrigger className={inputClass}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="field">{t("panel.config.tableProgressModeField")}</SelectItem>
                        <SelectItem value="static">{t("panel.config.tableProgressModeStatic")}</SelectItem>
                        <SelectItem value="rules">{t("panel.config.tableProgressModeRules")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                  {(selectedColumn.widgetProps?.progressMode ?? "field") === "field" ? (
                    <label className={fieldClass}>
                      {fieldLabel("panel.config.tableProgressField", "panel.config.tableProgressFieldHint")}
                      <Input
                        value={selectedColumn.widgetProps?.progressField ?? ""}
                        onChange={(e) =>
                          patchWidgetProps(selectedIndex, {
                            progressField: e.target.value || undefined,
                          })
                        }
                        placeholder={selectedColumn.field}
                        className={inputClass}
                      />
                    </label>
                  ) : null}
                  {(selectedColumn.widgetProps?.progressMode ?? "field") === "static" ? (
                    <label className={fieldClass}>
                      {fieldLabel("panel.config.tableProgressStatic", "panel.config.tableProgressStaticHint")}
                      <Input
                        value={String(selectedColumn.widgetProps?.progressStatic ?? "")}
                        onChange={(e) =>
                          patchWidgetProps(selectedIndex, {
                            progressStatic: e.target.value || undefined,
                          })
                        }
                        placeholder="80 或 {scope?.pct}"
                        className={inputClass}
                      />
                    </label>
                  ) : null}
                  {(selectedColumn.widgetProps?.progressMode ?? "field") === "rules" ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-muted-foreground">
                          {t("panel.config.tableProgressRules")}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => {
                            const rule: TableProgressRule = {
                              when: createDefaultCondition(),
                              value: 0,
                            };
                            patchWidgetProps(selectedIndex, {
                              progressRules: [
                                ...(selectedColumn.widgetProps?.progressRules ?? []),
                                rule,
                              ],
                            });
                          }}
                        >
                          {t("panel.config.tableAddProgressRule")}
                        </Button>
                      </div>
                      {(selectedColumn.widgetProps?.progressRules ?? []).map((rule, ruleIndex) => (
                          <div
                            key={`pr-${ruleIndex}`}
                            className="space-y-1.5 rounded-md border border-border/60 bg-muted/20 p-2"
                          >
                            <div className="flex justify-between">
                              <span className="text-[11px] text-muted-foreground">
                                {t("panel.config.tableProgressRuleItem", { n: ruleIndex + 1 })}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 px-1.5 text-destructive"
                                onClick={() => {
                                  const next = (selectedColumn.widgetProps?.progressRules ?? []).filter(
                                    (_, i) => i !== ruleIndex
                                  );
                                  patchWidgetProps(selectedIndex, {
                                    progressRules: next.length ? next : undefined,
                                  });
                                }}
                              >
                                ×
                              </Button>
                            </div>
                            <ConditionEditor
                              value={rule.when}
                              showField={false}
                              fieldClass={fieldClass}
                              inputClass={inputClass}
                              onChange={(when) => {
                                const next = [...(selectedColumn.widgetProps?.progressRules ?? [])];
                                next[ruleIndex] = { ...rule, when };
                                patchWidgetProps(selectedIndex, { progressRules: next });
                              }}
                            />
                            <label className={fieldClass}>
                              {fieldLabel("panel.config.tableProgressRuleValue")}
                              <Input
                                value={String(rule.value ?? "")}
                                onChange={(e) => {
                                  const next = [...(selectedColumn.widgetProps?.progressRules ?? [])];
                                  next[ruleIndex] = {
                                    ...rule,
                                    value: parseLeafValue(e.target.value) as number | string,
                                  };
                                  patchWidgetProps(selectedIndex, { progressRules: next });
                                }}
                                className={inputClass}
                              />
                            </label>
                          </div>
                      ))}
                    </div>
                  ) : null}
                  <label className={fieldClass}>
                    {fieldLabel("panel.config.tableProgressDisplay", "panel.config.tableProgressDisplayHint")}
                    <Select
                      value={
                        selectedColumn.widgetProps?.progressDisplay ??
                        (selectedColumn.widgetProps?.showLabel === false ? "bar" : "barLabel")
                      }
                      onValueChange={(value) =>
                        patchWidgetProps(selectedIndex, {
                          progressDisplay: value as NonNullable<TableWidgetProps["progressDisplay"]>,
                          showLabel: undefined,
                        })
                      }
                    >
                      <SelectTrigger className={inputClass}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="barLabel">{t("panel.config.tableProgressDisplayBarLabel")}</SelectItem>
                        <SelectItem value="bar">{t("panel.config.tableProgressDisplayBar")}</SelectItem>
                        <SelectItem value="label">{t("panel.config.tableProgressDisplayLabel")}</SelectItem>
                        <SelectItem value="circle">{t("panel.config.tableProgressDisplayCircle")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={fieldClass}>
                      {fieldLabel("panel.config.tableProgressMax")}
                      <Input
                        type="number"
                        min={1}
                        value={selectedColumn.widgetProps?.max ?? 100}
                        onChange={(e) =>
                          patchWidgetProps(selectedIndex, {
                            max: Math.max(1, Number(e.target.value) || 100),
                          })
                        }
                        className={inputClass}
                      />
                    </label>
                    {(selectedColumn.widgetProps?.progressDisplay ?? "barLabel") === "circle" ? (
                      <label className={fieldClass}>
                        {fieldLabel("panel.config.tableProgressSize")}
                        <Input
                          type="number"
                          min={16}
                          max={64}
                          value={selectedColumn.widgetProps?.progressSize ?? 28}
                          onChange={(e) =>
                            patchWidgetProps(selectedIndex, {
                              progressSize: Math.max(16, Math.min(64, Number(e.target.value) || 28)),
                            })
                          }
                          className={inputClass}
                        />
                      </label>
                    ) : (
                      <div />
                    )}
                  </div>
                </>
              ) : null}

              {selectedColumn.widget === "tag" || selectedColumn.widget === "badge" ? (
                <>
                  {colorField(
                    "panel.config.tableTagColor",
                    selectedColumn.widgetProps?.color ?? "",
                    (next) =>
                      patchWidgetProps(selectedIndex, {
                        color: next || undefined,
                      }),
                    "panel.config.tableTagColorHint",
                    "#3b82f6"
                  )}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <span>{t("panel.config.tableColorMap")}</span>
                        <ConfigHintIcon label={t("panel.config.tableColorMap")}>
                          <div>{t("panel.config.tableColorMapHint")}</div>
                        </ConfigHintIcon>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-[11px]"
                        onClick={() => {
                          const entry: TableColorMapEntry = { value: "", color: "#3b82f6" };
                          patchWidgetProps(selectedIndex, {
                            colorMapEntries: [
                              ...(selectedColumn.widgetProps?.colorMapEntries ?? []),
                              entry,
                            ],
                          });
                        }}
                      >
                        {t("panel.config.tableAddColorMap")}
                      </Button>
                    </div>
                    {(selectedColumn.widgetProps?.colorMapEntries ?? []).map((entry, entryIndex) => (
                      <div
                        key={`cm-${entryIndex}`}
                        className="grid grid-cols-[1fr_1fr_auto] items-end gap-1.5 rounded-md border border-border/60 bg-muted/20 p-2"
                      >
                        <label className={fieldClass}>
                          {fieldLabel("panel.config.tableColorMapValue")}
                          <Input
                            value={entry.value}
                            onChange={(e) => {
                              const next = [...(selectedColumn.widgetProps?.colorMapEntries ?? [])];
                              next[entryIndex] = { ...entry, value: e.target.value };
                              patchWidgetProps(selectedIndex, { colorMapEntries: next });
                            }}
                            placeholder="ok"
                            className={inputClass}
                          />
                        </label>
                        {colorField(
                          "panel.config.tableColorMapColor",
                          entry.color,
                          (nextColor) => {
                            const next = [...(selectedColumn.widgetProps?.colorMapEntries ?? [])];
                            next[entryIndex] = { ...entry, color: nextColor };
                            patchWidgetProps(selectedIndex, { colorMapEntries: next });
                          },
                          undefined,
                          "#3b82f6"
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-1.5 text-destructive"
                          onClick={() => {
                            const next = (selectedColumn.widgetProps?.colorMapEntries ?? []).filter(
                              (_, i) => i !== entryIndex
                            );
                            patchWidgetProps(selectedIndex, {
                              colorMapEntries: next.length ? next : undefined,
                            });
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}

              {selectedColumn.widget === "boolean" ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={fieldClass}>
                      {fieldLabel("panel.config.tableBooleanTrueLabel")}
                      <Input
                        value={selectedColumn.widgetProps?.trueLabel ?? ""}
                        onChange={(e) =>
                          patchWidgetProps(selectedIndex, {
                            trueLabel: e.target.value || undefined,
                          })
                        }
                        className={inputClass}
                      />
                    </label>
                    <label className={fieldClass}>
                      {fieldLabel("panel.config.tableBooleanFalseLabel")}
                      <Input
                        value={selectedColumn.widgetProps?.falseLabel ?? ""}
                        onChange={(e) =>
                          patchWidgetProps(selectedIndex, {
                            falseLabel: e.target.value || undefined,
                          })
                        }
                        className={inputClass}
                      />
                    </label>
                  </div>
                  <label className={fieldClass}>
                    {fieldLabel("panel.config.tableActionOnTrue", "panel.config.tableActionBlueprintHint")}
                    <BlueprintNodeSelect
                      value={selectedColumn.widgetProps?.actions?.onTrueBlueprintNodeId}
                      options={blueprintNodeOptions}
                      className={inputClass}
                      noneLabel={t("panel.config.tableActionBlueprintNone")}
                      onChange={(next) =>
                        patchWidgetProps(selectedIndex, {
                          actions: {
                            ...(selectedColumn.widgetProps?.actions ?? {}),
                            onTrueBlueprintNodeId: next,
                          },
                        })
                      }
                    />
                  </label>
                  <label className={fieldClass}>
                    {fieldLabel("panel.config.tableActionOnFalse", "panel.config.tableActionBlueprintHint")}
                    <BlueprintNodeSelect
                      value={selectedColumn.widgetProps?.actions?.onFalseBlueprintNodeId}
                      options={blueprintNodeOptions}
                      className={inputClass}
                      noneLabel={t("panel.config.tableActionBlueprintNone")}
                      onChange={(next) =>
                        patchWidgetProps(selectedIndex, {
                          actions: {
                            ...(selectedColumn.widgetProps?.actions ?? {}),
                            onFalseBlueprintNodeId: next,
                          },
                        })
                      }
                    />
                  </label>
                </>
              ) : null}

            </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <span>{t("panel.config.tableValueMap")}</span>
                <ConfigHintIcon label={t("panel.config.tableValueMap")}>
                  <div>
                    {selectedColumn.widget === "boolean"
                      ? t("panel.config.tableValueMapBooleanHint")
                      : t("panel.config.tableValueMapHint")}
                  </div>
                </ConfigHintIcon>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-[11px]"
                onClick={() => {
                  const rule: TableValueMapRule = {
                    when: createDefaultCondition(),
                    value: selectedColumn.widget === "boolean" ? true : "",
                  };
                  updateColumnAt(selectedIndex, {
                    valueMap: [...(selectedColumn.valueMap ?? []), rule],
                  });
                }}
              >
                {t("panel.config.tableAddValueMap")}
              </Button>
            </div>
            {selectedColumn.widget === "boolean" && booleanValueMapConflicts.length > 0 ? (
              <div className="rounded-md border border-amber-300/70 bg-amber-50 px-2 py-1.5 text-[11px] text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-200">
                {booleanValueMapConflicts.map((conflict) => (
                  <div key={conflict.key}>
                    {t("panel.config.tableValueMapBooleanConflict", {
                      indexes: conflict.ruleIndexes.join(", "),
                    })}
                  </div>
                ))}
              </div>
            ) : null}
            {(selectedColumn.valueMap ?? []).map((rule, ruleIndex) => (
                <div
                  key={`vm-${ruleIndex}`}
                  className="space-y-2 rounded-md border border-border/60 bg-muted/20 p-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[11px] font-medium text-muted-foreground">
                      {t("panel.config.tableMapItem", { n: ruleIndex + 1 })}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-1.5 text-[11px] text-destructive"
                      onClick={() => {
                        const next = (selectedColumn.valueMap ?? []).filter((_, i) => i !== ruleIndex);
                        updateColumnAt(selectedIndex, { valueMap: next.length ? next : undefined });
                      }}
                    >
                      ×
                    </Button>
                  </div>
                  <ConditionEditor
                    value={rule.when}
                    showField={false}
                    fieldClass={fieldClass}
                    inputClass={inputClass}
                    onChange={(when) => {
                      const next = [...(selectedColumn.valueMap ?? [])];
                      next[ruleIndex] = { ...rule, when };
                      updateColumnAt(selectedIndex, { valueMap: next });
                    }}
                  />
                  <label className={fieldClass}>
                    {selectedColumn.widget === "boolean"
                      ? fieldLabel("panel.config.tableDisplayBoolean", "panel.config.tableDisplayBooleanHint")
                      : fieldLabel("panel.config.tableDisplayValue", "panel.config.tableDisplayValueHint")}
                    {selectedColumn.widget === "boolean" ? (
                      <Select
                        value={booleanMapSelectValue(rule.value)}
                        onValueChange={(value) => {
                          const next = [...(selectedColumn.valueMap ?? [])];
                          next[ruleIndex] = {
                            ...rule,
                            value: value === "true",
                          };
                          updateColumnAt(selectedIndex, { valueMap: next });
                        }}
                      >
                        <SelectTrigger className={inputClass}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">{t("panel.config.tableBooleanYes")}</SelectItem>
                          <SelectItem value="false">{t("panel.config.tableBooleanNo")}</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={leafValueText(rule.value)}
                        onChange={(e) => {
                          const next = [...(selectedColumn.valueMap ?? [])];
                          next[ruleIndex] = {
                            ...rule,
                            value: e.target.value,
                          };
                          updateColumnAt(selectedIndex, { valueMap: next });
                        }}
                        placeholder="{current}"
                        className={inputClass}
                      />
                    )}
                  </label>
                </div>
            ))}
            <label className={fieldClass}>
              {fieldLabel("panel.config.tableDisplayTemplate", "panel.config.tableDisplayTemplateHint")}
              <Input
                value={selectedColumn.displayTemplate ?? ""}
                onChange={(e) =>
                  updateColumnAt(selectedIndex, {
                    displayTemplate: e.target.value.trim() ? e.target.value : undefined,
                  })
                }
                placeholder="{current}分"
                className={inputClass}
              />
            </label>
          </div>

          <div className="space-y-2 border-t border-border/50 pt-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <span>{t("panel.config.tableCellStyleRules")}</span>
                <ConfigHintIcon label={t("panel.config.tableCellStyleRules")}>
                  <div>{t("panel.config.tableCellStyleRulesHint")}</div>
                </ConfigHintIcon>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-[11px]"
                onClick={() => {
                  const rule: TableStyleRule = {
                    when: createDefaultCondition(),
                    style: { backgroundColor: "#fef3c7" },
                  };
                  updateColumnAt(selectedIndex, {
                    cellStyleRules: [...(selectedColumn.cellStyleRules ?? []), rule],
                  });
                }}
              >
                {t("panel.config.tableAddCellStyleRule")}
              </Button>
            </div>
            {(selectedColumn.cellStyleRules?.length
              ? selectedColumn.cellStyleRules
              : [
                  {
                    when: createDefaultCondition(),
                    style: { backgroundColor: "" },
                  },
                ]
            ).map((rule, ruleIndex) => {
              const isPlaceholder = !(selectedColumn.cellStyleRules?.length);
              return (
                <div key={`csr-${ruleIndex}`} className="space-y-2 rounded-md border border-border/60 bg-muted/20 p-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[11px] font-medium text-muted-foreground">
                      {t("panel.config.tableStyleRuleItem", { n: ruleIndex + 1 })}
                    </div>
                    {!isPlaceholder ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-1.5 text-[11px] text-destructive"
                        onClick={() => {
                          const next = (selectedColumn.cellStyleRules ?? []).filter(
                            (_, i) => i !== ruleIndex
                          );
                          updateColumnAt(selectedIndex, {
                            cellStyleRules: next.length ? next : undefined,
                          });
                        }}
                      >
                        ×
                      </Button>
                    ) : null}
                  </div>
                  <ConditionEditor
                    value={rule.when}
                    showField={true}
                    fieldClass={fieldClass}
                    inputClass={inputClass}
                    onChange={(when) => {
                      const base = selectedColumn.cellStyleRules ?? [
                        { when: createDefaultCondition(), style: {} },
                      ];
                      const next = [...base];
                      next[ruleIndex] = { ...rule, when };
                      updateColumnAt(selectedIndex, { cellStyleRules: next });
                    }}
                  />
                  {colorField(
                    "panel.config.tableBgColor",
                    rule.style?.backgroundColor ?? "",
                    (nextColor) => {
                      const base = selectedColumn.cellStyleRules ?? [
                        { when: createDefaultCondition(), style: {} },
                      ];
                      const next = [...base];
                      next[ruleIndex] = {
                        ...rule,
                        style: {
                          ...(rule.style ?? {}),
                          backgroundColor: nextColor || undefined,
                        },
                      };
                      updateColumnAt(selectedIndex, { cellStyleRules: next });
                    },
                    "panel.config.tableBgColorHint",
                    "#fef3c7"
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="space-y-2.5 rounded-lg border border-border/55 bg-background/80 p-2.5">
        {groupTitle("panel.config.groupTableAppearance", "panel.config.groupTableAppearanceHint")}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <label className="flex items-center gap-2 text-[11px]">
            <Switch
              checked={table.showHeader ?? true}
              onCheckedChange={(checked) => patchTable({ showHeader: checked })}
            />
            <span>{t("panel.config.tableShowHeader")}</span>
          </label>
          <label className="flex items-center gap-2 text-[11px]">
            <Switch
              checked={table.stripe ?? false}
              onCheckedChange={(checked) => patchTable({ stripe: checked })}
            />
            <span className="inline-flex items-center gap-1">
              {t("panel.config.tableStripe")}
              <ConfigHintIcon label={t("panel.config.tableStripe")}>
                <div>{t("panel.config.tableStripeHint")}</div>
              </ConfigHintIcon>
            </span>
          </label>
        </div>
        <label className={fieldClass}>
          {fieldLabel("panel.config.tableRowHeight", "panel.config.tableRowHeightHint")}
          <Input
            type="number"
            min={20}
            max={120}
            value={table.rowHeight ?? 36}
            onChange={(e) =>
              patchTable({
                rowHeight: Math.max(20, Math.min(120, Number(e.target.value) || 36)),
              })
            }
            className={inputClass}
          />
        </label>
        <div className="grid grid-cols-2 gap-2">
          {colorField(
            "panel.config.tableBodyBg",
            table.tableStyle?.backgroundColor ?? "",
            (next) => patchTableStyle({ backgroundColor: next || undefined }),
            "panel.config.tableBodyBgHint",
            "#ffffff",
            true
          )}
          {colorField(
            "panel.config.tableStyleColor",
            table.tableStyle?.color ?? "",
            (next) => patchTableStyle({ color: next || undefined }),
            undefined,
            "#111827"
          )}
          <label className={fieldClass}>
            {fieldLabel("panel.config.tableStyleFontSize")}
            <Input
              type="number"
              min={8}
              max={48}
              value={table.tableStyle?.fontSize ?? 12}
              onChange={(e) =>
                patchTableStyle({
                  fontSize: Math.max(8, Math.min(48, Number(e.target.value) || 12)),
                })
              }
              className={inputClass}
            />
          </label>
          {colorField(
            "panel.config.tableHeaderBg",
            table.headerStyle?.backgroundColor ?? "",
            (next) => patchHeaderStyle({ backgroundColor: next || undefined }),
            "panel.config.tableHeaderBgHint",
            "#f3f4f6",
            true
          )}
          <label className={fieldClass}>
            {fieldLabel("panel.config.tableHeaderFontSize")}
            <Input
              type="number"
              min={8}
              max={48}
              value={table.headerStyle?.fontSize ?? 12}
              onChange={(e) =>
                patchHeaderStyle({
                  fontSize: Math.max(8, Math.min(48, Number(e.target.value) || 12)),
                })
              }
              className={inputClass}
            />
          </label>
        </div>
      </div>

      <div className="space-y-2.5 rounded-lg border border-border/55 bg-background/80 p-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <div className="text-[11px] font-semibold text-muted-foreground">
              {t("panel.config.tableRowStyleRules")}
            </div>
            <ConfigHintIcon label={t("panel.config.tableRowStyleRules")}>
              <div>{t("panel.config.tableRowStyleRulesHint")}</div>
            </ConfigHintIcon>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2 text-[11px]"
            onClick={() => {
              const rule: TableStyleRule = {
                when: createDefaultCondition(),
                style: { backgroundColor: "#ecfccb" },
              };
              patchTable({
                rowStyleRules: [...(table.rowStyleRules ?? []), rule],
              });
            }}
          >
            {t("panel.config.tableAddRowStyleRule")}
          </Button>
        </div>
        {(table.rowStyleRules ?? []).map((rule, ruleIndex) => (
            <div key={`rsr-${ruleIndex}`} className="space-y-2 rounded-md border border-border/60 bg-muted/20 p-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] font-medium text-muted-foreground">
                  {t("panel.config.tableStyleRuleItem", { n: ruleIndex + 1 })}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-1.5 text-[11px] text-destructive"
                  onClick={() => {
                    const next = (table.rowStyleRules ?? []).filter((_, i) => i !== ruleIndex);
                    patchTable({ rowStyleRules: next.length ? next : undefined });
                  }}
                >
                  ×
                </Button>
              </div>
              <ConditionEditor
                value={rule.when}
                showField={true}
                fieldClass={fieldClass}
                inputClass={inputClass}
                onChange={(when) => {
                  const next = [...(table.rowStyleRules ?? [])];
                  next[ruleIndex] = { ...rule, when };
                  patchTable({ rowStyleRules: next });
                }}
              />
              {colorField(
                "panel.config.tableBgColor",
                rule.style?.backgroundColor ?? "",
                (nextColor) => {
                  const next = [...(table.rowStyleRules ?? [])];
                  next[ruleIndex] = {
                    ...rule,
                    style: {
                      ...(rule.style ?? {}),
                      backgroundColor: nextColor || undefined,
                    },
                  };
                  patchTable({ rowStyleRules: next });
                },
                "panel.config.tableBgColorHint",
                "#ecfccb",
                true
              )}
            </div>
        ))}
        {(table.rowStyleRules ?? []).length === 0 ? (
          <div className="text-[11px] text-muted-foreground">
            {t("panel.config.tableNoRowStyleRules")}
          </div>
        ) : null}
      </div>
    </fieldset>

    <Dialog open={rowsEditorOpen} onOpenChange={setRowsEditorOpen}>
      <DialogContent
        movable={false}
        resizable={false}
        className="z-[10150] !flex h-[min(78vh,560px)] max-h-[min(78vh,560px)] w-[min(94vw,680px)] max-w-[680px] !flex-col gap-0 overflow-hidden border-border/60 bg-background p-0 shadow-2xl sm:rounded-xl"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "min(78vh, 560px)",
          maxHeight: "min(78vh, 560px)",
          overflow: "hidden",
          padding: 0,
          gap: 0,
        }}
      >
        <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
          <DialogHeader className="shrink-0 space-y-0.5 border-b border-border/50 px-4 py-2.5 pr-12 text-left">
            <DialogTitle className="text-[14px] font-semibold tracking-tight">
              {t("panel.config.tableRowsEditTitle")}
            </DialogTitle>
            <DialogDescription className="text-[12px] leading-4 text-muted-foreground">
              {t("panel.config.tableRowsEditDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="relative min-h-0 flex-1 overflow-hidden">
            <div className="absolute inset-0 p-2">
              <JsonCodeEditor
                className="h-full w-full"
                value={rowsEditorDraft}
                onChange={(v) => {
                  setRowsEditorDraft(v);
                  setRowsEditorError(null);
                }}
              />
            </div>
          </div>

          {rowsEditorError ? (
            <div className="shrink-0 px-4 py-1.5 text-[12px] text-destructive">
              {rowsEditorError}
            </div>
          ) : null}

          <DialogFooter className="shrink-0 flex-row justify-end gap-2 border-t border-border/50 bg-muted/20 px-3 py-2 sm:space-x-0">
            <Button
              type="button"
              variant="ghost"
              className="h-8 rounded-md px-3"
              onClick={() => setRowsEditorOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              className="h-8 rounded-md px-4"
              onClick={() => {
                const trimmed = rowsEditorDraft.trim();
                if (!trimmed) {
                  patchTable({ rowsText: "" });
                  setRowsEditorOpen(false);
                  return;
                }
                try {
                  const parsed = JSON.parse(trimmed);
                  if (!Array.isArray(parsed)) {
                    setRowsEditorError(t("panel.config.tableRowsEditNeedArray"));
                    return;
                  }
                  patchTable({ rowsText: JSON.stringify(parsed, null, 2) });
                  setRowsEditorOpen(false);
                } catch {
                  setRowsEditorError(t("panel.config.tableRowsEditInvalidJson"));
                }
              }}
            >
              {t("common.save")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={mockOpen} onOpenChange={setMockOpen}>
      <DialogContent className="z-[10150] max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("panel.config.tableRowsMockTitle")}</DialogTitle>
          <DialogDescription>{t("panel.config.tableRowsMockDesc")}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          <label className={fieldClass}>
            {fieldLabel("panel.config.tableMockRowCount")}
            <Input
              type="number"
              min={1}
              max={200}
              value={mockRowCount}
              onChange={(e) =>
                setMockRowCount(Math.max(1, Math.min(200, Number(e.target.value) || 5)))
              }
              className={inputClass}
            />
          </label>
          <label className={fieldClass}>
            {fieldLabel("panel.config.tableMockLocale")}
            <Select
              value={mockLocale}
              onValueChange={(v) => setMockLocale(v as TableMockLocale)}
            >
              <SelectTrigger className={inputClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh">{t("panel.config.tableMockLocaleZh")}</SelectItem>
                <SelectItem value="en">{t("panel.config.tableMockLocaleEn")}</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className={fieldClass}>
            {fieldLabel("panel.config.tableMockNamePrefix")}
            <Input
              value={mockNamePrefix}
              onChange={(e) => setMockNamePrefix(e.target.value)}
              placeholder="Demo"
              className={inputClass}
            />
          </label>
          <label className={fieldClass}>
            {fieldLabel("panel.config.tableMockSeed")}
            <Input
              value={mockSeed}
              onChange={(e) => setMockSeed(e.target.value)}
              placeholder="optional"
              className={inputClass}
            />
          </label>
          <label className={`${fieldClass} col-span-2`}>
            {fieldLabel("panel.config.tableMockStatusValues")}
            <Input
              value={mockStatusValues}
              onChange={(e) => setMockStatusValues(e.target.value)}
              placeholder="active,idle,pending"
              className={inputClass}
            />
          </label>
          <label className={fieldClass}>
            {fieldLabel("panel.config.tableMockScoreMin")}
            <Input
              type="number"
              value={mockScoreMin}
              onChange={(e) => setMockScoreMin(Number(e.target.value) || 0)}
              className={inputClass}
            />
          </label>
          <label className={fieldClass}>
            {fieldLabel("panel.config.tableMockScoreMax")}
            <Input
              type="number"
              value={mockScoreMax}
              onChange={(e) => setMockScoreMax(Number(e.target.value) || 100)}
              className={inputClass}
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
          <label className="flex items-center gap-2 text-[11px]">
            <Switch checked={mockIncludeId} onCheckedChange={setMockIncludeId} />
            <span>{t("panel.config.tableMockIncludeId")}</span>
          </label>
          <label className="flex items-center gap-2 text-[11px]">
            <Switch checked={mockIncludeTimestamp} onCheckedChange={setMockIncludeTimestamp} />
            <span>{t("panel.config.tableMockIncludeTimestamp")}</span>
          </label>
          <label className="flex items-center gap-2 text-[11px]">
            <Switch checked={mockIncludeExtras} onCheckedChange={setMockIncludeExtras} />
            <span>{t("panel.config.tableMockIncludeExtras")}</span>
          </label>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setMockOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            onClick={() => {
              const rows = generateMockTableRows(columns, {
                rowCount: mockRowCount,
                seed: mockSeed || undefined,
                namePrefix: mockNamePrefix || undefined,
                locale: mockLocale,
                includeId: mockIncludeId,
                includeTimestamp: mockIncludeTimestamp,
                includeExtras: mockIncludeExtras,
                statusValues: mockStatusValues.split(/[,，]/),
                scoreMin: mockScoreMin,
                scoreMax: mockScoreMax,
              });
              patchTable({ rowsText: stringifyMockTableRows(rows) });
              setMockOpen(false);
            }}
          >
            {t("panel.config.tableMockGenerate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
