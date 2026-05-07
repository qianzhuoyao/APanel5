import React, { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";
import type { PanelElement } from "../types";
import { buildChartOption, CHART_TYPES } from "../utils/chartOptionBuilder";

export type ElementsLayerProps = {
  elements: PanelElement[];
  allElements: PanelElement[];
  selectedIds: string[];
  onSelectIds: (ids: string[]) => void;
};

function ChartNodeContent({ element }: { element: PanelElement }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const option = useMemo(() => buildChartOption(element), [element]);

  useEffect(() => {
    if (!hostRef.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(hostRef.current);
    }
    chartRef.current.setOption(option as echarts.EChartsOption, true);
    chartRef.current.resize();
    const obs = new ResizeObserver(() => chartRef.current?.resize());
    obs.observe(hostRef.current);
    return () => obs.disconnect();
  }, [option]);

  useEffect(() => {
    return () => {
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  return <div ref={hostRef} className="h-full w-full" />;
}

function getNodeVisualStyle(element: PanelElement): React.CSSProperties {
  const style = element.style ?? {};
  return {
    backgroundColor: style.backgroundColor,
    backgroundImage: style.backgroundImage,
    backgroundSize: style.backgroundSize,
    backgroundPosition: style.backgroundPosition,
    borderWidth: style.borderWidth,
    borderStyle: style.borderStyle,
    borderColor: style.borderColor,
    borderRadius: style.borderRadius,
  };
}

function getNodeAABB(element: PanelElement) {
  const rotate = ((element.rotate ?? 0) * Math.PI) / 180;
  const cos = Math.cos(rotate);
  const sin = Math.sin(rotate);
  const absCos = Math.abs(cos);
  const absSin = Math.abs(sin);
  const bboxWidth = element.width * absCos + element.height * absSin;
  const bboxHeight = element.width * absSin + element.height * absCos;
  const cx = element.x + element.width / 2;
  const cy = element.y + element.height / 2;
  return {
    left: cx - bboxWidth / 2,
    top: cy - bboxHeight / 2,
    right: cx + bboxWidth / 2,
    bottom: cy + bboxHeight / 2,
  };
}

function ReferenceNodeContent({
  element,
  allElements,
  snapshotSource,
  visitedIds = [],
}: {
  element: PanelElement;
  allElements: PanelElement[];
  snapshotSource?: PanelElement[];
  visitedIds?: string[];
}) {
  const sourceNodes = useMemo(
    () => {
      const fromDeep =
        element.refCopyMode === "deep" ? element.refSnapshot ?? snapshotSource ?? [] : null;
      const base = fromDeep ?? allElements.filter((n) => n.layerId === element.refLayerId);
      return base.filter((n) => n.id !== element.id && !visitedIds.includes(n.id));
    },
    [
      allElements,
      element.id,
      element.refCopyMode,
      element.refLayerId,
      element.refSnapshot,
      snapshotSource,
      visitedIds,
    ]
  );

  const layout = useMemo(() => {
    if (sourceNodes.length === 0) return null;
    const boxes = sourceNodes.map(getNodeAABB);
    const minX = Math.min(...boxes.map((b) => b.left));
    const minY = Math.min(...boxes.map((b) => b.top));
    const maxX = Math.max(...boxes.map((b) => b.right));
    const maxY = Math.max(...boxes.map((b) => b.bottom));
    const sourceWidth = Math.max(1, maxX - minX);
    const sourceHeight = Math.max(1, maxY - minY);

    const innerW = Math.max(1, element.width);
    const innerH = Math.max(1, element.height);
    const scale = Math.max(0.05, Math.min(innerW / sourceWidth, innerH / sourceHeight));
    const mappedW = sourceWidth * scale;
    const mappedH = sourceHeight * scale;

    return {
      minX,
      minY,
      scale,
      offsetX: (innerW - mappedW) / 2,
      offsetY: (innerH - mappedH) / 2,
    };
  }, [element.height, element.width, sourceNodes]);

  if (!layout || sourceNodes.length === 0) {
    const hintText = element.refLayerId ? "引用图层暂无节点" : "请在右侧选择引用图层";
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="rounded border border-dashed border-border/70 px-2 py-1 text-[10px] text-muted-foreground">
          {hintText}
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none relative h-full w-full overflow-hidden">
      {sourceNodes.map((node) => {
        const box = getNodeAABB(node);
        const left = layout.offsetX + (box.left - layout.minX) * layout.scale;
        const top = layout.offsetY + (box.top - layout.minY) * layout.scale;
        const width = Math.max(12, node.width * layout.scale);
        const height = Math.max(10, node.height * layout.scale);
        const boxWidth = Math.max(12, (box.right - box.left) * layout.scale);
        const boxHeight = Math.max(10, (box.bottom - box.top) * layout.scale);
        return (
          <div
            key={node.id}
            className="absolute overflow-visible"
            style={{
              left,
              top,
              width: boxWidth,
              height: boxHeight,
            }}
          >
            <div
              className="absolute"
              style={{
                left: (boxWidth - width) / 2,
                top: (boxHeight - height) / 2,
                width,
                height,
                transform: `rotate(${node.rotate ?? 0}deg)`,
                transformOrigin: "center center",
                ...getNodeVisualStyle(node),
              }}
            >
              {CHART_TYPES.has(node.materialType ?? "") ? (
                <ChartNodeContent element={node} />
              ) : node.materialType === "reference" ? (
                <ReferenceNodeContent
                  element={node}
                  allElements={allElements}
                  snapshotSource={node.refSnapshot}
                  visitedIds={[...visitedIds, element.id]}
                />
              ) : (
                <div className="h-full w-full" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ElementsLayer({
  elements,
  allElements,
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
              "rv-selectable absolute select-none rounded-lg",
              isSelected ? "border-2 border-blue-500/90" : "border-none",
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
              ...getNodeVisualStyle(el),
            }}
          >
            {CHART_TYPES.has(el.materialType ?? "") ? (
              <ChartNodeContent element={el} />
            ) : el.materialType === "reference" ? (
              <ReferenceNodeContent element={el} allElements={allElements} />
            ) : (
              <div className="h-full w-full" />
            )}
          </div>
        );
      })}
    </>
  );
}

