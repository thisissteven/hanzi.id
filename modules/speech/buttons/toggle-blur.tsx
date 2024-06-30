import { useThrottledClickHandler } from "@/hooks";
import { useReading } from "@/modules/layout";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import React from "react";
import { cn } from "@/utils";

export function ToggleBlur({ isPlaying }: { isPlaying: boolean }) {
  const { blurred, toggleBlur } = useReading();

  const [onClick] = useThrottledClickHandler(toggleBlur, {
    maxClicks: 1,
    throttle: 500,
  });

  return (
    <button
      disabled={!isPlaying}
      onClick={onClick}
      className={cn(
        "active:bg-hovered text-smokewhite p-2 rounded-md duration-200",
        isPlaying ? "opacity-100" : "opacity-0"
      )}
    >
      {blurred ? <EyeIcon size={22} /> : <EyeOffIcon size={22} />}
    </button>
  );
}
