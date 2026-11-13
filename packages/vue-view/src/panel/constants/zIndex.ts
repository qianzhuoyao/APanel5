export const PANEL_Z_INDEX = {
  /** 仅高于画布内容层，低于弹窗蒙层 */
  ruler: 100,
  /** 与顶栏 / 图层面板同级，避免盖住侧栏与弹层 */
  toolbar: 30,
  historyPopover: 40,
} as const;
