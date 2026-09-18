import { useI18nOptional as useI18n } from "@arronqzy/i18n/react";
import { cn } from "@arronqzy/ui";
import type { ReactNode } from "react";

export type BlueprintNodeCardProps = {
  nodeId: string;
  label: string;
  meta?: string;
  /** 节点关键配置摘要，显示在名称下方 */
  subtitle?: string;
  /** 调试执行进度（如时钟 2/3） */
  progressLabel?: string;
  variant?: "blueprint" | "view" | "logic" | "and" | "lifecycle" | "event" | "fetch" | "json" | "storage" | "clock";
  selected?: boolean;
  hideLeadingDot?: boolean;
  onSelect?: (nodeId: string) => void;
};

function IconSvg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function VariantIcon({
  variant,
}: {
  variant: NonNullable<BlueprintNodeCardProps["variant"]>;
}) {
  switch (variant) {
    case "logic":
      return (
        <IconSvg>
          <path d="M6 4v6a4 4 0 0 0 4 4h4" />
          <path d="M14 14v6" />
          <circle cx="6" cy="4" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="14" cy="20" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="18" cy="14" r="1.5" fill="currentColor" stroke="none" />
        </IconSvg>
      );
    case "and":
      return (
        <IconSvg>
          <path d="M8 6v12" />
          <path d="M8 12h8" />
          <path d="M16 6v12" />
        </IconSvg>
      );
    case "lifecycle":
      return (
        <IconSvg>
          <circle cx="12" cy="12" r="7" />
          <path d="M12 8v4l2.5 1.5" />
        </IconSvg>
      );
    case "event":
      return (
        <IconSvg>
          <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
        </IconSvg>
      );
    case "fetch":
      return (
        <IconSvg>
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 19h14" />
        </IconSvg>
      );
    case "json":
      return (
        <IconSvg>
          <path d="M8 4c-2 0-3 1.5-3 4s1 4 3 4" />
          <path d="M8 12c-2 0-3 1.5-3 4s1 4 3 4" />
          <path d="M16 4c2 0 3 1.5 3 4s-1 4-3 4" />
          <path d="M16 12c2 0 3 1.5 3 4s-1 4-3 4" />
        </IconSvg>
      );
    case "storage":
      return (
        <IconSvg>
          <ellipse cx="12" cy="6" rx="7" ry="3" />
          <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
          <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </IconSvg>
      );
    case "clock":
      return (
        <IconSvg>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4.5L15 15" />
        </IconSvg>
      );
    case "blueprint":
      return (
        <IconSvg>
          <circle cx="7" cy="7" r="2.5" />
          <circle cx="17" cy="7" r="2.5" />
          <circle cx="12" cy="17" r="2.5" />
          <path d="M9.2 8.2 14.8 8.2" />
          <path d="M8.2 9.2 11 14.8" />
          <path d="M15.8 9.2 13 14.8" />
        </IconSvg>
      );
    case "view":
      return (
        <IconSvg>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 9h18" />
          <path d="M8 14h4" />
        </IconSvg>
      );
    default:
      return (
        <IconSvg>
          <circle cx="7" cy="7" r="2.5" />
          <circle cx="17" cy="7" r="2.5" />
          <circle cx="12" cy="17" r="2.5" />
          <path d="M9.2 8.2 14.8 8.2" />
          <path d="M8.2 9.2 11 14.8" />
          <path d="M15.8 9.2 13 14.8" />
        </IconSvg>
      );
  }
}

export function BlueprintNodeCard({
  nodeId,
  label,
  meta,
  subtitle,
  progressLabel,
  variant = "blueprint",
  selected = false,
  onSelect,
}: BlueprintNodeCardProps) {
  const { t } = useI18n();
  const showMeta = Boolean(meta && meta !== label);

  return (
    <div
      data-blueprint-node-card
      className={cn(
        "bp-node-card bp-flow-drag-handle",
        selected && "bp-node-card--selected"
      )}
      title={t("blueprint.node.dragToMove")}
    >
      <button
        type="button"
        className="bp-node-card__body"
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(nodeId);
        }}
      >
        <span
          className={cn("bp-node-icon", `bp-node-icon--${variant}`)}
          aria-hidden="true"
        >
          <VariantIcon variant={variant} />
        </span>
        <div className="bp-node-card__content">
          <div className="bp-node-card__title-row">
            <div className="bp-node-card__title">{label}</div>
            {progressLabel ? (
              <span
                className={cn(
                  "bp-node-card__badge",
                  `bp-node-card__badge--${variant}`
                )}
                title={t("blueprint.node.signalSentCount")}
              >
                {progressLabel}
              </span>
            ) : null}
          </div>
          {showMeta ? (
            <div className="bp-node-card__meta" title={meta}>
              {meta}
            </div>
          ) : null}
          {subtitle ? (
            <div className="bp-node-card__subtitle" title={subtitle}>
              {subtitle}
            </div>
          ) : null}
        </div>
      </button>
    </div>
  );
}
