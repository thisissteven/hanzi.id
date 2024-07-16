import { LucideBookA } from "lucide-react";
import React from "react";
import { TypingTestData, WordStatus } from "./utils";
import { createSuccessToast, RouteDialog } from "@/components";
import { useRouter } from "next/router";
import { useLocale } from "@/locales/use-locale";
import { cn } from "@/utils";

export function AddWordsToFlashcard({
  words,
  wordStatuses,
  currentIndex,
}: {
  words: TypingTestData[];
  wordStatuses: {
    word: string;
    status: WordStatus;
  }[];
  currentIndex: number;
}) {
  const wordsToAdd = words.slice(0, currentIndex + 1) ?? [];

  const [added, setAdded] = React.useState(false);
  const [wrongOnly, setWrongOnly] = React.useState(true);

  const { t } = useLocale();

  const router = useRouter();

  const open = Boolean(router.query.addWordsToFlashcard);

  return (
    <>
      <RouteDialog open={open} onClose={() => router.back()} withoutOkButton>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">{t.addTheFollowingWordsToFlashcard}</h3>
          <div className="flex gap-1.5 items-center">
            <input
              checked={wrongOnly}
              onChange={(e) => setWrongOnly(e.target.checked)}
              id="wrong-only"
              type="checkbox"
            />
            <label htmlFor="wrong-only" className="text-sm">
              {t.onlyAddWrongWords}
            </label>
          </div>
          <ul className="grid grid-cols-2 gap-2 py-2 max-h-48 overflow-y-auto scrollbar">
            {wordsToAdd.map((word, index) => (
              <li
                key={word.hanzi}
                className={cn(
                  "flex gap-2 items-end flex-wrap duration-200 text-secondary",
                  wrongOnly && wordStatuses[index].status === "correct" && "opacity-50",
                  wrongOnly && ["wrong", "current"].includes(wordStatuses[index].status) && "text-mossgreen"
                )}
              >
                <span className="text-lg font-semibold">{word.hanzi}</span>
                <span className="text-sm">{word.pinyin}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              const flashcards = localStorage.getItem("flashcard-data") ?? "[]";
              const flashcardData = JSON.parse(flashcards);

              const id = new Date().getTime();

              const newFlashcard = [
                ...flashcardData,
                {
                  chapter: `Typing Test-${id}`,
                  words: wordsToAdd
                    .map((word) => word.hanzi)
                    .filter((_, index) => !wrongOnly || ["wrong", "current"].includes(wordStatuses[index].status)),
                },
              ];

              localStorage.setItem("flashcard-data", JSON.stringify(newFlashcard));

              createSuccessToast(t.wordsAdded, {});
              setAdded(true);
              router.back();
            }}
            className="rounded-md font-medium max-md:w-full text-white p-2 md:py-2.5 md:px-4 duration-200 bg-blue-500 active:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {t.addToFlashcard}
          </button>
          <button
            onClick={() => {
              router.back();
            }}
            className="p-2 active:bg-hovered duration-200 rounded-md flex justify-center items-center gap-2 focus:bg-subtle/50 focus:outline-none outline-transparent text-secondary active:text-white border border-secondary/20"
          >
            {t.cancel}
          </button>
        </div>
      </RouteDialog>
      <button
        disabled={added}
        onClick={() => {
          router.push(
            {
              query: {
                ...router.query,
                addWordsToFlashcard: true,
              },
            },
            undefined,
            { shallow: true }
          );
        }}
        className="px-4 py-2 active:bg-hovered duration-200 rounded-md flex items-center gap-2 focus:bg-subtle/50 focus:outline-none outline-transparent text-secondary active:text-white border border-secondary/20 disabled:pointer-events-none disabled:opacity-50"
      >
        <LucideBookA />
      </button>
    </>
  );
}
