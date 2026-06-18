import React, { useCallback, useMemo } from "react";
import Selecto from "react-selecto";

export type SelectLayerProps = {
  container: HTMLElement | null;
  dragContainer?: HTMLElement | null;
  rootContainer?: HTMLElement | null;
  selectableTargets?: string[];
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
};

export function SelectLayer({
  container,
  dragContainer,
  rootContainer,
  selectableTargets = [".rv-selectable"],
  selectedIds,
  onSelectedIdsChange,
}: SelectLayerProps) {
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const dragRoot = dragContainer ?? rootContainer ?? null;
  const overlayContainer = typeof document !== "undefined" ? document.body : null;

  const handleSelect = useCallback(
    (e: any) => {
      const input = e?.inputEvent as MouseEvent | undefined;
      if (input && input.button !== 0) return;
      const selected = (e?.selected ?? []) as Array<HTMLElement | SVGElement>;
      const idSet = new Set<string>();
      for (const el of selected) {
        const root = (el as Element).closest?.(".rv-selectable") as
          | HTMLElement
          | null;
        const id = root?.dataset.elementId;
        if (id) idSet.add(id);
      }
      onSelectedIdsChange(Array.from(idSet));
    },
    [onSelectedIdsChange]
  );

  if (!container || !dragRoot || !overlayContainer) return null;

  return (
    <Selecto
      // container 可以是 transform 过的画布；rootContainer 必须是未 transform 的真实坐标系容器
      container={container}
      rootContainer={dragRoot}
      // 选择框渲染到 body，避免受滚动/缩放影响产生偏移
      portalContainer={overlayContainer}
      // 鼠标事件绑定到滚动容器，确保 clientX/Y 与坐标系一致
      dragContainer={dragRoot}
      selectableTargets={selectableTargets}
      // 点击选中交给 ElementsLayer（支持 shift 多选），Selecto 只负责框选
      selectByClick={false}
      selectFromInside={false}
      // 不要阻止在节点内部的拖动（让 Moveable 接管拖拽移动）
      preventDragFromInside={false}
      preventDefault={false}
      continueSelect={false}
      toggleContinueSelect="shift"
      ratio={0}
      hitRate={0}
      dragCondition={(e: any) => {
        const input = e?.inputEvent as MouseEvent | undefined;
        // 只允许左键触发框选，右键不参与选区变更
        if (input && input.button !== 0) return false;
        const target = (input?.target as HTMLElement | null) ?? null;
        const isShift = !!input?.shiftKey;
        if (isShift) return true;

        // 已有选中时：在选中区域/Moveable 控制框上按下，应该交给 Moveable 拖动，不启动框选
        if (selectedIdSet.size > 0) {
          if (
            target?.closest(".moveable-control-box") ||
            target?.closest(".moveable-group") ||
            target?.closest(".moveable-line") ||
            target?.closest(".moveable-control") ||
            target?.closest(".moveable-direction")
          ) {
            return false;
          }
          const selectable = target?.closest(".rv-selectable") as HTMLElement | null;
          const id = selectable?.dataset.elementId;
          if (id && selectedIdSet.has(id)) return false;
        }
        return true;
      }}
      onDragStart={(e: { inputEvent: { target: unknown }; stop: () => void }) => {
        const input = e.inputEvent as MouseEvent | undefined;
        if (input && input.button !== 0) {
          e.stop();
          return;
        }
        // 已有多选时，默认应该是拖动移动；只有按住 shift 才继续框选/追加
        const target = e.inputEvent.target as HTMLElement | null;
        const selectable = target?.closest(".rv-selectable") as HTMLElement | null;
        const id = selectable?.dataset.elementId;
        const isShift = (e.inputEvent as MouseEvent | undefined)?.shiftKey ?? false;
        if (id && selectedIdSet.has(id) && !isShift) e.stop();
      }}
      onSelect={handleSelect}
    />
  );
}

