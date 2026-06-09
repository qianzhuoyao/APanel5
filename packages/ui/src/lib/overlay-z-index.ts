import type { CSSProperties } from "react";

/** 弹窗层级：高于画布 Ruler(999)、工具栏(1200)、Menubar(10100) 等 */
export const MODAL_Z_INDEX = 20000;
export const MODAL_CONTENT_Z_INDEX = 20001;

export const modalOverlayStyle: CSSProperties = { zIndex: MODAL_Z_INDEX };
export const modalContentStyle: CSSProperties = { zIndex: MODAL_CONTENT_Z_INDEX };
