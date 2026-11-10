export function getSelectedTargetsFromIds(
  container: HTMLElement | null,
  ids: string[]
) {
  if (!container) return [];
  const targets: HTMLElement[] = [];
  for (const id of ids) {
    const el = container.querySelector<HTMLElement>(
      `[data-element-id="${id}"]`
    );
    if (el) targets.push(el);
  }
  return targets;
}

export function shouldClearSelectionOnBlank(target: HTMLElement | null) {
  if (!target) return false;
  if (
    target.closest(".rv-selectable") ||
    target.closest(".rv-moveable-layer") ||
    target.closest(".moveable-control-box") ||
    target.closest(".moveable-group") ||
    target.closest(".moveable-area") ||
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
    target.closest(".ant-dropdown") ||
    target.closest(".ant-select-dropdown") ||
    target.closest(".ant-picker-dropdown")
  ) {
    return false;
  }
  return true;
}
