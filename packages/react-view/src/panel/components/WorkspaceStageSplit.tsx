import { useEffect, useRef, type ComponentRef, type ReactNode } from "react";

import { BluePrintReactRoot, type BluePrintReactRootProps } from "@arron/react-blueprint";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@arron/ui";

type WorkspaceStageSplitProps = {
  blueprintOpen: boolean;
  viewStage: ReactNode;
  blueprintProps: BluePrintReactRootProps;
};

function BlueprintPanel({ blueprintProps }: { blueprintProps: BluePrintReactRootProps }) {
  return (
    <div
      data-workspace-region="blueprint"
      className="flex h-full min-h-0 flex-col overflow-hidden bg-background"
    >
      <div className="shrink-0 border-b border-border bg-background/90 px-3 py-1 text-[11px] font-semibold text-muted-foreground">
        蓝图
      </div>
      <div className="min-h-0 flex-1">
        <BluePrintReactRoot style={{ width: "100%", height: "100%" }} {...blueprintProps} />
      </div>
    </div>
  );
}

export function WorkspaceStageSplit({
  blueprintOpen,
  viewStage,
  blueprintProps,
}: WorkspaceStageSplitProps) {
  const blueprintPanelRef = useRef<ComponentRef<typeof ResizablePanel>>(null);

  useEffect(() => {
    const panel = blueprintPanelRef.current;
    if (!panel) return;
    if (blueprintOpen) {
      panel.expand();
    } else {
      panel.collapse();
    }
  }, [blueprintOpen]);

  return (
    <ResizablePanelGroup
      direction="vertical"
      className="relative min-h-0 flex-1"
    >
      <ResizablePanel defaultSize={100} minSize={10} className="min-h-0">
        <div className="h-full min-h-0 overflow-hidden">{viewStage}</div>
      </ResizablePanel>
      <ResizableHandle
        withHandle
        className={blueprintOpen ? undefined : "hidden"}
      />
      <ResizablePanel
        ref={blueprintPanelRef}
        collapsible
        collapsedSize={0}
        defaultSize={0}
        minSize={15}
        className="min-h-0"
      >
        <BlueprintPanel blueprintProps={blueprintProps} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
