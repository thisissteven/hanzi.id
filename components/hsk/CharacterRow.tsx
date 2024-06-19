import { ChineseCharacter } from "@/data";
import { BASE_URL } from "@/pages/_app";
import { cn } from "@/utils/cn";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { preload } from "swr";

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
    <div onClick={onClick} className="relative active:scale-95 transition select-none font-chinese text-3xl">
      <div
        className={clsx(
          "pl-3 pr-4 pt-6 pb-3 flex gap-2 items-center transition border-2 shadow-b-small rounded-lg bg-softblack",
          isCompleted ? "border-mossgreen shadow-mossgreen text-wheat" : "border-border shadow-border"
        )}
      >
        <div className="shrink-0">{hanzi}</div>

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

function MarkAsCompleted({
  className,
  checkmarkClassName,
  isCompleted,
  onClick,
}: {
  className?: string;
  checkmarkClassName?: string;
  isCompleted: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "absolute right-2 bottom-2 w-10 h-10 grid place-items-center transition active:scale-95 hover:opacity-100 rounded-md text-sm active:bg-mossgreen/10",
        isCompleted && "bg-mossgreen/10",
        className
      )}
    >
      <input
        checked={isCompleted}
        onChange={onClick}
        type="checkbox"
        className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <Checkmark className={checkmarkClassName} />
    </div>
  );
}

function Checkmark({ className }: { className?: string }) {
  return (
    <svg
      className={cn(
        "h-6 w-6 text-smokewhite/20 peer-active:text-mossgreen/50 peer-checked:text-mossgreen transition pointer-events-none",
        className
      )}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
        pathLength="1"
        strokeDashoffset="0px"
        strokeDasharray="1px 1px"
      ></path>
    </svg>
  );
}
