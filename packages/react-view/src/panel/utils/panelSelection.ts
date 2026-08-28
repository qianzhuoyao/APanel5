export function formatRelativeTime(
  timestamp: number,
  now: number,
  t: (key: string, params?: Record<string, string | number>) => string
): string {
  const diff = Math.max(0, now - timestamp);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return t("common.secondsAgo", { sec });
  const min = Math.floor(sec / 60);
  if (min < 60) return t("common.minutesAgo", { min });
  const hour = Math.floor(min / 60);
  if (hour < 24) return t("common.hoursAgo", { hour });
  const day = Math.floor(hour / 24);
  return t("common.daysAgo", { day });
}

export function getSelectedTargetsFromIds(
  container: HTMLElement | null,
  ids: string[],
) {
  if (!container) return [];
  const targets: HTMLElement[] = [];
  for (const id of ids) {
    const el = container.querySelector<HTMLElement>(
      `[data-element-id="${id}"]`,
    );
    if (el) targets.push(el);
  }
  return targets;
}

export function shouldClearSelectionOnBlank(target: HTMLElement | null) {
  if (!target) return false;
  if (
    target.closest(".rv-selectable") ||
    target.closest(".moveable-control-box") ||
    target.closest(".moveable-group") ||
    target.closest(".moveable-line") ||
    target.closest(".moveable-control") ||
    target.closest(".moveable-direction")
  ) {
    return false;
  }
  if (
    target.closest("button") ||
    target.closest("input") ||
    target.closest("select") ||
    target.closest("textarea") ||
    target.closest("label") ||
    target.closest("a") ||
    target.closest("[role='menuitem']") ||
    target.closest("[data-radix-popper-content-wrapper]")
  ) {
    return false;
  }
  return true;
}
