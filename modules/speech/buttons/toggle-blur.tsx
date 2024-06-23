import { useThrottledClickHandler } from "@/hooks";
import { useReading } from "@/modules/layout";
import { AnimatePresence } from "framer-motion";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React from "react";
import { FadeInOut } from "./fade-in-out";

export function ToggleBlur() {
  const { blurred, toggleBlur } = useReading();

  const [onClick] = useThrottledClickHandler(toggleBlur, {
    maxClicks: 1,
    throttle: 500,
  });

  return (
    <button onClick={onClick} className="active:bg-hovered text-smokewhite p-2 rounded-md duration-200">
      <AnimatePresence mode="wait" initial={false}>
        {blurred ? (
          <FadeInOut key="blurred">
            <EyeIcon size={22} />
          </FadeInOut>
        ) : (
          <FadeInOut key="visible">
            <EyeOffIcon size={22} />
          </FadeInOut>
        )}
      </AnimatePresence>
    </button>
  );
}
