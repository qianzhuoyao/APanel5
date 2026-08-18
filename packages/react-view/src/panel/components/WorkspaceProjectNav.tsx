import React, { useState } from "react";
import { useI18n } from "@arronqzy/i18n/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@arronqzy/ui";
import type { WorkspaceProjectListItem } from "../library/workspace-project-db";

function formatUpdatedAt(ts: number): string {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

export type WorkspaceProjectNavProps = {
  projects: WorkspaceProjectListItem[];
  activeProjectId: string | null;
  activeProjectName: string | null;
  dirty: boolean;
  previewingProjectIds?: string[];
  onCreateProject: () => Promise<{ name: string; id: string } | void>;
  onOpenProject: (id: string) => Promise<void>;
  onSyncProject: () => Promise<string | void>;
  onDeleteProject: (id: string) => Promise<void>;
  onPreviewProject: (id: string, options?: { syncFirst?: boolean }) => Promise<void>;
};

export function WorkspaceProjectNav({
  projects,
  activeProjectId,
  activeProjectName,
  dirty,
  previewingProjectIds = [],
  onCreateProject,
  onOpenProject,
  onSyncProject,
  onDeleteProject,
  onPreviewProject,
}: WorkspaceProjectNavProps) {
  const { t } = useI18n();

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const pendingDelete = projects.find((p) => p.id === pendingDeleteId) ?? null;

  const runAction = async (action: () => Promise<unknown>) => {
    if (busy) return;
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1.5 border-l border-border pl-2">
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                disabled={busy}
                onClick={() => void runAction(onCreateProject)}
              >
                {t("panel.workspace.create")}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="z-[10100]">
              {t("panel.workspace.createHint")}
            </TooltipContent>
          </Tooltip>

          {activeProjectId ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={dirty ? "default" : "outline"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  disabled={busy || !dirty}
                  onClick={() => void runAction(onSyncProject)}
                >
                  {dirty ? t("panel.workspace.syncDirty") : t("common.sync")}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="z-[10100]">
                {dirty
                  ? t("panel.workspace.syncUpdate", {
                      name:
                        activeProjectName ??
                        t("panel.workspace.currentWorkspaceFallback"),
                    })
                  : t("panel.workspace.syncUpToDate")}
              </TooltipContent>
            </Tooltip>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 max-w-[200px] truncate px-2 text-xs"
                disabled={busy}
              >
                {activeProjectName
                  ? t("panel.workspace.workspaceNamed", { name: activeProjectName })
                  : t("panel.workspace.savedWorkspaces")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="z-[10100] w-72">
              {projects.length === 0 ? (
                <DropdownMenuItem disabled>{t("panel.workspace.noSavedWorkspaces")}</DropdownMenuItem>
              ) : (
                projects.map((project) => {
                  const isCurrent = activeProjectId === project.id;
                  const isPreviewing = previewingProjectIds.includes(project.id);
                  return (
                  <div key={project.id} className="px-1 py-0.5">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className={[
                          "min-w-0 flex-1 rounded px-2 py-1.5 text-left text-xs hover:bg-accent",
                          isCurrent
                            ? "bg-primary/15 font-medium text-primary ring-1 ring-inset ring-primary/40"
                            : "",
                          !isCurrent && isPreviewing
                            ? "bg-sky-500/10 ring-1 ring-inset ring-sky-400/50"
                            : "",
                        ].join(" ")}
                        onClick={() =>
                          void runAction(async () => {
                            await onOpenProject(project.id);
                          })
                        }
                      >
                        <div className="flex items-center gap-1">
                          <div className="min-w-0 flex-1 truncate">{project.name}</div>
                          {isCurrent ? (
                            <span className="shrink-0 rounded bg-primary px-1 py-px text-[9px] leading-none text-primary-foreground">
                              {t("panel.workspace.currentBadge")}
                            </span>
                          ) : null}
                          {isPreviewing ? (
                            <span className="shrink-0 rounded bg-sky-600 px-1 py-px text-[9px] leading-none text-white">
                              {t("panel.workspace.previewingBadge")}
                            </span>
                          ) : null}
                        </div>
                        <div className="truncate text-[10px] text-muted-foreground">
                          {formatUpdatedAt(project.updatedAt)}
                        </div>
                      </button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 shrink-0 px-2 text-[10px]"
                        onClick={() =>
                          void runAction(async () => {
                            await onPreviewProject(project.id, {
                              syncFirst: activeProjectId === project.id,
                            });
                          })
                        }
                      >
                        {t("panel.workspace.previewDocTitle")}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 shrink-0 px-2 text-[10px] text-destructive hover:text-destructive"
                        onClick={() => setPendingDeleteId(project.id)}
                      >
                        {t("common.delete")}
                      </Button>
                    </div>
                  </div>
                  );
                })
              )}
              {/* <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => void runAction(onCreateProject)}>
                {t("panel.workspace.create")}
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      </div>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteId(null);
        }}
      >
        <AlertDialogContent className="z-[10150]">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("panel.workspace.deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("panel.workspace.deleteConfirmBody", {
                name: pendingDelete?.name ?? "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                const id = pendingDeleteId;
                setPendingDeleteId(null);
                if (!id) return;
                void runAction(async () => {
                  await onDeleteProject(id);
                });
              }}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
