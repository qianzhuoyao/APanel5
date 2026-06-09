import type { ChangeEvent } from "react";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@arron/ui";
import {
  PAGE_LIFECYCLE_LABELS,
  PAGE_LIFECYCLE_PHASES,
  type PageLifecyclePhase,
} from "@arron/blueprint-dsl";

import { FetchNodeConfigPanel } from "./components/FetchNodeConfigPanel";
import { JsonNodeConfigPanel } from "./components/JsonNodeConfigPanel";
import {
  patchNodeConfigSource,
  resolveBlueprintConfigSource,
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
        | "nestedBlueprintId"
        | "libraryBlueprintId"
        | "lifecyclePhase"
        | "fetchConfig"
        | "jsonConfig"
      >
    >
  ) => void;
};

export function BlueprintNodeConfigSidebar({
  node,
  viewElementOptions = [],
  blueprintLibraryOptions = [],
  onUpdateNode,
}: BlueprintNodeConfigSidebarProps) {
  const configSource = resolveBlueprintConfigSource(node);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background text-foreground">
      <div className="shrink-0 border-b border-border px-3 py-2">
        <div className="text-xs font-semibold">蓝图节点配置</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">
          {node.role === "blueprint"
            ? "蓝图节点"
            : node.role === "lifecycle"
              ? "生命周期节点"
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
                viewElementId:
                  nextSource === "view" ? node.viewElementId : undefined,
              });
            }}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blueprint">蓝图配置</SelectItem>
              <SelectItem value="logic">逻辑配置</SelectItem>
              <SelectItem value="lifecycle">生命周期配置</SelectItem>
              <SelectItem value="fetch">数据源获取</SelectItem>
              <SelectItem value="json">JSON 节点</SelectItem>
              <SelectItem value="view">视图节点配置</SelectItem>
            </SelectContent>
          </Select>
        </label>

        {configSource === "view" ? (
          <label className="block space-y-1">
            <span className="text-muted-foreground">关联视图节点</span>
            <Select
              value={node.viewElementId ?? "__none__"}
              onValueChange={(value: string) =>
                onUpdateNode(node.id, {
                  viewElementId: value === "__none__" ? undefined : value,
                  configSource: "view",
                })
              }
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="选择视图节点" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">未关联</SelectItem>
                {viewElementOptions.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!node.viewElementId ? (
              <p className="text-[11px] text-muted-foreground">
                选择要绑定的视图画布节点；关联后仍在此配置蓝图节点，视图属性请在视图面板中编辑。
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                已关联视图节点「
                {viewElementOptions.find((o) => o.id === node.viewElementId)?.label ??
                  node.viewElementId}
                」。
              </p>
            )}
          </label>
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
          </div>
        ) : null}

        {configSource === "lifecycle" ? (
          <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
            <div className="font-medium text-foreground">生命周期钩子</div>
            <p className="text-[11px] text-muted-foreground">
              生命周期节点<strong>没有输入口</strong>，仅右侧输出口；当页面进入对应生命周期时，自动向下游发出真/假信号。
            </p>
            <label className="block space-y-1">
              <span className="text-muted-foreground">监听阶段</span>
              <Select
                value={node.lifecyclePhase ?? "mounted"}
                onValueChange={(value: string) =>
                  onUpdateNode(node.id, {
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

        {configSource === "logic" ? (
          <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
            <div className="font-medium text-foreground">逻辑属性</div>
            <label className="block space-y-1">
              <span className="text-muted-foreground">逻辑类型</span>
              <Input
                value={node.nodeType}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onUpdateNode(node.id, { nodeType: e.target.value })
                }
                className="h-8"
              />
            </label>
            {node.parentId ? (
              <p className="text-[11px] text-muted-foreground">
                所属蓝图节点：{node.parentId}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
