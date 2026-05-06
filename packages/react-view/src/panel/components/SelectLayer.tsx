import React, { useCallback, useMemo } from "react";
import Selecto from "react-selecto";

export type SelectLayerProps = {
  container: HTMLElement | null;
  selectableTargets?: string[];
  selectedTargets: HTMLElement[];
  onSelectedTargetsChange: (targets: HTMLElement[]) => void;
};

export function SelectLayer({
  container,
  selectableTargets = [".rv-selectable"],
  selectedTargets,
  onSelectedTargetsChange,
}: SelectLayerProps) {
  const targetsSet = useMemo(() => new Set(selectedTargets), [selectedTargets]);

  const toHTMLElementArray = useCallback(
    (els: Array<HTMLElement | SVGElement>) =>
      els.filter((el): el is HTMLElement => el instanceof HTMLElement),
    []
  );

  const handleSelect = useCallback(
    (e: any) => {
      const added = toHTMLElementArray((e?.added ?? []) as Array<HTMLElement | SVGElement>);
      const removed = toHTMLElementArray(
        (e?.removed ?? []) as Array<HTMLElement | SVGElement>
      );
      const next = [
        ...added,
        ...selectedTargets.filter((t) => !removed.includes(t)),
      ];
      onSelectedTargetsChange(next);
    },
    [onSelectedTargetsChange, selectedTargets, toHTMLElementArray]
  );

  if (!container) return null;

  return (
    <Selecto
      dragContainer={container}
      container={container}
      selectableTargets={selectableTargets}
      selectByClick
      selectFromInside={false}
      continueSelect
      toggleContinueSelect="shift"
      ratio={0}
      hitRate={0}
      onDragStart={(e: { inputEvent: { target: unknown }; stop: () => void }) => {
        // 点击到已选元素时，不打断 Moveable 拖拽
        const target = e.inputEvent.target as HTMLElement | null;
        if (target && targetsSet.has(target.closest(".rv-selectable") as HTMLElement)) {
          e.stop();
        }
      }}
      onSelect={handleSelect}
    />
  );
}

