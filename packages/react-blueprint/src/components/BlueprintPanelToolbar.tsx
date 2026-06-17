import { useEffect, useState, type ReactElement } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@arron/ui";

import type { BlueprintLibraryListItem } from "../library/types";
import type { LifecycleNodeOption } from "../hooks/useBlueprintDebugSession";
import { PAGE_LIFECYCLE_LABELS, type PageLifecyclePhase } from "@arron/blueprint-dsl";

export type BlueprintRenameDialogProps = {
  open: boolean;
  initialName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (name: string) => void;
};

export function BlueprintRenameDialog({
  open,
  initialName,
  onOpenChange,
  onConfirm,
}: BlueprintRenameDialogProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (!open) return;
    setName(initialName);
  }, [initialName, open]);

  const handleConfirm = () => {
    const next = name.trim();
    if (!next) return;
    onConfirm(next);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>重命名蓝图</DialogTitle>
          <DialogDescription>修改蓝图库中该项的显示名称。</DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5 py-1">
          <Label htmlFor="blueprint-rename-input">蓝图名称</Label>
          <Input
            id="blueprint-rename-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirm();
            }}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={!name.trim()}>
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function IconSave() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <path d="M17 21v-8H7v8M7 3v5h8" />
    </svg>
  );
}

function IconSync() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

function IconPencil() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 shrink-0 opacity-60"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export type BlueprintDeleteDialogProps = {
  open: boolean;
  blueprintName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function BlueprintDeleteDialog({
  open,
  blueprintName,
  onOpenChange,
  onConfirm,
}: BlueprintDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>删除蓝图</DialogTitle>
          <DialogDescription>
            确定从蓝图库中删除「{blueprintName}」吗？此操作不可恢复。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function IconLog({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

/** 快进：双三角，表示走完全流程 */
function IconRunAll({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M5 5v14l7-7-7-7z" />
      <path d="M12 5v14l7-7-7-7z" />
    </svg>
  );
}

/** 单三角播放：表示单步执行下一步 */
function IconStepNext({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6 4v16l14-8-14-8z" />
    </svg>
  );
}

/** 左向三角：回到上一步 */
function IconStepBack({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18 4v16l-14-8 14-8z" />
    </svg>
  );
}

/** 回到开始：竖线 + 左向三角 */
function IconResetToStart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M5 5v14" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M20 4v16l-14-8 14-8z" />
    </svg>
  );
}

export type BlueprintDebugToolbarProps = {
  lifecycleNodes: LifecycleNodeOption[];
  selectedLifecycleNodeId: string | null;
  onSelectLifecycleNode: (id: string | null) => void;
  onRunAll: () => void;
  onResetToStart: () => void;
  onStepBack: () => void;
  onStepNext: () => void;
  canResetToStart?: boolean;
  canStepBack?: boolean;
  canStepNext?: boolean;
  chainComplete?: boolean;
  falseSignalHalt?: boolean;
  logPanelOpen: boolean;
  onToggleLogPanel: () => void;
  running?: boolean;
};

export type BlueprintPanelToolbarProps = {
  items: BlueprintLibraryListItem[];
  activeId: string | null;
  /** 未选中库蓝图时，下拉触发器展示的工作区蓝图名称 */
  currentBlueprintLabel?: string;
  onSelectItem: (id: string) => void;
  onRenameItem: (id: string, name: string) => void;
  onDeleteItem: (id: string) => void;
  onSave: () => void;
  onSync?: () => void;
  canSync?: boolean;
  debug?: BlueprintDebugToolbarProps;
};

function groupItems(items: BlueprintLibraryListItem[]) {
  return {
    saved: items.filter((item) => item.source === "saved"),
    imported: items.filter((item) => item.source === "imported"),
  };
}

function ToolbarTooltip({
  content,
  children,
}: {
  content: string;
  children: ReactElement;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[260px] text-[11px]">
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

function ToolbarTooltipButton({
  content,
  disabled,
  className,
  ...props
}: React.ComponentProps<typeof Button> & { content: string }) {
  const button = (
    <Button disabled={disabled} className={className} {...props} />
  );
  return (
    <ToolbarTooltip content={content}>
      {disabled ? <span className="inline-flex shrink-0">{button}</span> : button}
    </ToolbarTooltip>
  );
}

function LibraryRow({
  item,
  active,
  onSelect,
  onRename,
  onDelete,
}: {
  item: BlueprintLibraryListItem;
  active: boolean;
  onSelect: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  const nameButton = (
    <button
      type="button"
      className="min-w-0 flex-1 truncate px-2 py-1.5 text-left text-xs hover:bg-accent/60"
      onClick={onSelect}
    >
      {item.name}
    </button>
  );

  return (
    <div
      className={`flex items-center gap-0.5 rounded-sm pr-0.5 ${
        active ? "bg-accent" : ""
      }`}
    >
      {active ? (
        <ToolbarTooltip content="再次点击返回当前工作区蓝图">
          {nameButton}
        </ToolbarTooltip>
      ) : (
        nameButton
      )}
      <ToolbarTooltip content={`重命名「${item.name}」`}>
        <button
          type="button"
          className="shrink-0 rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label={`重命名 ${item.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onRename();
          }}
        >
          <IconPencil />
        </button>
      </ToolbarTooltip>
      <ToolbarTooltip content={`从蓝图库删除「${item.name}」`}>
        <button
          type="button"
          className="shrink-0 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label={`删除 ${item.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <IconTrash />
        </button>
      </ToolbarTooltip>
    </div>
  );
}

export function BlueprintPanelToolbar({
  items,
  activeId,
  currentBlueprintLabel,
  onSelectItem,
  onRenameItem,
  onDeleteItem,
  onSave,
  onSync,
  canSync = false,
  debug,
}: BlueprintPanelToolbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<BlueprintLibraryListItem | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<BlueprintLibraryListItem | null>(
    null
  );

  const activeItem = items.find((item) => item.id === activeId) ?? null;
  const { saved, imported } = groupItems(items);
  const triggerLabel =
    activeItem?.name ??
    (currentBlueprintLabel?.trim() ||
      (items.length > 0 ? "蓝图库" : "蓝图库为空"));

  const handleRenameConfirm = (name: string) => {
    if (!renameTarget) return;
    onRenameItem(renameTarget.id, name);
    setRenameTarget(null);
  };

  return (
    <>
      <TooltipProvider delayDuration={200}>
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <div className="relative shrink-0">
            <ToolbarTooltip content="打开蓝图库：点击项加载；已选中项再次点击可返回当前工作区蓝图">
              <span className={items.length === 0 ? "inline-flex" : undefined}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 w-[148px] justify-between gap-1 px-2 text-xs font-normal"
                  disabled={items.length === 0}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <span className="min-w-0 truncate">{triggerLabel}</span>
                  <IconChevronDown />
                </Button>
              </span>
            </ToolbarTooltip>
            {menuOpen && items.length > 0 ? (
              <>
                <div
                  className="fixed inset-0 z-[10090]"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute left-0 top-[calc(100%+4px)] z-[10100] w-[240px] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
                  {saved.length > 0 ? (
                    <div className="mb-1">
                      <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground">
                        已保存
                      </div>
                      {saved.map((item) => (
                        <LibraryRow
                          key={item.id}
                          item={item}
                          active={item.id === activeId}
                          onSelect={() => {
                            onSelectItem(item.id);
                            setMenuOpen(false);
                          }}
                          onRename={() => setRenameTarget(item)}
                          onDelete={() => setDeleteTarget(item)}
                        />
                      ))}
                    </div>
                  ) : null}
                  {imported.length > 0 ? (
                    <div>
                      <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground">
                        已导入
                      </div>
                      {imported.map((item) => (
                        <LibraryRow
                          key={item.id}
                          item={item}
                          active={item.id === activeId}
                          onSelect={() => {
                            onSelectItem(item.id);
                            setMenuOpen(false);
                          }}
                          onRename={() => setRenameTarget(item)}
                          onDelete={() => setDeleteTarget(item)}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>

          <ToolbarTooltipButton
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7 shrink-0"
            content="保存蓝图到本地蓝图库"
            aria-label="保存蓝图到本地"
            onClick={onSave}
          >
            <IconSave />
          </ToolbarTooltipButton>

          {onSync ? (
            <ToolbarTooltipButton
              type="button"
              variant={canSync ? "default" : "outline"}
              size="icon"
              className="h-7 w-7 shrink-0"
              content={
                canSync
                  ? activeItem
                    ? `同步更新蓝图库中的「${activeItem.name}」`
                    : "将当前编辑同步到蓝图库"
                  : activeItem
                    ? `「${activeItem.name}」已与库中版本一致`
                    : "请先从蓝图库选择要编辑的蓝图"
              }
              aria-label="同步蓝图到库"
              disabled={!canSync}
              onClick={onSync}
            >
              <IconSync />
            </ToolbarTooltipButton>
          ) : null}

          {debug && debug.lifecycleNodes.length > 0 ? (
            <>
              <ToolbarTooltip content="模拟场景：选择生命周期节点，表示当前处于该生命周期阶段">
                <select
                  value={debug.selectedLifecycleNodeId ?? ""}
                  onChange={(e) => debug.onSelectLifecycleNode(e.target.value || null)}
                  className="h-7 max-w-[180px] shrink-0 rounded-md border border-input bg-background px-2 text-[11px] text-foreground outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  aria-label="模拟场景"
                >
                  <option value="">模拟场景</option>
                  {debug.lifecycleNodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.label}
                      {node.phase
                        ? ` · ${PAGE_LIFECYCLE_LABELS[node.phase as PageLifecyclePhase] ?? node.phase}`
                        : ""}
                    </option>
                  ))}
                </select>
              </ToolbarTooltip>

              <ToolbarTooltipButton
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7 shrink-0"
                content="走完全流程：从所选生命周期节点一次性执行完整任务链"
                aria-label="走完全流程"
                disabled={!debug.selectedLifecycleNodeId || debug.running}
                onClick={() => void debug.onRunAll()}
              >
                <IconRunAll className="h-3.5 w-3.5" />
              </ToolbarTooltipButton>

              <ToolbarTooltipButton
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7 shrink-0"
                content="回到开始：清空已执行记录，从所选生命周期节点重新调试"
                aria-label="回到开始"
                disabled={
                  !debug.selectedLifecycleNodeId ||
                  debug.running ||
                  !debug.canResetToStart
                }
                onClick={() => void debug.onResetToStart()}
              >
                <IconResetToStart className="h-3.5 w-3.5" />
              </ToolbarTooltipButton>

              <ToolbarTooltipButton
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7 shrink-0"
                content="上一步：撤销最近一次节点执行，恢复日志与画布状态"
                aria-label="上一步"
                disabled={
                  !debug.selectedLifecycleNodeId ||
                  debug.running ||
                  !debug.canStepBack
                }
                onClick={() => void debug.onStepBack()}
              >
                <IconStepBack className="h-3.5 w-3.5" />
              </ToolbarTooltipButton>

              <ToolbarTooltipButton
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7 shrink-0"
                content={
                  debug.falseSignalHalt
                    ? "当前节点输出假信号，无法继续下一步"
                    : debug.chainComplete
                      ? "已经是最后一个节点，任务链已走完"
                      : "下一步：向下一节点发送真信号，每次执行一个节点"
                }
                aria-label="下一步"
                disabled={
                  !debug.selectedLifecycleNodeId ||
                  debug.running ||
                  !debug.canStepNext
                }
                onClick={() => void debug.onStepNext()}
              >
                <IconStepNext className="h-3.5 w-3.5" />
              </ToolbarTooltipButton>

              <ToolbarTooltip content="任务输出日志：在右侧查看节点执行时间、输入与输出">
                <Button
                  type="button"
                  variant={debug.logPanelOpen ? "default" : "outline"}
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  aria-label="任务输出日志"
                  aria-pressed={debug.logPanelOpen}
                  onClick={debug.onToggleLogPanel}
                >
                  <IconLog className="h-3.5 w-3.5" />
                </Button>
              </ToolbarTooltip>
            </>
          ) : null}
        </div>
      </TooltipProvider>

      <BlueprintRenameDialog
        open={renameTarget !== null}
        initialName={renameTarget?.name ?? ""}
        onOpenChange={(open) => {
          if (!open) setRenameTarget(null);
        }}
        onConfirm={handleRenameConfirm}
      />

      <BlueprintDeleteDialog
        open={deleteTarget !== null}
        blueprintName={deleteTarget?.name ?? ""}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={() => {
          if (!deleteTarget) return;
          onDeleteItem(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </>
  );
}
