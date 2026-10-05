export type {
  Locale,
  MessageParams,
  NestedMessages,
  TranslateFn,
} from "./types";
export { LOCALES, LOCALE_STORAGE_KEY } from "./types";
export {
  createTranslator,
  interpolate,
  resolveLocale,
  detectBrowserLocale,
  readStoredLocale,
  writeStoredLocale,
  isLocale,
} from "./core";
export { zhCN } from "./locales/zh-CN";
export { enUS } from "./locales/en-US";
export type { MessageCatalog } from "./locales/zh-CN";

import { createTranslator, getByPath } from "./core";
import { zhCN } from "./locales/zh-CN";
import { enUS } from "./locales/en-US";
import type { Locale, MessageParams, NestedMessages, TranslateFn } from "./types";

const catalogs: Record<Locale, NestedMessages> = {
  "zh-CN": zhCN as unknown as NestedMessages,
  "en-US": enUS as unknown as NestedMessages,
};

export function getMessages(locale: Locale): NestedMessages {
  return catalogs[locale];
}

export function tForLocale(locale: Locale) {
  return createTranslator(catalogs[locale]);
}

const templateMatchers = new Map<string, RegExp>();
/** Counter-like params only match digits, so "Layer cake" is not taken for "Layer {n}". */
const NUMERIC_PARAMS = new Set(["n", "index", "count"]);

function templateMatcher(template: string): RegExp {
  let matcher = templateMatchers.get(template);
  if (!matcher) {
    const pattern = template
      .split(/(\{\w+\})/)
      .map((part) => {
        const param = /^\{(\w+)\}$/.exec(part)?.[1];
        if (param) return `(?<${param}>${NUMERIC_PARAMS.has(param) ? "\\d+" : ".+?"})`;
        return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      })
      .join("");
    matcher = new RegExp(`^${pattern}$`);
    templateMatchers.set(template, matcher);
  }
  return matcher;
}

/**
 * When `value` equals the message `key` rendered in any locale (e.g. a default name
 * persisted as "图层2"), returns its params; otherwise `null`.
 */
export function matchMessageInAnyLocale(value: string, key: string): MessageParams | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  for (const locale of Object.keys(catalogs) as Locale[]) {
    const template = getByPath(catalogs[locale], key);
    if (!template) continue;
    const match = templateMatcher(template).exec(trimmed);
    if (match) return { ...match.groups };
  }
  return null;
}

/**
 * Re-renders a persisted default text in the current locale; user-edited text is kept.
 * The first matching key wins.
 */
export function relocalizeMessage(value: string, keys: string | string[], t: TranslateFn): string {
  for (const key of Array.isArray(keys) ? keys : [keys]) {
    const params = matchMessageInAnyLocale(value, key);
    if (params) return t(key, params);
  }
  return value;
}
