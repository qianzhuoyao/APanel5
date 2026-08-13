/** Map panel.update patch keys → config field anchors / sidebar sections. */

export type ConfigRevealTarget = {
  field: string;
  section: string;
};

const FIELD_SECTION: Record<string, string> = {
  name: "nodeInfo",
  x: "nodeInfo",
  y: "nodeInfo",
  width: "nodeInfo",
  height: "nodeInfo",
  rotate: "nodeInfo",
  locked: "nodeInfo",
  zIndex: "nodeInfo",
  layerId: "nodeInfo",
  textHtml: "textConfig",
  textColor: "textConfig",
  textFontSize: "textConfig",
  textFontFamily: "textConfig",
  textFontWeight: "textConfig",
  textAlign: "textConfig",
  textLineHeight: "textConfig",
  table: "tableConfig",
  "table.source": "tableConfig",
  "table.rowsText": "tableConfig",
  "table.columns": "tableConfig",
  "table.emptyText": "tableConfig",
  "table.showHeader": "tableConfig",
  "table.stripe": "tableConfig",
  "table.rowHeight": "tableConfig",
  chart: "chartBasic",
  "chart.title": "chartBasic",
  "chart.labelsText": "chartBasic",
  "chart.valuesText": "chartBasic",
  "chart.color": "chartBasic",
  style: "nodeInfo",
  "style.backgroundColor": "nodeInfo",
  "style.borderColor": "nodeInfo",
  geometryShape: "geometryConfig",
  geometryColor: "geometryConfig",
};

export function configTargetsFromPatch(
  patch: Record<string, unknown>
): ConfigRevealTarget[] {
  const out: ConfigRevealTarget[] = [];
  const seen = new Set<string>();

  const push = (field: string) => {
    const section = FIELD_SECTION[field] ?? FIELD_SECTION[field.split(".")[0]!] ?? "nodeInfo";
    if (seen.has(field)) return;
    seen.add(field);
    out.push({ field, section });
  };

  for (const key of Object.keys(patch)) {
    if (key === "table" && patch.table && typeof patch.table === "object") {
      for (const sub of Object.keys(patch.table as object)) {
        push(`table.${sub}`);
      }
      continue;
    }
    if (key === "chart" && patch.chart && typeof patch.chart === "object") {
      for (const sub of Object.keys(patch.chart as object)) {
        push(`chart.${sub}`);
      }
      continue;
    }
    if (key === "style" && patch.style && typeof patch.style === "object") {
      for (const sub of Object.keys(patch.style as object)) {
        push(`style.${sub}`);
      }
      continue;
    }
    push(key);
  }

  return out;
}

const REVEAL_EVENT = "abuilder:reveal-config";

export type RevealConfigDetail = {
  fields: string[];
  sections: string[];
};

export function revealPanelConfig(targets: ConfigRevealTarget[]) {
  if (typeof window === "undefined" || !targets.length) return;
  const detail: RevealConfigDetail = {
    fields: targets.map((t) => t.field),
    sections: [...new Set(targets.map((t) => t.section))],
  };
  window.dispatchEvent(new CustomEvent(REVEAL_EVENT, { detail }));
}

export function revealPanelConfigFromPatch(patch: Record<string, unknown>) {
  revealPanelConfig(configTargetsFromPatch(patch));
}

export function subscribeRevealPanelConfig(
  handler: (detail: RevealConfigDetail) => void
): () => void {
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<RevealConfigDetail>).detail;
    if (!detail) return;
    handler(detail);
  };
  window.addEventListener(REVEAL_EVENT, listener);
  return () => window.removeEventListener(REVEAL_EVENT, listener);
}

export function highlightConfigField(field: string) {
  const el = document.querySelector<HTMLElement>(
    `[data-config-field="${CSS.escape(field)}"]`
  );
  if (!el) return;

  const scrollRoot = el.closest(".scope-config-sidebar") as HTMLElement | null;
  if (scrollRoot) {
    const rootRect = scrollRoot.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const top =
      elRect.top -
      rootRect.top +
      scrollRoot.scrollTop -
      scrollRoot.clientHeight / 3;
    scrollRoot.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  el.classList.add("config-field--highlight");
  window.setTimeout(() => el.classList.remove("config-field--highlight"), 1800);
}
