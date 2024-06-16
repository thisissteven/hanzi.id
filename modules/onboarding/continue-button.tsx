import { cn } from "@/utils";
import React from "react";

type ContinueButtonProps = {
  isEnd: boolean;
  onClick: () => void;
};

export function ContinueButton({ isEnd, onClick }: ContinueButtonProps) {
  return (
    <div className="flex justify-end">
      <button
        onClick={onClick}
        className={cn(
          "mt-4 ease duration-500 py-2 px-4 rounded-md",
          isEnd ? "opacity-100" : "opacity-0",
          "duration-300 hover:bg-hovered",
          "flex items-center"
        )}
        aria-label="Continue"
      >
        Continue &#8594;
      </button>
    </div>
  );
}
