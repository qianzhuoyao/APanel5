import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import {
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@arronqzy/ui";
import type {
  ExecutionTraceEntry,
  StorageKind,
  StorageReadConfig,
  StorageSetConfig,
} from "@arronqzy/blueprint-dsl";
import {
  latestTraceOutputsByNode,
  resolveFetchIncomingScope,
  resolveFetchScopeAutocompleteRoot,
  uniqueStorageKinds,
} from "@arronqzy/blueprint-dsl";
import { useI18n } from "@arronqzy/i18n/react";

import type { BlueprintGraphEdge, BlueprintGraphNode } from "../graph/document";
import { resolveNodeStorageConfig } from "../graph/document";
import { ConfigFieldLabel, ConfigSectionTitle } from "./ConfigHintIcon";
import { ScopeTemplateAutocompleteHost } from "./ScopeTemplateAutocompleteHost";

export type StorageNodeConfigPanelProps = {
  node: BlueprintGraphNode;
  graphNodes?: BlueprintGraphNode[];
  graphEdges?: BlueprintGraphEdge[];
  traceEntries?: ExecutionTraceEntry[];
  onUpdateNode: (
    nodeId: string,
    patch: Partial<Pick<BlueprintGraphNode, "storageConfig" | "configSource">>
  ) => void;
};

function patchStorageConfig(
  node: BlueprintGraphNode,
  patch: {
    read?: Partial<StorageReadConfig>;
    set?: Partial<StorageSetConfig>;
  }
) {
  const current = resolveNodeStorageConfig(node);
  return {
    storageConfig: {
      read: { ...current.read, ...patch.read },
      set: { ...current.set, ...patch.set },
    },
    configSource: "storage" as const,
  };
}

export function StorageNodeConfigPanel({
  node,
  graphNodes = [],
  graphEdges = [],
  traceEntries = [],
  onUpdateNode,
}: StorageNodeConfigPanelProps) {
  const { t } = useI18n();
  const [formEl, setFormEl] = useState<HTMLDivElement | null>(null);
  const storageConfig = resolveNodeStorageConfig(node);

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

  const handleReadStorageChange = useCallback(
    (value: string) => {
      onUpdateNode(
        node.id,
        patchStorageConfig(node, {
          read: { storage: value === "session" ? "session" : "local" },
        })
      );
    },
    [node, onUpdateNode]
  );

  const handleReadKeyChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onUpdateNode(
        node.id,
        patchStorageConfig(node, { read: { key: e.target.value } })
      );
    },
    [node, onUpdateNode]
  );

  const handleSetStorageToggle = useCallback(
    (kind: StorageKind, checked: boolean) => {
      const next = new Set(storageConfig.set.storages);
      if (checked) next.add(kind);
      else next.delete(kind);
      onUpdateNode(
        node.id,
        patchStorageConfig(node, {
          set: { storages: uniqueStorageKinds([...next]) },
        })
      );
    },
    [node, onUpdateNode, storageConfig.set.storages]
  );

  const handleSetKeyChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onUpdateNode(
        node.id,
        patchStorageConfig(node, { set: { key: e.target.value } })
      );
    },
    [node, onUpdateNode]
  );

  const handleSetValueChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onUpdateNode(
        node.id,
        patchStorageConfig(node, { set: { value: e.target.value } })
      );
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
        title={t("blueprint.config.storageTitle")}
        hint={t("blueprint.config.storageHint")}
      />

      <div className="space-y-2 rounded-md border border-border/60 bg-background/70 p-2">
        <ConfigSectionTitle
          title={t("blueprint.config.storageReadTitle")}
          hint={t("blueprint.config.storageReadHint")}
        />
        <label className="block space-y-1">
          <ConfigFieldLabel label={t("blueprint.config.storageTarget")} />
          <Select
            value={storageConfig.read.storage}
            onValueChange={handleReadStorageChange}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="session">
                {t("blueprint.config.storageSession")}
              </SelectItem>
              <SelectItem value="local">
                {t("blueprint.config.storageLocal")}
              </SelectItem>
            </SelectContent>
          </Select>
        </label>
        <label className="block space-y-1">
          <ConfigFieldLabel label={t("blueprint.config.storageKey")} />
          <Input
            value={storageConfig.read.key}
            onChange={handleReadKeyChange}
            spellCheck={false}
            className="h-8 font-mono text-[11px]"
            placeholder="key"
          />
        </label>
      </div>

      <div className="space-y-2 rounded-md border border-border/60 bg-background/70 p-2">
        <ConfigSectionTitle
          title={t("blueprint.config.storageSetTitle")}
          hint={t("blueprint.config.storageSetHint")}
        />
        <div className="space-y-1.5">
          <ConfigFieldLabel label={t("blueprint.config.storageTarget")} />
          {(["session", "local"] as const).map((kind) => {
            const checked = storageConfig.set.storages.includes(kind);
            return (
              <label key={kind} className="flex items-center gap-2">
                <Checkbox
                  checked={checked}
                  className="h-3.5 w-3.5 border-2 border-foreground/80 bg-background ring-1 ring-foreground/40 data-[state=checked]:border-primary data-[state=checked]:ring-primary/40"
                  onCheckedChange={(nextChecked: boolean | "indeterminate") => {
                    handleSetStorageToggle(kind, nextChecked === true);
                  }}
                />
                <span>
                  {kind === "session"
                    ? t("blueprint.config.storageSession")
                    : t("blueprint.config.storageLocal")}
                </span>
              </label>
            );
          })}
        </div>
        <label className="block space-y-1">
          <ConfigFieldLabel label={t("blueprint.config.storageKey")} />
          <Input
            value={storageConfig.set.key}
            onChange={handleSetKeyChange}
            spellCheck={false}
            className="h-8 font-mono text-[11px]"
            placeholder="key"
          />
        </label>
        <label className="block space-y-1">
          <ConfigFieldLabel
            label={t("blueprint.config.storageValue")}
            hint={t("blueprint.config.storageValueHint")}
          />
          <Input
            value={storageConfig.set.value}
            onChange={handleSetValueChange}
            spellCheck={false}
            className="h-8 font-mono text-[11px]"
            placeholder="{scope.value}"
          />
        </label>
      </div>
    </div>
  );
}
