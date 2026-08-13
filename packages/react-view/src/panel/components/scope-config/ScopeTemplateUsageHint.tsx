import { useI18n } from "@arronqzy/i18n/react";

export function ScopeTemplateUsageHint() {
  const { t } = useI18n();

  return (
    <div className="space-y-2">
      <p>{t("panel.scope.usageHint1")}</p>
      <p>{t("panel.scope.usageHint2")}</p>
    </div>
  );
}
