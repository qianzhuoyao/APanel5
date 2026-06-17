import { useCallback, type ChangeEvent } from "react";
import { Input } from "@arron/ui";
import type { ClockNodeConfig } from "@arron/blueprint-dsl";

import type { BlueprintGraphNode } from "../graph/document";
import { resolveNodeClockConfig } from "../graph/document";

export type ClockNodeConfigPanelProps = {
  node: BlueprintGraphNode;
  onUpdateNode: (
    nodeId: string,
    patch: Partial<Pick<BlueprintGraphNode, "clockConfig" | "configSource">>
  ) => void;
};

function patchClockConfig(
  node: BlueprintGraphNode,
  patch: Partial<ClockNodeConfig>
) {
  return {
    clockConfig: { ...resolveNodeClockConfig(node), ...patch },
    configSource: "clock" as const,
  };
}

export function ClockNodeConfigPanel({
  node,
  onUpdateNode,
}: ClockNodeConfigPanelProps) {
  const clockConfig = resolveNodeClockConfig(node);

  const handleIntervalChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = Number(e.target.value);
      const intervalSeconds =
        Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 0;
      onUpdateNode(node.id, patchClockConfig(node, { intervalSeconds }));
    },
    [node, onUpdateNode]
  );

  const handleOutputCountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = Number(e.target.value);
      const outputCount =
        Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1;
      onUpdateNode(node.id, patchClockConfig(node, { outputCount }));
    },
    [node, onUpdateNode]
  );

  const handleFormatChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onUpdateNode(
        node.id,
        patchClockConfig(node, { timeFormat: e.target.value })
      );
    },
    [node, onUpdateNode]
  );

  const handleEmitImmediatelyChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onUpdateNode(
        node.id,
        patchClockConfig(node, { emitImmediately: e.target.checked })
      );
    },
    [node, onUpdateNode]
  );

  return (
    <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
      <div className="font-medium text-foreground">时钟节点</div>
      <p className="text-[11px] text-muted-foreground">
        收到<strong>真信号</strong>后才开始计时输出；每次输出向下游发出
        <strong>真信号</strong>，值包含当前时间（formatted / timestamp / isoTime）。
        假信号会原样向下游传递。
      </p>

      <label className="block space-y-1">
        <span className="text-muted-foreground">时钟信号间隔（秒）</span>
        <Input
          type="number"
          min={0}
          step={1}
          value={clockConfig.intervalSeconds}
          onChange={handleIntervalChange}
          className="h-8"
        />
        <p className="text-[11px] text-muted-foreground">
          两次输出之间的间隔 n 秒；多次输出或未开启「立即发送」时须大于 0。
        </p>
      </label>

      <label className="block space-y-1">
        <span className="text-muted-foreground">输出次数</span>
        <Input
          type="number"
          min={1}
          step={1}
          value={clockConfig.outputCount}
          onChange={handleOutputCountChange}
          className="h-8"
        />
        <p className="text-[11px] text-muted-foreground">
          收到真信号后总共输出的次数，默认 1。
        </p>
      </label>

      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={clockConfig.emitImmediately}
          onChange={handleEmitImmediatelyChange}
          className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border border-input"
        />
        <span className="text-[11px] leading-relaxed text-muted-foreground">
          收到信号立即发送：开启且输出次数大于 1 时，会立刻执行第 1 次，剩余次数按间隔 m
          秒依次执行；仅输出 1 次时也会立刻执行。关闭则每次（含首次）都先等待 m 秒。
        </span>
      </label>

      <label className="block space-y-1">
        <span className="text-muted-foreground">时间格式</span>
        <Input
          value={clockConfig.timeFormat}
          onChange={handleFormatChange}
          spellCheck={false}
          className="h-8 font-mono text-[11px]"
          placeholder="YYYY-MM-DD HH:mm:ss"
        />
        <p className="text-[11px] text-muted-foreground">
          支持 YYYY、MM、DD、HH、mm、ss，默认 YYYY-MM-DD HH:mm:ss。
        </p>
      </label>
    </div>
  );
}
