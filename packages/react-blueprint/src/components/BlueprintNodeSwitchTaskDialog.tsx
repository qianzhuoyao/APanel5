import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@arron/ui";

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
  const targetLabel =
    toNodeId === null ? "取消选中" : `节点 ${toNodeId}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>节点正在执行任务</DialogTitle>
          <DialogDescription>
            节点 <span className="font-mono text-foreground">{fromNodeId}</span>{" "}
            正在解析 Swagger 文档。是否切换到 {targetLabel}？
          </DialogDescription>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          选择「保留并切换」将在后台继续解析，回到该节点时仍能看到进度；选择「取消并切换」会中止解析任务。
        </p>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            留在此节点
          </Button>
          <Button type="button" variant="secondary" onClick={onCancelTaskAndSwitch}>
            取消并切换
          </Button>
          <Button type="button" onClick={onKeepTaskAndSwitch}>
            保留并切换
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
