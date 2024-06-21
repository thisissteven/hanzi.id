import React from "react";
import { PrevSentenceIcon } from "../icons/prev-sentence-icon";

export function PrevSentenceButton({
  onClick,
  ...props
}: { onClick: () => void } & React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type="button"
      className="group relative grid h-8 w-8 place-items-center group disabled:pointer-events-none"
      onClick={onClick}
      aria-label="previous sentence"
      {...props}
    >
      <PrevSentenceIcon className="h-6 w-6 text-tertiary group-active:text-white transition" />
    </button>
  );
}
