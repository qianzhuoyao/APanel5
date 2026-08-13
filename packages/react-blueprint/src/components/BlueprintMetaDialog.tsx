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
import { useI18n } from "@arronqzy/i18n/react";

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
  const { t } = useI18n();
  const [name, setName] = useState(initialMeta.name);
  const [remark, setRemark] = useState(initialMeta.remark);

  useEffect(() => {
    if (!open) return;
    setName(initialMeta.name);
    setRemark(initialMeta.remark);
  }, [initialMeta.name, initialMeta.remark, open]);

  const title =
    mode === "export"
      ? t("blueprint.dialog.exportTitle")
      : t("blueprint.dialog.saveTitle");
  const description =
    mode === "export"
      ? t("blueprint.dialog.exportDescription")
      : t("blueprint.dialog.saveDescription");
  const confirmLabel =
    mode === "export" ? t("blueprint.dialog.export") : t("blueprint.dialog.save");

  const handleConfirm = () => {
    onConfirm({
      name: name.trim() || t("blueprint.dialog.unnamedBlueprint"),
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
            <Label htmlFor="blueprint-meta-name">
              {t("blueprint.dialog.blueprintName")}
            </Label>
            <Input
              id="blueprint-meta-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("blueprint.dialog.namePlaceholder")}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="blueprint-meta-remark">
              {t("blueprint.dialog.remark")}
            </Label>
            <Textarea
              id="blueprint-meta-remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder={t("blueprint.dialog.remarkPlaceholder")}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button type="button" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
