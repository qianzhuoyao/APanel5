import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import { Input } from "@arronqzy/ui";
import type { ExecutionTraceEntry } from "@arronqzy/blueprint-dsl";
import {
  latestTraceOutputsByNode,
  resolveFetchIncomingScope,
  resolveFetchScopeAutocompleteRoot,
} from "@arronqzy/blueprint-dsl";
import { useI18nOptional as useI18n } from "@arronqzy/i18n/react";

import type { BlueprintGraphEdge, BlueprintGraphNode } from "../graph/document";
import { resolveNodeBranchConfig } from "../graph/document";
import { ConfigFieldLabel, ConfigSectionTitle } from "./ConfigHintIcon";
import { ScopeTemplateAutocompleteHost } from "./ScopeTemplateAutocompleteHost";

export type BranchNodeConfigPanelProps = {
  node: BlueprintGraphNode;
  graphNodes?: BlueprintGraphNode[];
  graphEdges?: BlueprintGraphEdge[];
  traceEntries?: ExecutionTraceEntry[];
  onUpdateNode: (
    nodeId: string,
    patch: Partial<Pick<BlueprintGraphNode, "branchConfig" | "configSource">>
  ) => void;
};

export function BranchNodeConfigPanel({
  node,
  graphNodes = [],
  graphEdges = [],
  traceEntries = [],
  onUpdateNode,
}: BranchNodeConfigPanelProps) {
  const { t } = useI18n();
  const [formEl, setFormEl] = useState<HTMLDivElement | null>(null);
  const branchConfig = resolveNodeBranchConfig(node);

  const incomingScope = useMemo(() => {
    const outputs = latestTraceOutputsByNode(traceEntries);
    return resolveFetchIncomingScope({
      fetchNodeId: node.id,
      nodes: graphNodes,
      edges: graphEdges,
      getOutput: (sourceId, port) => outputs[sourceId]?.[port],
    });
  }, [graphEdges, graphNodes, node.id, traceEntries]);
  const autocompleteScope = resolveFetchScopeAutocompleteRoot(incomingScope);

  const handleExpressionChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onUpdateNode(node.id, {
        branchConfig: { expression: e.target.value },
        configSource: "branch",
      });
    },
    [node.id, onUpdateNode]
  );

  return (
    <div ref={setFormEl} className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5">
      <ConfigSectionTitle
        title={t("blueprint.config.branchTitle")}
        hint={t("blueprint.config.branchHint")}
      />
      <label className="block space-y-1">
        <ConfigFieldLabel
          label={t("blueprint.config.branchExpression")}
          hint={t("blueprint.config.branchExpressionHint")}
        />
        <Input
          value={branchConfig.expression}
          onChange={handleExpressionChange}
          placeholder={t("blueprint.config.branchExpressionPlaceholder")}
          className="h-8 font-mono text-[11px]"
          spellCheck={false}
        />
      </label>
      <ScopeTemplateAutocompleteHost
        scope={autocompleteScope}
        container={formEl}
      />
    </div>
  );
}
