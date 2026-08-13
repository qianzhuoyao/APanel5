export type CompactPanelElement = {
  id: string;
  materialType?: string;
  name?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  textHtml?: string;
  locked?: boolean;
  zIndex?: number;
  selected?: boolean;
  /** Compact config snapshot so the model can emit accurate panel.update patches. */
  config?: Record<string, unknown>;
};

export type CompactBlueprintNode = {
  id: string;
  role: string;
  nodeType: string;
  label: string;
  parentId?: string;
};

export type CompactBlueprintEdge = {
  id: string;
  source: string;
  target: string;
};

export type CompactLayer = {
  id: string;
  name: string;
  locked: boolean;
  active?: boolean;
};

export type CompactWorkspace = {
  activeProjectId: string | null;
  activeProjectName: string | null;
  dirty: boolean;
  projectCount: number;
};

export type RecentDialogTurn = {
  role: "user" | "assistant";
  content: string;
};

export type EditorContextInput = {
  elements: CompactPanelElement[];
  selectedIds?: string[];
  blueprintNodes?: CompactBlueprintNode[];
  blueprintEdges?: CompactBlueprintEdge[];
  layers?: CompactLayer[];
  activeLayerId?: string | null;
  zoom?: number;
  blueprintOpen?: boolean;
  workspace?: CompactWorkspace;
  lastActionResult?: string | null;
  step?: number;
  maxSteps?: number;
  userGoal?: string;
  /** Prior user/assistant turns for cross-turn continuity. */
  recentDialog?: RecentDialogTurn[];
  maxElements?: number;
  maxBlueprintNodes?: number;
};

function truncate(value: unknown, max: number): unknown {
  if (typeof value !== "string") return value;
  if (value.length <= max) return value;
  return `${value.slice(0, max)}…`;
}

export function buildEditorContext(input: EditorContextInput): string {
  const maxEl = input.maxElements ?? 40;
  const maxBp = input.maxBlueprintNodes ?? 40;
  const selected = new Set(input.selectedIds ?? []);

  const ordered = [...input.elements].sort((a, b) => {
    const as = selected.has(a.id) || a.selected ? 0 : 1;
    const bs = selected.has(b.id) || b.selected ? 0 : 1;
    return as - bs;
  });

  const elements = ordered.slice(0, maxEl).map((el) => ({
    id: el.id,
    materialType: el.materialType,
    name: el.name,
    x: el.x,
    y: el.y,
    width: el.width,
    height: el.height,
    locked: el.locked,
    zIndex: el.zIndex,
    selected: selected.has(el.id) || !!el.selected,
    textHtml: truncate(el.textHtml, 120),
    config: el.config,
  }));
  const blueprintNodes = (input.blueprintNodes ?? []).slice(0, maxBp);
  const blueprintEdges = (input.blueprintEdges ?? []).slice(0, maxBp);

  const recentDialog = (input.recentDialog ?? []).slice(-4);

  return JSON.stringify(
    {
      userGoal: input.userGoal,
      step: input.step,
      maxSteps: input.maxSteps,
      lastActionResult: input.lastActionResult ?? null,
      recentDialog: recentDialog.length ? recentDialog : undefined,
      selectedIds: Array.from(selected),
      activeLayerId: input.activeLayerId ?? null,
      zoom: input.zoom,
      blueprintOpen: input.blueprintOpen ?? false,
      layers: input.layers ?? [],
      workspace: input.workspace ?? null,
      elementCount: input.elements.length,
      elements,
      blueprint: {
        nodeCount: (input.blueprintNodes ?? []).length,
        edgeCount: (input.blueprintEdges ?? []).length,
        nodes: blueprintNodes,
        edges: blueprintEdges,
      },
    },
    null,
    0
  );
}
