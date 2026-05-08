import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Empty,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
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
import { PANEL_MESSAGES } from "../constants/messages";

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
  nodeZOrderLabel?: string;
  onAdjustNodeZOrder?: (
    nodeId: string,
    action: "bringForward" | "sendBackward" | "bringToFront" | "sendToBack"
  ) => void;
};

export function PanelConfigSidebar({
  selectedElement,
  layers,
  updateElement,
  setReferenceCopyMode,
  nodeZOrderLabel,
  onAdjustNodeZOrder,
}: PanelConfigSidebarProps) {
  const [isAdvancedOptionMode, setIsAdvancedOptionMode] = useState(false);
  const [optionJsonText, setOptionJsonText] = useState("{}");
  const [optionJsonError, setOptionJsonError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [audioStatus, setAudioStatus] = useState<string>("");
  const [videoStatus, setVideoStatus] = useState<string>("");
  const [configSearch, setConfigSearch] = useState("");
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);
  const SEARCH_COLLAPSE_STORAGE_KEY = "panel:config-search-collapsed";
  const textEditorRef = useRef<HTMLDivElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
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
  const selectedLayer = selectedElement
    ? layers.find((layer) => layer.id === selectedElement.layerId) ?? null
    : null;
  const canToggleNodeLock = !!selectedElement && !selectedLayer?.locked;
  const isNodeEditable = !!selectedElement && !selectedElement.locked && !selectedLayer?.locked;
  const readonlyReason = !selectedElement
    ? ""
    : selectedElement.locked
      ? PANEL_MESSAGES.nodeConfigLocked
      : selectedLayer?.locked
        ? PANEL_MESSAGES.nodeConfigLayerLocked
        : "";
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
  const normalizedSearch = useMemo(() => configSearch.trim().toLowerCase(), [configSearch]);
  const hasSearch = normalizedSearch.length > 0;

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

  useEffect(() => {
    if (!selectedElement || selectedElement.materialType !== "text") return;
    const nextHtml = selectedElement.textHtml ?? "<p>双击输入文本</p>";
    if (textEditorRef.current && textEditorRef.current.innerHTML !== nextHtml) {
      textEditorRef.current.innerHTML = nextHtml;
    }
  }, [selectedElement?.id, selectedElement?.materialType, selectedElement?.textHtml]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(SEARCH_COLLAPSE_STORAGE_KEY);
    if (saved === "1") setIsSearchCollapsed(true);
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SEARCH_COLLAPSE_STORAGE_KEY, isSearchCollapsed ? "1" : "0");
  }, [isSearchCollapsed]);
  useEffect(
    () => () => {
      recordStreamRef.current?.getTracks().forEach((track) => track.stop());
    },
    []
  );

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
  const updateSelectedText = useCallback(
    (patch: Partial<PanelElement>) => {
      if (!selectedElement || selectedElement.materialType !== "text") return;
      updateElement(selectedElement.id, patch);
    },
    [selectedElement, updateElement]
  );

  const handleUploadBackgroundImage = useCallback(
    async (file: File) => {
      if (!selectedElement) return;
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(new Error(PANEL_MESSAGES.readImageFailed));
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
  const updateSelectedAudio = useCallback(
    (patch: Partial<PanelElement>) => {
      if (!selectedElement || selectedElement.materialType !== "audio") return;
      updateElement(selectedElement.id, patch);
    },
    [selectedElement, updateElement]
  );
  const handleUploadAudioFile = useCallback(
    async (file: File) => {
      if (!selectedElement || selectedElement.materialType !== "audio") return;
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(new Error(PANEL_MESSAGES.readAudioFailed));
        reader.readAsDataURL(file);
      });
      updateSelectedAudio({ audioSrc: base64 });
      setAudioStatus(PANEL_MESSAGES.audioLocalSaved);
      try {
        const form = new FormData();
        form.append("file", file);
        const resp = await fetch("/api/upload", { method: "POST", body: form });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = (await resp.json()) as { url?: string };
        if (data.url) {
          updateSelectedAudio({ audioRemoteUrl: data.url });
          setAudioStatus(PANEL_MESSAGES.audioRemoteUploaded);
        }
      } catch {
        setAudioStatus(PANEL_MESSAGES.audioServerUploadFailed);
      }
    },
    [selectedElement, updateSelectedAudio]
  );
  const handleUploadAudioPoster = useCallback(
    async (file: File) => {
      if (!selectedElement || selectedElement.materialType !== "audio") return;
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(new Error(PANEL_MESSAGES.readImageFailed));
        reader.readAsDataURL(file);
      });
      updateSelectedAudio({ audioPosterImage: base64 });
      setAudioStatus(PANEL_MESSAGES.audioPosterSet);
    },
    [selectedElement, updateSelectedAudio]
  );
  const stopRecordingAudio = useCallback(() => {
    recorderRef.current?.stop();
  }, []);
  const startRecordingAudio = useCallback(async () => {
    if (!selectedElement || selectedElement.materialType !== "audio") return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setAudioStatus(PANEL_MESSAGES.audioRecordUnsupported);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result ?? ""));
          reader.onerror = () => reject(new Error(PANEL_MESSAGES.readRecordAudioFailed));
          reader.readAsDataURL(blob);
        });
        updateSelectedAudio({ audioSrc: dataUrl });
        setAudioStatus(PANEL_MESSAGES.audioRecordSaved);
        recordStreamRef.current?.getTracks().forEach((track) => track.stop());
        recordStreamRef.current = null;
        recorderRef.current = null;
        setIsRecordingAudio(false);
      };
      recorder.start();
      setIsRecordingAudio(true);
      setAudioStatus(PANEL_MESSAGES.audioRecording);
    } catch {
      setAudioStatus(PANEL_MESSAGES.audioRecordStartFailed);
      setIsRecordingAudio(false);
    }
  }, [selectedElement, updateSelectedAudio]);
  const updateSelectedVideo = useCallback(
    (patch: Partial<PanelElement>) => {
      if (!selectedElement || selectedElement.materialType !== "video") return;
      updateElement(selectedElement.id, patch);
    },
    [selectedElement, updateElement]
  );
  const handleUploadVideoFile = useCallback(
    async (file: File) => {
      if (!selectedElement || selectedElement.materialType !== "video") return;
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(new Error(PANEL_MESSAGES.readVideoFailed));
        reader.readAsDataURL(file);
      });
      updateSelectedVideo({ videoSrc: base64 });
      setVideoStatus(PANEL_MESSAGES.videoLocalSaved);
      try {
        const form = new FormData();
        form.append("file", file);
        const resp = await fetch("/api/upload", { method: "POST", body: form });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = (await resp.json()) as { url?: string };
        if (data.url) {
          updateSelectedVideo({ videoRemoteUrl: data.url });
          setVideoStatus(PANEL_MESSAGES.videoRemoteUploaded);
        }
      } catch {
        setVideoStatus(PANEL_MESSAGES.videoServerUploadFailed);
      }
    },
    [selectedElement, updateSelectedVideo]
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
    defaultOpen = true,
    searchTerms: string[] = []
  ) => {
    const hit =
      !hasSearch ||
      [title, ...searchTerms].some((term) => term.toLowerCase().includes(normalizedSearch));
    if (!hit) return null;
    renderedSectionCount += 1;
    return (
    <Collapsible
      open={hasSearch ? true : isSectionExpanded(key, defaultOpen)}
      onOpenChange={(open) => setSectionExpanded(key, open)}
      className="rounded-xl border border-border/70 bg-card/95 shadow-sm"
    >
      <div className="flex items-center gap-1.5 px-3 py-2">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded-md text-xs hover:bg-accent"
          >
            {isSectionExpanded(key, defaultOpen) ? "▾" : "▸"}
          </button>
        </CollapsibleTrigger>
        <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">{title}</div>
      </div>
      <CollapsibleContent className="space-y-3 border-t border-border/60 bg-muted/[0.1] px-3 pb-3 pt-2.5">
        {children}
      </CollapsibleContent>
    </Collapsible>
    );
  };

  const renderFieldGroup = (title: string, children: React.ReactNode) => (
    <div className="space-y-2.5 rounded-lg border border-border/55 bg-background/80 p-2.5">
      <div className="text-[11px] font-semibold text-muted-foreground">{title}</div>
      {children}
    </div>
  );

  const renderColorField = (
    label: string,
    value: string,
    onTextChange: (next: string) => void
  ) => (
    <label className="block space-y-1.5">
      <div className="text-[11px] text-muted-foreground">{label}</div>
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
  const execTextCommand = (cmd: "bold" | "italic" | "underline") => {
    textEditorRef.current?.focus();
    document.execCommand(cmd);
    const next = textEditorRef.current?.innerHTML ?? "";
    if (selectedElement?.materialType === "text") {
      updateElement(selectedElement.id, { textHtml: next || "<p><br/></p>" });
    }
  };

  let renderedSectionCount = 0;
  return (
    <aside
      className={`h-full overflow-auto border-l border-border bg-muted/[0.14] px-3 py-3 text-foreground ${themedScrollbarClass}`}
    >
      <div className="sticky top-0 z-20 mb-3 rounded-lg border border-border/70 bg-card/95 px-2.5 py-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-semibold tracking-wide">配置面板</div>
          <button
            type="button"
            className="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-accent"
            onClick={() => setIsSearchCollapsed((prev) => !prev)}
          >
            {isSearchCollapsed ? "展开搜索" : "收起搜索"}
          </button>
        </div>
        {!isSearchCollapsed ? (
          <div className="mt-2">
            <Input
              value={configSearch}
              onChange={(e) => setConfigSearch(e.target.value)}
              placeholder="搜索配置，如：边框、tooltip、音频、网格..."
              className="h-7"
            />
            {hasSearch ? (
              <div className="mt-1 text-[11px] text-muted-foreground">搜索中：{configSearch}</div>
            ) : null}
          </div>
        ) : null}
      </div>
      {!selectedElement ? (
        <Empty className="py-7">
          <EmptyIcon>
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <rect x="4" y="4" width="16" height="16" rx="2.5" />
              <path d="M8 9h8M8 12h8M8 15h5" />
            </svg>
          </EmptyIcon>
          <EmptyTitle>暂无可配置节点</EmptyTitle>
          <EmptyDescription>请先在画布中选中一个节点，再到这里进行配置。</EmptyDescription>
        </Empty>
      ) : (
        <div className="space-y-3">
          {!isNodeEditable ? (
            <div className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1.5 text-[11px] text-amber-700 dark:text-amber-300">
              {readonlyReason}
            </div>
          ) : null}
          <div className="rounded-lg border border-border/60 bg-card/80 px-2.5 py-2 text-xs">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={selectedElement.locked === true}
                disabled={!canToggleNodeLock}
                className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                onCheckedChange={(checked) =>
                  updateElement(selectedElement.id, {
                    locked: checked === true,
                  })
                }
              />
              <span>锁定节点（禁止层级/位置/大小/旋转）</span>
            </label>
          </div>
          <fieldset disabled={!isNodeEditable} className={!isNodeEditable ? "opacity-60" : ""}>
            <div className="space-y-3.5 text-xs">
              {renderSection(
            "nodeInfo",
            "节点信息",
            <>
              <label className="block space-y-1">
                <div>节点名称</div>
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
              <div className="space-y-1.5">
                <div className="text-[11px] text-muted-foreground">节点层级</div>
                <div className="text-[11px] text-muted-foreground/90">
                  当前 zIndex：{nodeZOrderLabel ?? "-"}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="rounded border border-border bg-background px-2 py-1 text-[11px] hover:bg-accent"
                    onClick={() => onAdjustNodeZOrder?.(selectedElement.id, "bringForward")}
                  >
                    上移一层
                  </button>
                  <button
                    type="button"
                    className="rounded border border-border bg-background px-2 py-1 text-[11px] hover:bg-accent"
                    onClick={() => onAdjustNodeZOrder?.(selectedElement.id, "sendBackward")}
                  >
                    下移一层
                  </button>
                  <button
                    type="button"
                    className="rounded border border-border bg-background px-2 py-1 text-[11px] hover:bg-accent"
                    onClick={() => onAdjustNodeZOrder?.(selectedElement.id, "bringToFront")}
                  >
                    置顶
                  </button>
                  <button
                    type="button"
                    className="rounded border border-border bg-background px-2 py-1 text-[11px] hover:bg-accent"
                    onClick={() => onAdjustNodeZOrder?.(selectedElement.id, "sendToBack")}
                  >
                    置底
                  </button>
                </div>
              </div>
              <div className="truncate text-muted-foreground">ID: {selectedElement.id}</div>
              <div className="text-muted-foreground">类型: {selectedElement.materialType ?? selectedElement.id}</div>
            </>,
            true,
            ["名称", "id", "类型", "锁定", "locked", "name"]
          )}

          {renderSection(
            "styleBackground",
            "通用样式 / 背景",
            <>
              {renderFieldGroup(
                "背景填充",
                <>
                  {renderColorField(
                    "背景色",
                    selectedElement.style?.backgroundColor ?? "",
                    (next) => updateSelectedStyle({ backgroundColor: next || undefined })
                  )}
                  <label className="block space-y-1">
                    <div>背景图</div>
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
                </>
              )}
              {renderFieldGroup(
                "背景布局",
                <div className="grid grid-cols-2 gap-2">
                  <label className="block space-y-1">
                    <div>背景尺寸</div>
                    <Select
                      value={selectedElement.style?.backgroundSize ?? "__none__"}
                      onValueChange={(value) =>
                        updateSelectedStyle({
                          backgroundSize: value === "__none__" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger className="h-7">
                        <SelectValue placeholder="选择背景尺寸" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">默认</SelectItem>
                        <SelectItem value="cover">cover</SelectItem>
                        <SelectItem value="contain">contain</SelectItem>
                        <SelectItem value="100% 100%">100% 100%</SelectItem>
                        <SelectItem value="auto">auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                  <label className="block space-y-1">
                    <div>背景位置</div>
                    <Select
                      value={selectedElement.style?.backgroundPosition ?? "__none__"}
                      onValueChange={(value) =>
                        updateSelectedStyle({
                          backgroundPosition: value === "__none__" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger className="h-7">
                        <SelectValue placeholder="选择背景位置" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">默认</SelectItem>
                        <SelectItem value="center">center</SelectItem>
                        <SelectItem value="top">top</SelectItem>
                        <SelectItem value="bottom">bottom</SelectItem>
                        <SelectItem value="left">left</SelectItem>
                        <SelectItem value="right">right</SelectItem>
                        <SelectItem value="top left">top left</SelectItem>
                        <SelectItem value="top right">top right</SelectItem>
                        <SelectItem value="bottom left">bottom left</SelectItem>
                        <SelectItem value="bottom right">bottom right</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                </div>
              )}
            </>,
            true,
            ["背景色", "背景图", "background", "backgroundSize", "backgroundPosition", "布局"]
          )}

          {renderSection(
            "styleBorder",
            "通用样式 / 边框",
            <>
              {renderFieldGroup(
                "边框几何",
                <div className="grid grid-cols-2 gap-2">
                  <label className="block space-y-1">
                    <div>边框宽度（px）</div>
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
                  <label className="block space-y-1">
                    <div>边框圆角（px）</div>
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
              )}
              {renderFieldGroup(
                "边框视觉",
                <div className="grid grid-cols-2 gap-2">
                  <label className="block space-y-1">
                    <div>边框样式</div>
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
              )}
            </>,
            true,
            ["边框", "border", "宽度", "圆角", "颜色", "样式"]
          )}

          {isChartElement ? (
            <>
              {renderSection(
                "chartBasic",
                "图表配置 / 基础",
                <>
                  {renderFieldGroup(
                    "基础显示",
                    <>
                      <label className="block space-y-1">
                        <div>标题</div>
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
                      <label className="block space-y-1">
                        <div>显示模式</div>
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
                    </>
                  )}
                  {renderFieldGroup(
                    "提示框 Tooltip",
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
                          <span>显示 Tooltip</span>
                        </label>
                        <label className="block space-y-1">
                          <div>Tooltip 触发方式</div>
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
                      <label className="block space-y-1">
                        <div>Tooltip Formatter（可选）</div>
                        <Input
                          value={selectedElement.chart?.tooltipFormatter ?? ""}
                          onChange={(e) =>
                            updateSelectedChart({ tooltipFormatter: e.target.value || undefined })
                          }
                          placeholder="例如：{b}: {c}"
                          className="h-7"
                        />
                      </label>
                    </>
                  )}
                  {renderFieldGroup(
                    "数据",
                    <>
                      <label className="block space-y-1">
                        <div>类目（逗号分隔）</div>
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

                      <label className="block space-y-1">
                        <div>数值（逗号分隔）</div>
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
                    </>
                  )}

                  {selectedChartType === "bar" ||
                  selectedChartType === "line" ||
                  selectedChartType === "area" ||
                  selectedChartType === "scatter" ? (
                    renderFieldGroup(
                      "坐标轴",
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
                    )
                  ) : null}

                  {selectedChartType === "bar" ||
                  selectedChartType === "line" ||
                  selectedChartType === "area" ||
                  selectedChartType === "pie" ? (
                    renderFieldGroup(
                      "系列",
                      <>
                        {selectedChartType === "bar" ? (
                          <label className="block space-y-1">
                            <div>柱宽（px）</div>
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
                            <label className="block space-y-1">
                              <div>内半径（%）</div>
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
                              <div>外半径（%）</div>
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
                </>,
                true,
                [
                  "图表",
                  "title",
                  "tooltip",
                  "x轴",
                  "y轴",
                  "axis",
                  "label",
                  "刻度线",
                  "分割线",
                  "render",
                  "svg",
                  "canvas",
                ]
              )}

              {renderSection(
                "chartAdvanced",
                "图表配置 / 高级（JSON）",
                <>
                  {renderFieldGroup(
                    "编辑模式",
                    <>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={isAdvancedOptionMode}
                          className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                          onCheckedChange={(checked) => setIsAdvancedOptionMode(checked === true)}
                        />
                        <span>JSON 高级模式（直接编辑 ECharts option）</span>
                      </label>
                      <div className="rounded border border-border/60 bg-background px-2 py-1.5 text-[11px] text-muted-foreground">
                        基础配置会先生成 option，JSON 模式会在此基础上覆盖（深度合并）。
                      </div>
                    </>
                  )}
                  {isAdvancedOptionMode ? (
                    renderFieldGroup(
                      "Option JSON",
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
                              setOptionJsonError("JSON 格式错误，修正后会自动应用");
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
                            JSON 有效，已实时应用到当前图表。
                          </div>
                        )}
                      </>
                    )
                  ) : null}
                </>,
                false,
                ["json", "option", "高级", "echarts"]
              )}
            </>
          ) : selectedElement.materialType === "text" ? (
            renderSection(
              "textConfig",
              "文本配置",
              <>
                {renderFieldGroup(
                  "文本内容",
                  <>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="rounded border border-border px-2 py-1 text-[11px] hover:bg-accent"
                        onClick={() => execTextCommand("bold")}
                      >
                        B
                      </button>
                      <button
                        type="button"
                        className="rounded border border-border px-2 py-1 text-[11px] italic hover:bg-accent"
                        onClick={() => execTextCommand("italic")}
                      >
                        I
                      </button>
                      <button
                        type="button"
                        className="rounded border border-border px-2 py-1 text-[11px] underline hover:bg-accent"
                        onClick={() => execTextCommand("underline")}
                      >
                        U
                      </button>
                    </div>
                    <div
                      ref={textEditorRef}
                      className="min-h-[120px] rounded border border-border bg-background px-2 py-1.5 text-xs leading-6 outline-none"
                      style={{
                        fontFamily: selectedElement.textFontFamily || undefined,
                        fontSize: selectedElement.textFontSize
                          ? `${selectedElement.textFontSize}px`
                          : undefined,
                        fontWeight: selectedElement.textFontWeight || undefined,
                        color: selectedElement.textColor || undefined,
                        lineHeight: selectedElement.textLineHeight
                          ? String(selectedElement.textLineHeight)
                          : undefined,
                        textAlign: selectedElement.textAlign ?? "left",
                      }}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => {
                        const nextHtml = (e.currentTarget as HTMLDivElement).innerHTML;
                        updateSelectedText({
                          textHtml: nextHtml || "<p><br/></p>",
                        });
                      }}
                    />
                  </>
                )}
                {renderFieldGroup(
                  "文字样式",
                  <>
                    <label className="block space-y-1">
                      <div>字体</div>
                      <Input
                        value={selectedElement.textFontFamily ?? ""}
                        onChange={(e) =>
                          updateSelectedText({
                            textFontFamily: e.target.value || undefined,
                          })
                        }
                        placeholder="如：Inter, PingFang SC, Microsoft YaHei"
                        className="h-7"
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block space-y-1">
                        <div>字号（px）</div>
                        <Input
                          type="number"
                          min={8}
                          max={200}
                          step={1}
                          value={selectedElement.textFontSize ?? 14}
                          onChange={(e) =>
                            updateSelectedText({
                              textFontSize: Math.max(8, Number(e.target.value) || 14),
                            })
                          }
                          className="h-7"
                        />
                      </label>
                      <label className="block space-y-1">
                        <div>字重</div>
                        <Select
                          value={selectedElement.textFontWeight ?? "400"}
                          onValueChange={(value) =>
                            updateSelectedText({
                              textFontWeight: value,
                            })
                          }
                        >
                          <SelectTrigger className="h-7">
                            <SelectValue placeholder="选择字重" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="300">300</SelectItem>
                            <SelectItem value="400">400</SelectItem>
                            <SelectItem value="500">500</SelectItem>
                            <SelectItem value="600">600</SelectItem>
                            <SelectItem value="700">700</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block space-y-1">
                        <div>对齐</div>
                        <Select
                          value={selectedElement.textAlign ?? "left"}
                          onValueChange={(value) =>
                            updateSelectedText({
                              textAlign: value as "left" | "center" | "right" | "justify",
                            })
                          }
                        >
                          <SelectTrigger className="h-7">
                            <SelectValue placeholder="选择对齐方式" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">左对齐</SelectItem>
                            <SelectItem value="center">居中</SelectItem>
                            <SelectItem value="right">右对齐</SelectItem>
                            <SelectItem value="justify">两端对齐</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>
                      <label className="block space-y-1">
                        <div>行高</div>
                        <Input
                          type="number"
                          min={1}
                          max={3}
                          step={0.1}
                          value={selectedElement.textLineHeight ?? 1.6}
                          onChange={(e) =>
                            updateSelectedText({
                              textLineHeight: Math.min(
                                3,
                                Math.max(1, Number(e.target.value) || 1.6)
                              ),
                            })
                          }
                          className="h-7"
                        />
                      </label>
                    </div>
                    {renderColorField(
                      "文字颜色",
                      selectedElement.textColor ?? "",
                      (next) =>
                        updateSelectedText({
                          textColor: next || undefined,
                        })
                    )}
                  </>
                )}
                {renderFieldGroup(
                  "输入能力",
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedElement.textAllowInput ?? true}
                      className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                      onCheckedChange={(checked) =>
                        updateSelectedText({
                          textAllowInput: checked !== false,
                        })
                      }
                    />
                    <span>允许在画布内直接输入（默认开启）</span>
                  </label>
                )}
              </>,
              true,
              ["文本", "富文本", "字体", "颜色", "对齐", "行高", "输入"]
            )
          ) : selectedElement.materialType === "audio" ? (
            renderSection(
              "audioConfig",
              "音频配置",
              <>
                {renderFieldGroup(
                  "音频来源",
                  <>
                    <label className="block space-y-1">
                      <div>音频 URL</div>
                      <Input
                        value={selectedElement.audioRemoteUrl ?? ""}
                        onChange={(e) =>
                          updateSelectedAudio({
                            audioRemoteUrl: e.target.value || undefined,
                            audioSrc: e.target.value || selectedElement.audioSrc,
                          })
                        }
                        placeholder="https://example.com/audio.mp3"
                        className="h-7"
                      />
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center rounded border border-border px-2 py-1 text-[11px] hover:bg-accent">
                        上传音频
                        <Input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            e.currentTarget.value = "";
                            if (!file) return;
                            await handleUploadAudioFile(file);
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        className="rounded border border-border px-2 py-1 text-[11px] hover:bg-accent disabled:opacity-50"
                        onClick={isRecordingAudio ? stopRecordingAudio : startRecordingAudio}
                      >
                        {isRecordingAudio ? "停止录音" : "开始录音"}
                      </button>
                    </div>
                    {audioStatus ? (
                      <div className="rounded border border-border/60 bg-background px-2 py-1.5 text-[11px] text-muted-foreground">
                        {audioStatus}
                      </div>
                    ) : null}
                    <audio
                      controls
                      className="h-8 w-full"
                      src={selectedElement.audioSrc || selectedElement.audioRemoteUrl || ""}
                    />
                  </>
                )}
                {renderFieldGroup(
                  "展示样式",
                  <>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedElement.mediaAutoPauseOnEdit !== false}
                        className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                        onCheckedChange={(checked) =>
                          updateSelectedAudio({
                            mediaAutoPauseOnEdit: checked !== false,
                          })
                        }
                      />
                      <span>编辑时自动暂停媒体</span>
                    </label>
                    <label className="block space-y-1">
                      <div>预设喇叭图标</div>
                      <Select
                        value={selectedElement.audioIconPreset ?? "__none__"}
                        onValueChange={(value) =>
                          updateSelectedAudio({
                            audioIconPreset:
                              value === "__none__"
                                ? undefined
                                : (value as "speaker" | "music" | "headphone" | "wave"),
                          })
                        }
                      >
                        <SelectTrigger className="h-7">
                          <SelectValue placeholder="选择图标" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">默认（显示进度条）</SelectItem>
                          <SelectItem value="speaker">喇叭</SelectItem>
                          <SelectItem value="music">音符</SelectItem>
                          <SelectItem value="headphone">耳机</SelectItem>
                          <SelectItem value="wave">声波</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                    <label className="block space-y-1">
                      <div>播放动效</div>
                      <Select
                        value={selectedElement.audioVisualEffect ?? "pulse"}
                        onValueChange={(value) =>
                          updateSelectedAudio({
                            audioVisualEffect: value as "none" | "pulse" | "ripple",
                          })
                        }
                      >
                        <SelectTrigger className="h-7">
                          <SelectValue placeholder="选择动效" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">无动效</SelectItem>
                          <SelectItem value="pulse">呼吸高亮</SelectItem>
                          <SelectItem value="ripple">波纹扩散</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                    <label className="block space-y-1">
                      <div>动效速度</div>
                      <Select
                        value={selectedElement.audioVisualSpeed ?? "normal"}
                        onValueChange={(value) =>
                          updateSelectedAudio({
                            audioVisualSpeed: value as "slow" | "normal" | "fast",
                          })
                        }
                      >
                        <SelectTrigger className="h-7">
                          <SelectValue placeholder="选择速度" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slow">慢</SelectItem>
                          <SelectItem value="normal">中</SelectItem>
                          <SelectItem value="fast">快</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center rounded border border-border px-2 py-1 text-[11px] hover:bg-accent">
                        上传占位图
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            e.currentTarget.value = "";
                            if (!file) return;
                            await handleUploadAudioPoster(file);
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        className="rounded border border-border px-2 py-1 text-[11px] hover:bg-accent"
                        onClick={() =>
                          updateSelectedAudio({
                            audioPosterImage: undefined,
                          })
                        }
                      >
                        清空占位图
                      </button>
                    </div>
                    {selectedElement.audioPosterImage ? (
                      <img
                        src={selectedElement.audioPosterImage}
                        alt="音频占位图预览"
                        className="h-20 w-full rounded border border-border/60 object-cover"
                      />
                    ) : null}
                    <div className="text-[11px] text-muted-foreground">
                      设置占位图或图标后，节点上将隐藏进度条，改为点击图标播放/暂停。
                    </div>
                  </>
                )}
              </>,
              true,
              ["音频", "url", "上传", "录音", "icon", "占位", "动效", "自动暂停", "media"]
            )
          ) : selectedElement.materialType === "video" ? (
            renderSection(
              "videoConfig",
              "视频配置",
              <>
                {renderFieldGroup(
                  "视频来源",
                  <>
                    <label className="block space-y-1">
                      <div>视频 URL</div>
                      <Input
                        value={selectedElement.videoRemoteUrl ?? ""}
                        onChange={(e) =>
                          updateSelectedVideo({
                            videoRemoteUrl: e.target.value || undefined,
                            videoSrc: e.target.value || selectedElement.videoSrc,
                          })
                        }
                        placeholder="https://example.com/video.mp4"
                        className="h-7"
                      />
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center rounded border border-border px-2 py-1 text-[11px] hover:bg-accent">
                        上传视频
                        <Input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            e.currentTarget.value = "";
                            if (!file) return;
                            await handleUploadVideoFile(file);
                          }}
                        />
                      </label>
                    </div>
                    {videoStatus ? (
                      <div className="rounded border border-border/60 bg-background px-2 py-1.5 text-[11px] text-muted-foreground">
                        {videoStatus}
                      </div>
                    ) : null}
                    <video
                      controls
                      className="h-36 w-full rounded border border-border/60 bg-black/80 object-contain"
                      src={selectedElement.videoSrc || selectedElement.videoRemoteUrl || ""}
                    />
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedElement.mediaAutoPauseOnEdit !== false}
                        className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                        onCheckedChange={(checked) =>
                          updateSelectedVideo({
                            mediaAutoPauseOnEdit: checked !== false,
                          })
                        }
                      />
                      <span>编辑时自动暂停媒体</span>
                    </label>
                  </>
                )}
              </>,
              true,
              ["视频", "url", "上传", "预览", "自动暂停", "media"]
            )
          ) : selectedElement.materialType === "grid" ? (
            renderSection(
              "gridConfig",
              "网格布局配置",
              <>
                {renderFieldGroup(
                  "网格参数",
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block space-y-1">
                      <div>行数</div>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        value={selectedElement.gridRows ?? 2}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            gridRows: Math.max(1, Math.min(12, Number(e.target.value) || 2)),
                          })
                        }
                        className="h-7"
                      />
                    </label>
                    <label className="block space-y-1">
                      <div>列数</div>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        value={selectedElement.gridCols ?? 3}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            gridCols: Math.max(1, Math.min(12, Number(e.target.value) || 3)),
                          })
                        }
                        className="h-7"
                      />
                    </label>
                    <label className="block space-y-1">
                      <div>间距（px）</div>
                      <Input
                        type="number"
                        min={0}
                        max={80}
                        value={selectedElement.gridGap ?? 8}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            gridGap: Math.max(0, Math.min(80, Number(e.target.value) || 0)),
                          })
                        }
                        className="h-7"
                      />
                    </label>
                    <label className="block space-y-1">
                      <div>内边距（px）</div>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={selectedElement.gridPadding ?? 10}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            gridPadding: Math.max(0, Math.min(100, Number(e.target.value) || 0)),
                          })
                        }
                        className="h-7"
                      />
                    </label>
                    <label className="block space-y-1">
                      <div>吸附阈值（px）</div>
                      <Input
                        type="number"
                        min={8}
                        max={120}
                        value={selectedElement.gridSnapThreshold ?? 36}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            gridSnapThreshold: Math.max(
                              8,
                              Math.min(120, Number(e.target.value) || 36)
                            ),
                          })
                        }
                        className="h-7"
                      />
                    </label>
                  </div>
                )}
                <div className="rounded border border-border/60 bg-background px-2 py-1.5 text-[11px] text-muted-foreground">
                  其他节点拖拽靠近该网格槽位中心时会自动吸附，并在节点树显示为该网格子节点。
                </div>
              </>,
              true,
              ["网格", "grid", "行", "列", "间距", "内边距", "吸附", "阈值"]
            )
          ) : selectedElement.materialType === "reference" ? (
            renderSection(
              "reference",
              "引用组件配置",
              <>
                {renderFieldGroup(
                  "引用源",
                  <label className="block space-y-1">
                    <div>引用图层</div>
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
                )}
                {renderFieldGroup(
                  "拷贝策略",
                  <>
                    <label className="block space-y-1">
                      <div>拷贝模式</div>
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
                    <div className="rounded border border-border/60 bg-background px-2 py-1.5 text-[11px] text-muted-foreground">
                      浅拷贝会实时同步被引用图层；深拷贝会固定当前快照，不再随源变化。
                    </div>
                  </>
                )}
              </>,
              true,
              ["引用", "ref", "图层", "浅拷贝", "深拷贝", "snapshot"]
            )
          ) : (
            <div className="text-xs leading-6 text-muted-foreground">
              当前节点不是图表类型，暂无图表配置项。
            </div>
          )}
          {hasSearch && renderedSectionCount === 0 ? (
            <div className="rounded border border-border/60 bg-background px-2 py-1.5 text-[11px] text-muted-foreground">
              未找到匹配项，请尝试更换关键词。
            </div>
          ) : null}
            </div>
          </fieldset>
        </div>
      )}
    </aside>
  );
}

