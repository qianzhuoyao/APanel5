import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import type {
  ExecutionTraceEntry,
  JsonNodeConfig,
} from "@arronqzy/blueprint-dsl";
import {
  latestTraceOutputsByNode,
  resolveFetchIncomingScope,
  resolveFetchScopeAutocompleteRoot,
  validateJsonStringAllowingScope,
} from "@arronqzy/blueprint-dsl";
import { useI18n } from "@arronqzy/i18n/react";

import type { BlueprintGraphEdge, BlueprintGraphNode } from "../graph/document";
import { resolveNodeJsonConfig } from "../graph/document";
import { ConfigHintIcon, ConfigSectionTitle } from "./ConfigHintIcon";
import { ScopeTemplateAutocompleteHost } from "./ScopeTemplateAutocompleteHost";

export type JsonNodeConfigPanelProps = {
  node: BlueprintGraphNode;
  graphNodes?: BlueprintGraphNode[];
  graphEdges?: BlueprintGraphEdge[];
  traceEntries?: ExecutionTraceEntry[];
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
  graphNodes = [],
  graphEdges = [],
  traceEntries = [],
  onUpdateNode,
}: JsonNodeConfigPanelProps) {
  const { t } = useI18n();
  const [formEl, setFormEl] = useState<HTMLDivElement | null>(null);
  const jsonConfig = resolveNodeJsonConfig(node);
  const [draftError, setDraftError] = useState<string | null>(null);

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

  const storedValidation = useMemo(
    () => validateJsonStringAllowingScope(jsonConfig.jsonString),
    [jsonConfig.jsonString]
  );

  const parseError =
    draftError ??
    (storedValidation.ok ? null : storedValidation.error);
  const deferredScope =
    storedValidation.ok && "deferred" in storedValidation
      ? storedValidation.deferred === true
      : false;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const jsonString = e.target.value;
      const result = validateJsonStringAllowingScope(jsonString);
      setDraftError(result.ok ? null : result.error);
      onUpdateNode(node.id, patchJsonConfig(node, { jsonString }));
    },
    [node, onUpdateNode]
  );

  return (
    <div
      ref={setFormEl}
      className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2.5"
    >
      <ScopeTemplateAutocompleteHost
        scope={autocompleteScope}
        container={formEl}
      />
      <ConfigSectionTitle
        title={t("blueprint.config.jsonTitle")}
        hint={t("blueprint.config.jsonHint")}
      />

      <label className="block space-y-1">
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          {t("blueprint.config.jsonContent")}
          <ConfigHintIcon label={t("blueprint.config.jsonContent")}>
            {t("blueprint.config.jsonScopeHint")}
          </ConfigHintIcon>
        </span>
        <textarea
          value={jsonConfig.jsonString}
          onChange={handleChange}
          rows={12}
          spellCheck={false}
          className="w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
          placeholder={'{\n  "key": "{scope?.value}"\n}'}
        />
        {parseError ? (
          <p className="text-[11px] text-destructive">
            {t("blueprint.config.jsonFormatError", { error: parseError })}
          </p>
        ) : deferredScope ? (
          <p className="text-[11px] text-muted-foreground">
            {t("blueprint.config.jsonScopeDeferred")}
          </p>
        ) : (
          <p className="text-[11px] text-muted-foreground">
            {t("blueprint.config.jsonFormatOk")}
          </p>
        )}
      </label>
    </div>
  );
}
