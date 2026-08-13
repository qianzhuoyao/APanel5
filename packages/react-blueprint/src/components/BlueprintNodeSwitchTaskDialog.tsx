import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@arronqzy/ui";
import { useI18n } from "@arronqzy/i18n/react";

export type BlueprintNodeSwitchTaskDialogProps = {
  open: boolean;
  fromNodeId: string;
  toNodeId: string | null;
  onOpenChange: (open: boolean) => void;
  onKeepTaskAndSwitch: () => void;
  onCancelTaskAndSwitch: () => void;
};

export function BlueprintNodeSwitchTaskDialog({
  open,
  fromNodeId,
  toNodeId,
  onOpenChange,
  onKeepTaskAndSwitch,
  onCancelTaskAndSwitch,
}: BlueprintNodeSwitchTaskDialogProps) {
  const { t } = useI18n();
  const targetLabel =
    toNodeId === null
      ? t("blueprint.dialog.cancelSelection")
      : t("blueprint.dialog.nodeTarget", { id: toNodeId });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("blueprint.dialog.taskRunningTitle")}</DialogTitle>
          <DialogDescription>
            {t("blueprint.dialog.taskRunningDescription", {
              fromNodeId,
              target: targetLabel,
            })}
          </DialogDescription>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          {t("blueprint.dialog.taskSwitchHint")}
        </p>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("blueprint.dialog.stayOnNode")}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancelTaskAndSwitch}>
            {t("blueprint.dialog.cancelAndSwitch")}
          </Button>
          <Button type="button" onClick={onKeepTaskAndSwitch}>
            {t("blueprint.dialog.keepAndSwitch")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
