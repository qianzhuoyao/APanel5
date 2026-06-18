import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import { validateLogicSourceCode } from "@arronqzy/blueprint-dsl";
import type { LogicNodeConfig } from "@arronqzy/blueprint-dsl";

import type { BlueprintGraphNode } from "../graph/document";
import { resolveNodeLogicConfig } from "../graph/document";

export type LogicNodeConfigPanelProps = {
  node: BlueprintGraphNode;
  onUpdateNode: (
    nodeId: string,
    patch: Partial<Pick<BlueprintGraphNode, "logicConfig" | "configSource">>
  ) => void;
};

function patchLogicConfig(
  node: BlueprintGraphNode,
  patch: Partial<LogicNodeConfig>
) {
  return {
    logicConfig: { ...resolveNodeLogicConfig(node), ...patch },
    configSource: "logic" as const,
  };
}

export function LogicNodeConfigPanel({
  node,
  onUpdateNode,
}: LogicNodeConfigPanelProps) {
  const logicConfig = resolveNodeLogicConfig(node);
  const [draftError, setDraftError] = useState<string | null>(null);

  const storedValidation = useMemo(
    () => validateLogicSourceCode(logicConfig.sourceCode),
    [logicConfig.sourceCode]
  );

  const parseError =
    draftError ?? (storedValidation.ok ? null : storedValidation.error);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const sourceCode = e.target.value;
      const result = validateLogicSourceCode(sourceCode);
      setDraftError(result.ok ? null : result.error);
      onUpdateNode(node.id, patchLogicConfig(node, { sourceCode }));
    },
    [node, onUpdateNode]
  );

  return (
    <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
      <div className="font-medium text-foreground">逻辑节点</div>
      <p className="text-[11px] text-muted-foreground">
        收到<strong>真信号</strong>后，将输入数据传入下方 <code>update</code>{" "}
        函数并执行；返回值作为<strong>真信号</strong>输出。代码语法错误或运行时报错则发出
        <strong>假信号</strong>（错误信息为输出值）。
      </p>

      <label className="block space-y-1">
        <span className="text-muted-foreground">JavaScript 代码</span>
        <textarea
          value={logicConfig.sourceCode}
          onChange={handleChange}
          rows={14}
          spellCheck={false}
          className="w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
          placeholder={`function update(input) {\n  return input;\n}`}
        />
        {parseError ? (
          <p className="text-[11px] text-destructive">
            JavaScript 错误：{parseError}
          </p>
        ) : (
          <p className="text-[11px] text-muted-foreground">JavaScript 语法正确</p>
        )}
      </label>
    </div>
  );
}
