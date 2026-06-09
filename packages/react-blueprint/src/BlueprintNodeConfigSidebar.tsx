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

import type { BlueprintConfigSource, BlueprintGraphNode } from "./graph/document";
import { resolveBlueprintConfigSource } from "./graph/document";

export type BlueprintViewElementOption = {
  id: string;
  label: string;
};

export type BlueprintNodeConfigSidebarProps = {
  node: BlueprintGraphNode;
  viewElementOptions?: BlueprintViewElementOption[];
  onUpdateNode: (
    nodeId: string,
    patch: Partial<
      Pick<
        BlueprintGraphNode,
        | "label"
        | "nodeType"
        | "configSource"
        | "viewElementId"
        | "nestedBlueprintId"
        | "lifecyclePhase"
      >
    >
  ) => void;
};

export function BlueprintNodeConfigSidebar({
  node,
  viewElementOptions = [],
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
              : "逻辑节点"}{" "}
          · {node.id}
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-auto p-3 text-xs">
        <label className="block space-y-1">
          <span className="text-muted-foreground">显示名称</span>
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
            onValueChange={(value: string) =>
              onUpdateNode(node.id, {
                configSource: value as BlueprintConfigSource,
                viewElementId:
                  value === "view" ? node.viewElementId : undefined,
              })
            }
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blueprint">蓝图配置</SelectItem>
              <SelectItem value="logic">逻辑配置</SelectItem>
              <SelectItem value="lifecycle">生命周期配置</SelectItem>
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
                请选择要绑定的视图画布节点，下方将展示该节点的属性配置。
              </p>
            ) : null}
          </label>
        ) : null}

        {configSource === "blueprint" ? (
          <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
            <div className="font-medium text-foreground">蓝图属性</div>
            <label className="block space-y-1">
              <span className="text-muted-foreground">节点类型</span>
              <Input
                value={node.nodeType}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onUpdateNode(node.id, { nodeType: e.target.value })
                }
                className="h-8"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-muted-foreground">嵌套蓝图 ID</span>
              <Input
                value={node.nestedBlueprintId ?? ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onUpdateNode(node.id, {
                    nestedBlueprintId: e.target.value || undefined,
                  })
                }
                className="h-8 font-mono text-[11px]"
              />
            </label>
          </div>
        ) : null}

        {configSource === "lifecycle" ? (
          <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
            <div className="font-medium text-foreground">生命周期钩子</div>
            <p className="text-[11px] text-muted-foreground">
              当页面进入对应生命周期时，自动向下游节点发送信号（含 phase 与 timestamp）。
            </p>
            <label className="block space-y-1">
              <span className="text-muted-foreground">监听阶段</span>
              <Select
                value={node.lifecyclePhase ?? "mounted"}
                onValueChange={(value: string) =>
                  onUpdateNode(node.id, {
                    lifecyclePhase: value as PageLifecyclePhase,
                    configSource: "lifecycle",
                    label: `生命周期 · ${value}`,
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
