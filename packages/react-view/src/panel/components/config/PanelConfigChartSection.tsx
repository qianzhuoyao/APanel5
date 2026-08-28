import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@arronqzy/i18n/react";
import {
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@arronqzy/ui";
import type { PanelChartConfig, PanelElement } from "../../types";
import { buildChartOption, getChartLabelsDisplayText, getChartValuesDisplayText } from "../../utils/chartOptionBuilder";
import { ConfigHintIcon } from "../ConfigHintIcon";
import {
  type ConfigSectionHelpers,
  type UpdateElement,
  mergeOptionPatch,
  patchChart,
} from "./helpers";

export function PanelConfigChartSection({
  element,
  helpers,
  updateElement,
}: {
  element: PanelElement;
  helpers: ConfigSectionHelpers;
  updateElement: UpdateElement;
}) {
  const { t } = useI18n();
  const {
    renderSection,
    renderFieldGroup,
    renderColorField,
    hasSearch,
    isSectionExpanded,
    setSectionExpanded,
    optionCheckboxClass,
    optionInputClass,
    optionSelectTriggerClass,
    renderOptionLabel,
    renderFormatterLabel,
  } = helpers;
  const optionLabelTextClass = "truncate whitespace-nowrap text-[11px] leading-none";
  const selectedElement = element;
  const [isAdvancedOptionMode, setIsAdvancedOptionMode] = useState(false);
  const [optionJsonText, setOptionJsonText] = useState("{}");
  const [optionJsonError, setOptionJsonError] = useState<string | null>(null);

  const selectedChartType = (selectedElement.materialType ?? "") as
    | "bar"
    | "line"
    | "pie"
    | "area"
    | "scatter"
    | "radar"
    | "gauge"
    | "funnel"
    | "";

  const updateSelectedChart = useCallback(
    (patch: Partial<PanelChartConfig>) => {
      updateElement(selectedElement.id, {
        chart: patchChart(selectedElement.chart, patch),
      });
    },
    [selectedElement, updateElement]
  );

  const updateSelectedOptionForm = useCallback(
    (patch: Record<string, unknown>) => {
      updateSelectedChart({
        option: mergeOptionPatch(
          (selectedElement.chart?.option as Record<string, unknown> | undefined) ?? {},
          patch
        ),
      });
    },
    [selectedElement, updateSelectedChart]
  );

  useEffect(() => {
    setOptionJsonText(JSON.stringify(buildChartOption(selectedElement), null, 2));
    setOptionJsonError(null);
  }, [selectedElement]);

  return (
    <>
              {renderSection(
                "chartBasic",
                t("panel.config.sectionChartBasic"),
                <>
                  {renderFieldGroup(
                    t("panel.config.groupBasicDisplay"),
                    <>
                      <label className="block space-y-1.5" data-config-field="chart.title">
                        <div>{t("panel.config.title")}</div>
                        <Input
                          value={selectedElement.chart?.title ?? ""}
                          onChange={(e) => updateSelectedChart({ title: e.target.value })}
                          className="h-7"
                        />
                      </label>

                      {renderColorField(
                        t("panel.config.primaryColor"),
                        selectedElement.chart?.color ?? "#3b82f6",
                        (next) => updateSelectedChart({ color: next || "#3b82f6" })
                      )}
                    </>
                  )}
                  {renderFieldGroup(
                    t("panel.config.groupData"),
                    <>
                      <label className="block space-y-1">
                        <div>{t("panel.config.labelsCsv")}</div>
                        <Input
                          value={getChartLabelsDisplayText(selectedElement.chart)}
                          onChange={(e) =>
                            updateSelectedChart({
                              labelsText: e.target.value,
                            })
                          }
                          className="h-7"
                        />
                      </label>

                      <label className="block space-y-1">
                        <div>{t("panel.config.valuesCsv")}</div>
                        <Input
                          value={getChartValuesDisplayText(selectedElement.chart)}
                          onChange={(e) =>
                            updateSelectedChart({
                              valuesText: e.target.value,
                            })
                          }
                          className="h-7"
                        />
                      </label>
                    </>
                  )}

                  {selectedChartType === "bar" ||
                  selectedChartType === "line" ||
                  selectedChartType === "area" ||
                  selectedChartType === "pie" ? (
                    renderFieldGroup(
                      t("panel.config.groupSeries"),
                      <>
                        {selectedChartType === "bar" ? (
                          <label className="block space-y-1">
                            <div>{t("panel.config.barWidthPx")}</div>
                            <Input
                              type="number"
                              min={1}
                              placeholder={t("panel.config.barWidthAuto")}
                              value={selectedElement.chart?.barWidth ?? ""}
                              onChange={(e) => {
                                const raw = e.target.value.trim();
                                updateSelectedChart({
                                  barWidth: raw
                                    ? Math.max(1, Number(raw) || 1)
                                    : undefined,
                                });
                              }}
                              className="h-7"
                            />
                          </label>
                        ) : null}

                        {selectedChartType === "line" || selectedChartType === "area" ? (
                          <label className="flex items-center gap-2">
                            <Checkbox
                              checked={selectedElement.chart?.smooth ?? true}
                              className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                              onCheckedChange={(checked) =>
                                updateSelectedChart({ smooth: checked === true })
                              }
                            />
                            <span>{t("panel.config.smooth")}</span>
                          </label>
                        ) : null}

                        {selectedChartType === "pie" ? (
                          <div className="grid grid-cols-2 gap-2">
                            <label className="block space-y-1">
                              <div>{t("panel.config.pieInnerRadiusPct")}</div>
                              <Input
                                type="number"
                                min={0}
                                max={99}
                                value={selectedElement.chart?.pieInnerRadius ?? 30}
                                onChange={(e) =>
                                  updateSelectedChart({
                                    pieInnerRadius: Math.max(
                                      0,
                                      Math.min(99, Number(e.target.value) || 0)
                                    ),
                                  })
                                }
                                className="h-7"
                              />
                            </label>
                            <label className="block space-y-1">
                              <div>{t("panel.config.pieOuterRadiusPct")}</div>
                              <Input
                                type="number"
                                min={1}
                                max={100}
                                value={selectedElement.chart?.pieOuterRadius ?? 65}
                                onChange={(e) =>
                                  updateSelectedChart({
                                    pieOuterRadius: Math.max(
                                      1,
                                      Math.min(100, Number(e.target.value) || 1)
                                    ),
                                  })
                                }
                                className="h-7"
                              />
                            </label>
                          </div>
                        ) : null}
                      </>
                    )
                  ) : null}
                  {renderFieldGroup(
                    t("panel.config.groupChartDisplayMore"),
                    <>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedElement.chart?.colorMode === "gradient"}
                          onCheckedChange={(checked) =>
                            updateSelectedChart({ colorMode: checked ? "gradient" : "solid" })
                          }
                        />
                        <span>{t("panel.config.usePrimaryGradient")}</span>
                      </label>
                      {selectedElement.chart?.colorMode === "gradient" ? (
                        <div className="grid grid-cols-2 gap-2">
                          {renderColorField(
                            t("panel.config.gradientFrom"),
                            selectedElement.chart?.gradientFrom ?? selectedElement.chart?.color ?? "#3b82f6",
                            (next) => updateSelectedChart({ gradientFrom: next || "#3b82f6" })
                          )}
                          {renderColorField(
                            t("panel.config.gradientTo"),
                            selectedElement.chart?.gradientTo ?? "#22d3ee",
                            (next) => updateSelectedChart({ gradientTo: next || "#22d3ee" })
                          )}
                          <label className="block space-y-1 col-span-2">
                            <div>{t("panel.config.gradientDirection")}</div>
                            <Select
                              value={selectedElement.chart?.gradientDirection ?? "to-right"}
                              onValueChange={(value) =>
                                updateSelectedChart({
                                  gradientDirection: value as
                                    | "to-right"
                                    | "to-bottom"
                                    | "to-bottom-right"
                                    | "to-top-right",
                                })
                              }
                            >
                              <SelectTrigger className="h-7">
                                <SelectValue placeholder={t("panel.config.selectGradientDirection")} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="to-right">{t("panel.config.dirToRight")}</SelectItem>
                                <SelectItem value="to-bottom">{t("panel.config.dirToBottom")}</SelectItem>
                                <SelectItem value="to-bottom-right">{t("panel.config.dirToBottomRight")}</SelectItem>
                                <SelectItem value="to-top-right">{t("panel.config.dirToTopRight")}</SelectItem>
                              </SelectContent>
                            </Select>
                          </label>
                          <div className="col-span-2 space-y-1">
                            <div className="text-[11px] text-muted-foreground">{t("panel.config.gradientPreview")}</div>
                            <div
                              className="h-6 rounded border border-border/60"
                              style={{
                                backgroundImage: `linear-gradient(${
                                  (selectedElement.chart?.gradientDirection ?? "to-right") === "to-bottom"
                                    ? "to bottom"
                                    : (selectedElement.chart?.gradientDirection ?? "to-right") === "to-bottom-right"
                                      ? "to bottom right"
                                      : (selectedElement.chart?.gradientDirection ?? "to-right") === "to-top-right"
                                        ? "to top right"
                                        : "to right"
                                }, ${selectedElement.chart?.gradientFrom ?? selectedElement.chart?.color ?? "#3b82f6"}, ${selectedElement.chart?.gradientTo ?? "#22d3ee"})`,
                              }}
                            />
                          </div>
                        </div>
                      ) : null}
                      <label className="block space-y-1.5">
                        <div>{t("panel.config.renderMode")}</div>
                        <Select
                          value={selectedElement.chart?.renderMode ?? "canvas"}
                          onValueChange={(value) =>
                            updateSelectedChart({ renderMode: value as "canvas" | "svg" })
                          }
                        >
                          <SelectTrigger className="h-7">
                            <SelectValue placeholder={t("panel.config.selectRenderMode")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="canvas">Canvas</SelectItem>
                            <SelectItem value="svg">SVG</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>
                    </>,
                    undefined,
                    { groupKey: "chartDisplayMore", defaultOpen: false }
                  )}
                  {renderFieldGroup(
                    t("panel.config.groupTooltip"),
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedElement.chart?.tooltipShow ?? true}
                            className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                            onCheckedChange={(checked) =>
                              updateSelectedChart({ tooltipShow: checked === true })
                            }
                          />
                          <span>{t("panel.config.showTooltip")}</span>
                        </label>
                        <label className="block space-y-1">
                          <div>{t("panel.config.tooltipTrigger")}</div>
                          <Select
                            value={selectedElement.chart?.tooltipTrigger ?? "axis"}
                            onValueChange={(value) =>
                              updateSelectedChart({ tooltipTrigger: value as "axis" | "item" })
                            }
                          >
                            <SelectTrigger className="h-7">
                              <SelectValue placeholder={t("panel.config.selectTooltipTrigger")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="axis">axis</SelectItem>
                              <SelectItem value="item">item</SelectItem>
                            </SelectContent>
                          </Select>
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {renderColorField(
                          t("panel.config.tooltipBgColor"),
                          selectedElement.chart?.tooltipBackgroundColor ?? "#0f172a",
                          (next) => updateSelectedChart({ tooltipBackgroundColor: next || "#0f172a" })
                        )}
                        {renderColorField(
                          t("panel.config.tooltipTextColor"),
                          selectedElement.chart?.tooltipTextColor ?? "#f8fafc",
                          (next) => updateSelectedChart({ tooltipTextColor: next || "#f8fafc" })
                        )}
                      </div>
                      <label className="block space-y-1">
                        {renderFormatterLabel(t("panel.config.tooltipFormatter"))}
                        <Input
                          value={selectedElement.chart?.tooltipFormatter ?? ""}
                          onChange={(e) =>
                            updateSelectedChart({ tooltipFormatter: e.target.value || undefined })
                          }
                          placeholder={t("panel.config.tooltipFormatterPlaceholder")}
                          className="h-7"
                        />
                      </label>
                    </>,
                    undefined,
                    { groupKey: "chartTooltip", defaultOpen: false }
                  )}
                  {selectedChartType === "bar" ||
                  selectedChartType === "line" ||
                  selectedChartType === "area" ||
                  selectedChartType === "scatter" ? (
                    renderFieldGroup(
                      t("panel.config.groupAxes"),
                      <>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="block">
                          <div className="mb-1">{t("panel.config.xAxisName")}</div>
                          <Input
                            value={selectedElement.chart?.xAxisName ?? ""}
                            onChange={(e) => updateSelectedChart({ xAxisName: e.target.value })}
                            placeholder={t("panel.config.xAxisNamePlaceholder")}
                            className="h-7"
                          />
                        </label>
                        <label className="block">
                          <div className="mb-1">{t("panel.config.yAxisName")}</div>
                          <Input
                            value={selectedElement.chart?.yAxisName ?? ""}
                            onChange={(e) => updateSelectedChart({ yAxisName: e.target.value })}
                            placeholder={t("panel.config.yAxisNamePlaceholder")}
                            className="h-7"
                          />
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedElement.chart?.xAxisTickShow ?? true}
                            className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                            onCheckedChange={(checked) =>
                              updateSelectedChart({ xAxisTickShow: checked === true })
                            }
                          />
                          <span>{t("panel.config.xAxisTick")}</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedElement.chart?.yAxisTickShow ?? true}
                            className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                            onCheckedChange={(checked) =>
                              updateSelectedChart({ yAxisTickShow: checked === true })
                            }
                          />
                          <span>{t("panel.config.yAxisTick")}</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {renderColorField(
                          t("panel.config.xAxisTickColor"),
                          selectedElement.chart?.xAxisTickColor ?? "#94a3b8",
                          (next) => updateSelectedChart({ xAxisTickColor: next || "#94a3b8" })
                        )}
                        {renderColorField(
                          t("panel.config.yAxisTickColor"),
                          selectedElement.chart?.yAxisTickColor ?? "#94a3b8",
                          (next) => updateSelectedChart({ yAxisTickColor: next || "#94a3b8" })
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedElement.chart?.xAxisSplitLineShow ?? false}
                            className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                            onCheckedChange={(checked) =>
                              updateSelectedChart({ xAxisSplitLineShow: checked === true })
                            }
                          />
                          <span>{t("panel.config.xAxisSplitLine")}</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedElement.chart?.yAxisSplitLineShow ?? true}
                            className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                            onCheckedChange={(checked) =>
                              updateSelectedChart({ yAxisSplitLineShow: checked === true })
                            }
                          />
                          <span>{t("panel.config.yAxisSplitLine")}</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {renderColorField(
                          t("panel.config.xAxisSplitLineColor"),
                          selectedElement.chart?.xAxisSplitLineColor ?? "#e2e8f0",
                          (next) => updateSelectedChart({ xAxisSplitLineColor: next || "#e2e8f0" })
                        )}
                        {renderColorField(
                          t("panel.config.yAxisSplitLineColor"),
                          selectedElement.chart?.yAxisSplitLineColor ?? "#e2e8f0",
                          (next) => updateSelectedChart({ yAxisSplitLineColor: next || "#e2e8f0" })
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {renderColorField(
                          t("panel.config.xAxisLabelColor"),
                          selectedElement.chart?.xAxisLabelColor ?? "#64748b",
                          (next) => updateSelectedChart({ xAxisLabelColor: next || "#64748b" })
                        )}
                        {renderColorField(
                          t("panel.config.yAxisLabelColor"),
                          selectedElement.chart?.yAxisLabelColor ?? "#64748b",
                          (next) => updateSelectedChart({ yAxisLabelColor: next || "#64748b" })
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="block">
                          <div className="mb-1">{t("panel.config.xAxisLabelFontSize")}</div>
                          <Input
                            type="number"
                            min={8}
                            max={48}
                            value={selectedElement.chart?.xAxisLabelFontSize ?? 10}
                            onChange={(e) =>
                              updateSelectedChart({
                                xAxisLabelFontSize: Math.max(8, Math.min(48, Number(e.target.value) || 10)),
                              })
                            }
                            className="h-7"
                          />
                        </label>
                        <label className="block">
                          <div className="mb-1">{t("panel.config.yAxisLabelFontSize")}</div>
                          <Input
                            type="number"
                            min={8}
                            max={48}
                            value={selectedElement.chart?.yAxisLabelFontSize ?? 10}
                            onChange={(e) =>
                              updateSelectedChart({
                                yAxisLabelFontSize: Math.max(8, Math.min(48, Number(e.target.value) || 10)),
                              })
                            }
                            className="h-7"
                          />
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedElement.chart?.xAxisLabelAutoEllipsis ?? false}
                            className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                            onCheckedChange={(checked) =>
                              updateSelectedChart({ xAxisLabelAutoEllipsis: checked === true })
                            }
                          />
                          <span>{t("panel.config.xAxisLabelAutoEllipsis")}</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedElement.chart?.yAxisLabelAutoEllipsis ?? false}
                            className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                            onCheckedChange={(checked) =>
                              updateSelectedChart({ yAxisLabelAutoEllipsis: checked === true })
                            }
                          />
                          <span>{t("panel.config.yAxisLabelAutoEllipsis")}</span>
                        </label>
                      </div>
                      </>,
                      undefined,
                      { groupKey: "chartAxes", defaultOpen: false }
                    )
                  ) : null}

                </>,
                true,
                [
                  t("panel.config.searchKwChart"),
                  "title",
                  "tooltip",
                  t("panel.config.searchKwXAxis"),
                  t("panel.config.searchKwYAxis"),
                  "axis",
                  "label",
                  t("panel.config.searchKwTick"),
                  t("panel.config.searchKwSplit"),
                  "render",
                  "svg",
                  "canvas",
                ]
              )}

              {renderSection(
                "chartAdvanced",
                t("panel.config.sectionChartAdvanced"),
                <>
                  {renderFieldGroup(
                    t("panel.config.groupCommonForm"),
                    <div className="grid grid-cols-1 gap-2">
                      <div className="rounded-lg border border-border/60 bg-background/70 p-3">
                        <Collapsible
                          open={isSectionExpanded("chartAdvancedLayout", false)}
                          onOpenChange={(open) => setSectionExpanded("chartAdvancedLayout", open)}
                        >
                          <div className="mb-2 flex items-center gap-1.5">
                            <CollapsibleTrigger asChild>
                              <button
                                type="button"
                                className="flex h-5 w-5 items-center justify-center rounded text-[11px] hover:bg-accent"
                                aria-label={isSectionExpanded("chartAdvancedLayout", false) ? t("panel.config.collapseLayoutCoord") : t("panel.config.expandLayoutCoord")}
                              >
                                {isSectionExpanded("chartAdvancedLayout", false) ? "▾" : "▸"}
                              </button>
                            </CollapsibleTrigger>
                            <div className="text-[11px] font-medium text-muted-foreground">{t("panel.config.groupLayoutAndCoord")}</div>
                          </div>
                          <CollapsibleContent>
                            <div className="grid grid-cols-2 gap-2">
                          <label className="block space-y-1.5">
                            <div className={optionLabelTextClass}>{t("panel.config.gridLeftForm")}</div>
                            <Input type="number" className={optionInputClass} value={Number((selectedElement.chart?.option as any)?.grid?.left ?? 28)} onChange={(e) => updateSelectedOptionForm({ grid: { left: Number(e.target.value) || 0 } })} />
                          </label>
                          <label className="block space-y-1.5">
                            <div className={optionLabelTextClass}>{t("panel.config.gridRightForm")}</div>
                            <Input type="number" className={optionInputClass} value={Number((selectedElement.chart?.option as any)?.grid?.right ?? 10)} onChange={(e) => updateSelectedOptionForm({ grid: { right: Number(e.target.value) || 0 } })} />
                          </label>
                          <label className="block space-y-1.5">
                            <div className={optionLabelTextClass}>{t("panel.config.gridTopForm")}</div>
                            <Input type="number" className={optionInputClass} value={Number((selectedElement.chart?.option as any)?.grid?.top ?? 30)} onChange={(e) => updateSelectedOptionForm({ grid: { top: Number(e.target.value) || 0 } })} />
                          </label>
                          <label className="block space-y-1.5">
                            <div className={optionLabelTextClass}>{t("panel.config.gridBottomForm")}</div>
                            <Input type="number" className={optionInputClass} value={Number((selectedElement.chart?.option as any)?.grid?.bottom ?? 20)} onChange={(e) => updateSelectedOptionForm({ grid: { bottom: Number(e.target.value) || 0 } })} />
                          </label>
                          <label className="block space-y-1.5">
                            <div className={optionLabelTextClass}>{t("panel.config.legendPositionForm")}</div>
                            <Select value={String((selectedElement.chart?.option as any)?.legend?.top ?? "top")} onValueChange={(value) => updateSelectedOptionForm({ legend: { top: value } })}>
                              <SelectTrigger className={optionSelectTriggerClass}><SelectValue placeholder={t("panel.config.selectLegendPosition")} /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="top">{t("panel.config.legendTop")}</SelectItem>
                                <SelectItem value="bottom">{t("panel.config.legendBottom")}</SelectItem>
                                <SelectItem value="left">{t("panel.config.legendLeft")}</SelectItem>
                                <SelectItem value="right">{t("panel.config.legendRight")}</SelectItem>
                              </SelectContent>
                            </Select>
                          </label>
                          <label className="block space-y-1.5">
                            <div className={optionLabelTextClass}>{t("panel.config.legendOrientForm")}</div>
                            <Select value={String((selectedElement.chart?.option as any)?.legend?.orient ?? "horizontal")} onValueChange={(value) => updateSelectedOptionForm({ legend: { orient: value } })}>
                              <SelectTrigger className={optionSelectTriggerClass}><SelectValue placeholder={t("panel.config.selectLegendOrient")} /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="horizontal">{t("panel.config.legendHorizontal")}</SelectItem>
                                <SelectItem value="vertical">{t("panel.config.legendVertical")}</SelectItem>
                              </SelectContent>
                            </Select>
                          </label>
                          <label className="block space-y-1.5">
                            {renderOptionLabel(t("panel.config.xAxisMin"), "xAxis.min", t("panel.config.xAxisMinHint"))}
                            <Input type="number" className={optionInputClass} value={Number((selectedElement.chart?.option as any)?.xAxis?.min ?? 0)} onChange={(e) => updateSelectedOptionForm({ xAxis: { min: Number(e.target.value) || 0 } })} />
                          </label>
                          <label className="block space-y-1.5">
                            {renderOptionLabel(t("panel.config.xAxisMax"), "xAxis.max", t("panel.config.xAxisMaxHint"))}
                            <Input type="number" className={optionInputClass} value={Number((selectedElement.chart?.option as any)?.xAxis?.max ?? 100)} onChange={(e) => updateSelectedOptionForm({ xAxis: { max: Number(e.target.value) || 0 } })} />
                          </label>
                          <label className="block space-y-1.5">
                            {renderOptionLabel(t("panel.config.yAxisMin"), "yAxis.min", t("panel.config.yAxisMinHint"))}
                            <Input type="number" className={optionInputClass} value={Number((selectedElement.chart?.option as any)?.yAxis?.min ?? 0)} onChange={(e) => updateSelectedOptionForm({ yAxis: { min: Number(e.target.value) || 0 } })} />
                          </label>
                          <label className="block space-y-1.5">
                            {renderOptionLabel(t("panel.config.yAxisMax"), "yAxis.max", t("panel.config.yAxisMaxHint"))}
                            <Input type="number" className={optionInputClass} value={Number((selectedElement.chart?.option as any)?.yAxis?.max ?? 100)} onChange={(e) => updateSelectedOptionForm({ yAxis: { max: Number(e.target.value) || 0 } })} />
                          </label>
                          <label className="block space-y-1.5">
                            {renderOptionLabel(t("panel.config.xAxisLabelRotate"), "xAxis.axisLabel.rotate", t("panel.config.rotateUnitHint"))}
                            <Input type="number" className={optionInputClass} value={Number((selectedElement.chart?.option as any)?.xAxis?.axisLabel?.rotate ?? 0)} onChange={(e) => updateSelectedOptionForm({ xAxis: { axisLabel: { rotate: Number(e.target.value) || 0 } } })} />
                          </label>
                          <label className="block space-y-1.5">
                            {renderOptionLabel(t("panel.config.yAxisLabelRotate"), "yAxis.axisLabel.rotate", t("panel.config.rotateUnitHint"))}
                            <Input type="number" className={optionInputClass} value={Number((selectedElement.chart?.option as any)?.yAxis?.axisLabel?.rotate ?? 0)} onChange={(e) => updateSelectedOptionForm({ yAxis: { axisLabel: { rotate: Number(e.target.value) || 0 } } })} />
                          </label>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                      <div className="rounded-lg border border-border/60 bg-background/70 p-3">
                        <div className="space-y-2">
                          <Collapsible
                            open={isSectionExpanded("chartAdvancedHighFreq", true)}
                            onOpenChange={(open) => setSectionExpanded("chartAdvancedHighFreq", open)}
                          >
                            <div className="mb-2 flex items-center gap-1.5">
                              <CollapsibleTrigger asChild>
                                <button
                                  type="button"
                                  className="flex h-5 w-5 items-center justify-center rounded text-[11px] hover:bg-accent"
                                  aria-label={isSectionExpanded("chartAdvancedHighFreq", true) ? t("panel.config.collapseHighFreq") : t("panel.config.expandHighFreq")}
                                >
                                  {isSectionExpanded("chartAdvancedHighFreq", true) ? "▾" : "▸"}
                                </button>
                              </CollapsibleTrigger>
                              <div className="text-[11px] font-medium text-muted-foreground">{t("panel.config.groupHighFreq")}</div>
                            </div>
                            <CollapsibleContent>
                              <div className="grid grid-cols-1 gap-2">
                                <label className="flex items-center gap-2 rounded-md bg-muted/30 px-2 py-1.5">
                                  <Checkbox className={optionCheckboxClass} checked={Boolean((selectedElement.chart?.option as any)?.legend?.show ?? true)} onCheckedChange={(checked) => updateSelectedOptionForm({ legend: { show: checked === true } })} />
                                  {renderOptionLabel(t("panel.config.showLegend"), "legend.show", t("panel.config.showLegendHint"))}
                                </label>
                                <label className="flex items-center gap-2 rounded-md bg-muted/30 px-2 py-1.5">
                                  <Checkbox className={optionCheckboxClass} checked={Boolean((selectedElement.chart?.option as any)?.grid?.containLabel ?? false)} onCheckedChange={(checked) => updateSelectedOptionForm({ grid: { containLabel: checked === true } })} />
                                  {renderOptionLabel(t("panel.config.gridContainLabel"), "grid.containLabel", t("panel.config.gridContainLabelHint"))}
                                </label>
                                <label className="flex items-center gap-2 rounded-md bg-muted/30 px-2 py-1.5">
                                  <Checkbox className={optionCheckboxClass} checked={Boolean(Array.isArray((selectedElement.chart?.option as any)?.dataZoom) && (selectedElement.chart?.option as any)?.dataZoom.some((z: any) => z?.type === "inside"))} onCheckedChange={(checked) => { const prev = Array.isArray((selectedElement.chart?.option as any)?.dataZoom) ? [...(selectedElement.chart?.option as any).dataZoom] : []; const next = checked ? [...prev.filter((z: any) => z?.type !== "inside"), { type: "inside" }] : prev.filter((z: any) => z?.type !== "inside"); updateSelectedOptionForm({ dataZoom: next }); }} />
                                  {renderOptionLabel(t("panel.config.zoomInside"), "dataZoom[type=inside]", t("panel.config.zoomInsideHint"))}
                                </label>
                                <label className="flex items-center gap-2 rounded-md bg-muted/30 px-2 py-1.5">
                                  <Checkbox className={optionCheckboxClass} checked={Boolean(Array.isArray((selectedElement.chart?.option as any)?.dataZoom) && (selectedElement.chart?.option as any)?.dataZoom.some((z: any) => z?.type === "slider"))} onCheckedChange={(checked) => { const prev = Array.isArray((selectedElement.chart?.option as any)?.dataZoom) ? [...(selectedElement.chart?.option as any).dataZoom] : []; const next = checked ? [...prev.filter((z: any) => z?.type !== "slider"), { type: "slider" }] : prev.filter((z: any) => z?.type !== "slider"); updateSelectedOptionForm({ dataZoom: next }); }} />
                                  {renderOptionLabel(t("panel.config.zoomSlider"), "dataZoom[type=slider]", t("panel.config.zoomSliderHint"))}
                                </label>
                                <label className="flex items-center gap-2 rounded-md bg-muted/30 px-2 py-1.5">
                                  <Checkbox className={optionCheckboxClass} checked={Boolean((selectedElement.chart?.option as any)?.animation ?? false)} onCheckedChange={(checked) => updateSelectedOptionForm({ animation: checked === true })} />
                                  {renderOptionLabel(t("panel.config.enableAnimation"), "animation", t("panel.config.enableAnimationHint"))}
                                </label>
                                <label className="block space-y-1.5">
                                  {renderOptionLabel(t("panel.config.animationDuration"), "animationDuration", t("panel.config.animationDurationHint"))}
                                  <Input type="number" min={0} className={optionInputClass} value={Number((selectedElement.chart?.option as any)?.animationDuration ?? 300)} onChange={(e) => updateSelectedOptionForm({ animationDuration: Math.max(0, Number(e.target.value) || 0) })} />
                                </label>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                          <Collapsible
                            open={isSectionExpanded("chartAdvancedAxisPointer", false)}
                            onOpenChange={(open) => setSectionExpanded("chartAdvancedAxisPointer", open)}
                          >
                            <div className="mb-2 flex items-center gap-1.5">
                              <CollapsibleTrigger asChild>
                                <button
                                  type="button"
                                  className="flex h-5 w-5 items-center justify-center rounded text-[11px] hover:bg-accent"
                                  aria-label={isSectionExpanded("chartAdvancedAxisPointer", false) ? t("panel.config.collapseAxisPointer") : t("panel.config.expandAxisPointer")}
                                >
                                  {isSectionExpanded("chartAdvancedAxisPointer", false) ? "▾" : "▸"}
                                </button>
                              </CollapsibleTrigger>
                              <div className="text-[11px] font-medium text-muted-foreground">{t("panel.config.groupAxisPointer")}</div>
                            </div>
                            <CollapsibleContent>
                              <div className="grid grid-cols-1 gap-2">
                                <label className="flex items-center gap-2 rounded-md bg-muted/30 px-2 py-1.5">
                                  <Checkbox className={optionCheckboxClass} checked={Boolean((selectedElement.chart?.option as any)?.axisPointer?.show ?? false)} onCheckedChange={(checked) => updateSelectedOptionForm({ axisPointer: { show: checked === true } })} />
                                  {renderOptionLabel(t("panel.config.showAxisPointer"), "axisPointer.show", t("panel.config.showAxisPointerHint"))}
                                </label>
                                <label className="block space-y-1.5 rounded-md bg-muted/30 px-2 py-1.5">
                                  {renderOptionLabel(t("panel.config.axisPointerType"), "axisPointer.type", t("panel.config.axisPointerTypeHint"))}
                                  <Select value={String((selectedElement.chart?.option as any)?.axisPointer?.type ?? "line")} onValueChange={(value) => updateSelectedOptionForm({ axisPointer: { type: value } })}>
                                    <SelectTrigger className={optionSelectTriggerClass}><SelectValue placeholder={t("panel.config.selectAxisPointerType")} /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="line">{t("panel.config.axisPointerLine")}</SelectItem>
                                      <SelectItem value="shadow">{t("panel.config.axisPointerShadow")}</SelectItem>
                                      <SelectItem value="cross">{t("panel.config.axisPointerCross")}</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </label>
                                <label className="flex items-center gap-2 rounded-md bg-muted/30 px-2 py-1.5">
                                  <Checkbox className={optionCheckboxClass} checked={Boolean((selectedElement.chart?.option as any)?.axisPointer?.snap ?? false)} onCheckedChange={(checked) => updateSelectedOptionForm({ axisPointer: { snap: checked === true } })} />
                                  {renderOptionLabel(t("panel.config.axisPointerSnap"), "axisPointer.snap", t("panel.config.axisPointerSnapHint"))}
                                </label>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      </div>
                    </div>
                  )}
                  {renderFieldGroup(
                    t("panel.config.groupJsonAdvanced"),
                    <>
                      <label className="flex items-center gap-2 rounded-md bg-background/70 px-2 py-1.5">
                        <Checkbox
                          checked={isAdvancedOptionMode}
                          className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                          onCheckedChange={(checked) => setIsAdvancedOptionMode(checked === true)}
                        />
                        <span>{t("panel.config.enableAdvancedJson")}</span>
                        <ConfigHintIcon label={t("panel.config.advancedJsonHintLabel")}>
                          {t("panel.config.advancedJsonHint")}
                        </ConfigHintIcon>
                      </label>
                      {isAdvancedOptionMode ? (
                        <>
                          <Textarea
                            value={optionJsonText}
                            onChange={(e) => {
                              const next = e.target.value;
                              setOptionJsonText(next);
                              try {
                                const parsed = JSON.parse(next) as Record<string, unknown>;
                                updateSelectedChart({ option: parsed });
                                setOptionJsonError(null);
                              } catch {
                                setOptionJsonError(t("panel.config.jsonInvalid"));
                              }
                            }}
                            spellCheck={false}
                            className="h-44 font-mono text-[11px]"
                          />
                          {optionJsonError ? (
                            <div className="rounded border border-destructive/40 bg-destructive/10 px-2 py-1.5 text-[11px] text-destructive">
                              {optionJsonError}
                            </div>
                          ) : (
                            <div className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1.5 text-[11px] text-emerald-700 dark:text-emerald-300">
                              {t("panel.config.jsonValidApplied")}
                            </div>
                          )}
                        </>
                      ) : null}
                    </>
                  )}
                </>,
                false,
                ["json", "option", t("panel.config.searchKwAdvanced"), "echarts"]
              )}
    </>
  );
}
