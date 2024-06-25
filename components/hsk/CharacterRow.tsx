import { ChineseCharacter } from "@/data";
import { BASE_URL } from "@/pages/_app";
import { cn } from "@/utils/cn";
import clsx from "clsx";
import React from "react";
import { preload } from "swr";
import { Checkmark, MarkAsCompleted } from "./CharacterCard";

async function preloadHanziDetails(hanzi: string) {
  await preload(`hanzi/${hanzi}`, async (url) => {
    const response = await fetch(`${BASE_URL}/api/${url}`);
    const data = await response.json();
    return data;
  });
}

export function CharacterRow({
  id,
  hanzi,
  pinyin,
  translations,
  isCompleted,
  onClick,
  onCompleteToggle,
}: ChineseCharacter & {
  onClick: () => void;
  isCompleted: boolean;
  onCompleteToggle: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "relative group transition select-none text-3xl",
        isCompleted ? "text-smokewhite" : "text-lightgray"
      )}
    >
      <div className="pl-3 pr-4 pt-6 pb-3 flex gap-2 items-center transition border-b border-b-secondary/20 bg-softblack active:bg-hovered">
        <div className="shrink-0 font-medium">{hanzi}</div>

        <div className="overflow-x-hidden flex-1">
          <div className="text-sm font-medium">{pinyin}</div>
          <div className="text-sm line-clamp-1 max-w-[90%]">{translations.join(", ")}</div>
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
