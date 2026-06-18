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
  Textarea,
} from "@arronqzy/ui";

import type { BlueprintMetaDraft } from "../library/types";

export type BlueprintMetaDialogProps = {
  open: boolean;
  mode: "export" | "save";
  initialMeta: BlueprintMetaDraft;
  onOpenChange: (open: boolean) => void;
  onConfirm: (meta: BlueprintMetaDraft) => void;
};

export function BlueprintMetaDialog({
  open,
  mode,
  initialMeta,
  onOpenChange,
  onConfirm,
}: BlueprintMetaDialogProps) {
  const [name, setName] = useState(initialMeta.name);
  const [remark, setRemark] = useState(initialMeta.remark);

  useEffect(() => {
    if (!open) return;
    setName(initialMeta.name);
    setRemark(initialMeta.remark);
  }, [initialMeta.name, initialMeta.remark, open]);

  const title = mode === "export" ? "导出蓝图" : "保存蓝图";
  const description =
    mode === "export"
      ? "填写蓝图名称与备注，将当前蓝图导出为 JSON 文件。"
      : "填写蓝图名称与备注，将当前蓝图保存到本地蓝图库。";
  const confirmLabel = mode === "export" ? "导出" : "保存";

  const handleConfirm = () => {
    onConfirm({
      name: name.trim() || "未命名蓝图",
      remark: remark.trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="blueprint-meta-name">蓝图名称</Label>
            <Input
              id="blueprint-meta-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：首页初始化流程"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="blueprint-meta-remark">蓝图备注</Label>
            <Textarea
              id="blueprint-meta-remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="可选：描述蓝图用途、触发条件等"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button type="button" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
