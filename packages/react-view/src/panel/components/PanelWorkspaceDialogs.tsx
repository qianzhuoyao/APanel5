import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@arronqzy/ui";
import type { PanelActionResult, PanelLayer } from "../types";

export type PanelWorkspaceDialogsProps = {
  t: (key: string, params?: Record<string, string | number>) => string;
  mappingDeleteConfirmOpen: boolean;
  setMappingDeleteConfirmOpen: (open: boolean) => void;
  mappingDeleteProceedRef: React.MutableRefObject<(() => void) | null>;
  mappingDeleteImpactCount: number;
  deletingLayer: PanelLayer | null;
  deletingLayerMode: "move" | "remove";
  setConfirmDeleteLayerId: (id: string | null) => void;
  setDeleteMode: (mode: "move" | "remove") => void;
  setDeleteTargetLayerId: (id: string) => void;
  deleteTargetLayerId: string;
  deleteTargetCandidates: PanelLayer[];
  deleteLayer: (
    id: string,
    options: { mode: "move" | "remove"; targetLayerId?: string }
  ) => PanelActionResult;
  showActionHint: (message: string) => void;
  titleIconPreviewOpen: boolean;
  setTitleIconPreviewOpen: (open: boolean) => void;
  titleIconZoom: number;
  setTitleIconZoom: React.Dispatch<React.SetStateAction<number>>;
  titleIconDataUrl: string;
};

export function PanelWorkspaceDialogs({
  t,
  mappingDeleteConfirmOpen,
  setMappingDeleteConfirmOpen,
  mappingDeleteProceedRef,
  mappingDeleteImpactCount,
  deletingLayer,
  deletingLayerMode,
  setConfirmDeleteLayerId,
  setDeleteMode,
  setDeleteTargetLayerId,
  deleteTargetLayerId,
  deleteTargetCandidates,
  deleteLayer,
  showActionHint,
  titleIconPreviewOpen,
  setTitleIconPreviewOpen,
  titleIconZoom,
  setTitleIconZoom,
  titleIconDataUrl,
}: PanelWorkspaceDialogsProps) {
  return (
    <>
      <AlertDialog
        open={mappingDeleteConfirmOpen}
        onOpenChange={(open) => {
          setMappingDeleteConfirmOpen(open);
          if (!open) mappingDeleteProceedRef.current = null;
        }}
      >
        <AlertDialogContent overlayClassName="bg-transparent pointer-events-none">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("panel.layers.confirmDeleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("panel.layers.confirmDeleteMappingBody", {
                count: mappingDeleteImpactCount,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const fn = mappingDeleteProceedRef.current;
                mappingDeleteProceedRef.current = null;
                setMappingDeleteConfirmOpen(false);
                fn?.();
              }}
            >
              {t("panel.layers.continueDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={Boolean(deletingLayer)}
        onOpenChange={(open) => {
          if (open) return;
          setConfirmDeleteLayerId(null);
          setDeleteMode("move");
          setDeleteTargetLayerId("");
        }}
      >
        <DialogContent
          className="sm:max-w-[520px]"
          overlayClassName="bg-transparent pointer-events-none"
        >
          <DialogHeader>
            <DialogTitle>{t("panel.layers.confirmDeleteLayerTitle")}</DialogTitle>
            <DialogDescription>
              {t("panel.layers.aboutToDeleteLayer", {
                name: deletingLayer?.name ?? "-",
              })}
            </DialogDescription>
          </DialogHeader>
          {deletingLayer ? (
            <RadioGroup
              value={deletingLayerMode}
              onValueChange={(value) => setDeleteMode(value as "move" | "remove")}
              className="space-y-2 text-sm"
            >
              {!deletingLayer.isMapping ? (
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5">
                    <RadioGroupItem value="move" />
                    {t("panel.layers.migrateNodesTo")}
                  </label>
                  <Select
                    value={deleteTargetLayerId || "__none__"}
                    onValueChange={(value) =>
                      setDeleteTargetLayerId(value === "__none__" ? "" : value)
                    }
                    disabled={deletingLayerMode !== "move" || deleteTargetCandidates.length === 0}
                  >
                    <SelectTrigger className="h-8 w-[220px]">
                      <SelectValue placeholder={t("panel.layers.selectTargetLayer")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">{t("panel.layers.pleaseSelectLayer")}</SelectItem>
                      {deleteTargetCandidates.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
              <label className="flex items-center gap-1.5">
                <RadioGroupItem value="remove" />
                {deletingLayer.isMapping ? t("panel.layers.deleteMappingWithNodes") : t("panel.layers.deleteAllNodesToo")}
              </label>
            </RadioGroup>
          ) : null}
          <DialogFooter>
            <button
              type="button"
              onClick={() => {
                setConfirmDeleteLayerId(null);
                setDeleteMode("move");
                setDeleteTargetLayerId("");
              }}
              className="rounded border border-border px-3 py-1.5 text-sm hover:bg-accent"
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!deletingLayer) return;
                const result = deleteLayer(deletingLayer.id, {
                  mode: deletingLayerMode,
                  targetLayerId: deleteTargetLayerId || undefined,
                });
                if (!result.ok) {
                  showActionHint(result.reason);
                  return;
                }
                setConfirmDeleteLayerId(null);
                setDeleteMode("move");
                setDeleteTargetLayerId("");
              }}
              className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
            >
              {t("panel.layers.confirmDeleteTitle")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={titleIconPreviewOpen}
        onOpenChange={setTitleIconPreviewOpen}
      >
        <DialogContent
          className="sm:max-w-[860px]"
          overlayClassName="bg-transparent pointer-events-none"
        >
          <DialogHeader>
            <DialogTitle>{t("panel.menubar.titleIconPreviewTitle")}</DialogTitle>
            <DialogDescription>{t("panel.menubar.titleIconPreviewDesc")}</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setTitleIconZoom((z) => Math.max(0.5, Number((z - 0.1).toFixed(2))))}
              className="rounded border border-border px-2 py-1 text-xs hover:bg-accent"
            >
              -
            </button>
            <span className="w-14 text-center text-xs text-muted-foreground">
              {(titleIconZoom * 100).toFixed(0)}%
            </span>
            <button
              type="button"
              onClick={() => setTitleIconZoom((z) => Math.min(8, Number((z + 0.1).toFixed(2))))}
              className="rounded border border-border px-2 py-1 text-xs hover:bg-accent"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setTitleIconZoom(1.6)}
              className="rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
            >
              {t("common.reset")}
            </button>
          </div>
          {titleIconDataUrl ? (
            <div
              className="max-h-[78vh] overflow-auto rounded border border-border bg-muted/20 p-4"
              onWheel={(e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                setTitleIconZoom((z) => {
                  const next = Number((z + delta).toFixed(2));
                  return Math.min(8, Math.max(0.5, next));
                });
              }}
            >
              <img
                src={titleIconDataUrl}
                alt={t("panel.menubar.titleIconPreviewAlt")}
                className="mx-auto rounded border border-border/70 object-contain"
                style={{
                  width: 200,
                  height: 200,
                  maxWidth: "none",
                  maxHeight: "none",
                  transform: `scale(${titleIconZoom})`,
                  transformOrigin: "center center",
                }}
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

    </>
  );
}
