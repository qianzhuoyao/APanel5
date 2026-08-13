import type { Condition, ConditionLeaf, ConditionOp } from "@arronqzy/view-table";
import {
  addConditionItem,
  getConditionLogic,
  isConditionLeaf,
  listConditionItems,
  removeConditionItem,
  setConditionLogic,
  updateConditionLeaf,
  type ConditionLogic,
} from "@arronqzy/view-table";
import { useI18n } from "@arronqzy/i18n/react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@arronqzy/ui";
import React from "react";

const CONDITION_OPS: ConditionOp[] = [
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
  "contains",
  "startsWith",
  "endsWith",
  "in",
  "empty",
  "notEmpty",
  "regex",
  "truthy",
  "falsy",
];

function leafValueText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function parseLeafValue(text: string): unknown {
  const trimmed = text.trim();
  if (trimmed === "") return "";
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return text;
}

export function ConditionEditor({
  value,
  onChange,
  showField = false,
  fieldClass = "space-y-1",
  inputClass = "h-8 text-[11px]",
}: {
  value: Condition | undefined;
  onChange: (next: Condition) => void;
  showField?: boolean;
  fieldClass?: string;
  inputClass?: string;
}) {
  const { t } = useI18n();
  const logic = getConditionLogic(value);
  const items = listConditionItems(value);

  const opLabel = (op: ConditionOp) => t(`panel.config.tableOp.${op}`);

  const logicLabel =
    logic === "or"
      ? t("panel.config.tableConditionLogicOr")
      : logic === "not"
        ? t("panel.config.tableConditionLogicNot")
        : t("panel.config.tableConditionLogicAnd");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className={`${fieldClass} min-w-0 flex-1`}>
          <div className="text-[11px] text-muted-foreground">{t("panel.config.tableConditionLogic")}</div>
          <Select
            value={logic}
            onValueChange={(next) => onChange(setConditionLogic(value, next as ConditionLogic))}
          >
            <SelectTrigger className={inputClass}>
              <SelectValue>{logicLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="and">{t("panel.config.tableConditionLogicAnd")}</SelectItem>
              <SelectItem value="or">{t("panel.config.tableConditionLogicOr")}</SelectItem>
              <SelectItem value="not">{t("panel.config.tableConditionLogicNot")}</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4 h-7 shrink-0 px-2 text-[11px]"
          onClick={() => onChange(addConditionItem(value))}
        >
          {t("panel.config.tableConditionAddItem")}
        </Button>
      </div>
      <div className="text-[10px] text-muted-foreground">{t("panel.config.tableConditionLogicHint")}</div>
      {items.map((item, index) => {
        const leaf: ConditionLeaf = isConditionLeaf(item)
          ? item
          : { op: "eq", value: "" };
        const needsValue = !["empty", "notEmpty", "truthy", "falsy"].includes(leaf.op);
        return (
          <div
            key={`cond-${index}`}
            className="space-y-1.5 rounded-md border border-border/50 bg-background/70 p-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-[10px] font-medium text-muted-foreground">
                {t("panel.config.tableConditionItem", { n: index + 1 })}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-1.5 text-[11px] text-destructive"
                disabled={items.length <= 1}
                onClick={() => onChange(removeConditionItem(value, index))}
              >
                ×
              </Button>
            </div>
            <div className={`grid grid-cols-1 gap-1.5 ${showField ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              <label className={fieldClass}>
                <div className="text-[11px] text-muted-foreground">{t("panel.config.tableConditionOp")}</div>
                <Select
                  value={leaf.op}
                  onValueChange={(next) =>
                    onChange(updateConditionLeaf(value, index, { op: next as ConditionOp }))
                  }
                >
                  <SelectTrigger className={inputClass}>
                    <SelectValue>{opLabel(leaf.op)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITION_OPS.map((op) => (
                      <SelectItem key={op} value={op}>
                        {opLabel(op)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              {showField ? (
                <label className={fieldClass}>
                  <div className="text-[11px] text-muted-foreground">{t("panel.config.tableConditionField")}</div>
                  <Input
                    value={leaf.field ?? ""}
                    onChange={(e) =>
                      onChange(
                        updateConditionLeaf(value, index, {
                          field: e.target.value || undefined,
                        })
                      )
                    }
                    className={inputClass}
                    placeholder={t("panel.config.tableConditionFieldPlaceholder")}
                  />
                </label>
              ) : null}
              {needsValue ? (
                <label className={fieldClass}>
                  <div className="text-[11px] text-muted-foreground">{t("panel.config.tableConditionValue")}</div>
                  <Input
                    value={leafValueText(leaf.value)}
                    onChange={(e) =>
                      onChange(
                        updateConditionLeaf(value, index, {
                          value: parseLeafValue(e.target.value),
                        })
                      )
                    }
                    className={inputClass}
                    placeholder={t("panel.config.tableConditionValuePlaceholder")}
                  />
                </label>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
