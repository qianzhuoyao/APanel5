import {
  computed,
  inject,
  provide,
  ref,
  type App,
  type InjectionKey,
  type Ref,
} from "vue";
import { createTranslator, resolveLocale, writeStoredLocale } from "../core";
import { zhCN } from "../locales/zh-CN";
import { enUS } from "../locales/en-US";
import type { Locale, MessageParams, NestedMessages, TranslateFn } from "../types";
import { LOCALE_STORAGE_KEY } from "../types";

const catalogs: Record<Locale, NestedMessages> = {
  "zh-CN": zhCN as unknown as NestedMessages,
  "en-US": enUS as unknown as NestedMessages,
};

export type I18nState = {
  locale: Ref<Locale>;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
  messages: Ref<NestedMessages>;
};

export const ABUILDER_I18N_KEY: InjectionKey<I18nState> = Symbol("abuilder-i18n");

export type CreateAbuilderI18nOptions = {
  locale?: Locale | null;
  storageKey?: string;
  detectBrowser?: boolean;
};

export function createAbuilderI18n(options: CreateAbuilderI18nOptions = {}): I18nState {
  const storageKey = options.storageKey ?? LOCALE_STORAGE_KEY;
  const locale = ref(
    resolveLocale({
      locale: options.locale,
      storageKey,
      detectBrowser: options.detectBrowser ?? true,
    })
  );

  const messages = computed(() => catalogs[locale.value]);

  const t: TranslateFn = (key, params) => createTranslator(messages.value)(key, params);

  function setLocale(next: Locale) {
    locale.value = next;
    writeStoredLocale(next, storageKey);
  }

  return {
    locale,
    setLocale,
    t,
    messages,
  };
}

export function provideI18n(options?: CreateAbuilderI18nOptions): I18nState {
  const i18n = createAbuilderI18n(options);
  provide(ABUILDER_I18N_KEY, i18n);
  return i18n;
}

/** Vue plugin: app.use(abuilderI18n, { locale: 'en-US' }) */
export const abuilderI18n = {
  install(app: App, options: CreateAbuilderI18nOptions = {}) {
    const i18n = createAbuilderI18n(options);
    app.provide(ABUILDER_I18N_KEY, i18n);
    app.config.globalProperties.$t = i18n.t;
    app.config.globalProperties.$i18n = i18n;
  },
};

export function useI18n(): I18nState {
  const ctx = inject(ABUILDER_I18N_KEY, null);
  if (!ctx) {
    throw new Error("useI18n must be used after provideI18n / abuilderI18n plugin");
  }
  return ctx;
}

export function useI18nOptional(): I18nState {
  const ctx = inject(ABUILDER_I18N_KEY, null);
  if (ctx) return ctx;
  return createAbuilderI18n({ locale: "zh-CN", detectBrowser: false });
}

declare module "vue" {
  interface ComponentCustomProperties {
    $t: TranslateFn;
    $i18n: I18nState;
  }
}
