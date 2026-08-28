/** Supported panel material types (MaterialSidebar). */
export const PANEL_MATERIAL_TYPES = [
  "bar",
  "line",
  "pie",
  "area",
  "scatter",
  "radar",
  "gauge",
  "funnel",
  "text",
  "table",
  "geometry",
  "scene3d",
  "grid",
  "viewport",
  "image",
  "reference",
  "video",
  "audio",
] as const;

export type PanelMaterialType = (typeof PANEL_MATERIAL_TYPES)[number];

export const BLUEPRINT_NODE_ALIASES = [
  "blueprint",
  "logic",
  "lifecycle",
  "clock",
  "timer",
  "fetch",
  "json",
  "storage",
  "and",
  "event",
] as const;

export type BlueprintNodeAlias = (typeof BLUEPRINT_NODE_ALIASES)[number];

export type ZOrderAction = "front" | "back" | "forward" | "backward";

export type AssistantAction =
  | { type: "reply"; message: string }
  | { type: "agent.done"; message: string }
  | { type: "agent.fail"; message: string }
  | {
      type: "panel.add";
      materialType: string;
      x?: number;
      y?: number;
      patch?: Record<string, unknown>;
      message?: string;
    }
  | {
      type: "panel.update";
      id: string;
      patch: Record<string, unknown>;
      message?: string;
    }
  | { type: "panel.remove"; id: string; message?: string }
  | { type: "panel.select"; ids: string[]; message?: string }
  | { type: "panel.duplicate"; id: string; message?: string }
  | { type: "panel.lock"; id: string; locked: boolean; message?: string }
  | {
      type: "panel.zOrder";
      ids?: string[];
      action: ZOrderAction;
      message?: string;
    }
  | { type: "panel.batch"; actions: AssistantAction[]; message?: string }
  | { type: "layer.setActive"; id: string; message?: string }
  | { type: "layer.add"; name?: string; message?: string }
  | { type: "layer.rename"; id: string; name: string; message?: string }
  | { type: "layer.lock"; id: string; locked: boolean; message?: string }
  | { type: "layer.delete"; id: string; message?: string }
  | {
      type: "viewport.zoom";
      /** absolute zoom, or relative delta when mode=delta */
      value: number;
      mode?: "absolute" | "delta";
      message?: string;
    }
  | { type: "viewport.fit"; message?: string }
  | { type: "history.undo"; message?: string }
  | { type: "history.redo"; message?: string }
  | {
      type: "blueprint.addNode";
      nodeType: string;
      label?: string;
      position?: { x: number; y: number };
      props?: Record<string, unknown>;
      message?: string;
    }
  | {
      type: "blueprint.connect";
      sourceId: string;
      targetId: string;
      sourcePort?: string;
      targetPort?: string;
      message?: string;
    }
  | { type: "blueprint.removeNode"; id: string; message?: string }
  | {
      type: "blueprint.updateNode";
      id: string;
      patch: Record<string, unknown>;
      message?: string;
    }
  | { type: "blueprint.removeEdge"; id: string; message?: string }
  | { type: "blueprint.open"; open?: boolean; message?: string }
  | { type: "blueprint.runAll"; message?: string }
  | { type: "workspace.save"; message?: string }
  | { type: "workspace.sync"; message?: string }
  | { type: "workspace.create"; name?: string; message?: string }
  | { type: "workspace.open"; id: string; message?: string }
  | { type: "workspace.preview"; id?: string; message?: string }
  | { type: "io.exportPanel"; message?: string }
  | { type: "io.importPanelJson"; json: string; message?: string }
  | { type: "ui.setTheme"; theme: "light" | "dark"; message?: string }
  | { type: "ui.setLocale"; locale: "zh-CN" | "en-US"; message?: string }
  | {
      type: "ui.setPanelFontSize";
      size: "sm" | "md" | "lg";
      message?: string;
    };

export type ActionParseResult =
  | { ok: true; action: AssistantAction; rawText: string }
  | { ok: false; error: string; rawText: string };

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function optMessage(raw: Record<string, unknown>): string | undefined {
  return typeof raw.message === "string" ? raw.message : undefined;
}

function extractJsonObject(text: string): unknown | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const candidates: string[] = [trimmed];
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) candidates.push(fenced[1].trim());
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    candidates.push(trimmed.slice(start, end + 1));
  }

  for (const raw of candidates) {
    const parsed = tryParseJson(raw);
    if (parsed != null) return parsed;
  }
  return null;
}

function tryParseJson(raw: string): unknown | null {
  const attempts = [
    raw,
    // trailing commas before } or ]
    raw.replace(/,\s*([}\]])/g, "$1"),
    // smart quotes → plain
    raw.replace(/[“”]/g, '"').replace(/[‘’]/g, "'"),
  ];
  for (const s of attempts) {
    try {
      return JSON.parse(s);
    } catch {
      // continue
    }
  }
  return null;
}

function parseOne(raw: unknown, depth = 0): AssistantAction | null {
  if (depth > 6 || !isPlainObject(raw)) return null;
  const type = String(raw.type ?? "");
  switch (type) {
    case "reply":
      return { type: "reply", message: String(raw.message ?? "") };
    case "agent.done":
      return { type: "agent.done", message: String(raw.message ?? "done") };
    case "agent.fail":
      return { type: "agent.fail", message: String(raw.message ?? "failed") };
    case "panel.add": {
      const materialType =
        normalizeMaterialType(String(raw.materialType ?? "")) ??
        String(raw.materialType ?? "");
      return {
        type: "panel.add",
        materialType,
        x: typeof raw.x === "number" ? raw.x : undefined,
        y: typeof raw.y === "number" ? raw.y : undefined,
        patch: isPlainObject(raw.patch) ? raw.patch : undefined,
        message: optMessage(raw),
      };
    }
    case "panel.update":
      if (typeof raw.id !== "string" || !isPlainObject(raw.patch)) return null;
      return {
        type: "panel.update",
        id: raw.id,
        patch: raw.patch,
        message: optMessage(raw),
      };
    case "panel.remove":
      if (typeof raw.id !== "string") return null;
      return { type: "panel.remove", id: raw.id, message: optMessage(raw) };
    case "panel.select": {
      const ids = Array.isArray(raw.ids)
        ? raw.ids.filter((id): id is string => typeof id === "string")
        : typeof raw.id === "string"
          ? [raw.id]
          : null;
      if (!ids) return null;
      return { type: "panel.select", ids, message: optMessage(raw) };
    }
    case "panel.duplicate":
      if (typeof raw.id !== "string") return null;
      return { type: "panel.duplicate", id: raw.id, message: optMessage(raw) };
    case "panel.lock":
      if (typeof raw.id !== "string" || typeof raw.locked !== "boolean") return null;
      return {
        type: "panel.lock",
        id: raw.id,
        locked: raw.locked,
        message: optMessage(raw),
      };
    case "panel.zOrder": {
      const action = String(raw.action ?? "") as ZOrderAction;
      if (!["front", "back", "forward", "backward"].includes(action)) return null;
      const ids = Array.isArray(raw.ids)
        ? raw.ids.filter((id): id is string => typeof id === "string")
        : undefined;
      return { type: "panel.zOrder", ids, action, message: optMessage(raw) };
    }
    case "panel.batch": {
      if (!Array.isArray(raw.actions)) return null;
      const actions: AssistantAction[] = [];
      for (const item of raw.actions) {
        const parsed = parseOne(item, depth + 1);
        if (!parsed) return null;
        actions.push(parsed);
      }
      return { type: "panel.batch", actions, message: optMessage(raw) };
    }
    case "layer.setActive":
      if (typeof raw.id !== "string") return null;
      return { type: "layer.setActive", id: raw.id, message: optMessage(raw) };
    case "layer.add":
      return {
        type: "layer.add",
        name: typeof raw.name === "string" ? raw.name : undefined,
        message: optMessage(raw),
      };
    case "layer.rename":
      if (typeof raw.id !== "string" || typeof raw.name !== "string") return null;
      return {
        type: "layer.rename",
        id: raw.id,
        name: raw.name,
        message: optMessage(raw),
      };
    case "layer.lock":
      if (typeof raw.id !== "string" || typeof raw.locked !== "boolean") return null;
      return {
        type: "layer.lock",
        id: raw.id,
        locked: raw.locked,
        message: optMessage(raw),
      };
    case "layer.delete":
      if (typeof raw.id !== "string") return null;
      return { type: "layer.delete", id: raw.id, message: optMessage(raw) };
    case "viewport.zoom":
      if (typeof raw.value !== "number") return null;
      return {
        type: "viewport.zoom",
        value: raw.value,
        mode: raw.mode === "delta" ? "delta" : "absolute",
        message: optMessage(raw),
      };
    case "viewport.fit":
      return { type: "viewport.fit", message: optMessage(raw) };
    case "history.undo":
      return { type: "history.undo", message: optMessage(raw) };
    case "history.redo":
      return { type: "history.redo", message: optMessage(raw) };
    case "blueprint.addNode":
      return {
        type: "blueprint.addNode",
        nodeType: String(raw.nodeType ?? "logic"),
        label: typeof raw.label === "string" ? raw.label : undefined,
        position:
          isPlainObject(raw.position) &&
          typeof raw.position.x === "number" &&
          typeof raw.position.y === "number"
            ? { x: raw.position.x, y: raw.position.y }
            : undefined,
        props: isPlainObject(raw.props) ? raw.props : undefined,
        message: optMessage(raw),
      };
    case "blueprint.connect":
      if (typeof raw.sourceId !== "string" || typeof raw.targetId !== "string") {
        return null;
      }
      return {
        type: "blueprint.connect",
        sourceId: raw.sourceId,
        targetId: raw.targetId,
        sourcePort: typeof raw.sourcePort === "string" ? raw.sourcePort : undefined,
        targetPort: typeof raw.targetPort === "string" ? raw.targetPort : undefined,
        message: optMessage(raw),
      };
    case "blueprint.removeNode":
      if (typeof raw.id !== "string") return null;
      return { type: "blueprint.removeNode", id: raw.id, message: optMessage(raw) };
    case "blueprint.updateNode":
      if (typeof raw.id !== "string" || !isPlainObject(raw.patch)) return null;
      return {
        type: "blueprint.updateNode",
        id: raw.id,
        patch: raw.patch,
        message: optMessage(raw),
      };
    case "blueprint.removeEdge":
      if (typeof raw.id !== "string") return null;
      return { type: "blueprint.removeEdge", id: raw.id, message: optMessage(raw) };
    case "blueprint.open":
      return {
        type: "blueprint.open",
        open: typeof raw.open === "boolean" ? raw.open : true,
        message: optMessage(raw),
      };
    case "blueprint.runAll":
      return { type: "blueprint.runAll", message: optMessage(raw) };
    case "workspace.save":
      return { type: "workspace.save", message: optMessage(raw) };
    case "workspace.sync":
      return { type: "workspace.sync", message: optMessage(raw) };
    case "workspace.create":
      return {
        type: "workspace.create",
        name: typeof raw.name === "string" ? raw.name : undefined,
        message: optMessage(raw),
      };
    case "workspace.open":
      if (typeof raw.id !== "string") return null;
      return { type: "workspace.open", id: raw.id, message: optMessage(raw) };
    case "workspace.preview":
      return {
        type: "workspace.preview",
        id: typeof raw.id === "string" ? raw.id : undefined,
        message: optMessage(raw),
      };
    case "io.exportPanel":
      return { type: "io.exportPanel", message: optMessage(raw) };
    case "io.importPanelJson":
      if (typeof raw.json !== "string") return null;
      return {
        type: "io.importPanelJson",
        json: raw.json,
        message: optMessage(raw),
      };
    case "ui.setTheme":
      if (raw.theme !== "light" && raw.theme !== "dark") return null;
      return { type: "ui.setTheme", theme: raw.theme, message: optMessage(raw) };
    case "ui.setLocale":
      if (raw.locale !== "zh-CN" && raw.locale !== "en-US") return null;
      return {
        type: "ui.setLocale",
        locale: raw.locale,
        message: optMessage(raw),
      };
    case "ui.setPanelFontSize":
      if (raw.size !== "sm" && raw.size !== "md" && raw.size !== "lg") return null;
      return {
        type: "ui.setPanelFontSize",
        size: raw.size,
        message: optMessage(raw),
      };
    default:
      return null;
  }
}

/** Parse model output into a single AssistantAction. Plain text becomes reply. */
export function parseAssistantAction(text: string): ActionParseResult {
  const rawText = text ?? "";
  const json = extractJsonObject(rawText);
  if (json == null) {
    const message = rawText.trim();
    if (!message) {
      return { ok: false, error: "empty_response", rawText };
    }
    return { ok: true, action: { type: "reply", message }, rawText };
  }
  const action = parseOne(json);
  if (!action) {
    return { ok: false, error: "invalid_action_schema", rawText };
  }
  return { ok: true, action, rawText };
}

export function isKnownMaterialType(type: string): type is PanelMaterialType {
  return (PANEL_MATERIAL_TYPES as readonly string[]).includes(type);
}

/** Map Chinese / casual names to canonical materialType. */
export function normalizeMaterialType(raw: string): PanelMaterialType | null {
  const t = raw.trim().toLowerCase();
  if (!t) return null;
  if (isKnownMaterialType(t)) return t;

  const aliases: Array<[RegExp, PanelMaterialType]> = [
    [/^(table|表格|列表|数据表)$/, "table"],
    [/^(text|文本|文字|标题|文案)$/, "text"],
    [/^(grid|网格|宫格)$/, "grid"],
    [/^(image|img|图片|图像)$/, "image"],
    [/^(video|视频)$/, "video"],
    [/^(audio|音频|音乐)$/, "audio"],
    [/^(geometry|几何|图形|形状)$/, "geometry"],
    [/^(scene3d|3d|三维|产品展示|数字孪生|沙盘)$/, "scene3d"],
    [/^(reference|引用|参照)$/, "reference"],
    [/^(bar|柱状|柱图|柱状图)$/, "bar"],
    [/^(line|折线|折线图)$/, "line"],
    [/^(pie|饼图|饼状图|饼)$/, "pie"],
    [/^(area|面积|面积图)$/, "area"],
    [/^(scatter|散点|散点图)$/, "scatter"],
    [/^(radar|雷达|雷达图)$/, "radar"],
    [/^(gauge|仪表|仪表盘)$/, "gauge"],
    [/^(funnel|漏斗|漏斗图)$/, "funnel"],
  ];
  for (const [re, type] of aliases) {
    if (re.test(t)) return type;
  }
  if (/表格|table/.test(t)) return "table";
  if (/文本|标题|文字/.test(t)) return "text";
  if (/柱状/.test(t)) return "bar";
  if (/折线/.test(t)) return "line";
  if (/饼图|饼状图/.test(t)) return "pie";
  if (/面积图/.test(t)) return "area";
  if (/散点/.test(t)) return "scatter";
  if (/雷达/.test(t)) return "radar";
  if (/仪表/.test(t)) return "gauge";
  if (/漏斗/.test(t)) return "funnel";
  if (/图片/.test(t)) return "image";
  if (/网格|宫格/.test(t)) return "grid";
  return null;
}

/**
 * Deterministic fallback: when user clearly asks to add a widget,
 * build panel.add without relying on the small local model.
 */
export function inferPanelAddFromUserText(text: string): Extract<
  AssistantAction,
  { type: "panel.add" }
> | null {
  const s = text.trim();
  if (!s) return null;
  if (!/(加|添加|放一|创建一个|新建一个|帮我做|放入)/.test(s)) return null;
  if (/是什么|怎么用|如何用|有哪些/.test(s) && !/(加|添加)/.test(s)) return null;

  // Charts before geometry/图形 to avoid「饼状图」被当成 geometry。
  const guesses: Array<[RegExp, PanelMaterialType, string]> = [
    [/表格|table/, "table", "表格"],
    [/文本|标题|文字|text/, "text", "文本"],
    [/网格|宫格|grid/, "grid", "网格"],
    [/图片|image/, "image", "图片"],
    [/视频|video/, "video", "视频"],
    [/音频|audio/, "audio", "音频"],
    [/柱状图?|bar图?/, "bar", "柱状图"],
    [/折线图?|line图?/, "line", "折线图"],
    [/饼状图|饼形图|饼图|pie\s*chart|pie/, "pie", "饼图"],
    [/面积图|area/, "area", "面积图"],
    [/散点图?|scatter/, "scatter", "散点图"],
    [/雷达图?|radar/, "radar", "雷达图"],
    [/仪表盘?|gauge/, "gauge", "仪表盘"],
    [/漏斗图?|funnel/, "funnel", "漏斗图"],
    [/几何|geometry/, "geometry", "几何"],
  ];

  for (const [re, materialType, label] of guesses) {
    if (!re.test(s)) continue;
    const patch: Record<string, unknown> = { name: label };
    if (materialType === "text") {
      patch.textHtml = "<p>标题</p>";
    }
    if (
      materialType === "bar" ||
      materialType === "line" ||
      materialType === "pie" ||
      materialType === "area" ||
      materialType === "scatter" ||
      materialType === "radar" ||
      materialType === "gauge" ||
      materialType === "funnel"
    ) {
      patch.chart = {
        title: label,
        labelsText: '["A","B","C"]',
        valuesText: "[30,50,20]",
      };
      if (materialType === "pie" || materialType === "gauge") {
        patch.width = 320;
        patch.height = 320;
      } else {
        patch.width = 420;
        patch.height = 280;
      }
    }
    return {
      type: "panel.add",
      materialType,
      x: 220 + Math.round(Math.random() * 40),
      y: 160 + Math.round(Math.random() * 40),
      patch,
      message: `已添加${label}组件`,
    };
  }
  return null;
}

export function normalizeBlueprintNodeAlias(nodeType: string): BlueprintNodeAlias | null {
  const t = nodeType.trim().toLowerCase();
  if (t === "timer" || t === "clock") return "clock";
  if (t === "cache" || t === "localstorage" || t === "sessionstorage") return "storage";
  if ((BLUEPRINT_NODE_ALIASES as readonly string[]).includes(t)) {
    return t as BlueprintNodeAlias;
  }
  return null;
}

/** True when the action ends the agent loop. */
export function isTerminalAgentAction(action: AssistantAction): boolean {
  return (
    action.type === "agent.done" ||
    action.type === "agent.fail" ||
    action.type === "reply"
  );
}
