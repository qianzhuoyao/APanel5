import { useEffect, useRef } from "react";

export type BlueprintContextMenuState =
  | {
      kind: "pane";
      clientX: number;
      clientY: number;
    }
  | {
      kind: "node";
      clientX: number;
      clientY: number;
      nodeId: string;
      role: "blueprint" | "logic" | "lifecycle";
    };

type BlueprintContextMenuProps = {
  menu: BlueprintContextMenuState | null;
  /** 当前选中的蓝图节点 id，用于在空白处右键时添加子节点 */
  selectedBlueprintNodeId?: string | null;
  onClose: () => void;
  onAddBlueprintNode: (clientX: number, clientY: number) => void;
  onAddLogicNode: (
    parentBlueprintId: string,
    clientX: number,
    clientY: number
  ) => void;
  onAddLifecycleNode: (
    parentBlueprintId: string,
    clientX: number,
    clientY: number
  ) => void;
  onDeleteNode: (nodeId: string) => void;
};

export function BlueprintContextMenu({
  menu,
  selectedBlueprintNodeId = null,
  onClose,
  onAddBlueprintNode,
  onAddLogicNode,
  onAddLifecycleNode,
  onDeleteNode,
}: BlueprintContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const closeOnPointerDown = (event: Event) => {
      const target = event.target as globalThis.Node | null;
      if (target && menuRef.current?.contains(target)) return;
      onClose();
    };
    const close = () => onClose();
    window.addEventListener("pointerdown", closeOnPointerDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("pointerdown", closeOnPointerDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [menu, onClose]);

  if (!menu) return null;

  return (
    <div
      ref={menuRef}
      className="bp-context-menu"
      style={{ left: menu.clientX, top: menu.clientY }}
      onMouseDown={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {menu.kind === "pane" ? (
        <>
          <button
            type="button"
            className="bp-context-menu__item"
            onClick={() => {
              onAddBlueprintNode(menu.clientX, menu.clientY);
              onClose();
            }}
          >
            新增蓝图节点
          </button>
          {selectedBlueprintNodeId ? (
            <>
              <div className="bp-context-menu__separator" />
              <button
                type="button"
                className="bp-context-menu__item"
                onClick={() => {
                  onAddLogicNode(
                    selectedBlueprintNodeId,
                    menu.clientX,
                    menu.clientY
                  );
                  onClose();
                }}
              >
                添加逻辑节点
              </button>
              <button
                type="button"
                className="bp-context-menu__item"
                onClick={() => {
                  onAddLifecycleNode(
                    selectedBlueprintNodeId,
                    menu.clientX,
                    menu.clientY
                  );
                  onClose();
                }}
              >
                添加生命周期节点
              </button>
            </>
          ) : null}
        </>
      ) : null}

      {menu.kind === "node" ? (
        <button
          type="button"
          className="bp-context-menu__item bp-context-menu__item--danger"
          onClick={() => {
            onDeleteNode(menu.nodeId);
            onClose();
          }}
        >
          删除
        </button>
      ) : null}
    </div>
  );
}
