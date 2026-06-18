import type { Value } from "./type.js";

/** 嵌套蓝图执行完成后各节点的端口输出 */
export type BlueprintNodeOutputs = Record<string, Record<string, Value>>;

/** 蓝图引用节点真信号携带的输出值 */
export type BlueprintRefOutput = {
  nodeId: string;
  nodeType: string;
  libraryBlueprintId: string;
  blueprintName?: string;
  /** 嵌套蓝图各节点 out 端口的信号输出 */
  nestedOutputs: BlueprintNodeOutputs;
};
