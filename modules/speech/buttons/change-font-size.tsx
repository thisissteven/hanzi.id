import { Popover } from "@/components";
import { fontSizeMap, useReading } from "@/modules/layout";
import { cn } from "@/utils";
import React from "react";

export function ChangeFontSize() {
  const { fontSize, changeFontSize } = useReading();

  return (
    <Popover>
      <Popover.Trigger className="active:bg-hovered text-smokewhite p-2 rounded-md duration-200">
        {fontSize.icon}
      </Popover.Trigger>
      <Popover.Content align="end" className="text-xs sm:text-sm leading-5 text-smokewhite p-1.5 w-fit">
        <ul className="grid grid-cols-4 gap-1.5 place-items-center">
          {Object.values(fontSizeMap).map(({ className, icon, name }) => {
            const active = fontSize.name === name;
            return (
              <li key={className}>
                <Popover.Close
                  className={cn("active:bg-subtle p-2 rounded", active && "bg-lightgray/30")}
                  onClick={() => changeFontSize(name)}
                >
                  {icon}
                </Popover.Close>
              </li>
            );
          })}
        </ul>
      </Popover.Content>
    </Popover>
  );
}
