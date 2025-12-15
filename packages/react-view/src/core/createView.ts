import { JSX } from "react";
import { pool } from "./nodePool";
import { Template } from "./template";
import { instructions } from "./instructions";
//该函数是创建存在可触发满足条件的任务的视图
//要自动记录需要执行的任务
export const createView = <T extends Record<string, unknown>>(
  id: string,
  constructor: () => T
) => {
  const prop = constructor();
  pool.createNode(id, prop);
  const addListener = (
    eventName: string,
    callback: (payload: { prop: T }) => void
  ) => {
    instructions.register(id + eventName, () => {
      callback({ prop });
    });
  };
  const render = (reactRender: () => JSX.Element) => {
    return Template({ id }, reactRender());
  };
  return {
    render,
    addListener,
  };
};
