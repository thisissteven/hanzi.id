import { FlashcardedResultStrict } from "@/pages/api/flashcard/en";
import React from "react";
import { ReviewResult } from "./review-result";
import { Pagination } from "./pagination";
import { Controls } from "./controls";
import { ReviewProvider } from "./provider";
import { CardContainer } from "./card-container";

export type CardStatus = "wrong" | "correct" | "untouched";

export function FlashcardReviewContent({
  words,
  onCardClick,
}: {
  words: FlashcardedResultStrict[];
  onCardClick: (card: FlashcardedResultStrict) => void;
}) {
  return (
    <div className="max-sm:px-2 flex flex-col items-center justify-center min-h-[calc(100dvh-5.5rem)]">
      <ReviewProvider length={words.length}>
        <ReviewResult />
        <CardContainer onCardClick={onCardClick} words={words} />

        <Controls wordsLength={words.length} />
        <Pagination wordsLength={words.length} />
      </ReviewProvider>
    </div>
  );
}
