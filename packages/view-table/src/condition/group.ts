import type { Condition, ConditionGroup, ConditionLeaf, ConditionOp } from "../types";

export type ConditionLogic = "and" | "or" | "not";

export function isConditionGroup(when: Condition | undefined): when is ConditionGroup {
  return !!when && (when.op === "and" || when.op === "or" || when.op === "not");
}

export function isConditionLeaf(when: Condition | undefined): when is ConditionLeaf {
  return (
    !!when &&
    when.op !== "and" &&
    when.op !== "or" &&
    when.op !== "not" &&
    when.op !== "expr"
  );
}

/** Normalize any condition into a group for the editor (default logic = and). */
export function normalizeConditionGroup(when: Condition | undefined): ConditionGroup {
  if (!when) {
    return { op: "and", items: [{ op: "eq", value: "" }] };
  }
  if (isConditionGroup(when)) {
    return {
      op: when.op,
      items: when.items?.length ? [...when.items] : [{ op: "eq", value: "" }],
    };
  }
  return { op: "and", items: [when] };
}

export function getConditionLogic(when: Condition | undefined): ConditionLogic {
  if (isConditionGroup(when)) return when.op;
  return "and";
}

export function createDefaultLeaf(op: ConditionOp = "eq"): ConditionLeaf {
  return { op, value: "" };
}

export function createDefaultCondition(logic: ConditionLogic = "and"): ConditionGroup {
  return { op: logic, items: [createDefaultLeaf()] };
}

export function setConditionLogic(when: Condition | undefined, logic: ConditionLogic): ConditionGroup {
  const group = normalizeConditionGroup(when);
  return { ...group, op: logic };
}

export function listConditionItems(when: Condition | undefined): Condition[] {
  return normalizeConditionGroup(when).items;
}

export function updateConditionItem(
  when: Condition | undefined,
  index: number,
  item: Condition
): ConditionGroup {
  const group = normalizeConditionGroup(when);
  const items = group.items.map((c, i) => (i === index ? item : c));
  return { ...group, items };
}

export function updateConditionLeaf(
  when: Condition | undefined,
  index: number,
  patch: Partial<ConditionLeaf>
): ConditionGroup {
  const group = normalizeConditionGroup(when);
  const current = group.items[index];
  const base: ConditionLeaf = isConditionLeaf(current)
    ? current
    : createDefaultLeaf();
  return updateConditionItem(when, index, { ...base, ...patch });
}

export function addConditionItem(when: Condition | undefined): ConditionGroup {
  const group = normalizeConditionGroup(when);
  return { ...group, items: [...group.items, createDefaultLeaf()] };
}

export function removeConditionItem(when: Condition | undefined, index: number): ConditionGroup {
  const group = normalizeConditionGroup(when);
  const items = group.items.filter((_, i) => i !== index);
  return {
    ...group,
    items: items.length ? items : [createDefaultLeaf()],
  };
}
