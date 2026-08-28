import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useI18n } from "@arronqzy/i18n/react";
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
} from "@arronqzy/ui";
import type { PanelElement, ReferenceCopyMode } from "../types";
import { CHART_TYPES } from "../utils/chartOptionBuilder";
import type { PanelLayer } from "../types";
import { getPanelMessages } from "../constants/messages";
import { ViewElementScopePanel } from "./ViewElementScopePanel";
import { ConfigHintIcon } from "./ConfigHintIcon";
import { hasViewElementScope } from "../scope/view-scope-store";
import { collectElementScopeWarnings } from "../utils/scope-template-warnings";
import { ScopeConfigProvider } from "./scope-config/ScopeConfigContext";
import { ScopeTemplateWarningsPanel } from "./scope-config/ScopeTemplateWarningsPanel";
import { PanelConfigTableSection } from "./table/PanelConfigTableSection";
import { highlightConfigField, subscribeRevealPanelConfig } from "../ai/revealConfigField";
import { PanelConfigScene3dSection } from "./config/PanelConfigScene3dSection";
import { PanelConfigNodeInfo } from "./config/PanelConfigNodeInfo";
import { PanelConfigChartSection } from "./config/PanelConfigChartSection";
import { PanelConfigTextSection } from "./config/PanelConfigTextSection";
import { PanelConfigStyleSections } from "./config/PanelConfigStyleSections";
import { PanelConfigGridSection } from "./config/PanelConfigGridSection";
import { PanelConfigGridChildSpan } from "./config/PanelConfigGridChildSpan";
import { PanelConfigViewportSection } from "./config/PanelConfigViewportSection";
import { PanelConfigReferenceSection } from "./config/PanelConfigReferenceSection";
import { PanelConfigAudioSection } from "./config/PanelConfigAudioSection";
import { PanelConfigVideoSection } from "./config/PanelConfigVideoSection";
import { PanelConfigGeometrySection } from "./config/PanelConfigGeometrySection";
import { PanelConfigMultiSelect } from "./config/PanelConfigMultiSelect";
import {
  type ConfigSectionHelpers,
  type UpdateElement,
  OPTION_CHECKBOX_CLASS,
  OPTION_INPUT_CLASS,
  OPTION_SELECT_TRIGGER_CLASS,
} from "./config/helpers";

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
  viewElementScope?: unknown;
  blueprintNodeOptions?: { id: string; label: string }[];
};

function ConfigSearchEmpty({
  hasSearch,
  matchCountRef,
  label,
}: {
  hasSearch: boolean;
  matchCountRef: React.MutableRefObject<number>;
  label: string;
}) {
  if (hasSearch && matchCountRef.current === 0) {
    return (
      <div className="rounded border border-border/60 bg-background px-2 py-1.5 text-[11px] text-muted-foreground">
        {label}
      </div>
    );
  }
  return null;
}

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

  const [configSearch, setConfigSearch] = useState("");
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);
  const SEARCH_COLLAPSE_STORAGE_KEY = "panel:config-search-collapsed";
  const sidebarScrollRef = useRef<HTMLElement | null>(null);
  const matchCountRef = useRef(0);
  const themedScrollbarClass =
    "scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/80 [&::-webkit-scrollbar-thumb]:hover:bg-border";
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    nodeInfo: true,
    styleBackground: false,
    styleBorder: false,
    chartBasic: true,
    chartAdvanced: false,
    chartAdvancedHighFreq: true,
    chartAdvancedLayout: false,
    chartAdvancedAxisPointer: false,
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
      ? messages.nodeConfigLocked
      : selectedLayer?.locked
        ? messages.nodeConfigLayerLocked
        : "";
  const normalizedSearch = useMemo(() => configSearch.trim().toLowerCase(), [configSearch]);
  const hasSearch = normalizedSearch.length > 0;
  const showScopePanel =
    !!selectedElement &&
    viewElementScope !== undefined &&
    hasViewElementScope(selectedElement.id);
  const scopeWarnings = useMemo(() => {
    if (!selectedElement || viewElementScope === undefined) return [];
    return collectElementScopeWarnings(selectedElement, viewElementScope, t);
  }, [selectedElement, viewElementScope, t]);
  const effectiveSelectedElements = useMemo(() => {
    if (selectedElements.length > 0) return selectedElements;
    return selectedElement ? [selectedElement] : [];
  }, [selectedElement, selectedElements]);
  const isMultiSelectMode = effectiveSelectedElements.length > 1;

  useEffect(() => {
    if (!selectedElement) return;
    if (!CHART_TYPES.has(selectedElement.materialType ?? "")) return;
    setExpandedSections((prev) => ({
      ...prev,
      chartBasic: true,
    }));
  }, [selectedElement?.id, selectedElement?.materialType]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(SEARCH_COLLAPSE_STORAGE_KEY);
    if (saved === "1") setIsSearchCollapsed(true);
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SEARCH_COLLAPSE_STORAGE_KEY, isSearchCollapsed ? "1" : "0");
  }, [isSearchCollapsed]);

  const isSectionExpanded = (key: string, defaultValue = true) =>
    expandedSections[key] ?? defaultValue;

  const setSectionExpanded = (key: string, next: boolean) => {
    setExpandedSections((prev) => ({ ...prev, [key]: next }));
  };

  useEffect(() => {
    return subscribeRevealPanelConfig((detail) => {
      setExpandedSections((prev) => {
        const next = { ...prev };
        for (const section of detail.sections) next[section] = true;
        next.nodeMore = true;
        next.styleBgLayout = true;
        next.chartDisplayMore = true;
        next.chartTooltip = true;
        next.chartAxes = true;
        next.textInputAbility = true;
        next.audioDisplayStyle = true;
        next.geometryCanvasScript = true;
        next.geometrySketch = true;
        next.referenceCopyStrategy = true;
        return next;
      });
      window.requestAnimationFrame(() => {
        const field = detail.fields[0];
        if (field) highlightConfigField(field);
      });
    });
  }, []);

  matchCountRef.current = 0;

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
    matchCountRef.current += 1;
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
    hint?: React.ReactNode,
    options?: { groupKey?: string; defaultOpen?: boolean }
  ) => {
    const groupKey = options?.groupKey;
    const defaultOpen = options?.defaultOpen ?? true;
    const header = (
      <>
        <div className="text-[11px] font-semibold text-muted-foreground">{title}</div>
        {hint ? <ConfigHintIcon label={title}>{hint}</ConfigHintIcon> : null}
      </>
    );
    if (!groupKey) {
      return (
        <div className="space-y-2.5 rounded-lg border border-border/55 bg-background/80 p-2.5">
          <div className="flex items-center gap-1">{header}</div>
          {children}
        </div>
      );
    }
    const open = hasSearch ? true : isSectionExpanded(groupKey, defaultOpen);
    return (
      <Collapsible
        open={open}
        onOpenChange={(next) => setSectionExpanded(groupKey, next)}
        className="space-y-2.5 rounded-lg border border-border/55 bg-background/80 p-2.5"
      >
        <div className="flex items-center gap-1.5">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex h-5 w-5 items-center justify-center rounded text-[11px] hover:bg-accent"
              aria-label={open ? t("panel.config.collapseGroup", { title }) : t("panel.config.expandGroup", { title })}
            >
              {open ? "▾" : "▸"}
            </button>
          </CollapsibleTrigger>
          {header}
        </div>
        <CollapsibleContent className="space-y-2.5">{children}</CollapsibleContent>
      </Collapsible>
    );
  };

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

  const helpers: ConfigSectionHelpers = {
    renderSection,
    renderFieldGroup,
    renderColorField,
    hasSearch,
    normalizedSearch,
    isSectionExpanded,
    setSectionExpanded,
    optionCheckboxClass: OPTION_CHECKBOX_CLASS,
    optionInputClass: OPTION_INPUT_CLASS,
    optionSelectTriggerClass: OPTION_SELECT_TRIGGER_CLASS,
    renderOptionLabel,
    renderFormatterLabel,
  };

  const materialType = selectedElement?.materialType ?? "";

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
          {showScopePanel ? <ViewElementScopePanel scope={viewElementScope} /> : null}
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
          <PanelConfigMultiSelect
            elements={effectiveSelectedElements}
            helpers={helpers}
            updateElement={updateElement}
            layers={layers}
            setReferenceCopyMode={setReferenceCopyMode}
            onExcludeSelectedNode={onExcludeSelectedNode}
            onAdjustNodeZOrder={onAdjustNodeZOrder}
          />
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
            <fieldset disabled={!isNodeEditable} className={!isNodeEditable ? "opacity-60" : ""}>
              <div className="space-y-3.5 text-xs">
                <PanelConfigNodeInfo
                  element={selectedElement}
                  helpers={helpers}
                  updateElement={updateElement}
                  nodeZOrderLabel={nodeZOrderLabel}
                  onAdjustNodeZOrder={onAdjustNodeZOrder}
                />
              </div>
            </fieldset>
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
                {isChartElement ? (
                  <PanelConfigChartSection
                    element={selectedElement}
                    helpers={helpers}
                    updateElement={updateElement}
                  />
                ) : materialType === "table" ? (
                  helpers.renderSection(
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
                ) : materialType === "text" ? (
                  <PanelConfigTextSection
                    element={selectedElement}
                    helpers={helpers}
                    updateElement={updateElement}
                  />
                ) : materialType === "audio" ? (
                  <PanelConfigAudioSection
                    element={selectedElement}
                    helpers={helpers}
                    updateElement={updateElement}
                  />
                ) : materialType === "video" ? (
                  <PanelConfigVideoSection
                    element={selectedElement}
                    helpers={helpers}
                    updateElement={updateElement}
                  />
                ) : null}
                <PanelConfigGridChildSpan
                  element={selectedElement}
                  helpers={helpers}
                  updateElement={updateElement}
                />
                {materialType === "geometry" ? (
                  <PanelConfigGeometrySection
                    element={selectedElement}
                    helpers={helpers}
                    updateElement={updateElement}
                  />
                ) : materialType === "scene3d" ? (
                  helpers.renderSection(
                    "scene3dConfig",
                    t("panel.config.sectionScene3d"),
                    <PanelConfigScene3dSection
                      element={selectedElement}
                      updateElement={updateElement}
                    />,
                    true,
                    [
                      t("panel.material.scene3d"),
                      "3d",
                      "glb",
                      t("panel.config.scene3dUploadModels"),
                      t("panel.config.groupScene3dCamera"),
                      t("panel.config.groupScene3dModelAnim"),
                    ]
                  )
                ) : materialType === "grid" ? (
                  <PanelConfigGridSection
                    element={selectedElement}
                    helpers={helpers}
                    updateElement={updateElement}
                  />
                ) : materialType === "viewport" ? (
                  <PanelConfigViewportSection
                    element={selectedElement}
                    helpers={helpers}
                    updateElement={updateElement}
                    layers={layers}
                    setReferenceCopyMode={setReferenceCopyMode}
                  />
                ) : materialType === "reference" ? (
                  <PanelConfigReferenceSection
                    element={selectedElement}
                    helpers={helpers}
                    updateElement={updateElement}
                    layers={layers}
                    setReferenceCopyMode={setReferenceCopyMode}
                  />
                ) : materialType === "image" ? null : (
                  <div className="text-xs leading-6 text-muted-foreground">
                    {t("panel.config.notChartType")}
                  </div>
                )}
                <PanelConfigStyleSections
                  element={selectedElement}
                  helpers={helpers}
                  updateElement={updateElement}
                />
                <ConfigSearchEmpty
                  hasSearch={hasSearch}
                  matchCountRef={matchCountRef}
                  label={t("panel.config.noMatch")}
                />
              </div>
            </fieldset>
          </div>
        ) : null}
      </aside>
    </ScopeConfigProvider>
  );
}
