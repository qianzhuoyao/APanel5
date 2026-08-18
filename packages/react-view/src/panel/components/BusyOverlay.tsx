import { createPortal } from "react-dom";
import { useI18n } from "@arronqzy/i18n/react";
import { useBusyOverlayMessage } from "../utils/async-work";

export function BusyOverlay() {
  const { t } = useI18n();
  const message = useBusyOverlayMessage();
  if (!message || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-black/45 px-6"
      style={{ zIndex: 40000 }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      <div className="max-w-sm text-center text-sm text-white">
        {message || t("common.loading")}
      </div>
    </div>,
    document.body
  );
}
