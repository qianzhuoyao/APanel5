import React from "react";
import type { PanelElement } from "../types";

export type ElementsLayerProps = {
  elements: PanelElement[];
  selectedIds: string[];
  onSelectIds: (ids: string[]) => void;
};

export function ElementsLayer({
  elements,
  selectedIds,
  onSelectIds,
}: ElementsLayerProps) {
  return (
    <>
      {elements.map((el) => {
        const isSelected = selectedIds.includes(el.id);
        return (
          <div
            key={el.id}
            className={[
              "rv-selectable absolute select-none rounded-lg bg-blue-500/10",
              isSelected
                ? "border-2 border-blue-500/90"
                : "border border-black/25",
            ].join(" ")}
            data-element-id={el.id}
            onMouseDown={(e) => {
              if (e.button !== 0) return;
              // 单击选中（与 Selecto 的框选互补）
              if (e.shiftKey) {
                onSelectIds(
                  isSelected
                    ? selectedIds.filter((id) => id !== el.id)
                    : [...selectedIds, el.id]
                );
              } else {
                onSelectIds([el.id]);
              }
            }}
            style={{
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
              transform: `rotate(${el.rotate ?? 0}deg)`,
              boxSizing: "border-box",
            }}
          >
            <div className="p-2 text-xs text-black/75">{el.id}</div>
          </div>
        );
      })}
    </>
  );
}

