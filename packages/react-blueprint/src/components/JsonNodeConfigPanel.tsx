import { useCallback, useMemo, useState } from "react";
import type {
  ExecutionTraceEntry,
  JsonErrorRange,
  JsonNodeConfig,
} from "@arronqzy/blueprint-dsl";
import {
  latestTraceOutputsByNode,
  resolveFetchIncomingScope,
  resolveFetchScopeAutocompleteRoot,
  validateJsonStringAllowingScope,
} from "@arronqzy/blueprint-dsl";
import { useI18nOptional as useI18n } from "@arronqzy/i18n/react";

import type { BlueprintGraphEdge, BlueprintGraphNode } from "../graph/document";
import { resolveNodeJsonConfig } from "../graph/document";
import { ConfigHintIcon, ConfigSectionTitle } from "./ConfigHintIcon";
import { JsonLintTextarea } from "./JsonLintTextarea";
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
  const [draftRanges, setDraftRanges] = useState<JsonErrorRange[] | null>(null);

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
  const errorRanges: JsonErrorRange[] =
    draftRanges ??
    (!storedValidation.ok && "ranges" in storedValidation
      ? storedValidation.ranges
      : []);
  const deferredScope =
    storedValidation.ok && "deferred" in storedValidation
      ? storedValidation.deferred === true
      : false;

  const handleChange = useCallback(
    (jsonString: string) => {
      const result = validateJsonStringAllowingScope(jsonString);
      setDraftError(result.ok ? null : result.error);
      setDraftRanges(result.ok ? null : result.ranges);
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
        <JsonLintTextarea
          value={jsonConfig.jsonString}
          onChange={handleChange}
          ranges={errorRanges}
          rows={12}
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
