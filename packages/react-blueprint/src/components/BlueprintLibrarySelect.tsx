import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@arronqzy/ui";
import { useI18n } from "@arronqzy/i18n/react";

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
  placeholder,
  onSelect,
}: BlueprintLibrarySelectProps) {
  const { t } = useI18n();
  const { saved, imported } = groupItems(items);
  const hasItems = items.length > 0;
  const resolvedPlaceholder = placeholder ?? t("blueprint.toolbar.library");

  return (
    <Select
      value={value ?? undefined}
      onValueChange={onSelect}
      disabled={!hasItems}
    >
      <SelectTrigger className="h-7 w-[168px] text-xs">
        <SelectValue
          placeholder={
            hasItems ? resolvedPlaceholder : t("blueprint.toolbar.libraryEmpty")
          }
        />
      </SelectTrigger>
      <SelectContent className="z-[10100]">
        {saved.length > 0 ? (
          <SelectGroup>
            <SelectLabel>{t("blueprint.toolbar.saved")}</SelectLabel>
            {saved.map((item) => (
              <SelectItem key={item.id} value={item.id} className="text-xs">
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ) : null}
        {imported.length > 0 ? (
          <SelectGroup>
            <SelectLabel>{t("blueprint.toolbar.imported")}</SelectLabel>
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
