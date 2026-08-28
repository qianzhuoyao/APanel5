import { I18nProvider } from "@arronqzy/i18n/react";
import { LOCALE_STORAGE_KEY } from "@arronqzy/i18n";
import { appStorageKey } from "@arronqzy/blueprint-dsl";
import type { Locale } from "@arronqzy/i18n";
import type { ReactNode } from "react";

export type I18nRootProps = {
  children: ReactNode;
  locale?: Locale | null;
  onLocaleChange?: (locale: Locale) => void;
  nameSpace?: string | null;
};

/** Ensures panel / preview subtree always has i18n context (host apps, duplicate package graphs). */
export function I18nRoot({
  children,
  locale,
  onLocaleChange,
  nameSpace,
}: I18nRootProps) {
  return (
    <I18nProvider
      locale={locale}
      onLocaleChange={onLocaleChange}
      storageKey={appStorageKey(LOCALE_STORAGE_KEY, nameSpace)}
    >
      {children}
    </I18nProvider>
  );
}

export { I18nProvider } from "@arronqzy/i18n/react";
export type { Locale } from "@arronqzy/i18n";
