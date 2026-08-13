import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@arronqzy/i18n/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
} from "@arronqzy/ui";
import type {
  PanelChartConfig,
  PanelElement,
  PanelElementStyle,
  ReferenceCopyMode,
} from "../types";
import { buildChartOption, CHART_TYPES, getChartLabelsDisplayText, getChartValuesDisplayText } from "../utils/chartOptionBuilder";
import type { PanelLayer } from "../types";
import { getPanelMessages } from "../constants/messages";
import { ViewElementScopePanel } from "./ViewElementScopePanel";
import { ConfigHintIcon } from "./ConfigHintIcon";
import { hasViewElementScope } from "../scope/view-scope-store";
import { collectElementScopeWarnings } from "../utils/scope-template-warnings";
import { ScopeConfigProvider } from "./scope-config/ScopeConfigContext";
import { ScopeTemplateWarningsPanel } from "./scope-config/ScopeTemplateWarningsPanel";
import { PanelConfigTableSection } from "./table/PanelConfigTableSection";
import {
  highlightConfigField,
  subscribeRevealPanelConfig,
} from "../ai/revealConfigField";

type UpdateElement = (
  id: string,
  patch: Partial<PanelElement>,
  options?: { batchId?: string; meta?: Record<string, unknown> }
) => void;

export type PanelConfigSidebarProps = {
  selectedElement: PanelElement | null;
  selectedElements?: PanelElement[];
  layers: PanelLayer[];
  updateElement: UpdateElement;
  setReferenceCopyMode?: (id: string, mode: ReferenceCopyMode) => void;
  nodeZOrderLabel?: string;
  onExcludeSelectedNode?: (nodeId: string) => void;
  onAdjustNodeZOrder?: (
    nodeId: string,
    action: "bringForward" | "sendBackward" | "bringToFront" | "sendToBack"
  ) => void;
  /** 蓝图视图绑定节点写入的信号 scope，用于展示与模版解析 */
  viewElementScope?: unknown;
  blueprintNodeOptions?: { id: string; label: string }[];
};

export function PanelConfigSidebar({
  selectedElement,
  selectedElements = [],
  layers,
  updateElement,
  setReferenceCopyMode,
  nodeZOrderLabel,
  onExcludeSelectedNode,
  onAdjustNodeZOrder,
  viewElementScope,
  blueprintNodeOptions = [],
}: PanelConfigSidebarProps) {
  const { t } = useI18n();
  const messages = React.useMemo(() => getPanelMessages(t), [t]);

  const [isAdvancedOptionMode, setIsAdvancedOptionMode] = useState(false);
  const [optionJsonText, setOptionJsonText] = useState("{}");
  const [optionJsonError, setOptionJsonError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [audioStatus, setAudioStatus] = useState<string>("");
  const [videoStatus, setVideoStatus] = useState<string>("");
  const [geometryDrawPenColor, setGeometryDrawPenColor] = useState("#111827");
  const [geometryDrawPenWidth, setGeometryDrawPenWidth] = useState(3);
  const [isGeometryDrawing, setIsGeometryDrawing] = useState(false);
  const [configSearch, setConfigSearch] = useState("");
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);
  const SEARCH_COLLAPSE_STORAGE_KEY = "panel:config-search-collapsed";
  const textEditorRef = useRef<HTMLDivElement | null>(null);
  const geometryDrawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const geometryLastPointRef = useRef<{ x: number; y: number } | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const sidebarScrollRef = useRef<HTMLElement | null>(null);
  const themedScrollbarClass =
    "scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/80 [&::-webkit-scrollbar-thumb]:hover:bg-border";
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    nodeInfo: true,
    styleBackground: true,
    styleBorder: true,
    chartBasic: true,
    chartAdvanced: false,
    chartAdvancedHighFreq: true,
    chartAdvancedLayout: false,
    chartAdvancedAxisPointer: false,
    reference: true,
  });
  const [expandedNodeCards, setExpandedNodeCards] = useState<Record<string, boolean>>({});

  const isChartElement = !!selectedElement && CHART_TYPES.has(selectedElement.materialType ?? "");
  const selectedLayer = selectedElement
    ? layers.find((layer) => layer.id === selectedElement.layerId) ?? null
    : null;
  const canToggleNodeLock = !!selectedElement && !selectedLayer?.locked;
  const isNodeEditable = !!selectedElement && !selectedElement.locked && !selectedLayer?.locked;
  const readonlyReason = !selectedElement
    ? ""
    : selectedElement.locked
      ? messages.nodeConfigLocked
      : selectedLayer?.locked
        ? messages.nodeConfigLayerLocked
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
  const showScopePanel =
    !!selectedElement &&
    viewElementScope !== undefined &&
    hasViewElementScope(selectedElement.id);
  const scopeWarnings = useMemo(() => {
    if (!selectedElement || viewElementScope === undefined) return [];
    return collectElementScopeWarnings(selectedElement, viewElementScope, t);
  }, [selectedElement, viewElementScope]);
  const effectiveSelectedElements = useMemo(() => {
    if (selectedElements.length > 0) return selectedElements;
    return selectedElement ? [selectedElement] : [];
  }, [selectedElement, selectedElements]);
  const isMultiSelectMode = effectiveSelectedElements.length > 1;

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
    const nextHtml =
      selectedElement.textHtml ?? `<p>${t("panel.defaults.doubleClickTextHtml")}</p>`;
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
  const updateSelectedGeometry = useCallback(
    (patch: Partial<PanelElement>) => {
      if (!selectedElement || selectedElement.materialType !== "geometry") return;
      updateElement(selectedElement.id, patch);
    },
    [selectedElement, updateElement]
  );

  const redrawGeometryPadFromElement = useCallback(() => {
    const canvas = geometryDrawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    const sketch = selectedElement?.geometrySketchDataUrl;
    if (!sketch) return;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
    };
    img.src = sketch;
  }, [selectedElement?.geometrySketchDataUrl]);

  useEffect(() => {
    if (!selectedElement || selectedElement.materialType !== "geometry") return;
    redrawGeometryPadFromElement();
  }, [redrawGeometryPadFromElement, selectedElement?.id, selectedElement?.materialType]);

  const handleUploadBackgroundImage = useCallback(
    async (file: File) => {
      if (!selectedElement) return;
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(new Error(messages.readImageFailed));
        reader.readAsDataURL(file);
      });
      updateSelectedStyle({
        backgroundImage: `url("${base64}")`,
      });
      setUploadStatus(t("panel.config.uploadWrittenBase64"));
      try {
        const form = new FormData();
        form.append("file", file);
        const resp = await fetch("/api/upload", { method: "POST", body: form });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = (await resp.json()) as { url?: string };
        if (data.url) {
          updateSelectedStyle({ backgroundImageRemoteUrl: data.url });
          setUploadStatus(t("panel.config.uploadServerAndBase64"));
        }
      } catch {
        setUploadStatus(t("panel.config.uploadServerFailedKeepBase64"));
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
        reader.onerror = () => reject(new Error(messages.readAudioFailed));
        reader.readAsDataURL(file);
      });
      updateSelectedAudio({ audioSrc: base64 });
      setAudioStatus(messages.audioLocalSaved);
      try {
        const form = new FormData();
        form.append("file", file);
        const resp = await fetch("/api/upload", { method: "POST", body: form });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = (await resp.json()) as { url?: string };
        if (data.url) {
          updateSelectedAudio({ audioRemoteUrl: data.url });
          setAudioStatus(messages.audioRemoteUploaded);
        }
      } catch {
        setAudioStatus(messages.audioServerUploadFailed);
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
        reader.onerror = () => reject(new Error(messages.readImageFailed));
        reader.readAsDataURL(file);
      });
      updateSelectedAudio({ audioPosterImage: base64 });
      setAudioStatus(messages.audioPosterSet);
    },
    [selectedElement, updateSelectedAudio]
  );
  const stopRecordingAudio = useCallback(() => {
    recorderRef.current?.stop();
  }, []);
  const startRecordingAudio = useCallback(async () => {
    if (!selectedElement || selectedElement.materialType !== "audio") return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setAudioStatus(messages.audioRecordUnsupported);
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
          reader.onerror = () => reject(new Error(messages.readRecordAudioFailed));
          reader.readAsDataURL(blob);
        });
        updateSelectedAudio({ audioSrc: dataUrl });
        setAudioStatus(messages.audioRecordSaved);
        recordStreamRef.current?.getTracks().forEach((track) => track.stop());
        recordStreamRef.current = null;
        recorderRef.current = null;
        setIsRecordingAudio(false);
      };
      recorder.start();
      setIsRecordingAudio(true);
      setAudioStatus(messages.audioRecording);
    } catch {
      setAudioStatus(messages.audioRecordStartFailed);
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
        reader.onerror = () => reject(new Error(messages.readVideoFailed));
        reader.readAsDataURL(file);
      });
      updateSelectedVideo({ videoSrc: base64 });
      setVideoStatus(messages.videoLocalSaved);
      try {
        const form = new FormData();
        form.append("file", file);
        const resp = await fetch("/api/upload", { method: "POST", body: form });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = (await resp.json()) as { url?: string };
        if (data.url) {
          updateSelectedVideo({ videoRemoteUrl: data.url });
          setVideoStatus(messages.videoRemoteUploaded);
        }
      } catch {
        setVideoStatus(messages.videoServerUploadFailed);
      }
    },
    [selectedElement, updateSelectedVideo]
  );

  const isSectionExpanded = (key: string, defaultValue = true) =>
    expandedSections[key] ?? defaultValue;

  const setSectionExpanded = (key: string, next: boolean) => {
    setExpandedSections((prev) => ({ ...prev, [key]: next }));
  };

  useEffect(() => {
    return subscribeRevealPanelConfig((detail) => {
      for (const section of detail.sections) {
        setSectionExpanded(section, true);
      }
      window.requestAnimationFrame(() => {
        const field = detail.fields[0];
        if (field) highlightConfigField(field);
      });
    });
  }, []);

  const renderSection = (
    key: string,
    title: string,
    children: React.ReactNode,
    defaultOpen = true,
    searchTerms: string[] = [],
    hint?: React.ReactNode
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
      data-config-section={key}
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
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">{title}</div>
          {hint ? <ConfigHintIcon label={title}>{hint}</ConfigHintIcon> : null}
        </div>
      </div>
      <CollapsibleContent className="space-y-3 border-t border-border/60 bg-muted/[0.1] px-3 pb-3 pt-2.5">
        {children}
      </CollapsibleContent>
    </Collapsible>
    );
  };

  const renderFieldGroup = (
    title: string,
    children: React.ReactNode,
    hint?: React.ReactNode
  ) => (
    <div className="space-y-2.5 rounded-lg border border-border/55 bg-background/80 p-2.5">
      <div className="flex items-center gap-1">
        <div className="text-[11px] font-semibold text-muted-foreground">{title}</div>
        {hint ? <ConfigHintIcon label={title}>{hint}</ConfigHintIcon> : null}
      </div>
      {children}
    </div>
  );
  const isNodeCardExpanded = useCallback(
    (id: string) => expandedNodeCards[id] ?? true,
    [expandedNodeCards]
  );
  const setNodeCardExpanded = useCallback((id: string, open: boolean) => {
    setExpandedNodeCards((prev) => ({ ...prev, [id]: open }));
  }, []);

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
          aria-label={t("common.colorPickerAria", { label })}
        />
      </div>
    </label>
  );
  const optionCheckboxClass =
    "h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40";
  const optionInputClass =
    "h-7 border border-border/60 bg-background/90 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border/60";
  const optionSelectTriggerClass =
    "h-7 border border-border/60 bg-muted/40 shadow-none ring-0 focus:ring-0 focus:ring-offset-0 focus:border-border/60 data-[state=open]:border-border/60";
  const optionLabelTextClass = "truncate whitespace-nowrap text-[11px] leading-none";
  const renderOptionLabel = (label: string, keyPath: string, desc: string) => (
    <div className="flex min-w-0 items-center gap-1">
      <span className={optionLabelTextClass} title={`${label}（${keyPath}）`}>{label}</span>
      <ConfigHintIcon label={label}>
        <div>Key: {keyPath}</div>
        <div>{desc}</div>
      </ConfigHintIcon>
    </div>
  );
  const renderFormatterLabel = (label = t("panel.config.tooltipFormatter")) => (
    <div className="flex min-w-0 items-center gap-1">
      <span className={optionLabelTextClass} title={label}>{label}</span>
      <ConfigHintIcon label="Tooltip Formatter" contentClassName="max-w-[360px]">
        <div className="font-medium">{t("panel.config.formatterPlaceholdersTitle")}</div>
        <div>{t("panel.config.formatterPlaceholders")}</div>
        <div className="mt-1 font-medium">{t("panel.config.formatterExamplesTitle")}</div>
        <div>{t("panel.config.formatterExample1")}</div>
        <div>{t("panel.config.formatterExample2")}</div>
        <div>{t("panel.config.formatterExample3")}</div>
        <div>{t("panel.config.formatterExample4")}</div>
      </ConfigHintIcon>
    </div>
  );
  const mergeOptionPatch = useCallback(
    (
      base: Record<string, unknown> | undefined,
      patch: Record<string, unknown>
    ): Record<string, unknown> => {
      const output: Record<string, unknown> = { ...(base ?? {}) };
      for (const [key, value] of Object.entries(patch)) {
        const prev = output[key];
        if (
          value &&
          typeof value === "object" &&
          !Array.isArray(value) &&
          prev &&
          typeof prev === "object" &&
          !Array.isArray(prev)
        ) {
          output[key] = mergeOptionPatch(
            prev as Record<string, unknown>,
            value as Record<string, unknown>
          );
        } else {
          output[key] = value;
        }
      }
      return output;
    },
    []
  );
  const updateSelectedOptionForm = useCallback(
    (patch: Record<string, unknown>) => {
      if (!selectedElement) return;
      updateSelectedChart({
        option: mergeOptionPatch(
          (selectedElement.chart?.option as Record<string, unknown> | undefined) ?? {},
          patch
        ),
      });
    },
    [mergeOptionPatch, selectedElement, updateSelectedChart]
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
    <ScopeConfigProvider
      scope={showScopePanel ? viewElementScope : undefined}
      element={selectedElement}
      warnings={scopeWarnings}
      scrollContainerRef={sidebarScrollRef}
    >
    <aside
      ref={sidebarScrollRef}
      className={`scope-config-sidebar h-full overflow-auto border-l border-border bg-muted/[0.14] px-3 py-3 text-foreground [&_.config-field--highlight]:rounded-md [&_.config-field--highlight]:ring-2 [&_.config-field--highlight]:ring-sky-400/80 [&_.scope-field--highlight]:rounded-md [&_.scope-field--highlight]:ring-2 [&_.scope-field--highlight]:ring-amber-400/80 [&_button[role=checkbox]]:border-2 [&_button[role=checkbox]]:border-foreground/80 [&_button[role=checkbox]]:bg-background [&_button[role=checkbox]]:ring-1 [&_button[role=checkbox]]:ring-foreground/40 [&_button[role=checkbox][data-state=checked]]:border-primary [&_button[role=checkbox][data-state=checked]]:ring-primary/40 ${themedScrollbarClass}`}
    >
      <div className="sticky top-0 z-20 mb-3 rounded-lg border border-border/70 bg-card/95 px-2.5 py-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-semibold tracking-wide">{t("panel.config.panelTitle")}</div>
        </div>
        {showScopePanel ? (
          <ViewElementScopePanel scope={viewElementScope} />
        ) : null}
        <ScopeTemplateWarningsPanel />
        <div
          className={
            showScopePanel || scopeWarnings.length > 0
              ? "mt-2 border-t border-border/50 pt-2"
              : "mt-0"
          }
        >
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-accent"
              onClick={() => setIsSearchCollapsed((prev) => !prev)}
            >
              {isSearchCollapsed ? t("panel.config.expandSearch") : t("panel.config.collapseSearch")}
            </button>
          </div>
          {!isSearchCollapsed ? (
            <div className="mt-2">
              <Input
                value={configSearch}
                onChange={(e) => setConfigSearch(e.target.value)}
                placeholder={t("panel.config.searchPlaceholder")}
                className="h-7"
                data-scope-autocomplete="off"
              />
              {hasSearch ? (
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {t("panel.config.searching", { query: configSearch })}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      {isMultiSelectMode ? (
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
                            value={el.chart?.barWidth ?? 24}
                            onChange={(e) =>
                              updateElement(el.id, {
                                chart: {
                                  ...(el.chart ?? {}),
                                  barWidth: Math.max(1, Number(e.target.value) || 1),
                                },
                              })
                            }
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
                      {el.materialType === "reference" ? (
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
      ) : null}
      {!isMultiSelectMode && !selectedElement ? (
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
          <EmptyTitle>{t("panel.config.emptyNoNodeTitle")}</EmptyTitle>
          <EmptyDescription>{t("panel.config.emptyNoNodeDesc")}</EmptyDescription>
        </Empty>
      ) : !isMultiSelectMode && selectedElement ? (
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
              <span>{t("panel.config.lockNode")}</span>
            </label>
          </div>
          <fieldset disabled={!isNodeEditable} className={!isNodeEditable ? "opacity-60" : ""}>
            <div className="space-y-3.5 text-xs">
              {renderSection(
            "nodeInfo",
            t("panel.config.sectionNodeInfo"),
            <>
              <label className="block space-y-1" data-config-field="name">
                <div>{t("panel.config.nodeName")}</div>
                <Input
                  value={selectedElement.name ?? ""}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      name: e.target.value || undefined,
                    })
                  }
                  placeholder={t("panel.config.nodeNamePlaceholder")}
                  className="h-7"
                />
              </label>
              <div className="grid grid-cols-3 gap-2">
                <label className="block space-y-1" data-config-field="x">
                  <div>X</div>
                  <Input
                    type="number"
                    value={selectedElement.x}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        x: Number(e.target.value) || 0,
                      })
                    }
                    className="h-7"
                  />
                </label>
                <label className="block space-y-1" data-config-field="y">
                  <div>Y</div>
                  <Input
                    type="number"
                    value={selectedElement.y}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        y: Number(e.target.value) || 0,
                      })
                    }
                    className="h-7"
                  />
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <label className="block space-y-1" data-config-field="rotate">
                  <div>{t("panel.config.rotate")}</div>
                  <Input
                    type="number"
                    value={selectedElement.rotate ?? 0}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        rotate: Number(e.target.value) || 0,
                      })
                    }
                    className="h-7"
                  />
                </label>
                <label className="block space-y-1" data-config-field="width">
                  <div>{t("panel.config.width")}</div>
                  <Input
                    type="number"
                    min={1}
                    value={selectedElement?.width ?? 1}
                    onChange={(e) => {
                      if (!selectedElement) return;
                      updateElement(selectedElement.id, {
                        width: Math.max(1, Number(e.target.value) || 1),
                      });
                    }}
                    className="h-7"
                  />
                </label>
                <label className="block space-y-1" data-config-field="height">
                  <div>{t("panel.config.height")}</div>
                  <Input
                    type="number"
                    min={1}
                    value={selectedElement.height}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        height: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                    className="h-7"
                  />
                </label>
              </div>
              <div className="space-y-1.5">
                <div className="text-[11px] text-muted-foreground">{t("panel.config.nodeZOrder")}</div>
                <div className="text-[11px] text-muted-foreground/90">
                  {t("panel.config.currentZIndex", { value: nodeZOrderLabel ?? "-" })}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="rounded border border-border bg-background px-2 py-1 text-[11px] hover:bg-accent"
                    onClick={() => onAdjustNodeZOrder?.(selectedElement.id, "bringForward")}
                  >
                    {t("panel.menubar.bringForward")}
                  </button>
                  <button
                    type="button"
                    className="rounded border border-border bg-background px-2 py-1 text-[11px] hover:bg-accent"
                    onClick={() => onAdjustNodeZOrder?.(selectedElement.id, "sendBackward")}
                  >
                    {t("panel.menubar.sendBackward")}
                  </button>
                  <button
                    type="button"
                    className="rounded border border-border bg-background px-2 py-1 text-[11px] hover:bg-accent"
                    onClick={() => onAdjustNodeZOrder?.(selectedElement.id, "bringToFront")}
                  >
                    {t("panel.menubar.bringToFront")}
                  </button>
                  <button
                    type="button"
                    className="rounded border border-border bg-background px-2 py-1 text-[11px] hover:bg-accent"
                    onClick={() => onAdjustNodeZOrder?.(selectedElement.id, "sendToBack")}
                  >
                    {t("panel.menubar.sendToBack")}
                  </button>
                </div>
              </div>
              <div className="truncate text-muted-foreground">ID: {selectedElement.id}</div>
              <div className="text-muted-foreground">{t("panel.config.type")}: {selectedElement.materialType ?? selectedElement.id}</div>
            </>,
            true,
            [t("panel.config.name"), "id", t("panel.config.type"), t("panel.layers.lockShort"), "locked", "name"]
          )}

          {renderSection(
            "styleBackground",
            t("panel.config.sectionStyleBackground"),
            <>
              {renderFieldGroup(
                t("panel.config.groupBgFill"),
                <>
                  {renderColorField(
                    t("panel.config.backgroundColor"),
                    selectedElement.style?.backgroundColor ?? "",
                    (next) => updateSelectedStyle({ backgroundColor: next || undefined })
                  )}
                  <label className="block space-y-1">
                    <div>{t("panel.config.backgroundImage")}</div>
                    <Input
                      value={selectedElement.style?.backgroundImage ?? ""}
                      onChange={(e) => updateSelectedStyle({ backgroundImage: e.target.value || undefined })}
                      placeholder='url("https://...") / linear-gradient(...)'
                      className="h-7"
                    />
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center rounded border border-border px-2 py-1 text-[11px] hover:bg-accent">
                      {t("panel.config.uploadImage")}
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
                t("panel.config.groupBgLayout"),
                <div className="grid grid-cols-2 gap-2">
                  <label className="block space-y-1">
                    <div>{t("panel.config.backgroundSize")}</div>
                    <Select
                      value={selectedElement.style?.backgroundSize ?? "__none__"}
                      onValueChange={(value) =>
                        updateSelectedStyle({
                          backgroundSize: value === "__none__" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger className="h-7">
                        <SelectValue placeholder={t("panel.config.selectBackgroundSize")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">{t("common.default")}</SelectItem>
                        <SelectItem value="cover">cover</SelectItem>
                        <SelectItem value="contain">contain</SelectItem>
                        <SelectItem value="100% 100%">100% 100%</SelectItem>
                        <SelectItem value="auto">auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                  <label className="block space-y-1">
                    <div>{t("panel.config.backgroundPosition")}</div>
                    <Select
                      value={selectedElement.style?.backgroundPosition ?? "__none__"}
                      onValueChange={(value) =>
                        updateSelectedStyle({
                          backgroundPosition: value === "__none__" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger className="h-7">
                        <SelectValue placeholder={t("panel.config.selectBackgroundPosition")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">{t("common.default")}</SelectItem>
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
            [t("panel.config.backgroundColor"), t("panel.config.backgroundImage"), "background", "backgroundSize", "backgroundPosition", t("panel.config.searchKwLayout")]
          )}

          {renderSection(
            "styleBorder",
            t("panel.config.sectionStyleBorder"),
            <>
              {renderFieldGroup(
                t("panel.config.groupBorderGeometry"),
                <div className="grid grid-cols-2 gap-2">
                  <label className="block space-y-1">
                    <div>{t("panel.config.borderWidth")}</div>
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
                    <div>{t("panel.config.borderRadius")}</div>
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
                t("panel.config.groupBorderVisual"),
                <div className="grid grid-cols-2 gap-2">
                  <label className="block space-y-1">
                    <div>{t("panel.config.borderStyle")}</div>
                    <Select
                      value={selectedElement.style?.borderStyle ?? "solid"}
                      onValueChange={(value) =>
                        updateSelectedStyle({
                          borderStyle: value as NonNullable<PanelElementStyle["borderStyle"]>,
                        })
                      }
                    >
                      <SelectTrigger className="h-7">
                        <SelectValue placeholder={t("panel.config.selectBorderStyle")} />
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
                    t("panel.config.borderColor"),
                    selectedElement.style?.borderColor ?? "",
                    (next) => updateSelectedStyle({ borderColor: next || undefined })
                  )}
                </div>
              )}
            </>,
            true,
            [t("panel.config.searchKwBorder"), "border", t("panel.config.searchKwWidth"), t("panel.config.searchKwRadius"), t("panel.config.color"), t("panel.config.searchKwStyle")]
          )}

          {isChartElement ? (
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
                    </>
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
                      </>
                    )
                  ) : null}

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
          ) : selectedElement.materialType === "table" ? (
            renderSection(
              "tableConfig",
              t("panel.config.sectionTable"),
              <PanelConfigTableSection
                element={selectedElement}
                disabled={!isNodeEditable}
                updateElement={updateElement}
                blueprintNodeOptions={blueprintNodeOptions}
              />,
              true,
              [
                t("panel.material.table"),
                "table",
                t("panel.config.tableSource"),
                t("panel.config.tableColumns"),
                t("panel.config.tableRowsText"),
              ]
            )
          ) : selectedElement.materialType === "text" ? (
            renderSection(
              "textConfig",
              t("panel.config.sectionText"),
              <>
                {renderFieldGroup(
                  t("panel.config.groupTextContent"),
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
                      data-config-field="textHtml"
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
                  t("panel.config.groupTextStyle"),
                  <>
                    <label className="block space-y-1">
                      <div>{t("panel.config.fontFamily")}</div>
                      <Input
                        value={selectedElement.textFontFamily ?? ""}
                        onChange={(e) =>
                          updateSelectedText({
                            textFontFamily: e.target.value || undefined,
                          })
                        }
                        placeholder={t("panel.config.fontFamilyPlaceholder")}
                        className="h-7"
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block space-y-1">
                        <div>{t("panel.config.fontSizePx")}</div>
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
                        <div>{t("panel.config.fontWeight")}</div>
                        <Select
                          value={selectedElement.textFontWeight ?? "400"}
                          onValueChange={(value) =>
                            updateSelectedText({
                              textFontWeight: value,
                            })
                          }
                        >
                          <SelectTrigger className="h-7">
                            <SelectValue placeholder={t("panel.config.selectFontWeight")} />
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
                        <div>{t("panel.config.textAlign")}</div>
                        <Select
                          value={selectedElement.textAlign ?? "left"}
                          onValueChange={(value) =>
                            updateSelectedText({
                              textAlign: value as "left" | "center" | "right" | "justify",
                            })
                          }
                        >
                          <SelectTrigger className="h-7">
                            <SelectValue placeholder={t("panel.config.selectTextAlign")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">{t("panel.config.alignLeft")}</SelectItem>
                            <SelectItem value="center">{t("panel.config.alignCenter")}</SelectItem>
                            <SelectItem value="right">{t("panel.config.alignRight")}</SelectItem>
                            <SelectItem value="justify">{t("panel.config.alignJustify")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>
                      <label className="block space-y-1">
                        <div>{t("panel.config.lineHeight")}</div>
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
                      t("panel.config.textColor"),
                      selectedElement.textColor ?? "",
                      (next) =>
                        updateSelectedText({
                          textColor: next || undefined,
                        })
                    )}
                  </>
                )}
                {renderFieldGroup(
                  t("panel.config.groupInputAbility"),
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
                    <span>{t("panel.config.allowCanvasInput")}</span>
                  </label>
                )}
              </>,
              true,
              [t("panel.material.text"), t("panel.config.searchKwRichText"), t("panel.config.fontFamily"), t("panel.config.color"), t("panel.config.textAlign"), t("panel.config.lineHeight"), t("panel.config.searchKwInput")]
            )
          ) : selectedElement.materialType === "audio" ? (
            renderSection(
              "audioConfig",
              t("panel.config.sectionAudio"),
              <>
                {renderFieldGroup(
                  t("panel.config.groupAudioSource"),
                  <>
                    <label className="block space-y-1">
                      <div>{t("panel.config.audioUrl")}</div>
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
                        {t("panel.config.uploadAudio")}
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
                        {isRecordingAudio ? t("panel.config.stopRecord") : t("panel.config.startRecord")}
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
                  t("panel.config.groupDisplayStyle"),
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
                      <span>{t("panel.config.autoPauseMedia")}</span>
                    </label>
                    <label className="block space-y-1">
                      <div>{t("panel.config.audioIconPreset")}</div>
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
                          <SelectValue placeholder={t("panel.config.selectIcon")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">{t("panel.config.iconDefaultProgress")}</SelectItem>
                          <SelectItem value="speaker">{t("panel.config.iconSpeaker")}</SelectItem>
                          <SelectItem value="music">{t("panel.config.iconMusic")}</SelectItem>
                          <SelectItem value="headphone">{t("panel.config.iconHeadphone")}</SelectItem>
                          <SelectItem value="wave">{t("panel.config.iconWave")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                    <label className="block space-y-1">
                      <div>{t("panel.config.visualEffect")}</div>
                      <Select
                        value={selectedElement.audioVisualEffect ?? "pulse"}
                        onValueChange={(value) =>
                          updateSelectedAudio({
                            audioVisualEffect: value as "none" | "pulse" | "ripple",
                          })
                        }
                      >
                        <SelectTrigger className="h-7">
                          <SelectValue placeholder={t("panel.config.selectEffect")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t("panel.config.effectNone")}</SelectItem>
                          <SelectItem value="pulse">{t("panel.config.effectPulse")}</SelectItem>
                          <SelectItem value="ripple">{t("panel.config.effectRipple")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                    <label className="block space-y-1">
                      <div>{t("panel.config.effectSpeed")}</div>
                      <Select
                        value={selectedElement.audioVisualSpeed ?? "normal"}
                        onValueChange={(value) =>
                          updateSelectedAudio({
                            audioVisualSpeed: value as "slow" | "normal" | "fast",
                          })
                        }
                      >
                        <SelectTrigger className="h-7">
                          <SelectValue placeholder={t("panel.config.selectSpeed")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slow">{t("panel.config.speedSlow")}</SelectItem>
                          <SelectItem value="normal">{t("panel.config.speedNormal")}</SelectItem>
                          <SelectItem value="fast">{t("panel.config.speedFast")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center rounded border border-border px-2 py-1 text-[11px] hover:bg-accent">
                        {t("panel.config.uploadPoster")}
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
                        {t("panel.config.clearPoster")}
                      </button>
                    </div>
                    {selectedElement.audioPosterImage ? (
                      <img
                        src={selectedElement.audioPosterImage}
                        alt={t("panel.config.audioPosterAlt")}
                        className="h-20 w-full rounded border border-border/60 object-cover"
                      />
                    ) : null}
                    <div className="flex items-center gap-1">
                      <div className="text-[11px] text-muted-foreground">{t("panel.config.audioPoster")}</div>
                      <ConfigHintIcon label={t("panel.config.audioPoster")}>
                        {t("panel.config.audioPosterHint")}
                      </ConfigHintIcon>
                    </div>
                  </>
                )}
              </>,
              true,
              [t("panel.material.audio"), "url", t("panel.config.searchKwUpload"), t("panel.config.searchKwRecord"), "icon", t("panel.config.searchKwPoster"), t("panel.config.effect"), t("panel.config.searchKwAutoPause"), "media"]
            )
          ) : selectedElement.materialType === "video" ? (
            renderSection(
              "videoConfig",
              t("panel.config.sectionVideo"),
              <>
                {renderFieldGroup(
                  t("panel.config.groupVideoSource"),
                  <>
                    <label className="block space-y-1">
                      <div>{t("panel.config.videoUrl")}</div>
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
                        {t("panel.config.uploadVideo")}
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
                      <span>{t("panel.config.autoPauseMedia")}</span>
                    </label>
                  </>
                )}
              </>,
              true,
              [t("panel.material.video"), "url", t("panel.config.searchKwUpload"), t("panel.config.searchKwPreview"), t("panel.config.searchKwAutoPause"), "media"]
            )
          ) : null}
          {selectedElement
            ? selectedElement.parentGridId
              ? renderSection(
                "gridChildSpan",
                t("panel.config.sectionGridChildSpan"),
                <>
                  {renderFieldGroup(
                    t("panel.config.groupCrossSlots"),
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block space-y-1">
                        <div>{t("panel.config.colSpan")}</div>
                        <Input
                          type="number"
                          min={1}
                          max={12}
                          value={selectedElement.gridColSpan ?? 1}
                          onChange={(e) =>
                            updateElement(selectedElement.id, {
                              gridColSpan: Math.max(1, Math.min(12, Number(e.target.value) || 1)),
                            })
                          }
                          className="h-7"
                        />
                      </label>
                      <label className="block space-y-1">
                        <div>{t("panel.config.rowSpan")}</div>
                        <Input
                          type="number"
                          min={1}
                          max={12}
                          value={selectedElement.gridRowSpan ?? 1}
                          onChange={(e) =>
                            updateElement(selectedElement.id, {
                              gridRowSpan: Math.max(1, Math.min(12, Number(e.target.value) || 1)),
                            })
                          }
                          className="h-7"
                        />
                      </label>
                    </div>
                  )}
                </>,
                true,
                [t("panel.config.searchKwGrid"), t("panel.config.searchKwCrossCol"), t("panel.config.searchKwCrossRow"), "span", "slot"],
                <>{t("panel.config.gridChildHint")}</>
              )
              : null
            : null}
          {selectedElement.materialType === "geometry" ? (
            renderSection(
              "geometryConfig",
              t("panel.config.sectionGeometry"),
              <>
                {renderFieldGroup(
                  t("panel.config.groupBasicShape"),
                  <>
                    <label className="block space-y-1">
                      <div>{t("panel.config.shape")}</div>
                      <Select
                        value={selectedElement.geometryShape ?? "rect"}
                        onValueChange={(value) =>
                          updateSelectedGeometry({
                            geometryShape: value as PanelElement["geometryShape"],
                          })
                        }
                      >
                        <SelectTrigger className="h-7">
                          <SelectValue placeholder={t("panel.config.selectShape")} />
                        </SelectTrigger>
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
                    {renderColorField(
                      t("panel.config.geometryColor"),
                      selectedElement.geometryColor ?? "#3b82f6",
                      (next) => updateSelectedGeometry({ geometryColor: next || "#3b82f6" })
                    )}
                  </>
                )}
                {renderFieldGroup(
                  t("panel.config.groupCanvasScript"),
                  <>
                    <Textarea
                      value={selectedElement.geometryScript ?? ""}
                      onChange={(e) => updateSelectedGeometry({ geometryScript: e.target.value || undefined })}
                      spellCheck={false}
                      className="h-36 font-mono text-[11px]"
                      placeholder={t("panel.config.geometryScriptPlaceholder")}
                    />
                  </>,
                  <>
                    {t("panel.config.canvasScriptHint")}
                  </>
                )}
                {renderFieldGroup(
                  t("panel.config.groupSketchOverlay"),
                  <>
                    <div className="flex items-center gap-2">
                      <label className="block space-y-1">
                        <div className="text-[11px]">{t("panel.config.penColor")}</div>
                        <Input
                          type="color"
                          value={geometryDrawPenColor}
                          onChange={(e) => setGeometryDrawPenColor(e.target.value)}
                          className="h-7 w-10 p-1"
                        />
                      </label>
                      <label className="block space-y-1">
                        <div className="text-[11px]">{t("panel.config.penWidth")}</div>
                        <Input
                          type="number"
                          min={1}
                          max={24}
                          value={geometryDrawPenWidth}
                          onChange={(e) => setGeometryDrawPenWidth(Math.max(1, Math.min(24, Number(e.target.value) || 1)))}
                          className="h-7 w-20"
                        />
                      </label>
                    </div>
                    <div className="rounded border border-border/60 bg-white p-2">
                      <canvas
                        ref={geometryDrawCanvasRef}
                        width={320}
                        height={180}
                        className="h-[180px] w-full cursor-crosshair rounded border border-border/60"
                        onPointerDown={(e) => {
                          const canvas = geometryDrawCanvasRef.current;
                          if (!canvas) return;
                          const ctx = canvas.getContext("2d");
                          if (!ctx) return;
                          const rect = canvas.getBoundingClientRect();
                          const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
                          const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
                          geometryLastPointRef.current = { x, y };
                          setIsGeometryDrawing(true);
                          ctx.lineCap = "round";
                          ctx.lineJoin = "round";
                          ctx.strokeStyle = geometryDrawPenColor;
                          ctx.lineWidth = geometryDrawPenWidth;
                          ctx.beginPath();
                          ctx.moveTo(x, y);
                        }}
                        onPointerMove={(e) => {
                          if (!isGeometryDrawing) return;
                          const canvas = geometryDrawCanvasRef.current;
                          const last = geometryLastPointRef.current;
                          if (!canvas || !last) return;
                          const ctx = canvas.getContext("2d");
                          if (!ctx) return;
                          const rect = canvas.getBoundingClientRect();
                          const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
                          const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
                          ctx.lineTo(x, y);
                          ctx.stroke();
                          geometryLastPointRef.current = { x, y };
                        }}
                        onPointerUp={() => {
                          setIsGeometryDrawing(false);
                          geometryLastPointRef.current = null;
                        }}
                        onPointerLeave={() => {
                          setIsGeometryDrawing(false);
                          geometryLastPointRef.current = null;
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded border border-border px-2 py-1 text-[11px] hover:bg-accent"
                        onClick={() => {
                          const canvas = geometryDrawCanvasRef.current;
                          if (!canvas) return;
                          updateSelectedGeometry({ geometrySketchDataUrl: canvas.toDataURL("image/png") });
                        }}
                      >
                        {t("panel.config.applySketch")}
                      </button>
                      <button
                        type="button"
                        className="rounded border border-border px-2 py-1 text-[11px] hover:bg-accent"
                        onClick={() => {
                          updateSelectedGeometry({ geometrySketchDataUrl: undefined });
                          redrawGeometryPadFromElement();
                        }}
                      >
                        {t("panel.config.clearSketch")}
                      </button>
                    </div>
                  </>
                )}
              </>,
              true,
              [t("panel.material.geometry"), "geometry", t("panel.config.shape"), "canvas", t("panel.config.searchKwScript"), t("panel.config.searchKwSketch")]
            )
          ) : selectedElement.materialType === "grid" ? (
            renderSection(
              "gridConfig",
              t("panel.config.sectionGrid"),
              <>
                {renderFieldGroup(
                  t("panel.config.groupGridParams"),
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block space-y-1">
                      <div>{t("panel.config.rowCount")}</div>
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
                      <div>{t("panel.config.colCount")}</div>
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
                      <div>{t("panel.config.gapPx")}</div>
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
                      <div>{t("panel.config.paddingPx")}</div>
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
                      <div>{t("panel.config.snapThresholdPx")}</div>
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
              </>,
              true,
              [t("panel.config.searchKwGrid"), "grid", t("panel.config.rows"), t("panel.config.cols"), t("panel.config.searchKwGap"), t("panel.config.searchKwPadding"), t("panel.config.searchKwSnap"), t("panel.config.searchKwThreshold")],
              <>
                {t("panel.config.gridHint")}
              </>
            )
          ) : selectedElement.materialType === "reference" ? (
            renderSection(
              "reference",
              t("panel.config.sectionReference"),
              <>
                {renderFieldGroup(
                  t("panel.config.groupRefSource"),
                  <label className="block space-y-1">
                    <div>{t("panel.config.refLayer")}</div>
                    <Select
                      value={selectedElement.refLayerId ?? "__none__"}
                      onValueChange={(value) =>
                        updateElement(selectedElement.id, {
                          refLayerId: value === "__none__" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger className="h-7">
                        <SelectValue placeholder={t("panel.config.pleaseSelectLayer")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">{t("panel.config.noneNoRef")}</SelectItem>
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
                  t("panel.config.groupCopyStrategy"),
                  <>
                    <label className="block space-y-1">
                      <div>{t("panel.config.copyMode")}</div>
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
                          <SelectValue placeholder={t("panel.config.selectCopyMode")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shallow">{t("panel.config.shallowFollow")}</SelectItem>
                          <SelectItem value="deep">{t("panel.config.deepFreeze")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                  </>,
                  <>
                    {t("panel.config.copyStrategyHint")}
                  </>
                )}
              </>,
              true,
              [t("panel.config.searchKwRef"), "ref", t("panel.config.layer"), t("panel.material.shallowCopy"), t("panel.material.deepCopy"), "snapshot"]
            )
          ) : (
            <div className="text-xs leading-6 text-muted-foreground">
              {t("panel.config.notChartType")}
            </div>
          )}
          {hasSearch && renderedSectionCount === 0 ? (
            <div className="rounded border border-border/60 bg-background px-2 py-1.5 text-[11px] text-muted-foreground">
              {t("panel.config.noMatch")}
            </div>
          ) : null}
            </div>
          </fieldset>
        </div>
      ) : null}
    </aside>
    </ScopeConfigProvider>
  );
}

