// packages/rx-store/src/types.ts
export interface Node {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: Node[];
  events?: Partial<Record<EventName, EventAction[]>>;
  [key: string]: any;
}

export type EventName =
  | "onClick"
  | "onDoubleClick"
  | "onChange"
  | "onMouseDown"
  | "onMouseUp"
  | "onHover"
  | "onBlur";

export type EventAction =
  | { type: "navigate"; to: string }
  | { type: "openUrl"; url: string; target?: "_blank" | "_self" }
  | { type: "runPlugin"; plugin: string; args?: any }
  | { type: "log"; value: any }
  | { type: "toggle"; path: string }
  | { type: "increment"; path: string; step?: number }
  | { type: "decrement"; path: string; step?: number }
  | { type: "callApi"; url: string; method?: "GET" | "POST"; body?: any }
  | { type: "setState"; targetId?: string; path: string; value: any }; // targetId 可选，默认为当前节点

export type State = {
  root: Node;
  selectedIds: string[];
  variables?: Record<string, any>;
  [key: string]: any;
};

export type Path = string; // e.g. 'root.children[2].props.x' or 'variables.counter'
