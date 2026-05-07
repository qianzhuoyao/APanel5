import React, { useCallback, useEffect, useState } from "react";
import type {
  PanelChartConfig,
  PanelElement,
  PanelElementStyle,
  ReferenceCopyMode,
} from "../types";
import { CHART_TYPES } from "../utils/chartOptionBuilder";
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
    setOptionJsonText(JSON.stringify(selectedElement.chart?.option ?? {}, null, 2));
    setOptionJsonError(null);
  }, [selectedElement]);

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

  return (
    <aside className="h-full border-l border-border bg-background px-3 py-3 text-foreground">
      <div className="mb-2 text-xs font-semibold">配置</div>
      {!selectedElement ? (
        <div className="text-xs leading-6 text-muted-foreground">请选择一个节点后进行配置</div>
      ) : (
        <div className="space-y-3 text-xs">
          <div className="rounded border border-border bg-card p-2">
            <div className="mb-1 text-muted-foreground">节点信息</div>
            <div className="truncate">ID: {selectedElement.id}</div>
            <div>类型: {selectedElement.materialType ?? selectedElement.id}</div>
          </div>

          <div className="space-y-2 rounded border border-border bg-card p-2">
            <div className="text-muted-foreground">通用样式</div>
            <label className="block">
              <div className="mb-1">背景色</div>
              <input
                value={selectedElement.style?.backgroundColor ?? ""}
                onChange={(e) => updateSelectedStyle({ backgroundColor: e.target.value || undefined })}
                placeholder="#ffffff"
                className="h-7 w-full rounded border border-border bg-background px-2"
              />
            </label>
            <label className="block">
              <div className="mb-1">背景图</div>
              <input
                value={selectedElement.style?.backgroundImage ?? ""}
                onChange={(e) => updateSelectedStyle({ backgroundImage: e.target.value || undefined })}
                placeholder='url("https://...") / linear-gradient(...)'
                className="h-7 w-full rounded border border-border bg-background px-2"
              />
            </label>
            <div className="flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center rounded border border-border px-2 py-1 text-[11px] hover:bg-accent">
                上传图片
                <input
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
                <input
                  value={selectedElement.style?.backgroundSize ?? ""}
                  onChange={(e) => updateSelectedStyle({ backgroundSize: e.target.value || undefined })}
                  placeholder="cover"
                  className="h-7 w-full rounded border border-border bg-background px-2"
                />
              </label>
              <label className="block">
                <div className="mb-1">背景位置</div>
                <input
                  value={selectedElement.style?.backgroundPosition ?? ""}
                  onChange={(e) => updateSelectedStyle({ backgroundPosition: e.target.value || undefined })}
                  placeholder="center"
                  className="h-7 w-full rounded border border-border bg-background px-2"
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <div className="mb-1">边框宽度（px）</div>
                <input
                  type="number"
                  min={0}
                  value={selectedElement.style?.borderWidth ?? 0}
                  onChange={(e) =>
                    updateSelectedStyle({ borderWidth: Math.max(0, Number(e.target.value) || 0) })
                  }
                  className="h-7 w-full rounded border border-border bg-background px-2"
                />
              </label>
              <label className="block">
                <div className="mb-1">边框圆角（px）</div>
                <input
                  type="number"
                  min={0}
                  value={selectedElement.style?.borderRadius ?? 0}
                  onChange={(e) =>
                    updateSelectedStyle({ borderRadius: Math.max(0, Number(e.target.value) || 0) })
                  }
                  className="h-7 w-full rounded border border-border bg-background px-2"
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <div className="mb-1">边框样式</div>
                <select
                  value={selectedElement.style?.borderStyle ?? "solid"}
                  onChange={(e) =>
                    updateSelectedStyle({
                      borderStyle: e.target.value as NonNullable<PanelElementStyle["borderStyle"]>,
                    })
                  }
                  className="h-7 w-full rounded border border-border bg-background px-2"
                >
                  <option value="none">none</option>
                  <option value="solid">solid</option>
                  <option value="dashed">dashed</option>
                  <option value="dotted">dotted</option>
                  <option value="double">double</option>
                </select>
              </label>
              <label className="block">
                <div className="mb-1">边框颜色</div>
                <input
                  value={selectedElement.style?.borderColor ?? ""}
                  onChange={(e) => updateSelectedStyle({ borderColor: e.target.value || undefined })}
                  placeholder="#000000"
                  className="h-7 w-full rounded border border-border bg-background px-2"
                />
              </label>
            </div>
          </div>

          {isChartElement ? (
            <div className="space-y-2 rounded border border-border bg-card p-2">
              <div className="text-muted-foreground">图表配置（实时生效）</div>

              <label className="block">
                <div className="mb-1">标题</div>
                <input
                  value={selectedElement.chart?.title ?? ""}
                  onChange={(e) => updateSelectedChart({ title: e.target.value })}
                  className="h-7 w-full rounded border border-border bg-background px-2"
                />
              </label>

              <label className="block">
                <div className="mb-1">主色</div>
                <input
                  value={selectedElement.chart?.color ?? "#3b82f6"}
                  onChange={(e) => updateSelectedChart({ color: e.target.value })}
                  className="h-7 w-full rounded border border-border bg-background px-2"
                />
              </label>

              <label className="block">
                <div className="mb-1">类目（逗号分隔）</div>
                <input
                  value={(selectedElement.chart?.labels ?? []).join(",")}
                  onChange={(e) =>
                    updateSelectedChart({
                      labels: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="h-7 w-full rounded border border-border bg-background px-2"
                />
              </label>

              <label className="block">
                <div className="mb-1">数值（逗号分隔）</div>
                <input
                  value={(selectedElement.chart?.values ?? []).join(",")}
                  onChange={(e) =>
                    updateSelectedChart({
                      values: e.target.value
                        .split(",")
                        .map((s) => Number(s.trim()))
                        .filter((n) => Number.isFinite(n)),
                    })
                  }
                  className="h-7 w-full rounded border border-border bg-background px-2"
                />
              </label>

              {selectedChartType === "bar" ? (
                <label className="block">
                  <div className="mb-1">柱宽（px）</div>
                  <input
                    type="number"
                    min={1}
                    value={selectedElement.chart?.barWidth ?? 24}
                    onChange={(e) =>
                      updateSelectedChart({ barWidth: Math.max(1, Number(e.target.value) || 1) })
                    }
                    className="h-7 w-full rounded border border-border bg-background px-2"
                  />
                </label>
              ) : null}

              {selectedChartType === "line" || selectedChartType === "area" ? (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedElement.chart?.smooth ?? true}
                    onChange={(e) => updateSelectedChart({ smooth: e.target.checked })}
                  />
                  <span>平滑曲线</span>
                </label>
              ) : null}

              {selectedChartType === "pie" ? (
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <div className="mb-1">内半径（%）</div>
                    <input
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
                      className="h-7 w-full rounded border border-border bg-background px-2"
                    />
                  </label>
                  <label className="block">
                    <div className="mb-1">外半径（%）</div>
                    <input
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
                      className="h-7 w-full rounded border border-border bg-background px-2"
                    />
                  </label>
                </div>
              ) : null}

              <div className="mt-2 rounded border border-border p-2">
                <label className="mb-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isAdvancedOptionMode}
                    onChange={(e) => setIsAdvancedOptionMode(e.target.checked)}
                  />
                  <span>JSON 高级模式（直接编辑 ECharts option）</span>
                </label>
                {isAdvancedOptionMode ? (
                  <div className="space-y-2">
                    <textarea
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
                      className="h-40 w-full rounded border border-border bg-background p-2 font-mono text-[11px]"
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
              </div>
            </div>
          ) : selectedElement.materialType === "reference" ? (
            <div className="space-y-2 rounded border border-border bg-card p-2">
              <div className="text-muted-foreground">引用组件配置</div>
              <label className="block">
                <div className="mb-1">引用图层</div>
                <select
                  value={selectedElement.refLayerId ?? ""}
                  onChange={(e) => updateElement(selectedElement.id, { refLayerId: e.target.value || undefined })}
                  className="h-7 w-full rounded border border-border bg-background px-2"
                >
                  <option value="">请选择图层</option>
                  {layers
                    .filter((l) => l.id !== selectedElement.layerId)
                    .map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                </select>
              </label>
              <label className="block">
                <div className="mb-1">拷贝模式</div>
                <select
                  value={selectedElement.refCopyMode ?? "shallow"}
                  onChange={(e) =>
                    setReferenceCopyMode?.(
                      selectedElement.id,
                      e.target.value as ReferenceCopyMode
                    )
                  }
                  className="h-7 w-full rounded border border-border bg-background px-2"
                >
                  <option value="shallow">浅拷贝（跟随源图层变化）</option>
                  <option value="deep">深拷贝（冻结当前引用快照）</option>
                </select>
              </label>
              <div className="text-[11px] text-muted-foreground">
                浅拷贝会实时同步被引用图层；深拷贝会固定当前快照，不再随源变化。
              </div>
            </div>
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

