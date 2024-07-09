import { LucideBookA } from "lucide-react";
import React from "react";
import { TypingTestData } from "./utils";
import { createSuccessToast } from "@/components";

export function AddWordsToFlashcard({ words, currentIndex }: { words: TypingTestData[]; currentIndex: number }) {
  const wordsToAdd = words.slice(0, currentIndex + 1) ?? [];

  const [added, setAdded] = React.useState(false);

  return (
    <button
      disabled={added}
      onClick={() => {
        const flashcards = localStorage.getItem("flashcard-data") ?? "[]";
        const flashcardData = JSON.parse(flashcards);

        const id = new Date().getTime();

        const newFlashcard = [
          ...flashcardData,
          {
            chapter: `Typing Test-${id}`,
            words: wordsToAdd.map((word) => word.hanzi),
          },
        ];

        localStorage.setItem("flashcard-data", JSON.stringify(newFlashcard));

        createSuccessToast("Words added to flashcard", {});
        setAdded(true);
      }}
      className="px-4 py-2 active:bg-hovered duration-200 rounded-md flex items-center gap-2 focus:bg-subtle/50 focus:outline-none outline-transparent text-secondary active:text-white border border-secondary/20 disabled:pointer-events-none disabled:opacity-50"
    >
      <LucideBookA />
    </button>
  );
}
