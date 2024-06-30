import { useLocale } from "@/locales/use-locale";
import { cn } from "@/utils";
import React from "react";

type ContinueButtonProps = {
  isEnd: boolean;
  onClick: () => void;
};

export function ContinueButton({ isEnd, onClick }: ContinueButtonProps) {
  const { t } = useLocale();

  return (
    <div className="flex justify-end">
      <button
        onClick={onClick}
        className={cn(
          "mt-4 ease duration-500 py-2 px-4 rounded-md",
          isEnd ? "opacity-100" : "opacity-0",
          "duration-300 hover:bg-hovered active:bg-hovered",
          "flex items-center"
        )}
        aria-label="Continue"
      >
        {t.continue} &#8594;
      </button>
    </div>
  );
}
