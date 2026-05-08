import React, { useCallback, useEffect, useState } from "react";
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
} from "@arron/ui";
import type {
  PanelChartConfig,
  PanelElement,
  PanelElementStyle,
  ReferenceCopyMode,
} from "../types";
import { buildChartOption, CHART_TYPES } from "../utils/chartOptionBuilder";
import type { PanelLayer } from "../hooks/usePanelElements";

type UpdateElement = (
  id: string,
  patch: Partial<PanelElement>,
  options?: { batchId?: string; meta?: Record<string, unknown> }
) => void;

export type PanelConfigSidebarProps = {
  selectedElement: PanelElement | null;
  layers: PanelLayer[];
  updateElement: UpdateElement;
  setReferenceCopyMode?: (id: string, mode: ReferenceCopyMode) => void;
};

export function PanelConfigSidebar({
  selectedElement,
  layers,
  updateElement,
  setReferenceCopyMode,
}: PanelConfigSidebarProps) {
  const [isAdvancedOptionMode, setIsAdvancedOptionMode] = useState(false);
  const [optionJsonText, setOptionJsonText] = useState("{}");
  const [optionJsonError, setOptionJsonError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const themedScrollbarClass =
    "scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/80 [&::-webkit-scrollbar-thumb]:hover:bg-border";
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    nodeInfo: true,
    styleBackground: true,
    styleBorder: true,
    chartBasic: true,
    chartAdvanced: false,
    reference: true,
  });

  const isChartElement = !!selectedElement && CHART_TYPES.has(selectedElement.materialType ?? "");
  const selectedChartType = (selectedElement?.materialType ?? "") as
    | "bar"
    | "line"
    | "pie"
    | "area"
    | "scatter"
    | "radar"
    | "gauge"
    | "funnel"
    | "";

  useEffect(() => {
    if (!selectedElement) {
      setOptionJsonText("{}");
      setOptionJsonError(null);
      return;
    }
    if (CHART_TYPES.has(selectedElement.materialType ?? "")) {
      setOptionJsonText(JSON.stringify(buildChartOption(selectedElement), null, 2));
    } else {
      setOptionJsonText("{}");
    }
    setOptionJsonError(null);
  }, [selectedElement]);

  useEffect(() => {
    if (!selectedElement) return;
    if (!CHART_TYPES.has(selectedElement.materialType ?? "")) return;
    setExpandedSections((prev) => ({
      ...prev,
      chartBasic: true,
    }));
  }, [selectedElement?.id, selectedElement?.materialType]);

  const updateSelectedChart = useCallback(
    (patch: Partial<PanelChartConfig>) => {
      if (!selectedElement) return;
      updateElement(selectedElement.id, {
        chart: { ...(selectedElement.chart ?? {}), ...patch },
      });
    },
    [selectedElement, updateElement]
  );

  const updateSelectedStyle = useCallback(
    (patch: Partial<PanelElementStyle>) => {
      if (!selectedElement) return;
      updateElement(selectedElement.id, {
        style: { ...(selectedElement.style ?? {}), ...patch },
      });
    },
    [selectedElement, updateElement]
  );

  const handleUploadBackgroundImage = useCallback(
    async (file: File) => {
      if (!selectedElement) return;
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(new Error("读取图片失败"));
        reader.readAsDataURL(file);
      });
      updateSelectedStyle({
        backgroundImage: `url("${base64}")`,
      });
      setUploadStatus("已写入 base64");
      try {
        const form = new FormData();
        form.append("file", file);
        const resp = await fetch("/api/upload", { method: "POST", body: form });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = (await resp.json()) as { url?: string };
        if (data.url) {
          updateSelectedStyle({ backgroundImageRemoteUrl: data.url });
          setUploadStatus("已上传服务器并写入 base64");
        }
      } catch {
        setUploadStatus("服务器上传失败，仅保留 base64");
      }
    },
    [selectedElement, updateSelectedStyle]
  );

  const isSectionExpanded = (key: string, defaultValue = true) =>
    expandedSections[key] ?? defaultValue;

  const setSectionExpanded = (key: string, next: boolean) => {
    setExpandedSections((prev) => ({ ...prev, [key]: next }));
  };

  const renderSection = (
    key: string,
    title: string,
    children: React.ReactNode,
    defaultOpen = true
  ) => (
    <Collapsible
      open={isSectionExpanded(key, defaultOpen)}
      onOpenChange={(open) => setSectionExpanded(key, open)}
      className="rounded border border-border bg-card"
    >
      <div className="flex items-center gap-1 px-2 py-1.5">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded text-xs hover:bg-accent"
          >
            {isSectionExpanded(key, defaultOpen) ? "▾" : "▸"}
          </button>
        </CollapsibleTrigger>
        <div className="text-muted-foreground">{title}</div>
      </div>
      <CollapsibleContent className="space-y-2 border-t border-border/60 p-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  const renderColorField = (
    label: string,
    value: string,
    onTextChange: (next: string) => void
  ) => (
    <label className="block">
      <div className="mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="#000000"
          className="h-7"
        />
        <Input
          type="color"
          value={/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value || "") ? value : "#000000"}
          onChange={(e) => onTextChange(e.target.value)}
          className="h-7 w-10 cursor-pointer p-1"
          aria-label={`${label}调色盘`}
        />
      </div>
    </label>
  );

  return (
    <aside
      className={`h-full overflow-auto border-l border-border bg-background px-3 py-3 text-foreground ${themedScrollbarClass}`}
    >
      <div className="mb-2 text-xs font-semibold">配置</div>
      {!selectedElement ? (
        <div className="text-xs leading-6 text-muted-foreground">请选择一个节点后进行配置</div>
      ) : (
        <div className="space-y-3 text-xs">
          {renderSection(
            "nodeInfo",
            "节点信息",
            <>
              <label className="block">
                <div className="mb-1">节点名称</div>
                <Input
                  value={selectedElement.name ?? ""}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      name: e.target.value || undefined,
                    })
                  }
                  placeholder="自定义节点名称（显示在节点树）"
                  className="h-7"
                />
              </label>
              <div className="truncate">ID: {selectedElement.id}</div>
              <div>类型: {selectedElement.materialType ?? selectedElement.id}</div>
            </>
          )}

          {renderSection(
            "styleBackground",
            "通用样式 / 背景",
            <>
              {renderColorField(
                "背景色",
                selectedElement.style?.backgroundColor ?? "",
                (next) => updateSelectedStyle({ backgroundColor: next || undefined })
              )}
              <label className="block">
                <div className="mb-1">背景图</div>
                <Input
                  value={selectedElement.style?.backgroundImage ?? ""}
                  onChange={(e) => updateSelectedStyle({ backgroundImage: e.target.value || undefined })}
                  placeholder='url("https://...") / linear-gradient(...)'
                  className="h-7"
                />
              </label>
              <div className="flex items-center gap-2">
                <label className="inline-flex cursor-pointer items-center rounded border border-border px-2 py-1 text-[11px] hover:bg-accent">
                  上传图片
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.currentTarget.value = "";
                      if (!file) return;
                      await handleUploadBackgroundImage(file);
                    }}
                  />
                </label>
                {uploadStatus ? (
                  <span className="text-[11px] text-muted-foreground">{uploadStatus}</span>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <div className="mb-1">背景尺寸</div>
                  <Input
                    value={selectedElement.style?.backgroundSize ?? ""}
                    onChange={(e) => updateSelectedStyle({ backgroundSize: e.target.value || undefined })}
                    placeholder="cover"
                    className="h-7"
                  />
                </label>
                <label className="block">
                  <div className="mb-1">背景位置</div>
                  <Input
                    value={selectedElement.style?.backgroundPosition ?? ""}
                    onChange={(e) => updateSelectedStyle({ backgroundPosition: e.target.value || undefined })}
                    placeholder="center"
                    className="h-7"
                  />
                </label>
              </div>
            </>
          )}

          {renderSection(
            "styleBorder",
            "通用样式 / 边框",
            <>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <div className="mb-1">边框宽度（px）</div>
                  <Input
                    type="number"
                    min={0}
                    value={selectedElement.style?.borderWidth ?? 0}
                    onChange={(e) =>
                      updateSelectedStyle({ borderWidth: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="h-7"
                  />
                </label>
                <label className="block">
                  <div className="mb-1">边框圆角（px）</div>
                  <Input
                    type="number"
                    min={0}
                    value={selectedElement.style?.borderRadius ?? 0}
                    onChange={(e) =>
                      updateSelectedStyle({ borderRadius: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="h-7"
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <div className="mb-1">边框样式</div>
                  <Select
                    value={selectedElement.style?.borderStyle ?? "solid"}
                    onValueChange={(value) =>
                      updateSelectedStyle({
                        borderStyle: value as NonNullable<PanelElementStyle["borderStyle"]>,
                      })
                    }
                  >
                    <SelectTrigger className="h-7">
                      <SelectValue placeholder="请选择边框样式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">none</SelectItem>
                      <SelectItem value="solid">solid</SelectItem>
                      <SelectItem value="dashed">dashed</SelectItem>
                      <SelectItem value="dotted">dotted</SelectItem>
                      <SelectItem value="double">double</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
                {renderColorField(
                  "边框颜色",
                  selectedElement.style?.borderColor ?? "",
                  (next) => updateSelectedStyle({ borderColor: next || undefined })
                )}
              </div>
            </>
          )}

          {isChartElement ? (
            <>
              {renderSection(
                "chartBasic",
                "图表配置 / 基础",
                <>
                  <label className="block">
                    <div className="mb-1">标题</div>
                    <Input
                      value={selectedElement.chart?.title ?? ""}
                      onChange={(e) => updateSelectedChart({ title: e.target.value })}
                      className="h-7"
                    />
                  </label>

                  {renderColorField(
                    "主色",
                    selectedElement.chart?.color ?? "#3b82f6",
                    (next) => updateSelectedChart({ color: next || "#3b82f6" })
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedElement.chart?.tooltipShow ?? true}
                        className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                        onCheckedChange={(checked) =>
                          updateSelectedChart({ tooltipShow: checked === true })
                        }
                      />
                      <span>显示 Tooltip</span>
                    </label>
                    <label className="block">
                      <div className="mb-1">Tooltip 触发方式</div>
                      <Select
                        value={selectedElement.chart?.tooltipTrigger ?? "axis"}
                        onValueChange={(value) =>
                          updateSelectedChart({ tooltipTrigger: value as "axis" | "item" })
                        }
                      >
                        <SelectTrigger className="h-7">
                          <SelectValue placeholder="请选择触发方式" />
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
                      "Tooltip 背景色",
                      selectedElement.chart?.tooltipBackgroundColor ?? "#0f172a",
                      (next) => updateSelectedChart({ tooltipBackgroundColor: next || "#0f172a" })
                    )}
                    {renderColorField(
                      "Tooltip 文字色",
                      selectedElement.chart?.tooltipTextColor ?? "#f8fafc",
                      (next) => updateSelectedChart({ tooltipTextColor: next || "#f8fafc" })
                    )}
                  </div>
                  <label className="block">
                    <div className="mb-1">Tooltip Formatter（可选）</div>
                    <Input
                      value={selectedElement.chart?.tooltipFormatter ?? ""}
                      onChange={(e) =>
                        updateSelectedChart({ tooltipFormatter: e.target.value || undefined })
                      }
                      placeholder="例如：{b}: {c}"
                      className="h-7"
                    />
                  </label>
                  <label className="block">
                    <div className="mb-1">显示模式</div>
                    <Select
                      value={selectedElement.chart?.renderMode ?? "canvas"}
                      onValueChange={(value) =>
                        updateSelectedChart({ renderMode: value as "canvas" | "svg" })
                      }
                    >
                      <SelectTrigger className="h-7">
                        <SelectValue placeholder="请选择显示模式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="canvas">Canvas</SelectItem>
                        <SelectItem value="svg">SVG</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>

                  <label className="block">
                    <div className="mb-1">类目（逗号分隔）</div>
                    <Input
                      value={(selectedElement.chart?.labels ?? []).join(",")}
                      onChange={(e) =>
                        updateSelectedChart({
                          labels: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      className="h-7"
                    />
                  </label>

                  <label className="block">
                    <div className="mb-1">数值（逗号分隔）</div>
                    <Input
                      value={(selectedElement.chart?.values ?? []).join(",")}
                      onChange={(e) =>
                        updateSelectedChart({
                          values: e.target.value
                            .split(",")
                            .map((s) => Number(s.trim()))
                            .filter((n) => Number.isFinite(n)),
                        })
                      }
                      className="h-7"
                    />
                  </label>

                  {selectedChartType === "bar" ||
                  selectedChartType === "line" ||
                  selectedChartType === "area" ||
                  selectedChartType === "scatter" ? (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="block">
                          <div className="mb-1">X 轴名称</div>
                          <Input
                            value={selectedElement.chart?.xAxisName ?? ""}
                            onChange={(e) => updateSelectedChart({ xAxisName: e.target.value })}
                            placeholder="例如：日期 / 类目"
                            className="h-7"
                          />
                        </label>
                        <label className="block">
                          <div className="mb-1">Y 轴名称</div>
                          <Input
                            value={selectedElement.chart?.yAxisName ?? ""}
                            onChange={(e) => updateSelectedChart({ yAxisName: e.target.value })}
                            placeholder="例如：销量 / 数值"
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
                          <span>X 轴刻度线</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedElement.chart?.yAxisTickShow ?? true}
                            className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                            onCheckedChange={(checked) =>
                              updateSelectedChart({ yAxisTickShow: checked === true })
                            }
                          />
                          <span>Y 轴刻度线</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {renderColorField(
                          "X 轴刻度线颜色",
                          selectedElement.chart?.xAxisTickColor ?? "#94a3b8",
                          (next) => updateSelectedChart({ xAxisTickColor: next || "#94a3b8" })
                        )}
                        {renderColorField(
                          "Y 轴刻度线颜色",
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
                          <span>X 轴分割线</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedElement.chart?.yAxisSplitLineShow ?? true}
                            className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                            onCheckedChange={(checked) =>
                              updateSelectedChart({ yAxisSplitLineShow: checked === true })
                            }
                          />
                          <span>Y 轴分割线</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {renderColorField(
                          "X 轴分割线颜色",
                          selectedElement.chart?.xAxisSplitLineColor ?? "#e2e8f0",
                          (next) => updateSelectedChart({ xAxisSplitLineColor: next || "#e2e8f0" })
                        )}
                        {renderColorField(
                          "Y 轴分割线颜色",
                          selectedElement.chart?.yAxisSplitLineColor ?? "#e2e8f0",
                          (next) => updateSelectedChart({ yAxisSplitLineColor: next || "#e2e8f0" })
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {renderColorField(
                          "X 轴标签颜色",
                          selectedElement.chart?.xAxisLabelColor ?? "#64748b",
                          (next) => updateSelectedChart({ xAxisLabelColor: next || "#64748b" })
                        )}
                        {renderColorField(
                          "Y 轴标签颜色",
                          selectedElement.chart?.yAxisLabelColor ?? "#64748b",
                          (next) => updateSelectedChart({ yAxisLabelColor: next || "#64748b" })
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="block">
                          <div className="mb-1">X 轴标签字号</div>
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
                          <div className="mb-1">Y 轴标签字号</div>
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
                          <span>X 轴标签自动缩略</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedElement.chart?.yAxisLabelAutoEllipsis ?? false}
                            className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                            onCheckedChange={(checked) =>
                              updateSelectedChart({ yAxisLabelAutoEllipsis: checked === true })
                            }
                          />
                          <span>Y 轴标签自动缩略</span>
                        </label>
                      </div>
                    </>
                  ) : null}

                  {selectedChartType === "bar" ? (
                    <label className="block">
                      <div className="mb-1">柱宽（px）</div>
                      <Input
                        type="number"
                        min={1}
                        value={selectedElement.chart?.barWidth ?? 24}
                        onChange={(e) =>
                          updateSelectedChart({ barWidth: Math.max(1, Number(e.target.value) || 1) })
                        }
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
                      <span>平滑曲线</span>
                    </label>
                  ) : null}

                  {selectedChartType === "pie" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block">
                        <div className="mb-1">内半径（%）</div>
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
                      <label className="block">
                        <div className="mb-1">外半径（%）</div>
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
              )}

              {renderSection(
                "chartAdvanced",
                "图表配置 / 高级（JSON）",
                <>
                  <label className="mb-2 flex items-center gap-2">
                    <Checkbox
                      checked={isAdvancedOptionMode}
                      className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                      onCheckedChange={(checked) => setIsAdvancedOptionMode(checked === true)}
                    />
                    <span>JSON 高级模式（直接编辑 ECharts option）</span>
                  </label>
                  {isAdvancedOptionMode ? (
                    <div className="space-y-2">
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
                            setOptionJsonError("JSON 格式错误，修正后会自动应用");
                          }
                        }}
                        spellCheck={false}
                        className="h-40 font-mono text-[11px]"
                      />
                      {optionJsonError ? (
                        <div className="text-[11px] text-destructive">{optionJsonError}</div>
                      ) : (
                        <div className="text-[11px] text-muted-foreground">
                          JSON 有效时会实时覆盖到图表 option（与基础配置合并）。
                        </div>
                      )}
                    </div>
                  ) : null}
                </>,
                false
              )}
            </>
          ) : selectedElement.materialType === "reference" ? (
            renderSection(
              "reference",
              "引用组件配置",
              <>
                <label className="block">
                  <div className="mb-1">引用图层</div>
                  <Select
                    value={selectedElement.refLayerId ?? "__none__"}
                    onValueChange={(value) =>
                      updateElement(selectedElement.id, {
                        refLayerId: value === "__none__" ? undefined : value,
                      })
                    }
                  >
                    <SelectTrigger className="h-7">
                      <SelectValue placeholder="请选择图层" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">无（不引用）</SelectItem>
                      {layers
                        .filter((l) => l.id !== selectedElement.layerId)
                        .map((l) => (
                          <SelectItem key={l.id} value={l.id}>
                            {l.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </label>
                <label className="block">
                  <div className="mb-1">拷贝模式</div>
                  <Select
                    value={selectedElement.refCopyMode ?? "shallow"}
                    onValueChange={(value) =>
                      setReferenceCopyMode?.(
                        selectedElement.id,
                        value as ReferenceCopyMode
                      )
                    }
                  >
                    <SelectTrigger className="h-7">
                      <SelectValue placeholder="请选择拷贝模式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shallow">浅拷贝（跟随源图层变化）</SelectItem>
                      <SelectItem value="deep">深拷贝（冻结当前引用快照）</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
                <div className="text-[11px] text-muted-foreground">
                  浅拷贝会实时同步被引用图层；深拷贝会固定当前快照，不再随源变化。
                </div>
              </>
            )
          ) : (
            <div className="text-xs leading-6 text-muted-foreground">
              当前节点不是图表类型，暂无图表配置项。
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

