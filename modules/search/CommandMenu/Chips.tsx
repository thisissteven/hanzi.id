import { useLocale } from "@/locales/use-locale";
import { cn } from "@/utils";
import React from "react";

export function CommandMenuChips({
  active,
  toggleActive,
}: {
  active: number[];
  toggleActive: (active: number) => void;
}) {
  const { t } = useLocale();

  const chips = React.useMemo(() => t.commandMenuChips, [t.commandMenuChips]);
  return (
    <div className="ml-3 h-[32px] flex items-center overflow-x-auto scrollbar-none w-full">
      <ul className="px-2 flex gap-1.5 whitespace-nowrap">
        {chips.map((chip, index) => {
          return (
            <li key={chip} className="text-xs text-smokewhite font-light">
              <button
                onClick={() => {
                  toggleActive(index);
                }}
                className={cn(
                  "bg-zinc border-[1.5px] rounded-full px-3 py-0.5 duration-200",
                  active.includes(index) ? "opacity-100 border-secondary/20" : "opacity-50 border-secondary/20"
                )}
              >
                {chip}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
