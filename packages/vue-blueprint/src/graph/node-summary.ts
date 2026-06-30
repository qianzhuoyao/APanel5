import {
  PAGE_LIFECYCLE_LABELS,
  resolveFetchRequestUrl,
} from "@arronqzy/blueprint-dsl";

import {
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

/** 画布节点正文区展示的配置摘要 */
export function resolveBlueprintNodeSummary(
  data: BlueprintFlowNodeData
): string | undefined {
  const configSource = resolveBlueprintConfigSource(data);

  switch (configSource) {
    case "fetch": {
      const config = resolveNodeFetchConfig(data);
      if (!config.url?.trim()) return "未配置 URL";
      let url = config.url.trim();
      try {
        url = resolveFetchRequestUrl(config);
      } catch {
        /* 保留原始输入 */
      }
      const method = config.method ?? "GET";
      return truncate(`${method} ${url}`, 44);
    }
    case "clock": {
      const clock = resolveNodeClockConfig(data);
      const parts = [
        `${clock.outputCount} 次`,
        clock.intervalSeconds > 0 ? `间隔 ${clock.intervalSeconds}s` : null,
        clock.emitImmediately ? "立即首发" : "延迟首发",
      ].filter(Boolean);
      return parts.join(" · ");
    }
    case "json": {
      const json = resolveNodeJsonConfig(data).jsonString?.trim();
      if (!json) return "空 JSON";
      return truncate(json.replace(/\s+/g, " "), 44);
    }
    case "logic": {
      const code = resolveNodeLogicConfig(data).sourceCode?.trim();
      if (!code) return "未配置脚本";
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
      return "未选择蓝图";
    }
    case "lifecycle": {
      const phase = data.lifecyclePhase ?? "mounted";
      return PAGE_LIFECYCLE_LABELS[phase as keyof typeof PAGE_LIFECYCLE_LABELS] ?? phase;
    }
    case "view": {
      const ids = resolveViewElementIds(data);
      if (ids.length === 0) return "未关联视图节点";
      if (ids.length === 1) {
        return truncate(`视图节点 ${ids[0]}`, 44);
      }
      return `已关联 ${ids.length} 个视图节点`;
    }
    case "and":
      return "两路输入均为真时输出";
    default:
      return undefined;
  }
}
