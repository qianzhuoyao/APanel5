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
      role: "blueprint" | "logic" | "lifecycle" | "fetch" | "json";
    };

type BlueprintContextMenuProps = {
  menu: BlueprintContextMenuState | null;
  onClose: () => void;
  onAddBlueprintNode: (clientX: number, clientY: number) => void;
  onDeleteNode: (nodeId: string) => void;
};

export function BlueprintContextMenu({
  menu,
  onClose,
  onAddBlueprintNode,
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
        <button
          type="button"
          className="bp-context-menu__item"
          onClick={() => {
            onAddBlueprintNode(menu.clientX, menu.clientY);
            onClose();
          }}
        >
          新增节点
        </button>
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
