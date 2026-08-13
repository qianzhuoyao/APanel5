import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from "react";
import { useI18n } from "@arronqzy/i18n/react";

import {
  BluePrintReactRoot,
  BlueprintPanelToolbar,
  type BluePrintReactRootProps,
  type BlueprintDebugToolbarProps,
  type BlueprintLibraryListItem,
} from "@arronqzy/react-blueprint";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@arronqzy/ui";

type WorkspaceStageSplitProps = {
  blueprintOpen: boolean;
  viewStage: ReactNode;
  blueprintProps: BluePrintReactRootProps;
  blueprintLibraryItems?: BlueprintLibraryListItem[];
  activeBlueprintLibraryId?: string | null;
  currentBlueprintLabel?: string;
  onSelectBlueprintLibraryItem?: (id: string) => void;
  onRenameBlueprintLibraryItem?: (id: string, name: string) => void;
  onDeleteBlueprintLibraryItem?: (id: string) => void;
  onSaveBlueprint?: () => void;
  onSyncBlueprint?: () => void;
  canSyncBlueprint?: boolean;
  blueprintDebug?: BlueprintDebugToolbarProps;
};

const MIN_BLUEPRINT_HEIGHT = 48;

function BlueprintPanel({
  blueprintOpen,
  blueprintProps,
  blueprintLibraryItems = [],
  activeBlueprintLibraryId = null,
  currentBlueprintLabel,
  onSelectBlueprintLibraryItem,
  onRenameBlueprintLibraryItem,
  onDeleteBlueprintLibraryItem,
  onSaveBlueprint,
  onSyncBlueprint,
  canSyncBlueprint = false,
  blueprintDebug,
}: {
  blueprintOpen: boolean;
  blueprintProps: BluePrintReactRootProps;
  blueprintLibraryItems?: BlueprintLibraryListItem[];
  activeBlueprintLibraryId?: string | null;
  currentBlueprintLabel?: string;
  onSelectBlueprintLibraryItem?: (id: string) => void;
  onRenameBlueprintLibraryItem?: (id: string, name: string) => void;
  onDeleteBlueprintLibraryItem?: (id: string) => void;
  onSaveBlueprint?: () => void;
  onSyncBlueprint?: () => void;
  canSyncBlueprint?: boolean;
  blueprintDebug?: BlueprintDebugToolbarProps;
}) {
  const { t } = useI18n();
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
      <div className="flex shrink-0 items-center border-b border-border bg-background/90 px-2 py-1">
        <BlueprintPanelToolbar
          items={blueprintLibraryItems}
          activeId={activeBlueprintLibraryId}
          currentBlueprintLabel={currentBlueprintLabel}
          onSelectItem={(id) => onSelectBlueprintLibraryItem?.(id)}
          onRenameItem={(id, name) => onRenameBlueprintLibraryItem?.(id, name)}
          onDeleteItem={(id) => onDeleteBlueprintLibraryItem?.(id)}
          onSave={() => onSaveBlueprint?.()}
          onSync={() => onSyncBlueprint?.()}
          canSync={canSyncBlueprint}
          debug={blueprintDebug}
        />
      </div>
      <div ref={wrapRef} className="relative min-h-0 flex-1">
        {layoutReady ? (
          <BluePrintReactRoot style={{ width: "100%", height: "100%" }} {...blueprintProps} />
        ) : (
          <div className="flex h-full items-center justify-center text-[11px] text-muted-foreground">
            {blueprintOpen ? t("panel.workspace.canvasLoading") : ""}
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
  blueprintLibraryItems,
  activeBlueprintLibraryId,
  currentBlueprintLabel,
  onSelectBlueprintLibraryItem,
  onRenameBlueprintLibraryItem,
  onDeleteBlueprintLibraryItem,
  onSaveBlueprint,
  onSyncBlueprint,
  canSyncBlueprint,
  blueprintDebug,
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
        <BlueprintPanel
          blueprintOpen={blueprintOpen}
          blueprintProps={blueprintProps}
          blueprintLibraryItems={blueprintLibraryItems}
          activeBlueprintLibraryId={activeBlueprintLibraryId}
          currentBlueprintLabel={currentBlueprintLabel}
          onSelectBlueprintLibraryItem={onSelectBlueprintLibraryItem}
          onRenameBlueprintLibraryItem={onRenameBlueprintLibraryItem}
          onDeleteBlueprintLibraryItem={onDeleteBlueprintLibraryItem}
          onSaveBlueprint={onSaveBlueprint}
          onSyncBlueprint={onSyncBlueprint}
          canSyncBlueprint={canSyncBlueprint}
          blueprintDebug={blueprintDebug}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
