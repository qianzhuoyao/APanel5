import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import { validateJsonString } from "@arron/blueprint-dsl";
import type { JsonNodeConfig } from "@arron/blueprint-dsl";

import type { BlueprintGraphNode } from "../graph/document";
import { resolveNodeJsonConfig } from "../graph/document";

export type JsonNodeConfigPanelProps = {
  node: BlueprintGraphNode;
  onUpdateNode: (
    nodeId: string,
    patch: Partial<Pick<BlueprintGraphNode, "jsonConfig" | "configSource">>
  ) => void;
};

function patchJsonConfig(
  node: BlueprintGraphNode,
  patch: Partial<JsonNodeConfig>
) {
  return {
    jsonConfig: { ...resolveNodeJsonConfig(node), ...patch },
    configSource: "json" as const,
  };
}

export function JsonNodeConfigPanel({
  node,
  onUpdateNode,
}: JsonNodeConfigPanelProps) {
  const jsonConfig = resolveNodeJsonConfig(node);
  const [draftError, setDraftError] = useState<string | null>(null);

  const storedValidation = useMemo(
    () => validateJsonString(jsonConfig.jsonString),
    [jsonConfig.jsonString]
  );

  const parseError =
    draftError ??
    (storedValidation.ok ? null : storedValidation.error);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const jsonString = e.target.value;
      const result = validateJsonString(jsonString);
      setDraftError(result.ok ? null : result.error);
      onUpdateNode(node.id, patchJsonConfig(node, { jsonString }));
    },
    [node, onUpdateNode]
  );

  return (
    <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
      <div className="font-medium text-foreground">JSON 节点</div>
      <p className="text-[11px] text-muted-foreground">
        收到<strong>真信号</strong>后，将下方 JSON 解析为 JavaScript object（或
        array）并从输出口发出<strong>真信号</strong>；解析失败则发出
        <strong>假信号</strong>。
      </p>

      <label className="block space-y-1">
        <span className="text-muted-foreground">JSON 内容</span>
        <textarea
          value={jsonConfig.jsonString}
          onChange={handleChange}
          rows={12}
          spellCheck={false}
          className="w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
          placeholder={'{\n  "key": "value"\n}'}
        />
        {parseError ? (
          <p className="text-[11px] text-destructive">JSON 格式错误：{parseError}</p>
        ) : (
          <p className="text-[11px] text-muted-foreground">JSON 格式正确</p>
        )}
      </label>
    </div>
  );
}
