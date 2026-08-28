import { useCallback, useState } from "react";
import { useI18n } from "@arronqzy/i18n/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@arronqzy/ui";
import type { PanelElement, PanelLayer, ReferenceCopyMode } from "../../types";
import { CHART_TYPES, getChartLabelsDisplayText, getChartValuesDisplayText } from "../../utils/chartOptionBuilder";
import { VIEWPORT_OVERFLOW_MODES, normalizeViewportOverflow, type ViewportOverflowMode } from "../../utils/viewportPlacement";
import { type ConfigSectionHelpers, type UpdateElement, mergeOptionPatch } from "./helpers";

export function PanelConfigMultiSelect({
  elements,
  helpers,
  updateElement,
  layers,
  setReferenceCopyMode,
  onExcludeSelectedNode,
  onAdjustNodeZOrder,
}: {
  elements: PanelElement[];
  helpers: ConfigSectionHelpers;
  updateElement: UpdateElement;
  layers: PanelLayer[];
  setReferenceCopyMode?: (id: string, mode: ReferenceCopyMode) => void;
  onExcludeSelectedNode?: (nodeId: string) => void;
  onAdjustNodeZOrder?: (
    nodeId: string,
    action: "bringForward" | "sendBackward" | "bringToFront" | "sendToBack"
  ) => void;
}) {
  const { t } = useI18n();
  const { hasSearch, normalizedSearch, renderFormatterLabel, renderOptionLabel } = helpers;
  const effectiveSelectedElements = elements;
  const [expandedNodeCards, setExpandedNodeCards] = useState<Record<string, boolean>>({});
  const isNodeCardExpanded = useCallback(
    (id: string) => expandedNodeCards[id] ?? true,
    [expandedNodeCards]
  );
  const setNodeCardExpanded = useCallback((id: string, open: boolean) => {
    setExpandedNodeCards((prev) => ({ ...prev, [id]: open }));
  }, []);

  return (
        <div className="space-y-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs">{t("panel.config.batchTitleWithCount", { count: effectiveSelectedElements.length })}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="rounded border border-border bg-background px-2 py-1 hover:bg-accent"
                  onClick={() => effectiveSelectedElements.forEach((el) => updateElement(el.id, { locked: true }))}
                >
                  {t("panel.config.lockAll")}
                </button>
                <button
                  type="button"
                  className="rounded border border-border bg-background px-2 py-1 hover:bg-accent"
                  onClick={() => effectiveSelectedElements.forEach((el) => updateElement(el.id, { locked: false }))}
                >
                  {t("panel.config.unlockAll")}
                </button>
                <button
                  type="button"
                  className="rounded border border-border bg-background px-2 py-1 hover:bg-accent"
                  onClick={() =>
                    effectiveSelectedElements.forEach((el) =>
                      onAdjustNodeZOrder?.(el.id, "bringForward")
                    )
                  }
                >
                  {t("panel.config.bringAllForward")}
                </button>
                <button
                  type="button"
                  className="rounded border border-border bg-background px-2 py-1 hover:bg-accent"
                  onClick={() =>
                    effectiveSelectedElements.forEach((el) =>
                      onAdjustNodeZOrder?.(el.id, "sendBackward")
                    )
                  }
                >
                  {t("panel.config.sendAllBackward")}
                </button>
                <button
                  type="button"
                  className="rounded border border-border bg-background px-2 py-1 hover:bg-accent"
                  onClick={() =>
                    effectiveSelectedElements.forEach((el) =>
                      updateElement(el.id, { zIndex: 1 })
                    )
                  }
                >
                  {t("panel.config.setAllZIndex1")}
                </button>
                <button
                  type="button"
                  className="rounded border border-border bg-background px-2 py-1 hover:bg-accent"
                  onClick={() =>
                    effectiveSelectedElements.forEach((el) =>
                      updateElement(el.id, {
                        style: {
                          ...(el.style ?? {}),
                          backgroundColor: "#3b82f6",
                        },
                      })
                    )
                  }
                >
                  {t("panel.config.setAllBgBlue")}
                </button>
              </div>
            </CardContent>
          </Card>
          {effectiveSelectedElements
            .filter((el) => {
              if (!hasSearch) return true;
              const text = `${el.name ?? ""} ${el.id} ${el.materialType ?? ""} zIndex style layer`
                .toLowerCase();
              return text.includes(normalizedSearch);
            })
            .map((el) => (
              <Card
                key={el.id}
                className={el.locked ? "border-amber-500/40 bg-amber-500/5" : ""}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex h-6 w-6 items-center justify-center rounded border border-border text-[11px] hover:bg-accent"
                      onClick={() => setNodeCardExpanded(el.id, !isNodeCardExpanded(el.id))}
                      aria-label={isNodeCardExpanded(el.id) ? t("panel.config.collapseNodeConfig") : t("panel.config.expandNodeConfig")}
                    >
                      {isNodeCardExpanded(el.id) ? "▾" : "▸"}
                    </button>
                    <CardTitle className="min-w-0 flex-1 text-xs truncate">
                      {el.name?.trim() || el.materialType || t("common.node")} · {el.id}
                    </CardTitle>
                    <button
                      type="button"
                      className="inline-flex h-6 items-center justify-center rounded border border-border px-2 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground"
                      onClick={() => onExcludeSelectedNode?.(el.id)}
                      title={t("panel.config.removeFromSelectionTitle")}
                    >
                      {t("panel.config.removeFromSelection")}
                    </button>
                  </div>
                </CardHeader>
                {isNodeCardExpanded(el.id) ? (
                <CardContent className="space-y-2 text-xs">
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={el.locked === true}
                      onCheckedChange={(checked) => updateElement(el.id, { locked: checked === true })}
                    />
                    <span>{t("panel.config.lockedNode")}</span>
                  </label>
                  {el.locked ? (
                    <div className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1.5 text-[11px] text-amber-700 dark:text-amber-300">
                      {t("panel.config.lockedNodeHint")}
                    </div>
                  ) : null}
                  <fieldset disabled={el.locked} className={el.locked ? "opacity-60" : ""}>
                    <div className="space-y-2">
                      <label className="block space-y-1">
                        <div>{t("panel.config.name")}</div>
                        <Input
                          className="h-7"
                          value={el.name ?? ""}
                          onChange={(e) => updateElement(el.id, { name: e.target.value || undefined })}
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="block space-y-1">
                          <div>zIndex</div>
                          <Input
                            className="h-7"
                            type="number"
                            value={el.zIndex ?? 1}
                            onChange={(e) =>
                              updateElement(el.id, { zIndex: Number(e.target.value) || 1 })
                            }
                          />
                        </label>
                        <label className="block space-y-1">
                          <div>{t("panel.config.layer")}</div>
                          <Select
                            value={el.layerId}
                            onValueChange={(value) => updateElement(el.id, { layerId: value })}
                          >
                            <SelectTrigger className="h-7">
                              <SelectValue placeholder={t("panel.config.selectLayer")} />
                            </SelectTrigger>
                            <SelectContent>
                              {layers.map((layer) => (
                                <SelectItem key={layer.id} value={layer.id}>
                                  {layer.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="block space-y-1">
                          <div>X</div>
                          <Input
                            className="h-7"
                            type="number"
                            value={el.x}
                            onChange={(e) => updateElement(el.id, { x: Number(e.target.value) || 0 })}
                          />
                        </label>
                        <label className="block space-y-1">
                          <div>Y</div>
                          <Input
                            className="h-7"
                            type="number"
                            value={el.y}
                            onChange={(e) => updateElement(el.id, { y: Number(e.target.value) || 0 })}
                          />
                        </label>
                        <label className="block space-y-1">
                          <div>{t("panel.config.rotate")}</div>
                          <Input
                            className="h-7"
                            type="number"
                            value={el.rotate ?? 0}
                            onChange={(e) =>
                              updateElement(el.id, { rotate: Number(e.target.value) || 0 })
                            }
                          />
                        </label>
                        <label className="block space-y-1">
                          <div>{t("panel.config.width")}</div>
                          <Input
                            className="h-7"
                            type="number"
                            min={1}
                            value={el.width}
                            onChange={(e) =>
                              updateElement(el.id, { width: Math.max(1, Number(e.target.value) || 1) })
                            }
                          />
                        </label>
                        <label className="block space-y-1">
                          <div>{t("panel.config.height")}</div>
                          <Input
                            className="h-7"
                            type="number"
                            min={1}
                            value={el.height}
                            onChange={(e) =>
                              updateElement(el.id, { height: Math.max(1, Number(e.target.value) || 1) })
                            }
                          />
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                    <label className="block space-y-1">
                      <div>{t("panel.config.backgroundColor")}</div>
                      <Input
                        className="h-7"
                        value={el.style?.backgroundColor ?? ""}
                        placeholder="#000000"
                        onChange={(e) =>
                          updateElement(el.id, {
                            style: {
                              ...(el.style ?? {}),
                              backgroundColor: e.target.value || undefined,
                            },
                          })
                        }
                      />
                    </label>
                    <label className="block space-y-1">
                      <div>{t("panel.config.borderColorShort")}</div>
                      <Input
                        className="h-7"
                        value={el.style?.borderColor ?? ""}
                        placeholder="#000000"
                        onChange={(e) =>
                          updateElement(el.id, {
                            style: {
                              ...(el.style ?? {}),
                              borderColor: e.target.value || undefined,
                            },
                          })
                        }
                      />
                    </label>
                      </div>
                      {CHART_TYPES.has(el.materialType ?? "") ? (
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block space-y-1 col-span-2">
                        <div>{t("panel.config.chartTitle")}</div>
                        <Input
                          className="h-7"
                          value={el.chart?.title ?? ""}
                          onChange={(e) =>
                            updateElement(el.id, {
                              chart: { ...(el.chart ?? {}), title: e.target.value },
                            })
                          }
                        />
                      </label>
                      <label className="block space-y-1">
                        <div>{t("panel.config.primaryColor")}</div>
                        <Input
                          className="h-7"
                          value={el.chart?.color ?? ""}
                          onChange={(e) =>
                            updateElement(el.id, {
                              chart: { ...(el.chart ?? {}), color: e.target.value || undefined },
                            })
                          }
                        />
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={el.chart?.colorMode === "gradient"}
                          onCheckedChange={(checked) =>
                            updateElement(el.id, {
                              chart: { ...(el.chart ?? {}), colorMode: checked ? "gradient" : "solid" },
                            })
                          }
                        />
                        <span>{t("panel.config.primaryGradient")}</span>
                      </label>
                      {el.chart?.colorMode === "gradient" ? (
                        <>
                          <label className="block space-y-1">
                            <div>{t("panel.config.gradientFrom")}</div>
                            <Input
                              className="h-7"
                              value={el.chart?.gradientFrom ?? el.chart?.color ?? "#3b82f6"}
                              onChange={(e) =>
                                updateElement(el.id, {
                                  chart: { ...(el.chart ?? {}), gradientFrom: e.target.value || "#3b82f6" },
                                })
                              }
                            />
                          </label>
                          <label className="block space-y-1">
                            <div>{t("panel.config.gradientTo")}</div>
                            <Input
                              className="h-7"
                              value={el.chart?.gradientTo ?? "#22d3ee"}
                              onChange={(e) =>
                                updateElement(el.id, {
                                  chart: { ...(el.chart ?? {}), gradientTo: e.target.value || "#22d3ee" },
                                })
                              }
                            />
                          </label>
                          <label className="block space-y-1 col-span-2">
                            <div>{t("panel.config.gradientDirection")}</div>
                            <Select
                              value={el.chart?.gradientDirection ?? "to-right"}
                              onValueChange={(value) =>
                                updateElement(el.id, {
                                  chart: {
                                    ...(el.chart ?? {}),
                                    gradientDirection: value as
                                      | "to-right"
                                      | "to-bottom"
                                      | "to-bottom-right"
                                      | "to-top-right",
                                  },
                                })
                              }
                            >
                              <SelectTrigger className="h-7"><SelectValue /></SelectTrigger>
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
                                  (el.chart?.gradientDirection ?? "to-right") === "to-bottom"
                                    ? "to bottom"
                                    : (el.chart?.gradientDirection ?? "to-right") === "to-bottom-right"
                                      ? "to bottom right"
                                      : (el.chart?.gradientDirection ?? "to-right") === "to-top-right"
                                        ? "to top right"
                                        : "to right"
                                }, ${el.chart?.gradientFrom ?? el.chart?.color ?? "#3b82f6"}, ${el.chart?.gradientTo ?? "#22d3ee"})`,
                              }}
                            />
                          </div>
                        </>
                      ) : null}
                      <label className="block space-y-1">
                        <div>{t("panel.config.render")}</div>
                        <Select
                          value={el.chart?.renderMode ?? "canvas"}
                          onValueChange={(value) =>
                            updateElement(el.id, {
                              chart: { ...(el.chart ?? {}), renderMode: value as "canvas" | "svg" },
                            })
                          }
                        >
                          <SelectTrigger className="h-7">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="canvas">canvas</SelectItem>
                            <SelectItem value="svg">svg</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>
                      <label className="block space-y-1">
                        <div>{t("panel.config.tooltipBg")}</div>
                        <Input
                          className="h-7"
                          value={el.chart?.tooltipBackgroundColor ?? ""}
                          placeholder="#0f172a"
                          onChange={(e) =>
                            updateElement(el.id, {
                              chart: {
                                ...(el.chart ?? {}),
                                tooltipBackgroundColor: e.target.value || undefined,
                              },
                            })
                          }
                        />
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={el.chart?.tooltipShow ?? true}
                          onCheckedChange={(checked) =>
                            updateElement(el.id, {
                              chart: { ...(el.chart ?? {}), tooltipShow: checked === true },
                            })
                          }
                        />
                        <span>{t("panel.config.showTooltip")}</span>
                      </label>
                      <label className="block space-y-1">
                        <div>{t("panel.config.tooltipTrigger")}</div>
                        <Select
                          value={el.chart?.tooltipTrigger ?? "axis"}
                          onValueChange={(value) =>
                            updateElement(el.id, {
                              chart: { ...(el.chart ?? {}), tooltipTrigger: value as "axis" | "item" },
                            })
                          }
                        >
                          <SelectTrigger className="h-7"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="axis">axis</SelectItem>
                            <SelectItem value="item">item</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>
                      <label className="block space-y-1">
                        <div>{t("panel.config.tooltipTextColor")}</div>
                        <Input
                          className="h-7"
                          value={el.chart?.tooltipTextColor ?? ""}
                          placeholder="#f8fafc"
                          onChange={(e) =>
                            updateElement(el.id, {
                              chart: {
                                ...(el.chart ?? {}),
                                tooltipTextColor: e.target.value || undefined,
                              },
                            })
                          }
                        />
                      </label>
                      <label className="block space-y-1 col-span-2">
                        {renderFormatterLabel("Tooltip Formatter")}
                        <Input
                          className="h-7"
                          value={el.chart?.tooltipFormatter ?? ""}
                          placeholder="{b}: {c}"
                          onChange={(e) =>
                            updateElement(el.id, {
                              chart: {
                                ...(el.chart ?? {}),
                                tooltipFormatter: e.target.value || undefined,
                              },
                            })
                          }
                        />
                      </label>
                      <label className="block space-y-1 col-span-2">
                        <div>{t("panel.config.labelsCsv")}</div>
                        <Input
                          className="h-7"
                          value={getChartLabelsDisplayText(el.chart)}
                          onChange={(e) =>
                            updateElement(el.id, {
                              chart: {
                                ...(el.chart ?? {}),
                                labelsText: e.target.value,
                              },
                            })
                          }
                        />
                      </label>
                      <label className="block space-y-1 col-span-2">
                        <div>{t("panel.config.valuesCsv")}</div>
                        <Input
                          className="h-7"
                          value={getChartValuesDisplayText(el.chart)}
                          onChange={(e) =>
                            updateElement(el.id, {
                              chart: {
                                ...(el.chart ?? {}),
                                valuesText: e.target.value,
                              },
                            })
                          }
                        />
                      </label>
                      {["bar", "line", "area", "scatter"].includes(el.materialType ?? "") ? (
                        <>
                          <label className="block space-y-1">
                            <div>{t("panel.config.xAxisName")}</div>
                            <Input
                              className="h-7"
                              value={el.chart?.xAxisName ?? ""}
                              onChange={(e) =>
                                updateElement(el.id, {
                                  chart: { ...(el.chart ?? {}), xAxisName: e.target.value },
                                })
                              }
                            />
                          </label>
                          <label className="block space-y-1">
                            <div>{t("panel.config.yAxisName")}</div>
                            <Input
                              className="h-7"
                              value={el.chart?.yAxisName ?? ""}
                              onChange={(e) =>
                                updateElement(el.id, {
                                  chart: { ...(el.chart ?? {}), yAxisName: e.target.value },
                                })
                              }
                            />
                          </label>
                          <label className="block space-y-1">
                            <div>{t("panel.config.xAxisLabelColor")}</div>
                            <Input
                              className="h-7"
                              value={el.chart?.xAxisLabelColor ?? ""}
                              placeholder="#64748b"
                              onChange={(e) =>
                                updateElement(el.id, {
                                  chart: { ...(el.chart ?? {}), xAxisLabelColor: e.target.value || undefined },
                                })
                              }
                            />
                          </label>
                          <label className="block space-y-1">
                            <div>{t("panel.config.yAxisLabelColor")}</div>
                            <Input
                              className="h-7"
                              value={el.chart?.yAxisLabelColor ?? ""}
                              placeholder="#64748b"
                              onChange={(e) =>
                                updateElement(el.id, {
                                  chart: { ...(el.chart ?? {}), yAxisLabelColor: e.target.value || undefined },
                                })
                              }
                            />
                          </label>
                          <label className="block space-y-1">
                            <div>{t("panel.config.xAxisLabelFontSize")}</div>
                            <Input
                              className="h-7"
                              type="number"
                              min={8}
                              max={48}
                              value={el.chart?.xAxisLabelFontSize ?? 10}
                              onChange={(e) =>
                                updateElement(el.id, {
                                  chart: {
                                    ...(el.chart ?? {}),
                                    xAxisLabelFontSize: Math.max(8, Math.min(48, Number(e.target.value) || 10)),
                                  },
                                })
                              }
                            />
                          </label>
                          <label className="block space-y-1">
                            <div>{t("panel.config.yAxisLabelFontSize")}</div>
                            <Input
                              className="h-7"
                              type="number"
                              min={8}
                              max={48}
                              value={el.chart?.yAxisLabelFontSize ?? 10}
                              onChange={(e) =>
                                updateElement(el.id, {
                                  chart: {
                                    ...(el.chart ?? {}),
                                    yAxisLabelFontSize: Math.max(8, Math.min(48, Number(e.target.value) || 10)),
                                  },
                                })
                              }
                            />
                          </label>
                          <label className="flex items-center gap-2">
                            <Checkbox
                              checked={el.chart?.xAxisLabelAutoEllipsis ?? false}
                              onCheckedChange={(checked) =>
                                updateElement(el.id, {
                                  chart: { ...(el.chart ?? {}), xAxisLabelAutoEllipsis: checked === true },
                                })
                              }
                            />
                            <span>{t("panel.config.xAxisLabelAutoEllipsis")}</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <Checkbox
                              checked={el.chart?.yAxisLabelAutoEllipsis ?? false}
                              onCheckedChange={(checked) =>
                                updateElement(el.id, {
                                  chart: { ...(el.chart ?? {}), yAxisLabelAutoEllipsis: checked === true },
                                })
                              }
                            />
                            <span>{t("panel.config.yAxisLabelAutoEllipsis")}</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <Checkbox
                              checked={el.chart?.xAxisTickShow ?? true}
                              onCheckedChange={(checked) =>
                                updateElement(el.id, {
                                  chart: { ...(el.chart ?? {}), xAxisTickShow: checked === true },
                                })
                              }
                            />
                            <span>{t("panel.config.xAxisTick")}</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <Checkbox
                              checked={el.chart?.yAxisTickShow ?? true}
                              onCheckedChange={(checked) =>
                                updateElement(el.id, {
                                  chart: { ...(el.chart ?? {}), yAxisTickShow: checked === true },
                                })
                              }
                            />
                            <span>{t("panel.config.yAxisTick")}</span>
                          </label>
                          <label className="block space-y-1">
                            <div>{t("panel.config.xAxisTickColor")}</div>
                            <Input
                              className="h-7"
                              value={el.chart?.xAxisTickColor ?? ""}
                              placeholder="#94a3b8"
                              onChange={(e) =>
                                updateElement(el.id, {
                                  chart: { ...(el.chart ?? {}), xAxisTickColor: e.target.value || undefined },
                                })
                              }
                            />
                          </label>
                          <label className="block space-y-1">
                            <div>{t("panel.config.yAxisTickColor")}</div>
                            <Input
                              className="h-7"
                              value={el.chart?.yAxisTickColor ?? ""}
                              placeholder="#94a3b8"
                              onChange={(e) =>
                                updateElement(el.id, {
                                  chart: { ...(el.chart ?? {}), yAxisTickColor: e.target.value || undefined },
                                })
                              }
                            />
                          </label>
                          <label className="flex items-center gap-2">
                            <Checkbox
                              checked={el.chart?.xAxisSplitLineShow ?? false}
                              onCheckedChange={(checked) =>
                                updateElement(el.id, {
                                  chart: { ...(el.chart ?? {}), xAxisSplitLineShow: checked === true },
                                })
                              }
                            />
                            <span>{t("panel.config.xAxisSplitLine")}</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <Checkbox
                              checked={el.chart?.yAxisSplitLineShow ?? true}
                              onCheckedChange={(checked) =>
                                updateElement(el.id, {
                                  chart: { ...(el.chart ?? {}), yAxisSplitLineShow: checked === true },
                                })
                              }
                            />
                            <span>{t("panel.config.yAxisSplitLine")}</span>
                          </label>
                          <label className="block space-y-1">
                            <div>{t("panel.config.xAxisSplitLineColor")}</div>
                            <Input
                              className="h-7"
                              value={el.chart?.xAxisSplitLineColor ?? ""}
                              placeholder="#e2e8f0"
                              onChange={(e) =>
                                updateElement(el.id, {
                                  chart: { ...(el.chart ?? {}), xAxisSplitLineColor: e.target.value || undefined },
                                })
                              }
                            />
                          </label>
                          <label className="block space-y-1">
                            <div>{t("panel.config.yAxisSplitLineColor")}</div>
                            <Input
                              className="h-7"
                              value={el.chart?.yAxisSplitLineColor ?? ""}
                              placeholder="#e2e8f0"
                              onChange={(e) =>
                                updateElement(el.id, {
                                  chart: { ...(el.chart ?? {}), yAxisSplitLineColor: e.target.value || undefined },
                                })
                              }
                            />
                          </label>
                        </>
                      ) : null}
                      {el.materialType === "gauge" ? (
                        <label className="block space-y-1">
                          <div>{t("panel.config.gaugeValue")}</div>
                          <Input
                            className="h-7"
                            type="number"
                            value={el.chart?.values?.[0] ?? 0}
                            onChange={(e) =>
                              updateElement(el.id, {
                                chart: {
                                  ...(el.chart ?? {}),
                                  values: [Number(e.target.value) || 0],
                                },
                              })
                            }
                          />
                        </label>
                      ) : null}
                      {el.materialType === "bar" ? (
                        <label className="block space-y-1">
                          <div>{t("panel.config.barWidth")}</div>
                          <Input
                            className="h-7"
                            type="number"
                            min={1}
                            placeholder={t("panel.config.barWidthAuto")}
                            value={el.chart?.barWidth ?? ""}
                            onChange={(e) => {
                              const raw = e.target.value.trim();
                              updateElement(el.id, {
                                chart: {
                                  ...(el.chart ?? {}),
                                  barWidth: raw
                                    ? Math.max(1, Number(raw) || 1)
                                    : undefined,
                                },
                              });
                            }}
                          />
                        </label>
                      ) : null}
                      {(el.materialType === "line" || el.materialType === "area") ? (
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={el.chart?.smooth ?? true}
                            onCheckedChange={(checked) =>
                              updateElement(el.id, {
                                chart: { ...(el.chart ?? {}), smooth: checked === true },
                              })
                            }
                          />
                          <span>{t("panel.config.smooth")}</span>
                        </label>
                      ) : null}
                      {el.materialType === "pie" ? (
                        <>
                          <label className="block space-y-1">
                            <div>{t("panel.config.pieInnerRadius")}</div>
                            <Input
                              className="h-7"
                              type="number"
                              min={0}
                              max={99}
                              value={el.chart?.pieInnerRadius ?? 30}
                              onChange={(e) =>
                                updateElement(el.id, {
                                  chart: {
                                    ...(el.chart ?? {}),
                                    pieInnerRadius: Math.max(0, Math.min(99, Number(e.target.value) || 0)),
                                  },
                                })
                              }
                            />
                          </label>
                          <label className="block space-y-1">
                            <div>{t("panel.config.pieOuterRadius")}</div>
                            <Input
                              className="h-7"
                              type="number"
                              min={1}
                              max={100}
                              value={el.chart?.pieOuterRadius ?? 65}
                              onChange={(e) =>
                                updateElement(el.id, {
                                  chart: {
                                    ...(el.chart ?? {}),
                                    pieOuterRadius: Math.max(1, Math.min(100, Number(e.target.value) || 1)),
                                  },
                                })
                              }
                            />
                          </label>
                        </>
                      ) : null}
                      <label className="block space-y-1">
                        {renderOptionLabel(t("panel.config.gridLeft"), "grid.left", t("panel.config.gridLeftHint"))}
                        <Input
                          className="h-7"
                          type="number"
                          value={Number((el.chart?.option as any)?.grid?.left ?? 28)}
                          onChange={(e) =>
                            updateElement(el.id, {
                              chart: {
                                ...(el.chart ?? {}),
                                option: mergeOptionPatch(el.chart?.option as any, {
                                  grid: { left: Number(e.target.value) || 0 },
                                }),
                              },
                            })
                          }
                        />
                      </label>
                      <label className="block space-y-1">
                        {renderOptionLabel(t("panel.config.gridRight"), "grid.right", t("panel.config.gridRightHint"))}
                        <Input
                          className="h-7"
                          type="number"
                          value={Number((el.chart?.option as any)?.grid?.right ?? 10)}
                          onChange={(e) =>
                            updateElement(el.id, {
                              chart: {
                                ...(el.chart ?? {}),
                                option: mergeOptionPatch(el.chart?.option as any, {
                                  grid: { right: Number(e.target.value) || 0 },
                                }),
                              },
                            })
                          }
                        />
                      </label>
                      <label className="block space-y-1">
                        {renderOptionLabel(t("panel.config.gridTop"), "grid.top", t("panel.config.gridTopHint"))}
                        <Input
                          className="h-7"
                          type="number"
                          value={Number((el.chart?.option as any)?.grid?.top ?? 30)}
                          onChange={(e) =>
                            updateElement(el.id, {
                              chart: {
                                ...(el.chart ?? {}),
                                option: mergeOptionPatch(el.chart?.option as any, {
                                  grid: { top: Number(e.target.value) || 0 },
                                }),
                              },
                            })
                          }
                        />
                      </label>
                      <label className="block space-y-1">
                        {renderOptionLabel(t("panel.config.gridBottom"), "grid.bottom", t("panel.config.gridBottomHint"))}
                        <Input
                          className="h-7"
                          type="number"
                          value={Number((el.chart?.option as any)?.grid?.bottom ?? 20)}
                          onChange={(e) =>
                            updateElement(el.id, {
                              chart: {
                                ...(el.chart ?? {}),
                                option: mergeOptionPatch(el.chart?.option as any, {
                                  grid: { bottom: Number(e.target.value) || 0 },
                                }),
                              },
                            })
                          }
                        />
                      </label>
                      <label className="block space-y-1">
                        {renderOptionLabel(t("panel.config.legendPosition"), "legend.top", t("panel.config.legendPositionHint"))}
                        <Select
                          value={String((el.chart?.option as any)?.legend?.top ?? "top")}
                          onValueChange={(value) =>
                            updateElement(el.id, {
                              chart: {
                                ...(el.chart ?? {}),
                                option: mergeOptionPatch(el.chart?.option as any, {
                                  legend: { top: value },
                                }),
                              },
                            })
                          }
                        >
                          <SelectTrigger className="h-7"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="top">top</SelectItem>
                            <SelectItem value="bottom">bottom</SelectItem>
                            <SelectItem value="left">left</SelectItem>
                            <SelectItem value="right">right</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>
                      <label className="block space-y-1">
                        {renderOptionLabel(t("panel.config.legendOrient"), "legend.orient", t("panel.config.legendOrientHint"))}
                        <Select
                          value={String((el.chart?.option as any)?.legend?.orient ?? "horizontal")}
                          onValueChange={(value) =>
                            updateElement(el.id, {
                              chart: {
                                ...(el.chart ?? {}),
                                option: mergeOptionPatch(el.chart?.option as any, {
                                  legend: { orient: value },
                                }),
                              },
                            })
                          }
                        >
                          <SelectTrigger className="h-7"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="horizontal">horizontal</SelectItem>
                            <SelectItem value="vertical">vertical</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={Boolean((el.chart?.option as any)?.legend?.show ?? true)}
                          onCheckedChange={(checked) =>
                            updateElement(el.id, {
                              chart: {
                                ...(el.chart ?? {}),
                                option: mergeOptionPatch(el.chart?.option as any, {
                                  legend: { show: checked === true },
                                }),
                              },
                            })
                          }
                        />
                        <span>{t("panel.config.showLegendWithKey")}</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={Boolean(
                            Array.isArray((el.chart?.option as any)?.dataZoom) &&
                              (el.chart?.option as any)?.dataZoom.some((z: any) => z?.type === "inside")
                          )}
                          onCheckedChange={(checked) => {
                            const prev = Array.isArray((el.chart?.option as any)?.dataZoom)
                              ? [...(el.chart?.option as any).dataZoom]
                              : [];
                            const next = checked
                              ? [...prev.filter((z: any) => z?.type !== "inside"), { type: "inside" }]
                              : prev.filter((z: any) => z?.type !== "inside");
                            updateElement(el.id, {
                              chart: {
                                ...(el.chart ?? {}),
                                option: mergeOptionPatch(el.chart?.option as any, { dataZoom: next }),
                              },
                            });
                          }}
                        />
                        <span>{t("panel.config.zoomInsideWithKey")}</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={Boolean(
                            Array.isArray((el.chart?.option as any)?.dataZoom) &&
                              (el.chart?.option as any)?.dataZoom.some((z: any) => z?.type === "slider")
                          )}
                          onCheckedChange={(checked) => {
                            const prev = Array.isArray((el.chart?.option as any)?.dataZoom)
                              ? [...(el.chart?.option as any).dataZoom]
                              : [];
                            const next = checked
                              ? [...prev.filter((z: any) => z?.type !== "slider"), { type: "slider" }]
                              : prev.filter((z: any) => z?.type !== "slider");
                            updateElement(el.id, {
                              chart: {
                                ...(el.chart ?? {}),
                                option: mergeOptionPatch(el.chart?.option as any, { dataZoom: next }),
                              },
                            });
                          }}
                        />
                        <span>{t("panel.config.zoomSliderWithKey")}</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={Boolean((el.chart?.option as any)?.axisPointer?.show ?? false)}
                          onCheckedChange={(checked) =>
                            updateElement(el.id, {
                              chart: {
                                ...(el.chart ?? {}),
                                option: mergeOptionPatch(el.chart?.option as any, {
                                  axisPointer: { show: checked === true },
                                }),
                              },
                            })
                          }
                        />
                        <span>{t("panel.config.showAxisPointerWithKey")}</span>
                      </label>
                      <label className="block space-y-1">
                        <div>{t("panel.config.axisPointerTypeWithKey")}</div>
                        <Select
                          value={String((el.chart?.option as any)?.axisPointer?.type ?? "line")}
                          onValueChange={(value) =>
                            updateElement(el.id, {
                              chart: {
                                ...(el.chart ?? {}),
                                option: mergeOptionPatch(el.chart?.option as any, {
                                  axisPointer: { type: value },
                                }),
                              },
                            })
                          }
                        >
                          <SelectTrigger className="h-7"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="line">line</SelectItem>
                            <SelectItem value="shadow">shadow</SelectItem>
                            <SelectItem value="cross">cross</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>
                      <label className="block space-y-1 col-span-2">
                        <div>{t("panel.config.advancedOptionJson")}</div>
                        <Textarea
                          className="h-28 font-mono text-[11px]"
                          defaultValue={JSON.stringify(el.chart?.option ?? {}, null, 2)}
                          placeholder={t("panel.config.advancedJsonPlaceholder")}
                          onBlur={(e) => {
                            const nextText = e.target.value.trim();
                            if (!nextText) {
                              updateElement(el.id, { chart: { ...(el.chart ?? {}), option: undefined } });
                              return;
                            }
                            try {
                              const parsed = JSON.parse(nextText) as Record<string, unknown>;
                              updateElement(el.id, { chart: { ...(el.chart ?? {}), option: parsed } });
                            } catch {
                              // ignore invalid json input on blur
                            }
                          }}
                        />
                      </label>
                    </div>
                      ) : null}
                      {el.materialType === "text" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block space-y-1 col-span-2">
                        <div>{t("panel.config.textHtml")}</div>
                        <Textarea
                          className="h-24"
                          value={el.textHtml ?? ""}
                          onChange={(e) => updateElement(el.id, { textHtml: e.target.value || "<p><br/></p>" })}
                        />
                      </label>
                      <label className="block space-y-1">
                        <div>{t("panel.config.fontSize")}</div>
                        <Input
                          className="h-7"
                          type="number"
                          min={8}
                          value={el.textFontSize ?? 14}
                          onChange={(e) => updateElement(el.id, { textFontSize: Math.max(8, Number(e.target.value) || 14) })}
                        />
                      </label>
                      <label className="block space-y-1">
                        <div>{t("panel.config.textColor")}</div>
                        <Input
                          className="h-7"
                          value={el.textColor ?? ""}
                          onChange={(e) => updateElement(el.id, { textColor: e.target.value || undefined })}
                        />
                      </label>
                    </div>
                      ) : null}
                      {el.materialType === "audio" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block space-y-1 col-span-2">
                        <div>{t("panel.config.audioUrl")}</div>
                        <Input
                          className="h-7"
                          value={el.audioRemoteUrl ?? ""}
                          onChange={(e) => updateElement(el.id, { audioRemoteUrl: e.target.value || undefined })}
                        />
                      </label>
                      <label className="block space-y-1">
                        <div>{t("panel.config.effect")}</div>
                        <Select
                          value={el.audioVisualEffect ?? "pulse"}
                          onValueChange={(value) =>
                            updateElement(el.id, { audioVisualEffect: value as "none" | "pulse" | "ripple" })
                          }
                        >
                          <SelectTrigger className="h-7"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">none</SelectItem>
                            <SelectItem value="pulse">pulse</SelectItem>
                            <SelectItem value="ripple">ripple</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>
                      <label className="block space-y-1">
                        <div>{t("panel.config.speed")}</div>
                        <Select
                          value={el.audioVisualSpeed ?? "normal"}
                          onValueChange={(value) =>
                            updateElement(el.id, { audioVisualSpeed: value as "slow" | "normal" | "fast" })
                          }
                        >
                          <SelectTrigger className="h-7"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="slow">slow</SelectItem>
                            <SelectItem value="normal">normal</SelectItem>
                            <SelectItem value="fast">fast</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>
                    </div>
                      ) : null}
                      {el.materialType === "video" ? (
                    <label className="block space-y-1">
                      <div>{t("panel.config.videoUrl")}</div>
                      <Input
                        className="h-7"
                        value={el.videoRemoteUrl ?? ""}
                        onChange={(e) => updateElement(el.id, { videoRemoteUrl: e.target.value || undefined })}
                      />
                    </label>
                      ) : null}
                      {el.materialType === "grid" ? (
                    <div className="grid grid-cols-2 gap-2 rounded-lg border border-border/60 bg-muted/20 p-3">
                      <label className="block space-y-1.5">
                        <div>{t("panel.config.rows")}</div>
                        <Input className="h-7" type="number" min={1} value={el.gridRows ?? 2} onChange={(e) => updateElement(el.id, { gridRows: Math.max(1, Number(e.target.value) || 2) })} />
                      </label>
                      <label className="block space-y-1.5">
                        <div>{t("panel.config.cols")}</div>
                        <Input className="h-7" type="number" min={1} value={el.gridCols ?? 3} onChange={(e) => updateElement(el.id, { gridCols: Math.max(1, Number(e.target.value) || 3) })} />
                      </label>
                    </div>
                      ) : null}
                      {el.materialType === "geometry" ? (
                    <div className="grid grid-cols-2 gap-2 rounded-lg border border-border/60 bg-muted/20 p-3">
                      <label className="block space-y-1.5">
                        <div>{t("panel.config.shape")}</div>
                        <Select
                          value={el.geometryShape ?? "rect"}
                          onValueChange={(value) =>
                            updateElement(el.id, { geometryShape: value as PanelElement["geometryShape"] })
                          }
                        >
                          <SelectTrigger className="h-7"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rect">{t("panel.config.shapeRect")}</SelectItem>
                            <SelectItem value="circle">{t("panel.config.shapeCircle")}</SelectItem>
                            <SelectItem value="triangle">{t("panel.config.shapeTriangle")}</SelectItem>
                            <SelectItem value="diamond">{t("panel.config.shapeDiamond")}</SelectItem>
                            <SelectItem value="hexagon">{t("panel.config.shapeHexagon")}</SelectItem>
                            <SelectItem value="star">{t("panel.config.shapeStar")}</SelectItem>
                            <SelectItem value="heart">{t("panel.config.shapeHeart")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>
                      <label className="block space-y-1.5">
                        <div>{t("panel.config.color")}</div>
                        <Input
                          className="h-7"
                          value={el.geometryColor ?? "#3b82f6"}
                          onChange={(e) => updateElement(el.id, { geometryColor: e.target.value || "#3b82f6" })}
                        />
                      </label>
                    </div>
                      ) : null}
                      {el.materialType === "reference" || el.materialType === "viewport" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block space-y-1.5">
                        <div>{t("panel.config.refLayer")}</div>
                        <Select
                          value={el.refLayerId ?? "__none__"}
                          onValueChange={(value) => updateElement(el.id, { refLayerId: value === "__none__" ? undefined : value })}
                        >
                          <SelectTrigger className="h-7"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none__">{t("common.none")}</SelectItem>
                            {layers.filter((l) => l.id !== el.layerId).map((l) => (
                              <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </label>
                      <label className="block space-y-1.5">
                        <div>{t("panel.config.copy")}</div>
                        <Select
                          value={el.refCopyMode ?? "shallow"}
                          onValueChange={(value) => setReferenceCopyMode?.(el.id, value as ReferenceCopyMode)}
                        >
                          <SelectTrigger className="h-7"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="shallow">shallow</SelectItem>
                            <SelectItem value="deep">deep</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>
                    </div>
                      ) : null}
                      {el.materialType === "viewport" ? (
                    <label className="block space-y-1.5">
                      <div>{t("panel.config.viewportOverflow")}</div>
                      <Select
                        value={normalizeViewportOverflow(el.viewportOverflow)}
                        onValueChange={(value) =>
                          updateElement(el.id, {
                            viewportOverflow: value as ViewportOverflowMode,
                          })
                        }
                      >
                        <SelectTrigger className="h-7"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {VIEWPORT_OVERFLOW_MODES.map((mode) => (
                            <SelectItem key={mode} value={mode}>
                              {mode === "scroll-x"
                                ? t("panel.config.viewportOverflowScrollX")
                                : mode === "scroll-y"
                                  ? t("panel.config.viewportOverflowScrollY")
                                  : mode === "scroll"
                                    ? t("panel.config.viewportOverflowScroll")
                                    : t("panel.config.viewportOverflowClip")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>
                      ) : null}
                    </div>
                  </fieldset>
                </CardContent>
                ) : null}
              </Card>
            ))}
          {hasSearch &&
          effectiveSelectedElements.every((el) => {
            const text = `${el.name ?? ""} ${el.id} ${el.materialType ?? ""} zIndex style layer`
              .toLowerCase();
            return !text.includes(normalizedSearch);
          }) ? (
            <div className="rounded border border-border/60 bg-background px-2 py-1.5 text-[11px] text-muted-foreground">
              {t("panel.config.noEditableMatch")}
            </div>
          ) : null}
        </div>

  );
}
