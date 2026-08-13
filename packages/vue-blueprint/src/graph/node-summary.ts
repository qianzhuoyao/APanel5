import { resolveFetchRequestUrl } from "@arronqzy/blueprint-dsl";
import type { TranslateFn } from "@arronqzy/i18n";
import { resolveLocale, tForLocale } from "@arronqzy/i18n";

import {
  getLifecyclePhaseLabel,
  resolveBlueprintConfigSource,
  resolveNodeClockConfig,
  resolveNodeFetchConfig,
  resolveNodeJsonConfig,
  resolveNodeLogicConfig,
  resolveViewElementIds,
} from "./document";
import type { BlueprintFlowNodeData } from "./vue-flow-adapter";

function truncate(text: string, max: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, Math.max(0, max - 1))}…`;
}

function defaultTranslate(): TranslateFn {
  return tForLocale(resolveLocale());
}

/** 画布节点正文区展示的配置摘要 */
export function resolveBlueprintNodeSummary(
  data: BlueprintFlowNodeData,
  t: TranslateFn = defaultTranslate()
): string | undefined {
  const configSource = resolveBlueprintConfigSource(data);

  switch (configSource) {
    case "fetch": {
      const config = resolveNodeFetchConfig(data);
      if (!config.url?.trim()) return t("blueprint.node.summaryNoUrl");
      let url = config.url.trim();
      try {
        url = resolveFetchRequestUrl(config);
      } catch {
        /* keep raw input */
      }
      const method = config.method ?? "GET";
      return truncate(`${method} ${url}`, 44);
    }
    case "clock": {
      const clock = resolveNodeClockConfig(data);
      const parts = [
        t("blueprint.node.summaryOutputCount", { count: clock.outputCount }),
        clock.intervalSeconds > 0
          ? t("blueprint.node.summaryInterval", {
              seconds: clock.intervalSeconds,
            })
          : null,
        clock.emitImmediately
          ? t("blueprint.node.summaryEmitImmediate")
          : t("blueprint.node.summaryEmitDelayed"),
      ].filter(Boolean);
      return parts.join(" · ");
    }
    case "json": {
      const json = resolveNodeJsonConfig(data).jsonString?.trim();
      if (!json) return t("blueprint.node.summaryEmptyJson");
      return truncate(json.replace(/\s+/g, " "), 44);
    }
    case "logic": {
      const code = resolveNodeLogicConfig(data).sourceCode?.trim();
      if (!code) return t("blueprint.node.summaryNoScript");
      const firstLine =
        code.split("\n").find((line) => line.trim())?.trim() ?? code;
      return truncate(firstLine, 44);
    }
    case "blueprint": {
      if (data.libraryBlueprintLabel) {
        return truncate(data.libraryBlueprintLabel, 44);
      }
      if (data.libraryBlueprintId) {
        return truncate(data.libraryBlueprintId, 44);
      }
      return t("blueprint.node.summaryNoBlueprint");
    }
    case "lifecycle": {
      const phase = data.lifecyclePhase ?? "mounted";
      return getLifecyclePhaseLabel(t, phase);
    }
    case "view": {
      const ids = resolveViewElementIds(data);
      if (ids.length === 0) return t("blueprint.node.summaryNoView");
      if (ids.length === 1) {
        return truncate(
          t("blueprint.node.summaryViewOne", { id: ids[0] }),
          44
        );
      }
      return t("blueprint.node.summaryViewMany", { count: ids.length });
    }
    case "and":
      return t("blueprint.node.summaryAnd");
    default:
      return undefined;
  }
}
