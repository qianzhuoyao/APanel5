export type Locale = "zh-CN" | "en-US";

export const LOCALES: Locale[] = ["zh-CN", "en-US"];

export const LOCALE_STORAGE_KEY = "abuilder.locale";

export type MessageParams = Record<string, string | number | boolean | null | undefined>;

export type TranslateFn = (key: string, params?: MessageParams) => string;

export type NestedMessages = {
  [key: string]: string | NestedMessages;
};
