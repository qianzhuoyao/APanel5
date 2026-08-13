import type { Locale, MessageParams, NestedMessages } from "./types";
import { LOCALE_STORAGE_KEY } from "./types";

function getByPath(messages: NestedMessages, path: string): string | undefined {
  const parts = path.split(".");
  let cur: string | NestedMessages | undefined = messages;
  for (const part of parts) {
    if (cur == null || typeof cur === "string") return undefined;
    cur = cur[part];
  }
  return typeof cur === "string" ? cur : undefined;
}

export function interpolate(template: string, params?: MessageParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = params[key];
    return value == null ? "" : String(value);
  });
}

export function createTranslator(messages: NestedMessages) {
  return function t(key: string, params?: MessageParams): string {
    const raw = getByPath(messages, key);
    if (raw == null) {
      if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
        console.warn(`[i18n] missing key: ${key}`);
      }
      return key;
    }
    return interpolate(raw, params);
  };
}

export function isLocale(value: unknown): value is Locale {
  return value === "zh-CN" || value === "en-US";
}

export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "zh-CN";
  const lang = (navigator.language || "").toLowerCase();
  return lang.startsWith("zh") ? "zh-CN" : "en-US";
}

export function readStoredLocale(storageKey = LOCALE_STORAGE_KEY): Locale | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey);
    return isLocale(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function writeStoredLocale(locale: Locale, storageKey = LOCALE_STORAGE_KEY): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(storageKey, locale);
  } catch {
    /* ignore quota / private mode */
  }
}

export type ResolveLocaleOptions = {
  /** Explicit prop wins when set */
  locale?: Locale | null;
  storageKey?: string;
  /** When true, use browser language if nothing else (default true) */
  detectBrowser?: boolean;
  fallback?: Locale;
};

/**
 * Priority: explicit locale → localStorage → browser → fallback (zh-CN)
 */
export function resolveLocale(options: ResolveLocaleOptions = {}): Locale {
  const {
    locale,
    storageKey = LOCALE_STORAGE_KEY,
    detectBrowser = true,
    fallback = "zh-CN",
  } = options;
  if (isLocale(locale)) return locale;
  const stored = readStoredLocale(storageKey);
  if (stored) return stored;
  if (detectBrowser) return detectBrowserLocale();
  return fallback;
}
