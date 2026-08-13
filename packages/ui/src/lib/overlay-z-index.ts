import type { CSSProperties } from "react";

/** 全局浮层 z-index 刻度 */
export const UI_Z_INDEX = {
  tooltip: 10000,
  /** 普通页面下拉；弹窗内下拉须高于 modalContent */
  dropdown: 20150,
  popover: 20170,
  alertDialog: 10150,
  /** 弹窗：高于画布 Ruler、工具栏、Menubar 等 */
  modal: 20000,
  modalContent: 20001,
  /** Toast 通知：始终置于最顶层 */
  toast: 99999,
} as const;

/** @deprecated 使用 UI_Z_INDEX.modal */
export const MODAL_Z_INDEX = UI_Z_INDEX.modal;

/** @deprecated 使用 UI_Z_INDEX.modalContent */
export const MODAL_CONTENT_Z_INDEX = UI_Z_INDEX.modalContent;

export const modalOverlayStyle: CSSProperties = { zIndex: UI_Z_INDEX.modal };
export const modalContentStyle: CSSProperties = { zIndex: UI_Z_INDEX.modalContent };
export const dropdownStyle: CSSProperties = { zIndex: UI_Z_INDEX.dropdown };
