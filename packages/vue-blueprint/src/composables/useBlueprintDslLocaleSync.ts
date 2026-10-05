import { setBlueprintDslLocale } from "@arronqzy/blueprint-dsl";
import { useI18nOptional } from "@arronqzy/i18n/vue";
import { watch } from "vue";

/**
 * Keeps blueprint-dsl validation / runtime messages in the app locale. `flush: "sync"`
 * updates it before computeds that track the locale are re-evaluated.
 */
export function useBlueprintDslLocaleSync(): void {
  const { locale } = useI18nOptional();
  watch(locale, (next) => setBlueprintDslLocale(next), { immediate: true, flush: "sync" });
}
