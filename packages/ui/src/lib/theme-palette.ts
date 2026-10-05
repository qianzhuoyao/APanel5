import chroma, { type Color } from "chroma-js";

export type ThemeMode = "light" | "dark";

export const THEME_TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
] as const;

export type ThemeToken = (typeof THEME_TOKENS)[number];

/** Any color string chroma-js can parse (hex, rgb(), hsl(), named…). */
export type ThemeColors = Record<ThemeToken, string>;

export type ThemePaletteOptions = {
  /** Brand color; `primary-foreground` and `ring` are derived from it. */
  primary?: string | Partial<Record<ThemeMode, string>>;
  overrides?: Partial<Record<ThemeMode, Partial<ThemeColors>>>;
};

export const BASE_THEME_COLORS: Record<ThemeMode, ThemeColors> = {
  light: {
    background: "#ffffff",
    foreground: "#020817",
    card: "#ffffff",
    "card-foreground": "#020817",
    popover: "#ffffff",
    "popover-foreground": "#020817",
    primary: "#0f172a",
    "primary-foreground": "#f8fafc",
    secondary: "#f1f5f9",
    "secondary-foreground": "#0f172a",
    muted: "#f1f5f9",
    "muted-foreground": "#64748b",
    accent: "#f1f5f9",
    "accent-foreground": "#0f172a",
    destructive: "#ef4444",
    "destructive-foreground": "#f8fafc",
    border: "#e2e8f0",
    input: "#e2e8f0",
    ring: "#020817",
  },
  dark: {
    background: "#020817",
    foreground: "#f8fafc",
    card: "#020817",
    "card-foreground": "#f8fafc",
    popover: "#020817",
    "popover-foreground": "#f8fafc",
    primary: "#f8fafc",
    "primary-foreground": "#0f172a",
    secondary: "#1e293b",
    "secondary-foreground": "#f8fafc",
    muted: "#1e293b",
    "muted-foreground": "#94a3b8",
    accent: "#1e293b",
    "accent-foreground": "#f8fafc",
    destructive: "#f87171",
    "destructive-foreground": "#0f172a",
    border: "#1e293b",
    input: "#1e293b",
    ring: "#cbd5e1",
  },
};

type ContrastRule = { token: ThemeToken; against: ThemeToken[]; min: number };

/**
 * Applied in order: a token is only adjusted against tokens that are already final,
 * so surfaces come first, then fills, then the text drawn on top of them.
 */
const CONTRAST_RULES: ContrastRule[] = [
  { token: "foreground", against: ["background"], min: 7 },
  { token: "card-foreground", against: ["card"], min: 7 },
  { token: "popover-foreground", against: ["popover"], min: 7 },
  { token: "primary", against: ["background"], min: 3 },
  { token: "destructive", against: ["background", "card"], min: 4.5 },
  { token: "ring", against: ["background"], min: 3 },
  { token: "primary-foreground", against: ["primary"], min: 4.5 },
  { token: "secondary-foreground", against: ["secondary"], min: 4.5 },
  { token: "accent-foreground", against: ["accent"], min: 4.5 },
  { token: "destructive-foreground", against: ["destructive"], min: 4.5 },
  { token: "muted-foreground", against: ["background", "card", "muted", "accent"], min: 4.5 },
  { token: "border", against: ["background"], min: 1.2 },
  { token: "input", against: ["background"], min: 1.5 },
];

const LIGHTNESS_STEP = 0.005;
const CHROMA_STEP = 0.002;

function minContrast(color: Color, against: Color[]): number {
  return Math.min(...against.map((bg) => chroma.contrast(color, bg)));
}

/** Drops chroma until the color fits sRGB; clipping would otherwise shift the hue. */
function inGamutOklch(l: number, c: number, h: number): Color {
  let chromaValue = c;
  let candidate = chroma.oklch(l, chromaValue, h);
  while (candidate.clipped() && chromaValue > 0) {
    chromaValue = Math.max(0, chromaValue - CHROMA_STEP);
    candidate = chroma.oklch(l, chromaValue, h);
  }
  return candidate;
}

function walkLightness(
  color: Color,
  against: Color[],
  min: number,
  direction: 1 | -1,
): Color | null {
  const [l, c, h] = color.oklch();
  const hue = Number.isNaN(h) ? 0 : h;
  for (let next = l; next >= 0 && next <= 1; next += direction * LIGHTNESS_STEP) {
    const candidate = inGamutOklch(next, c, hue);
    if (minContrast(candidate, against) >= min) return candidate;
  }
  return null;
}

/**
 * Nudges `color` along OKLCH lightness (hue and chroma kept) until it reaches `min`
 * contrast against every color in `against`. Moves away from the backgrounds first and
 * flips direction only when that side cannot satisfy the target.
 */
export function ensureContrast(color: string | Color, against: Array<string | Color>, min: number): Color {
  const fg = chroma(color);
  const bgs = against.map((bg) => chroma(bg));
  if (minContrast(fg, bgs) >= min) return fg;

  const bgLuminance = bgs.reduce((sum, bg) => sum + bg.luminance(), 0) / bgs.length;
  const preferred: 1 | -1 = fg.luminance() >= bgLuminance ? 1 : -1;
  const result =
    walkLightness(fg, bgs, min, preferred) ?? walkLightness(fg, bgs, min, preferred === 1 ? -1 : 1);
  if (result) return result;

  const extremes = [chroma("#ffffff"), chroma("#000000")];
  return extremes.reduce((best, c) => (minContrast(c, bgs) > minContrast(best, bgs) ? c : best));
}

/** Best of near-white / near-black text for a fill color. */
function readableOn(fill: Color, light: string, dark: string): string {
  return chroma.contrast(light, fill) >= chroma.contrast(dark, fill) ? light : dark;
}

function resolvePrimary(option: ThemePaletteOptions["primary"], mode: ThemeMode): string | undefined {
  if (!option) return undefined;
  return typeof option === "string" ? option : option[mode];
}

export function createThemeColors(mode: ThemeMode, options: ThemePaletteOptions = {}): Record<ThemeToken, Color> {
  const base = BASE_THEME_COLORS[mode];
  const source: ThemeColors = { ...base };

  const primary = resolvePrimary(options.primary, mode);
  if (primary && chroma.valid(primary)) {
    source.primary = primary;
    source["primary-foreground"] = readableOn(
      chroma(primary),
      BASE_THEME_COLORS.light["primary-foreground"],
      BASE_THEME_COLORS.dark["primary-foreground"],
    );
    source.ring = primary;
  }

  for (const [token, value] of Object.entries(options.overrides?.[mode] ?? {})) {
    if (value && chroma.valid(value)) source[token as ThemeToken] = value;
  }

  const colors = Object.fromEntries(
    THEME_TOKENS.map((token) => [token, chroma(source[token])]),
  ) as Record<ThemeToken, Color>;

  for (const rule of CONTRAST_RULES) {
    colors[rule.token] = ensureContrast(
      colors[rule.token],
      rule.against.map((token) => colors[token]),
      rule.min,
    );
  }
  return colors;
}

const round = (value: number) => Math.round(value * 10) / 10;

/** Formats a color as the `H S% L%` triplet consumed by `hsl(var(--token))`. */
export function toHslTriplet(color: Color): string {
  const [h, s, l] = color.hsl();
  const hue = Number.isNaN(h) ? 0 : h;
  const sat = Number.isNaN(s) ? 0 : s;
  return `${round(hue)} ${round(sat * 100)}% ${round(l * 100)}%`;
}

export function createThemePalette(mode: ThemeMode, options?: ThemePaletteOptions): Record<ThemeToken, string> {
  const colors = createThemeColors(mode, options);
  return Object.fromEntries(
    THEME_TOKENS.map((token) => [token, toHslTriplet(colors[token])]),
  ) as Record<ThemeToken, string>;
}

function toCssBlock(selector: string, palette: Record<ThemeToken, string>): string {
  const lines = THEME_TOKENS.map((token) => `  --${token}: ${palette[token]};`);
  return `${selector} {\n${lines.join("\n")}\n}`;
}

export function buildThemePaletteCss(options?: ThemePaletteOptions): string {
  return [
    toCssBlock(":root", createThemePalette("light", options)),
    toCssBlock(".dark", createThemePalette("dark", options)),
  ].join("\n");
}
