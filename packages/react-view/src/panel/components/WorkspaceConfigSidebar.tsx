import { useMemo } from "react";

import {
  BlueprintNodeConfigSidebar,
  type BlueprintGraphNode,
} from "@arron/react-blueprint";
import {
  Empty,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
} from "@arron/ui";

import type { PanelConfigSidebarProps } from "./PanelConfigSidebar";
import { PanelConfigSidebar } from "./PanelConfigSidebar";
import type { PanelElement } from "../types";

export type WorkspaceConfigFocus = "view" | "blueprint";

export type WorkspaceConfigSidebarProps = Omit<
  PanelConfigSidebarProps,
  "selectedElement" | "selectedElements"
> & {
  configFocus: WorkspaceConfigFocus;
  selectedBlueprintNode: BlueprintGraphNode | null;
  onUpdateBlueprintNode: (
    nodeId: string,
    patch: Partial<
      Pick<
        BlueprintGraphNode,
        | "label"
        | "role"
        | "nodeType"
        | "configSource"
        | "viewElementId"
        | "nestedBlueprintId"
        | "libraryBlueprintId"
        | "lifecyclePhase"
        | "fetchConfig"
        | "jsonConfig"
      >
    >
  ) => void;
  blueprintLibraryOptions?: { id: string; label: string }[];
  selectedElement: PanelElement | null;
  selectedElements?: PanelElement[];
  allViewElements: PanelElement[];
};

export function WorkspaceConfigSidebar({
  configFocus,
  selectedBlueprintNode,
  onUpdateBlueprintNode,
  blueprintLibraryOptions = [],
  selectedElement,
  selectedElements,
  allViewElements,
  ...viewPanelProps
}: WorkspaceConfigSidebarProps) {
  const viewElementOptions = useMemo(
    () =>
      allViewElements.map((el) => ({
        id: el.id,
        label: el.name?.trim() || el.chart?.title || el.materialType || el.id,
      })),
    [allViewElements]
  );

  if (configFocus === "view") {
    return (
      <PanelConfigSidebar
        {...viewPanelProps}
        selectedElement={selectedElement}
        selectedElements={selectedElements}
      />
    );
  }

  if (!selectedBlueprintNode) {
    return (
      <div className="flex h-full flex-col overflow-hidden bg-background text-foreground">
        <Empty className="py-10">
          <EmptyIcon>
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="6" cy="6" r="2" />
              <circle cx="18" cy="18" r="2" />
              <path d="M8 7l8 4M8 17l8-4" />
            </svg>
          </EmptyIcon>
          <EmptyTitle>未选中蓝图节点</EmptyTitle>
          <EmptyDescription>
            在蓝图面板中选中一个节点后，这里会显示对应的配置。
          </EmptyDescription>
        </Empty>
      </div>
    );
  }

  return (
    <BlueprintNodeConfigSidebar
      node={selectedBlueprintNode}
      viewElementOptions={viewElementOptions}
      blueprintLibraryOptions={blueprintLibraryOptions}
      onUpdateNode={onUpdateBlueprintNode}
    />
  );
}
