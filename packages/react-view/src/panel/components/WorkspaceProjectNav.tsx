import React, { useState } from "react";
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
} from "@arron/ui";
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
  onCreateProject,
  onOpenProject,
  onSyncProject,
  onDeleteProject,
  onPreviewProject,
}: WorkspaceProjectNavProps) {
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
                创建工作区
              </Button>
            </TooltipTrigger>
            <TooltipContent className="z-[10100]">
              以当前产物名称新建一条 IndexedDB 工作区记录，不会覆盖已有工作区
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
                  同步{dirty ? " *" : ""}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="z-[10100]">
                {dirty
                  ? `同步更新「${activeProjectName ?? "当前工作区"}」到 IndexedDB`
                  : "当前工作区已与 IndexedDB 同步"}
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
                {activeProjectName ? `工作区：${activeProjectName}` : "已保存工作区"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="z-[10100] w-72">
              {projects.length === 0 ? (
                <DropdownMenuItem disabled>暂无已保存工作区</DropdownMenuItem>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="px-1 py-0.5">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className={[
                          "min-w-0 flex-1 rounded px-2 py-1.5 text-left text-xs hover:bg-accent",
                          activeProjectId === project.id ? "bg-accent/60 font-medium" : "",
                        ].join(" ")}
                        onClick={() =>
                          void runAction(async () => {
                            await onOpenProject(project.id);
                          })
                        }
                      >
                        <div className="truncate">{project.name}</div>
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
                        预览
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 shrink-0 px-2 text-[10px] text-destructive hover:text-destructive"
                        onClick={() => setPendingDeleteId(project.id)}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                ))
              )}
              {/* <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => void runAction(onCreateProject)}>
                创建工作区
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
            <AlertDialogTitle>删除工作区？</AlertDialogTitle>
            <AlertDialogDescription>
              将永久删除 IndexedDB 中的「{pendingDelete?.name ?? ""}」，此操作不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
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
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
