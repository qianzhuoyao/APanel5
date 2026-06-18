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
  PAGE_LIFECYCLE_LABELS,
  PAGE_LIFECYCLE_PHASES,
  type PageLifecyclePhase,
} from "@arronqzy/blueprint-dsl";

import { FetchNodeConfigPanel } from "./components/FetchNodeConfigPanel";
import { ClockNodeConfigPanel } from "./components/ClockNodeConfigPanel";
import { JsonNodeConfigPanel } from "./components/JsonNodeConfigPanel";
import { LogicNodeConfigPanel } from "./components/LogicNodeConfigPanel";
import { ViewElementMultiSelect } from "./components/ViewElementMultiSelect";
import {
  patchNodeConfigSource,
  pruneViewElementIds,
  resolveBlueprintConfigSource,
  resolveViewElementIds,
  type BlueprintConfigSource,
  type BlueprintGraphNode,
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

export function BlueprintNodeConfigSidebar({
  node,
  viewElementOptions = [],
  blueprintLibraryOptions = [],
  allowFalseSignalPropagation = false,
  onUpdateAllowFalseSignalPropagation,
  onUpdateNode,
}: BlueprintNodeConfigSidebarProps) {
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

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background text-foreground">
      <div className="shrink-0 border-b border-border px-3 py-2">
        <div className="text-xs font-semibold">蓝图节点配置</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">
          {node.role === "blueprint"
            ? "蓝图节点"
            : node.role === "lifecycle"
              ? "生命周期节点"
              : node.role === "and"
                ? "并运算节点"
              : node.role === "fetch"
                ? "数据源节点"
                : node.role === "json"
                  ? "JSON 节点"
                  : "逻辑节点"}{" "}
          · {node.id}
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-auto p-3 text-xs">
        <label className="block space-y-1">
          <span className="text-muted-foreground">节点名称</span>
          <Input
            value={node.label}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onUpdateNode(node.id, { label: e.target.value })
            }
            className="h-8"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-muted-foreground">配置类型</span>
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
              <SelectItem value="blueprint">蓝图配置</SelectItem>
              <SelectItem value="logic">逻辑配置</SelectItem>
              <SelectItem value="and">并运算</SelectItem>
              <SelectItem value="lifecycle">生命周期配置</SelectItem>
              <SelectItem value="fetch">数据源获取</SelectItem>
              <SelectItem value="json">JSON 节点</SelectItem>
              <SelectItem value="clock">时钟</SelectItem>
              <SelectItem value="view">视图节点配置</SelectItem>
            </SelectContent>
          </Select>
        </label>

        {configSource === "view" ? (
          <div className="block space-y-1">
            <span className="text-muted-foreground">关联视图节点</span>
            <ViewElementMultiSelect
              options={viewElementOptions}
              value={linkedViewElementIds}
              placeholder="选择视图节点"
              onChange={(next) =>
                onUpdateNode(node.id, {
                  viewElementIds: next,
                  viewElementId: undefined,
                  configSource: "view",
                })
              }
            />
            {linkedViewElementIds.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">
                可多选视图画布节点；关联后仍在此配置蓝图节点，视图属性请在视图面板中编辑。
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                已关联 {linkedViewElementIds.length} 个视图节点：
                {linkedViewElementIds
                  .map((id) => viewElementLabelById.get(id) ?? id)
                  .join("、")}
                。
              </p>
            )}
          </div>
        ) : null}

        {configSource === "blueprint" ? (
          <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
            <div className="font-medium text-foreground">蓝图属性</div>
            <p className="text-[11px] text-muted-foreground">
              选中蓝图库中的蓝图后，当输入端收到<strong>真信号</strong>
              时才会执行该蓝图；执行完成后从输出端发出
              <strong>真信号</strong>（含嵌套蓝图输出值与当前节点信息），执行失败则发出
              <strong>假信号</strong>。
            </p>
            <label className="block space-y-1">
              <span className="text-muted-foreground">引用蓝图库</span>
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
                  <SelectValue placeholder="选择蓝图库中的蓝图" />
                </SelectTrigger>
                <SelectContent className="z-[10100]">
                  <SelectItem value="__none__">未关联</SelectItem>
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
                请先从蓝图库选择要引用的蓝图。
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
                允许假信号传递：开启后，节点输出假信号时不会阻塞任务链，错误信息会继续向下游传递。
              </span>
            </label>
          </div>
        ) : null}

        {configSource === "lifecycle" ? (
          <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
            <div className="font-medium text-foreground">生命周期钩子</div>
            <p className="text-[11px] text-muted-foreground">
              生命周期节点<strong>没有输入口</strong>，仅右侧输出口。
              {node.lifecyclePhase === "blueprintActivated"
                ? "当本蓝图被其他蓝图的蓝图配置节点引用且收到真信号时，自动向下游发出真信号，输出值为父级传入的输入数据。"
                : "当页面进入对应生命周期时，自动向下游发出真/假信号。"}
            </p>
            <label className="block space-y-1">
              <span className="text-muted-foreground">监听阶段</span>
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
                      {PAGE_LIFECYCLE_LABELS[phase]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            {node.parentId ? (
              <p className="text-[11px] text-muted-foreground">
                所属蓝图节点：{node.parentId}
              </p>
            ) : null}
          </div>
        ) : null}

        {configSource === "fetch" ? (
          <FetchNodeConfigPanel node={node} onUpdateNode={onUpdateNode} />
        ) : null}

        {configSource === "json" ? (
          <JsonNodeConfigPanel node={node} onUpdateNode={onUpdateNode} />
        ) : null}

        {configSource === "clock" ? (
          <ClockNodeConfigPanel node={node} onUpdateNode={onUpdateNode} />
        ) : null}

        {configSource === "and" ? (
          <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
            <div className="font-medium text-foreground">并运算</div>
            <p className="text-[11px] text-muted-foreground">
              左侧两个输入口 <strong>inA</strong>、<strong>inB</strong>。
              每个输入口可连 n 条线，同端口任一为真则该端口视为真（或）。
              仅当 <strong>inA 与 inB 均为真信号</strong> 时，从输出口发出真信号；
              否则发出假信号。
            </p>
          </div>
        ) : null}

        {configSource === "logic" ? (
          <>
            <LogicNodeConfigPanel node={node} onUpdateNode={onUpdateNode} />
            {node.parentId ? (
              <p className="text-[11px] text-muted-foreground">
                所属蓝图节点：{node.parentId}
              </p>
            ) : null}
          </>
        ) : null}

        {configSource !== "blueprint" && configSource !== "and" ? (
          <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
            <div className="font-medium text-foreground">任务链执行</div>
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
                允许假信号传递：默认假信号会阻塞任务链；开启后继续向下游传递假信号与错误信息。
              </span>
            </label>
          </div>
        ) : null}
      </div>
    </div>
  );
}
