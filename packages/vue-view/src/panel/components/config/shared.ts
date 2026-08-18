import type { PanelChartConfig } from "../../types";
import { resolveLocale, tForLocale } from "@arronqzy/i18n";
import { runBusyTask } from "../../utils/async-work";

export function mergeOptionPatch(
  base: Record<string, unknown> | undefined,
  patch: Record<string, unknown>
): Record<string, unknown> {
  const output: Record<string, unknown> = { ...(base ?? {}) };
  for (const [key, value] of Object.entries(patch)) {
    const prev = output[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      prev &&
      typeof prev === "object" &&
      !Array.isArray(prev)
    ) {
      output[key] = mergeOptionPatch(
        prev as Record<string, unknown>,
        value as Record<string, unknown>
      );
    } else {
      output[key] = value;
    }
  }
  return output;
}

export function sectionMatchesSearch(
  title: string,
  searchTerms: string[],
  normalizedSearch: string,
  hasSearch: boolean
): boolean {
  if (!hasSearch) return true;
  return [title, ...searchTerms].some((term) =>
    term.toLowerCase().includes(normalizedSearch)
  );
}

export { readFileAsDataUrl } from "../../utils/async-work";

export async function uploadFileToRemote(file: File): Promise<string | undefined> {
  const t = tForLocale(resolveLocale());
  return runBusyTask(t("common.uploadingFile"), async () => {
    try {
      const form = new FormData();
      form.append("file", file);
      const resp = await fetch("/api/upload", { method: "POST", body: form });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = (await resp.json()) as { url?: string };
      return data.url;
    } catch {
      return undefined;
    }
  });
}

export function patchChart(
  chart: PanelChartConfig | undefined,
  patch: Partial<PanelChartConfig>
): PanelChartConfig {
  return { ...(chart ?? {}), ...patch };
}
