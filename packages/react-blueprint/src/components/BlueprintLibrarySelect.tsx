import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@arronqzy/ui";

import type { BlueprintLibraryListItem } from "../library/types";

export type BlueprintLibrarySelectProps = {
  items: BlueprintLibraryListItem[];
  value: string | null;
  placeholder?: string;
  onSelect: (id: string) => void;
};

function groupItems(items: BlueprintLibraryListItem[]) {
  const saved = items.filter((item) => item.source === "saved");
  const imported = items.filter((item) => item.source === "imported");
  return { saved, imported };
}

export function BlueprintLibrarySelect({
  items,
  value,
  placeholder = "蓝图库",
  onSelect,
}: BlueprintLibrarySelectProps) {
  const { saved, imported } = groupItems(items);
  const hasItems = items.length > 0;

  return (
    <Select
      value={value ?? undefined}
      onValueChange={onSelect}
      disabled={!hasItems}
    >
      <SelectTrigger className="h-7 w-[168px] text-xs">
        <SelectValue placeholder={hasItems ? placeholder : "蓝图库为空"} />
      </SelectTrigger>
      <SelectContent className="z-[10100]">
        {saved.length > 0 ? (
          <SelectGroup>
            <SelectLabel>已保存</SelectLabel>
            {saved.map((item) => (
              <SelectItem key={item.id} value={item.id} className="text-xs">
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ) : null}
        {imported.length > 0 ? (
          <SelectGroup>
            <SelectLabel>已导入</SelectLabel>
            {imported.map((item) => (
              <SelectItem key={item.id} value={item.id} className="text-xs">
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ) : null}
      </SelectContent>
    </Select>
  );
}
