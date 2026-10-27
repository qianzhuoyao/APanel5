import { useI18n } from "@arronqzy/i18n/react";
import { TemplateConceptText } from "@arronqzy/react-blueprint";

export function ScopeTemplateUsageHint() {
  const { t } = useI18n();

  return (
    <div className="space-y-2">
      <p><TemplateConceptText text={t("panel.scope.usageHint1")} /></p>
      <p><TemplateConceptText text={t("panel.scope.usageHint2")} /></p>
      <p><TemplateConceptText text={t("panel.scope.usageHintSystem")} /></p>
    </div>
  );
}
