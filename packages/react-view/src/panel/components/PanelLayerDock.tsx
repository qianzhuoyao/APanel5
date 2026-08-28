import React from "react";
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
  IconLock,
  IconMerge,
  IconPlus,
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
  return (
              <div className="border-t border-border bg-background/95 px-2 py-1.5">
                <TooltipProvider delayDuration={120}>
                  <Tabs value={activeLayerId} onValueChange={setActiveLayer}>
                    <div className="mb-1 flex items-center gap-2">
                      <div className="text-[11px] font-semibold text-muted-foreground">{t("panel.layers.title")}</div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => setIsLayerPanelExpanded((v) => !v)}
                            aria-label={isLayerPanelExpanded ? t("panel.layers.collapseInputAria") : t("panel.layers.expandInputAria")}
                            className="rounded border border-border p-1 hover:bg-accent"
                          >
                            <IconChevron expanded={isLayerPanelExpanded} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="z-[10000]">
                          {isLayerPanelExpanded ? t("panel.layers.collapseInput") : t("panel.layers.expandInput")}
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={addLayer}
                            aria-label={t("panel.layers.add")}
                            className="rounded border border-border p-1 hover:bg-accent"
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
                            }}
                            aria-label={t("panel.layers.merge")}
                          disabled={!canMergeLayers}
                          className="rounded border border-border p-1 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <IconMerge />
                          </button>
                        </TooltipTrigger>
                      <TooltipContent className="z-[10000]">
                        {canMergeLayers ? t("panel.layers.merge") : t("panel.layers.mergeNeedTwo")}
                      </TooltipContent>
                      </Tooltip>
                    </div>

                    <TabsList
                      className={`h-auto w-full justify-start gap-1 overflow-x-auto bg-muted/40 p-1 ${themedScrollbarClass}`}
                    >
                      {layers.map((layer) => (
                        <TabsTrigger
                          key={layer.id}
                          value={layer.id}
                          className="flex min-w-[120px] items-center gap-1 px-2 py-1 text-xs"
                        >
                          <span className="truncate">{layer.name}</span>
                          {layer.isMapping ? (
                            <span className="rounded border border-primary/40 bg-primary/10 px-1 text-[10px] text-primary">
                              {t("panel.layers.mapping")}
                            </span>
                          ) : null}
                          {layer.isPrimary ? (
                            <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-1 text-[10px] text-emerald-600">
                              {t("panel.layers.primary")}
                            </span>
                          ) : null}
                          {layer.locked ? <IconLock locked /> : null}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <TabsContent value={activeLayerId} className="mt-2 space-y-2">
                      {activeLayer ? (
                        <div className="flex items-center gap-2 rounded border border-border bg-card px-2 py-1.5 text-xs">
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
                              className="h-7 min-w-0 flex-1"
                              placeholder={t("panel.layers.namePlaceholder")}
                              autoFocus
                            />
                          ) : (
                            <span className="truncate font-medium">{activeLayer.name}</span>
                          )}
                          {activeLayer.isMapping ? (
                            <span className="rounded border border-primary/40 bg-primary/10 px-1 text-[10px] text-primary">
                              {t("panel.layers.mappingLayer")}
                            </span>
                          ) : null}
                          {activeLayer.isPrimary ? (
                            <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-1 text-[10px] text-emerald-600">
                              {t("panel.layers.primaryLayer")}
                            </span>
                          ) : null}
                          <div className="flex-1" />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => setPrimaryLayer(activeLayer.id)}
                                disabled={activeLayer.isPrimary}
                                aria-label={activeLayer.isPrimary ? t("panel.layers.isPrimary") : t("panel.layers.setPrimary")}
                                className={[
                                  "rounded border px-2 py-1 text-[11px] disabled:cursor-not-allowed disabled:opacity-60",
                                  activeLayer.isPrimary
                                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
                                    : "border-border hover:bg-accent",
                                ].join(" ")}
                              >
                                {activeLayer.isPrimary ? t("panel.layers.isPrimary") : t("panel.layers.setPrimary")}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="z-[10000]">
                              {activeLayer.isPrimary ? t("panel.layers.isPrimaryHint") : t("panel.layers.setPrimaryHint")}
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => toggleLayerLock(activeLayer.id)}
                                disabled={!activeLayer.editable}
                                aria-label={activeLayer.locked ? t("panel.layers.unlock") : t("panel.layers.lock")}
                                className="rounded border border-border p-1 disabled:opacity-40"
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
                                  className="rounded border border-border p-1 hover:bg-accent"
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
                                  className="rounded border border-border p-1 disabled:opacity-40"
                                >
                                  <IconEdit />
                                </button>
                              )}
                            </TooltipTrigger>
                            <TooltipContent className="z-[10000]">
                              {editingLayerId === activeLayer.id ? t("panel.layers.saveName") : t("panel.layers.rename")}
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
                                  className="rounded border border-border p-1 hover:bg-accent"
                                >
                                  <IconClose />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="z-[10000]">{t("panel.layers.cancelEdit")}</TooltipContent>
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
                                className="rounded border border-border p-1 disabled:opacity-40"
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

                      {isLayerPanelExpanded ? (
                        <div className="rounded border border-border bg-card px-2 py-1.5 text-xs">
                          <div className="mb-1 text-muted-foreground">{t("panel.layers.selectMergeLayers")}</div>
                          <div className="flex flex-wrap gap-2">
                            {layers.map((layer) => (
                              <label key={layer.id} className="flex items-center gap-1.5">
                                <Checkbox
                                  checked={Boolean(layer.mergeSelected)}
                                  disabled={layer.isMapping}
                                  className="h-4 w-4 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                                  onCheckedChange={() => toggleLayerMergeSelected(layer.id)}
                                />
                                <span
                                  className="max-w-[140px] truncate"
                                  title={layer.isMapping ? t("panel.layers.mappingCannotMerge") : layer.name}
                                >
                                  {layer.name}
                                  {layer.isMapping ? t("panel.layers.cannotMergeSuffix") : ""}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </TabsContent>
                  </Tabs>

                {isLayerPanelExpanded && isMergingLayers ? (
                  <div className="mt-2 flex items-center gap-2 rounded border border-border bg-card px-2 py-1.5 text-xs">
                    <span className="text-muted-foreground">{t("panel.layers.mergedName")}</span>
                    <Input
                      value={mergeLayerName}
                      onChange={(e) => setMergeLayerName(e.target.value)}
                      className="h-7 min-w-0 flex-1"
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
                          className="rounded border border-border p-1 hover:bg-accent"
                        >
                          <IconCheck />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="z-[10000]">{t("panel.layers.confirmMerge")}</TooltipContent>
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
                          className="rounded border border-border p-1 hover:bg-accent"
                        >
                          <IconClose />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="z-[10000]">{t("panel.layers.cancelMerge")}</TooltipContent>
                    </Tooltip>
                  </div>
                ) : null}
                </TooltipProvider>
              </div>

  );
}
