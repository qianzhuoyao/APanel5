import { JSX, useRef } from "react";
import { instructions } from "./instructions";

/**
 * 事件需要补齐
 * @param props
 * @param children
 * @returns
 */
export const Template = (
  props: Record<string, unknown>,
  children: JSX.Element
) => {
  const onHandleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (props?.id) {
      instructions.execute(props.id + "click", { e });
    } else {
      if (import.meta.env.DEV) {
        console.warn("Template 缺少 id,无法触发事件");
      }
    }
  };

  return <div onClick={onHandleClick}>{children}</div>;
};
