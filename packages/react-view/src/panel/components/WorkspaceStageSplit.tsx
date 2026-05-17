import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from "react";

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

const MIN_BLUEPRINT_HEIGHT = 48;

function BlueprintPanel({
  blueprintOpen,
  blueprintProps,
}: {
  blueprintOpen: boolean;
  blueprintProps: BluePrintReactRootProps;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [layoutReady, setLayoutReady] = useState(false);

  useEffect(() => {
    if (!blueprintOpen) {
      setLayoutReady(false);
      return;
    }

    const el = wrapRef.current;
    if (!el) return;

    const check = () => {
      setLayoutReady(el.clientHeight >= MIN_BLUEPRINT_HEIGHT);
    };

    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [blueprintOpen]);

  return (
    <div
      data-workspace-region="blueprint"
      className="flex h-full min-h-0 flex-col overflow-hidden bg-background"
    >
      <div className="shrink-0 border-b border-border bg-background/90 px-3 py-1 text-[11px] font-semibold text-muted-foreground">
        蓝图
      </div>
      <div ref={wrapRef} className="relative min-h-0 flex-1">
        {layoutReady ? (
          <BluePrintReactRoot style={{ width: "100%", height: "100%" }} {...blueprintProps} />
        ) : (
          <div className="flex h-full items-center justify-center text-[11px] text-muted-foreground">
            {blueprintOpen ? "画布加载中…" : ""}
          </div>
        )}
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
        <BlueprintPanel blueprintOpen={blueprintOpen} blueprintProps={blueprintProps} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
