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

import { createTranslator } from "./core";
import { zhCN } from "./locales/zh-CN";
import { enUS } from "./locales/en-US";
import type { Locale, NestedMessages } from "./types";

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
