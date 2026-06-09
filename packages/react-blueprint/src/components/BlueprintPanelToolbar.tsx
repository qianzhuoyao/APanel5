import { useEffect, useState } from "react";
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
} from "@arron/ui";

import type { BlueprintLibraryListItem } from "../library/types";

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

export type BlueprintPanelToolbarProps = {
  items: BlueprintLibraryListItem[];
  activeId: string | null;
  onSelectItem: (id: string) => void;
  onRenameItem: (id: string, name: string) => void;
  onDeleteItem: (id: string) => void;
  onSave: () => void;
};

function groupItems(items: BlueprintLibraryListItem[]) {
  return {
    saved: items.filter((item) => item.source === "saved"),
    imported: items.filter((item) => item.source === "imported"),
  };
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
  return (
    <div
      className={`flex items-center gap-0.5 rounded-sm pr-0.5 ${
        active ? "bg-accent" : ""
      }`}
    >
      <button
        type="button"
        className="min-w-0 flex-1 truncate px-2 py-1.5 text-left text-xs hover:bg-accent/60"
        onClick={onSelect}
        title={item.name}
      >
        {item.name}
      </button>
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
    </div>
  );
}

export function BlueprintPanelToolbar({
  items,
  activeId,
  onSelectItem,
  onRenameItem,
  onDeleteItem,
  onSave,
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
  const triggerLabel = activeItem?.name ?? (items.length > 0 ? "蓝图库" : "蓝图库为空");

  const handleRenameConfirm = (name: string) => {
    if (!renameTarget) return;
    onRenameItem(renameTarget.id, name);
    setRenameTarget(null);
  };

  return (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <div className="relative shrink-0">
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

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7 shrink-0"
          title="保存蓝图到本地"
          aria-label="保存蓝图到本地"
          onClick={onSave}
        >
          <IconSave />
        </Button>
      </div>

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
