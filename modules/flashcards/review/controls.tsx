import React from "react";
import { CardStatus } from "./content";
import { LucideCheck, LucideEye, LucideEyeOff, LucideX } from "lucide-react";
import { useConfetti } from "@/modules/layout";
import { useRouter } from "next/router";

export function Controls({
  setReviewResult,
  setCurrentIndex,
  setFlipped,
  flipped,
  currentIndex,
  reviewResult,
  wordsLength,
}: {
  setReviewResult: React.Dispatch<React.SetStateAction<CardStatus[]>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setFlipped: React.Dispatch<React.SetStateAction<number | null>>;
  flipped: number | null;
  currentIndex: number;
  reviewResult: CardStatus[];
  wordsLength: number;
}) {
  const { party } = useConfetti();

  const router = useRouter();

  return (
    <div className="mt-4 flex flex-wrap gap-2 w-full max-w-80 mx-auto">
      <button
        onClick={() => {
          setReviewResult((prev) => {
            const newResult = [...prev];
            newResult[currentIndex] = "wrong";
            return newResult;
          });
          setCurrentIndex((prev) => {
            const nextIndex = Math.min(wordsLength - 1, prev + 1);
            if (reviewResult[prev] !== "untouched") {
              return prev;
            }
            setFlipped(null);
            return nextIndex;
          });
          if (currentIndex === wordsLength - 1) {
            party();
            router.push({ query: { ...router.query, results: true } }, undefined, { shallow: true });
          }
        }}
        className="flex items-center rounded-md duration-200 active:bg-red-400/20 active:border-red-400/20 bg-red-400/10 text-red-400 border-b-2 border-red-400/20 p-3"
      >
        <LucideX />
      </button>

      <button
        className="grid place-items-center rounded-md duration-200 active:bg-sky-400/20 active:border-sky-400/20 bg-sky-400/10 text-sky-400 border-b-2 border-sky-400/20 p-3 flex-1"
        onClick={() => setFlipped(currentIndex === flipped ? null : currentIndex)}
      >
        {flipped !== null ? <LucideEyeOff /> : <LucideEye />}
      </button>

      <button
        onClick={() => {
          setReviewResult((prev) => {
            const newResult = [...prev];
            newResult[currentIndex] = "correct";
            return newResult;
          });
          setCurrentIndex((prev) => {
            const nextIndex = Math.min(wordsLength - 1, prev + 1);
            if (reviewResult[prev] !== "untouched") {
              return prev;
            }
            setFlipped(null);
            return nextIndex;
          });
          if (currentIndex === wordsLength - 1) {
            party();
            router.push({ query: { ...router.query, results: true } }, undefined, { shallow: true });
          }
        }}
        className="flex items-center rounded-md duration-200 active:bg-emerald-400/20 active:border-emerald-400/20 bg-emerald-400/10 text-emerald-400 border-b-2 border-emerald-400/20 p-3"
      >
        <LucideCheck />
      </button>
    </div>
  );
}
