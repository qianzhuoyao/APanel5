import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createTranslator, isLocale, resolveLocale, writeStoredLocale } from "../core";
import { zhCN } from "../locales/zh-CN";
import { enUS } from "../locales/en-US";
import type { Locale, MessageParams, NestedMessages } from "../types";
import { LOCALE_STORAGE_KEY } from "../types";

const catalogs: Record<Locale, NestedMessages> = {
  "zh-CN": zhCN as unknown as NestedMessages,
  "en-US": enUS as unknown as NestedMessages,
};

export type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: MessageParams) => string;
  messages: NestedMessages;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export type I18nProviderProps = {
  children: ReactNode;
  /** Explicit locale; when omitted, resolve from storage / browser / zh-CN */
  locale?: Locale | null;
  storageKey?: string;
  detectBrowser?: boolean;
  onLocaleChange?: (locale: Locale) => void;
};

export function I18nProvider({
  children,
  locale: localeProp,
  storageKey = LOCALE_STORAGE_KEY,
  detectBrowser = true,
  onLocaleChange,
}: I18nProviderProps) {
  const [localeState, setLocaleState] = useState<Locale>(() =>
    resolveLocale({ locale: localeProp, storageKey, detectBrowser })
  );

  useEffect(() => {
    if (isLocale(localeProp)) setLocaleState(localeProp);
  }, [localeProp]);

  const locale = isLocale(localeProp) ? localeProp : localeState;

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      writeStoredLocale(next, storageKey);
      onLocaleChange?.(next);
    },
    [onLocaleChange, storageKey]
  );

  const messages = catalogs[locale];
  const t = useMemo(() => createTranslator(messages), [messages]);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t, messages }),
    [locale, setLocale, t, messages]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}

/** Safe hook: returns zh-CN translator when outside provider (for utilities). */
export function useI18nOptional(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (ctx) return ctx;
  const messages = catalogs["zh-CN"];
  const t = createTranslator(messages);
  return {
    locale: "zh-CN",
    setLocale: () => undefined,
    t,
    messages,
  };
}
