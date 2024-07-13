import React from "react";
import { LucideCheck, LucideEye, LucideEyeOff, LucideX } from "lucide-react";
import { useConfetti } from "@/modules/layout";
import { useRouter } from "next/router";
import { useReview } from "./provider";

export function Controls({ wordsLength }: { wordsLength: number }) {
  const { party } = useConfetti();

  const { setReviewResult, setCurrentIndex, currentIndex, reviewResult, flipped, setFlipped } = useReview();

  const router = useRouter();

  const timeout = React.useRef<NodeJS.Timeout>();

  return (
    <div className="mt-4 flex flex-wrap gap-2 w-full max-w-80 mx-auto">
      <button
        disabled={reviewResult[reviewResult.length - 1] !== "untouched"}
        onClick={() => {
          clearTimeout(timeout.current);

          setReviewResult((prev) => {
            const newResult = [...prev];
            newResult[currentIndex] = "wrong";

            if (currentIndex === wordsLength - 1) {
              party();
              timeout.current = setTimeout(() => {
                const correct = newResult.filter((result) => result === "correct").length;
                const percentage = Math.round((correct / newResult.length) * 100);
                router.push({ query: { ...router.query, results: true, percentage } }, undefined, { shallow: true });
              }, 1500);
            }

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
        disabled={reviewResult[reviewResult.length - 1] !== "untouched"}
        onClick={() => {
          clearTimeout(timeout.current);

          setReviewResult((prev) => {
            const newResult = [...prev];
            newResult[currentIndex] = "correct";

            if (currentIndex === wordsLength - 1) {
              party();
              timeout.current = setTimeout(() => {
                const correct = newResult.filter((result) => result === "correct").length;
                const percentage = Math.round((correct / newResult.length) * 100);
                router.push({ query: { ...router.query, results: true, percentage } }, undefined, { shallow: true });
              }, 1500);
            }

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
        }}
        className="flex items-center rounded-md duration-200 active:bg-emerald-400/20 active:border-emerald-400/20 bg-emerald-400/10 text-emerald-400 border-b-2 border-emerald-400/20 p-3"
      >
        <LucideCheck />
      </button>
    </div>
  );
}
