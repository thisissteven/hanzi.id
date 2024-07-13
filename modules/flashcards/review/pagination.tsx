import React from "react";
import { CardStatus } from "./content";
import { useLocale } from "@/locales/use-locale";

export function Pagination({
  currentIndex,
  reviewResult,
  wordsLength,
  setCurrentIndex,
}: {
  currentIndex: number;
  reviewResult: CardStatus[];
  wordsLength: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { t } = useLocale();

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 px-2 flex flex-wrap gap-2 w-full max-w-80">
      <button
        disabled={currentIndex === 0}
        onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
        className="flex-1 whitespace-nowrap grid place-items-center bg-subtle/50 border-b-2 border-secondary/10 rounded-md active:bg-hovered duration-200 p-3 disabled:opacity-50 disabled:pointer-events-none"
      >
        &#8592; {t.previous}
      </button>
      <button
        disabled={currentIndex === wordsLength - 1 || reviewResult[currentIndex] === "untouched"}
        onClick={() => {
          setCurrentIndex((prev) => Math.min(wordsLength - 1, prev + 1));
        }}
        className="flex-1 whitespace-nowrap grid place-items-center bg-subtle/50 border-b-2 border-secondary/10 rounded-md active:bg-hovered duration-200 p-3 disabled:opacity-50 disabled:pointer-events-none"
      >
        {t.next} &#x2192;
      </button>
    </div>
  );
}
