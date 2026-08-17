import { useEffect, useMemo, type ChangeEvent } from "react";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@arronqzy/ui";
import {
  LIFECYCLE_NODE_TYPE,
  PAGE_LIFECYCLE_PHASES,
  type ExecutionTraceEntry,
  type PageLifecyclePhase,
} from "@arronqzy/blueprint-dsl";
import { useI18n } from "@arronqzy/i18n/react";

import { FetchNodeConfigPanel } from "./components/FetchNodeConfigPanel";
import { ClockNodeConfigPanel } from "./components/ClockNodeConfigPanel";
import { JsonNodeConfigPanel } from "./components/JsonNodeConfigPanel";
import { LogicNodeConfigPanel } from "./components/LogicNodeConfigPanel";
import { ViewElementMultiSelect } from "./components/ViewElementMultiSelect";
import { ConfigFieldLabel, ConfigHintIcon, ConfigSectionTitle } from "./components/ConfigHintIcon";
import {
  getLifecyclePhaseLabel,
  patchNodeConfigSource,
  pruneViewElementIds,
  resolveBlueprintConfigSource,
  resolveViewElementIds,
  type BlueprintConfigSource,
  type BlueprintGraphEdge,
  type BlueprintGraphNode,
  type BlueprintNodeRole,
} from "./graph/document";

export type BlueprintViewElementOption = {
  id: string;
  label: string;
};

export type BlueprintLibraryOption = {
  id: string;
  label: string;
};

export type BlueprintNodeConfigSidebarProps = {
  node: BlueprintGraphNode;
  graphNodes?: BlueprintGraphNode[];
  graphEdges?: BlueprintGraphEdge[];
  traceEntries?: ExecutionTraceEntry[];
  viewElementOptions?: BlueprintViewElementOption[];
  blueprintLibraryOptions?: BlueprintLibraryOption[];
  allowFalseSignalPropagation?: boolean;
  onUpdateAllowFalseSignalPropagation?: (value: boolean) => void;
  onUpdateNode: (
    nodeId: string,
    patch: Partial<
      Pick<
        BlueprintGraphNode,
        | "label"
        | "role"
        | "nodeType"
        | "configSource"
        | "viewElementId"
        | "viewElementIds"
        | "nestedBlueprintId"
        | "libraryBlueprintId"
        | "lifecyclePhase"
        | "fetchConfig"
        | "jsonConfig"
        | "logicConfig"
        | "clockConfig"
      >
    >
  ) => void;
};

const ROLE_LABEL_KEYS: Record<BlueprintNodeRole, string> = {
  blueprint: "blueprint.config.roleBlueprint",
  lifecycle: "blueprint.config.roleLifecycle",
  and: "blueprint.config.roleAnd",
  fetch: "blueprint.config.roleFetch",
  json: "blueprint.config.roleJson",
  logic: "blueprint.config.roleLogic",
  clock: "blueprint.config.roleClock",
};

export function BlueprintNodeConfigSidebar({
  node,
  graphNodes = [],
  graphEdges = [],
  traceEntries = [],
  viewElementOptions = [],
  blueprintLibraryOptions = [],
  allowFalseSignalPropagation = false,
  onUpdateAllowFalseSignalPropagation,
  onUpdateNode,
}: BlueprintNodeConfigSidebarProps) {
  const { t } = useI18n();
  const configSource = resolveBlueprintConfigSource(node);
  const linkedViewElementIds = resolveViewElementIds(node);
  const existingViewElementIdSet = useMemo(
    () => new Set(viewElementOptions.map((opt) => opt.id)),
    [viewElementOptions]
  );
  const viewElementLabelById = new Map(
    viewElementOptions.map((opt) => [opt.id, opt.label])
  );

  useEffect(() => {
    if (configSource !== "view") return;
    // 视图画布尚未就绪时不清理，避免误删有效绑定导致绑定节点「执行了但不写 scope」
    if (viewElementOptions.length === 0) return;
    const linked = resolveViewElementIds(node);
    if (linked.length === 0) return;
    const pruned = pruneViewElementIds(linked, existingViewElementIdSet);
    if (pruned.length === linked.length) return;
    onUpdateNode(node.id, {
      viewElementIds: pruned.length > 0 ? pruned : undefined,
      viewElementId: undefined,
      configSource: "view",
    });
  }, [
    configSource,
    existingViewElementIdSet,
    node.id,
    node.viewElementId,
    node.viewElementIds,
    onUpdateNode,
    viewElementOptions.length,
  ]);

  const roleLabel = t(ROLE_LABEL_KEYS[node.role] ?? "blueprint.config.roleLogic");

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background text-foreground">
      <div className="shrink-0 border-b border-border px-3 py-2">
        <div className="text-xs font-semibold">{t("blueprint.config.title")}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">
          {roleLabel} · {node.id}
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-auto p-3 text-xs">
        <label className="block space-y-1">
          <span className="text-muted-foreground">{t("blueprint.config.nodeName")}</span>
          <Input
            value={node.label}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onUpdateNode(node.id, { label: e.target.value })
            }
            className="h-8"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-muted-foreground">{t("blueprint.config.configType")}</span>
          <Select
            value={configSource}
            onValueChange={(value: string) => {
              const nextSource = value as BlueprintConfigSource;
              onUpdateNode(node.id, {
                ...patchNodeConfigSource(node, nextSource),
                ...(nextSource === "view"
                  ? {
                      viewElementIds: linkedViewElementIds,
                      viewElementId: undefined,
                    }
                  : {
                      viewElementIds: undefined,
                      viewElementId: undefined,
                    }),
              });
            }}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blueprint">{t("blueprint.config.configBlueprint")}</SelectItem>
              <SelectItem value="logic">{t("blueprint.config.configLogic")}</SelectItem>
              <SelectItem value="and">{t("blueprint.config.configAnd")}</SelectItem>
              <SelectItem value="lifecycle">{t("blueprint.config.configLifecycle")}</SelectItem>
              <SelectItem value="fetch">{t("blueprint.config.configFetch")}</SelectItem>
              <SelectItem value="json">{t("blueprint.config.configJson")}</SelectItem>
              <SelectItem value="clock">{t("blueprint.config.configClock")}</SelectItem>
              <SelectItem value="view">{t("blueprint.config.configView")}</SelectItem>
            </SelectContent>
          </Select>
        </label>

        {configSource === "view" ? (
          <div className="block space-y-1">
            <ConfigFieldLabel
              label={t("blueprint.config.linkedViewNodes")}
              hint={t("blueprint.config.viewMultiHint")}
            />
            <ViewElementMultiSelect
              options={viewElementOptions}
              value={linkedViewElementIds}
              placeholder={t("blueprint.config.selectViewNode")}
              onChange={(next) =>
                onUpdateNode(node.id, {
                  viewElementIds: next,
                  viewElementId: undefined,
                  configSource: "view",
                })
              }
            />
            {linkedViewElementIds.length > 0 ? (
              <p className="text-[11px] text-muted-foreground">
                {t("blueprint.config.linkedViewCount", {
                  count: linkedViewElementIds.length,
                  names: linkedViewElementIds
                    .map((id) => viewElementLabelById.get(id) ?? id)
                    .join("、"),
                })}
              </p>
            ) : null}
          </div>
        ) : null}

        {configSource === "blueprint" ? (
          <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
            <ConfigSectionTitle
              title={t("blueprint.config.blueprintAttrs")}
              hint={t("blueprint.config.blueprintAttrsHint")}
            />
            <label className="block space-y-1">
              <span className="text-muted-foreground">{t("blueprint.config.refLibrary")}</span>
              <Select
                value={node.libraryBlueprintId ?? "__none__"}
                onValueChange={(value: string) => {
                  onUpdateNode(node.id, {
                    libraryBlueprintId: value === "__none__" ? undefined : value,
                    configSource: "blueprint",
                  });
                }}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder={t("blueprint.config.selectLibraryBlueprint")} />
                </SelectTrigger>
                <SelectContent className="z-[10100]">
                  <SelectItem value="__none__">{t("blueprint.config.unlinked")}</SelectItem>
                  {blueprintLibraryOptions.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            {!node.libraryBlueprintId ? (
              <p className="text-[11px] text-muted-foreground">
                {t("blueprint.config.selectLibraryFirst")}
              </p>
            ) : null}
            <label className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                checked={allowFalseSignalPropagation}
                onChange={(e) =>
                  onUpdateAllowFalseSignalPropagation?.(e.target.checked)
                }
                className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border border-input"
              />
              <span className="text-[11px] leading-relaxed text-muted-foreground">
                {t("blueprint.config.allowFalsePropagateBlueprint")}
              </span>
            </label>
          </div>
        ) : null}

        {configSource === "lifecycle" ? (
          <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
            <div className="flex items-center gap-1.5">
              <div className="font-medium text-foreground">
                {t("blueprint.config.lifecycleHook")}
              </div>
              <ConfigHintIcon label={t("blueprint.config.lifecycleHook")}>
                <p>{t("blueprint.config.lifecycleNoInput")}</p>
                <p>
                  {node.lifecyclePhase === "blueprintActivated"
                    ? t("blueprint.config.lifecycleBlueprintActivatedHint")
                    : t("blueprint.config.lifecyclePageHint")}
                </p>
              </ConfigHintIcon>
            </div>
            <label className="block space-y-1">
              <span className="text-muted-foreground">{t("blueprint.config.listenPhase")}</span>
              <Select
                value={node.lifecyclePhase ?? "mounted"}
                onValueChange={(value: string) =>
                  onUpdateNode(node.id, {
                    role: "lifecycle",
                    nodeType: LIFECYCLE_NODE_TYPE,
                    lifecyclePhase: value as PageLifecyclePhase,
                    configSource: "lifecycle",
                  })
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_LIFECYCLE_PHASES.map((phase) => (
                    <SelectItem key={phase} value={phase}>
                      {getLifecyclePhaseLabel(t, phase)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            {node.parentId ? (
              <p className="text-[11px] text-muted-foreground">
                {t("blueprint.config.parentBlueprintNode", { id: node.parentId })}
              </p>
            ) : null}
          </div>
        ) : null}

        {configSource === "fetch" ? (
          <FetchNodeConfigPanel
            node={node}
            graphNodes={graphNodes}
            graphEdges={graphEdges}
            traceEntries={traceEntries}
            onUpdateNode={onUpdateNode}
          />
        ) : null}

        {configSource === "json" ? (
          <JsonNodeConfigPanel node={node} onUpdateNode={onUpdateNode} />
        ) : null}

        {configSource === "clock" ? (
          <ClockNodeConfigPanel node={node} onUpdateNode={onUpdateNode} />
        ) : null}

        {configSource === "and" ? (
          <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
            <ConfigSectionTitle
              title={t("blueprint.config.andTitle")}
              hint={t("blueprint.config.andHint")}
            />
          </div>
        ) : null}

        {configSource === "logic" ? (
          <>
            <LogicNodeConfigPanel node={node} onUpdateNode={onUpdateNode} />
            {node.parentId ? (
              <p className="text-[11px] text-muted-foreground">
                {t("blueprint.config.parentBlueprintNode", { id: node.parentId })}
              </p>
            ) : null}
          </>
        ) : null}

        {configSource !== "blueprint" && configSource !== "and" ? (
          <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
            <div className="font-medium text-foreground">{t("blueprint.config.taskChain")}</div>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={allowFalseSignalPropagation}
                onChange={(e) =>
                  onUpdateAllowFalseSignalPropagation?.(e.target.checked)
                }
                className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border border-input"
              />
              <span className="text-[11px] leading-relaxed text-muted-foreground">
                {t("blueprint.config.allowFalsePropagateDefault")}
              </span>
            </label>
          </div>
        ) : null}
      </div>
    </div>
  );
}
