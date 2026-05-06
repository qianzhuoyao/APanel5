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
            className="rv-selectable"
            data-element-id={el.id}
            onMouseDown={(e) => {
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
              position: "absolute",
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
              transform: `rotate(${el.rotate ?? 0}deg)`,
              border: isSelected
                ? "2px solid rgba(59, 130, 246, 0.9)"
                : "1px solid rgba(0,0,0,0.25)",
              borderRadius: 8,
              background: "rgba(59, 130, 246, 0.08)",
              boxSizing: "border-box",
              userSelect: "none",
            }}
          >
            <div
              style={{
                fontSize: 12,
                padding: 8,
                color: "rgba(0,0,0,0.75)",
              }}
            >
              {el.id}
            </div>
          </div>
        );
      })}
    </>
  );
}

