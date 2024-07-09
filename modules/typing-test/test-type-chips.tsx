import React from "react";
import { getTestTypeDisplayName, testTypes } from "./utils";
import { useTypingTestSettings } from "./use-typing-test-settings";
import { cn } from "@/utils";

export function TestTypeChips({ disabled }: { disabled: boolean }) {
  const {
    settings: { testType },
    updateSettings,
  } = useTypingTestSettings();

  return (
    <ul className="flex justify-center gap-2 md:gap-1.5 whitespace-nowrap flex-wrap">
      {testTypes.map((type) => {
        return (
          <li key={type} className="text-xs text-smokewhite font-light">
            <button
              disabled={disabled}
              onClick={() => {
                updateSettings("testType", type);
              }}
              className={cn(
                "bg-zinc border-[1.5px] rounded-full px-3 py-0.5 duration-200",
                testType === type ? "opacity-100 border-secondary/20" : "opacity-50 border-secondary/20"
              )}
            >
              {getTestTypeDisplayName(type)}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
