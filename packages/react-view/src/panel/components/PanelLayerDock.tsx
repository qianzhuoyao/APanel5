import React, { useState } from "react";
import {
  Checkbox,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@arronqzy/ui";
import {
  IconCheck,
  IconChevron,
  IconClose,
  IconEdit,
  IconEyeOff,
  IconLayers,
  IconLock,
  IconMerge,
  IconPlus,
  IconStar,
  IconTrash,
} from "../icons";
import type { PanelLayer } from "../types";

export type PanelLayerDockProps = {
  t: (key: string, params?: Record<string, string | number>) => string;
  isLayerPanelExpanded: boolean;
  setIsLayerPanelExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  addLayer: () => void;
  canMergeLayers: boolean;
  setIsMergingLayers: React.Dispatch<React.SetStateAction<boolean>>;
  isMergingLayers: boolean;
  layers: PanelLayer[];
  activeLayerId: string;
  setActiveLayer: (layerId: string) => void;
  themedScrollbarClass: string;
  activeLayer: PanelLayer | null;
  editingLayerId: string | null;
  setEditingLayerId: React.Dispatch<React.SetStateAction<string | null>>;
  editingLayerName: string;
  setEditingLayerName: React.Dispatch<React.SetStateAction<string>>;
  renameLayer: (layerId: string, name: string) => void;
  setPrimaryLayer: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  getLayerDeleteBlockReason: (layerId: string) => string | null;
  showActionHint: (message: string) => void;
  setConfirmDeleteLayerId: (id: string | null) => void;
  setDeleteTargetLayerId: (id: string) => void;
  setDeleteMode: (mode: "remove" | "move") => void;
  toggleLayerMergeSelected: (layerId: string) => void;
  mergeLayerName: string;
  setMergeLayerName: React.Dispatch<React.SetStateAction<string>>;
  mergeSelectedLayers: (name?: string) => void;
};

const iconBtn =
  "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background/80 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40";

export function PanelLayerDock({
  t,
  isLayerPanelExpanded,
  setIsLayerPanelExpanded,
  addLayer,
  canMergeLayers,
  setIsMergingLayers,
  isMergingLayers,
  layers,
  activeLayerId,
  setActiveLayer,
  themedScrollbarClass,
  activeLayer,
  editingLayerId,
  setEditingLayerId,
  editingLayerName,
  setEditingLayerName,
  renameLayer,
  setPrimaryLayer,
  toggleLayerLock,
  getLayerDeleteBlockReason,
  showActionHint,
  setConfirmDeleteLayerId,
  setDeleteTargetLayerId,
  setDeleteMode,
  toggleLayerMergeSelected,
  mergeLayerName,
  setMergeLayerName,
  mergeSelectedLayers,
}: PanelLayerDockProps) {
  const [dockVisible, setDockVisible] = useState(true);

  if (!dockVisible) {
    return (
      <div className="flex justify-center border-t border-border/50 bg-muted/5 px-2 py-0.5">
        <TooltipProvider delayDuration={120}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setDockVisible(true)}
                aria-label={t("panel.layers.title")}
                className="inline-flex h-6 items-center gap-1 rounded-md border border-border/60 bg-background/90 px-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <IconLayers />
                <span data-typo="caption" className="hidden text-[11px] font-medium sm:inline">
                  {t("panel.layers.title")}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent className="z-[10000]">{t("panel.layers.title")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className="border-t border-border/50 bg-muted/5 px-2.5 py-1.5">
      <TooltipProvider delayDuration={120}>
        <Tabs value={activeLayerId} onValueChange={setActiveLayer}>
          <div className="flex min-w-0 items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground">
                  <IconLayers />
                </span>
              </TooltipTrigger>
              <TooltipContent className="z-[10000]">{t("panel.layers.title")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setIsLayerPanelExpanded((v) => !v)}
                  aria-label={
                    isLayerPanelExpanded
                      ? t("panel.layers.collapseInputAria")
                      : t("panel.layers.expandInputAria")
                  }
                  className={iconBtn}
                >
                  <IconChevron expanded={isLayerPanelExpanded} />
                </button>
              </TooltipTrigger>
              <TooltipContent className="z-[10000]">
                {isLayerPanelExpanded
                  ? t("panel.layers.collapseInput")
                  : t("panel.layers.expandInput")}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={addLayer}
                  aria-label={t("panel.layers.add")}
                  className={iconBtn}
                >
                  <IconPlus />
                </button>
              </TooltipTrigger>
              <TooltipContent className="z-[10000]">{t("panel.layers.add")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => {
                    if (!canMergeLayers) return;
                    setIsMergingLayers(true);
                    setIsLayerPanelExpanded(true);
                  }}
                  aria-label={t("panel.layers.merge")}
                  disabled={!canMergeLayers}
                  className={iconBtn}
                >
                  <IconMerge />
                </button>
              </TooltipTrigger>
              <TooltipContent className="z-[10000]">
                {canMergeLayers ? t("panel.layers.merge") : t("panel.layers.mergeNeedTwo")}
              </TooltipContent>
            </Tooltip>

            <TabsList
              className={`ml-0.5 h-6 min-w-0 flex-1 justify-start gap-0.5 overflow-x-auto rounded-md bg-muted/30 p-0.5 ${themedScrollbarClass}`}
            >
              {layers.map((layer) => (
                <TabsTrigger
                  key={layer.id}
                  value={layer.id}
                  className="flex h-5 max-w-[120px] min-w-[64px] items-center gap-1 rounded px-1.5 py-0 text-[11px] font-medium data-[state=active]:font-semibold"
                >
                  <span className="truncate">{layer.name}</span>
                  {layer.isPrimary ? (
                    <span className="text-emerald-500" title={t("panel.layers.primary")}>
                      <IconStar filled />
                    </span>
                  ) : null}
                  {layer.locked ? <IconLock locked /> : null}
                </TabsTrigger>
              ))}
            </TabsList>

            {activeLayer ? (
              <div className="flex shrink-0 items-center gap-0.5 border-l border-border/50 pl-1">
                {editingLayerId === activeLayer.id ? (
                  <Input
                    value={editingLayerName}
                    onChange={(e) => setEditingLayerName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        renameLayer(editingLayerId, editingLayerName);
                        setEditingLayerId(null);
                        setEditingLayerName("");
                        return;
                      }
                      if (e.key === "Escape") {
                        e.preventDefault();
                        setEditingLayerId(null);
                        setEditingLayerName("");
                      }
                    }}
                    className="h-6 w-24 min-w-0 text-[11px]"
                    placeholder={t("panel.layers.namePlaceholder")}
                    autoFocus
                  />
                ) : null}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setPrimaryLayer(activeLayer.id)}
                      disabled={activeLayer.isPrimary}
                      aria-label={
                        activeLayer.isPrimary
                          ? t("panel.layers.isPrimary")
                          : t("panel.layers.setPrimary")
                      }
                      className={[
                        iconBtn,
                        activeLayer.isPrimary ? "text-emerald-500" : "",
                      ].join(" ")}
                    >
                      <IconStar filled={activeLayer.isPrimary} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="z-[10000]">
                    {activeLayer.isPrimary
                      ? t("panel.layers.isPrimaryHint")
                      : t("panel.layers.setPrimaryHint")}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => toggleLayerLock(activeLayer.id)}
                      disabled={!activeLayer.editable}
                      aria-label={
                        activeLayer.locked ? t("panel.layers.unlock") : t("panel.layers.lock")
                      }
                      className={iconBtn}
                    >
                      <IconLock locked={activeLayer.locked} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="z-[10000]">
                    {activeLayer.locked ? t("panel.layers.unlock") : t("panel.layers.lock")}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    {editingLayerId === activeLayer.id ? (
                      <button
                        type="button"
                        onClick={() => {
                          renameLayer(editingLayerId, editingLayerName);
                          setEditingLayerId(null);
                          setEditingLayerName("");
                        }}
                        aria-label={t("panel.layers.saveName")}
                        className={iconBtn}
                      >
                        <IconCheck />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingLayerId(activeLayer.id);
                          setEditingLayerName(activeLayer.name);
                        }}
                        disabled={!activeLayer.editable}
                        aria-label={t("panel.layers.rename")}
                        className={iconBtn}
                      >
                        <IconEdit />
                      </button>
                    )}
                  </TooltipTrigger>
                  <TooltipContent className="z-[10000]">
                    {editingLayerId === activeLayer.id
                      ? t("panel.layers.saveName")
                      : t("panel.layers.rename")}
                  </TooltipContent>
                </Tooltip>

                {editingLayerId === activeLayer.id ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingLayerId(null);
                          setEditingLayerName("");
                        }}
                        aria-label={t("panel.layers.cancelEditName")}
                        className={iconBtn}
                      >
                        <IconClose />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="z-[10000]">
                      {t("panel.layers.cancelEdit")}
                    </TooltipContent>
                  </Tooltip>
                ) : null}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        const blockReason = getLayerDeleteBlockReason(activeLayer.id);
                        if (blockReason) {
                          showActionHint(blockReason);
                          return;
                        }
                        setConfirmDeleteLayerId(activeLayer.id);
                        const firstTarget = layers.find((l) => l.id !== activeLayer.id);
                        setDeleteTargetLayerId(firstTarget?.id ?? "");
                        setDeleteMode(activeLayer.isMapping ? "remove" : "move");
                      }}
                      disabled={!activeLayer.editable || activeLayer.locked}
                      aria-label={
                        !activeLayer.editable
                          ? t("panel.layers.cannotDeleteDefault")
                          : activeLayer.locked
                            ? t("panel.layers.cannotDeleteLocked")
                            : t("panel.layers.delete")
                      }
                      className={iconBtn}
                    >
                      <IconTrash />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="z-[10000]">
                    {!activeLayer.editable
                      ? t("panel.layers.cannotDeleteDefault")
                      : activeLayer.locked
                        ? t("panel.layers.cannotDeleteLocked")
                        : t("panel.layers.delete")}
                  </TooltipContent>
                </Tooltip>
              </div>
            ) : null}

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setDockVisible(false)}
                  aria-label={t("panel.layers.collapseInputAria")}
                  className={iconBtn}
                >
                  <IconEyeOff />
                </button>
              </TooltipTrigger>
              <TooltipContent className="z-[10000]">
                {t("panel.layers.collapseInput")}
              </TooltipContent>
            </Tooltip>
          </div>

          {isLayerPanelExpanded ? (
            <TabsContent value={activeLayerId} className="mt-1 space-y-1">
              <div className="rounded-md border border-border/50 bg-card/80 px-2 py-1.5">
                <div
                  data-typo="caption"
                  className="mb-1 text-[11px] font-medium text-muted-foreground"
                >
                  {t("panel.layers.selectMergeLayers")}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {layers.map((layer) => (
                    <label
                      key={layer.id}
                      className="flex min-w-0 items-center gap-1.5 text-[11px]"
                    >
                      <Checkbox
                        checked={Boolean(layer.mergeSelected)}
                        disabled={layer.isMapping}
                        className="h-3.5 w-3.5 border border-foreground/70 bg-background data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                        onCheckedChange={() => toggleLayerMergeSelected(layer.id)}
                      />
                      <span
                        className="max-w-[120px] truncate font-medium text-foreground/90"
                        title={
                          layer.isMapping ? t("panel.layers.mappingCannotMerge") : layer.name
                        }
                      >
                        {layer.name}
                        {layer.isMapping ? t("panel.layers.cannotMergeSuffix") : ""}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {isMergingLayers ? (
                <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-card/80 px-2 py-1">
                  <span
                    data-typo="caption"
                    className="shrink-0 text-[11px] text-muted-foreground"
                  >
                    {t("panel.layers.mergedName")}
                  </span>
                  <Input
                    value={mergeLayerName}
                    onChange={(e) => setMergeLayerName(e.target.value)}
                    className="h-6 min-w-0 flex-1 text-[11px]"
                    placeholder={t("panel.layers.mergedNamePlaceholder")}
                    autoFocus
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => {
                          if (!canMergeLayers) return;
                          mergeSelectedLayers(mergeLayerName || undefined);
                          setIsMergingLayers(false);
                          setMergeLayerName("");
                        }}
                        aria-label={t("panel.layers.confirmMergeAria")}
                        disabled={!canMergeLayers}
                        className={iconBtn}
                      >
                        <IconCheck />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="z-[10000]">
                      {t("panel.layers.confirmMerge")}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMergingLayers(false);
                          setMergeLayerName("");
                        }}
                        aria-label={t("panel.layers.cancelMergeAria")}
                        className={iconBtn}
                      >
                        <IconClose />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="z-[10000]">
                      {t("panel.layers.cancelMerge")}
                    </TooltipContent>
                  </Tooltip>
                </div>
              ) : null}
            </TabsContent>
          ) : null}
        </Tabs>
      </TooltipProvider>
    </div>
  );
}
