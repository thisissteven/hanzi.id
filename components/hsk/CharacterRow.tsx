import { ChineseCharacter } from "@/data";

import clsx from "clsx";
import React from "react";

import { MarkAsCompleted } from "./CharacterCard";

export function CharacterRow({
  id,
  character,
  pinyin,
  translations,
  isCompleted,
  onClick,
  onCompleteToggle,
}: ChineseCharacter & {
  character: string;
  onClick: () => void;
  isCompleted: boolean;
  onCompleteToggle: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={clsx("relative group transition select-none", isCompleted ? "text-smokewhite" : "text-lightgray")}
    >
      <div className="pl-3 pr-4 pt-7 pb-3 flex gap-2 items-center transition border-b border-b-secondary/10 bg-softblack active:bg-hovered">
        <div className="shrink-0 font-medium text-4xl">{character}</div>

        <div className="overflow-x-hidden flex-1 -space-y-1">
          <div className="text-base font-medium">{pinyin}</div>
          <div className="text-base line-clamp-1 max-w-[90%]">{translations.join(", ")}</div>
        </div>

        <MarkAsCompleted
          className={isCompleted ? "bg-transparent" : ""}
          isCompleted={isCompleted}
          onClick={onCompleteToggle}
        />

        <div className="absolute left-4 top-3 text-xs">{id}</div>
      </div>
    </div>
  );
}
