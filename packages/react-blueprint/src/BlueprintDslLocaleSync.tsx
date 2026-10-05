import { setBlueprintDslLocale } from "@arronqzy/blueprint-dsl";
import { useI18nOptional } from "@arronqzy/i18n/react";
import type { ReactNode } from "react";

/**
 * Keeps blueprint-dsl validation / runtime messages in the app locale. Sets it during
 * render so descendants re-rendering for the same locale change already see it.
 */
export function BlueprintDslLocaleSync({ children }: { children: ReactNode }) {
  const { locale } = useI18nOptional();
  setBlueprintDslLocale(locale);
  return <>{children}</>;
}
