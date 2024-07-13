import { usePreferences } from "@/components";
import { FlashcardedResultStrict } from "@/pages/api/flashcard/en";
import React from "react";
import { CharacterCard } from "./character-card";
import { LucideCheck, LucideEye, LucideEyeOff, LucideX } from "lucide-react";

export type CardStatus = "wrong" | "correct" | "untouched";

export function FlashcardReviewContent({ words }: { words: FlashcardedResultStrict[] }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const { isSimplified } = usePreferences();

  const [flipped, setFlipped] = React.useState<number | null>(null);

  const containerRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;
  const cardRefs = React.useRef([]) as React.MutableRefObject<(HTMLDivElement | null)[]>;

  React.useEffect(() => {
    if (cardRefs.current) {
      const currentCard = cardRefs.current[currentIndex];
      if (currentCard) {
        currentCard.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentIndex]);

  const [reviewResult, setReviewResult] = React.useState<Array<CardStatus>>(
    Array.from({ length: words.length }, () => "untouched")
  );

  const wrong = reviewResult.filter((result) => result === "wrong").length;
  const correct = reviewResult.filter((result) => result === "correct").length;
  const untouched = reviewResult.length - wrong - correct;

  return (
    <div className="max-sm:px-2 flex flex-col items-center justify-center min-h-[calc(100dvh-5.5rem)] md:min-h-[calc(100dvh-12.5rem)]">
      <div className="px-2 w-full flex flex-wrap gap-4 justify-center">
        <div className="flex gap-2 items-center text-sm">
          <div className="w-2 h-2 rounded-full bg-red-500"></div> {wrong} Wrong
        </div>
        <div className="flex gap-2 items-center text-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div> {correct} Correct
        </div>
        <div className="flex gap-2 items-center text-sm">
          <div className="w-2 h-2 rounded-full bg-gray-500"></div> {untouched} Untouched
        </div>
      </div>
      <div className="mt-4 w-full overflow-x-auto flex gap-2 scrollbar-none pointer-events-none" ref={containerRef}>
        {words.map((word, index) => {
          const character = isSimplified ? word.simplified : word.traditional;
          const pinyin = word.entries.map((entry) => entry.pinyin).join(", ");
          const translations = word.entries[0].english.join(", ");
          const active = index === currentIndex;

          const style = {
            marginLeft: index === 0 ? "50%" : undefined,
            marginRight: index === words.length - 1 ? "50%" : undefined,
          };

          return (
            <div
              key={word.simplified}
              className="shrink-0 w-full max-w-96 sm:max-w-80 aspect-square"
              ref={(el) => {
                if (el) {
                  cardRefs.current[index] = el;
                }
              }}
              style={style}
            >
              <CharacterCard
                id={index + 1}
                character={character}
                pinyin={pinyin}
                translations={translations}
                isFlipped={index === flipped}
                className={active ? "opacity-100" : "opacity-40 scale-90"}
                status={reviewResult[index]}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 w-full max-w-80 mx-auto">
        <button
          onClick={() => {
            setReviewResult((prev) => {
              const newResult = [...prev];
              newResult[currentIndex] = "wrong";
              return newResult;
            });
            setCurrentIndex((prev) => {
              const nextIndex = Math.min(words.length - 1, prev + 1);
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
          onClick={() => {
            setReviewResult((prev) => {
              const newResult = [...prev];
              newResult[currentIndex] = "correct";
              return newResult;
            });
            setCurrentIndex((prev) => {
              const nextIndex = Math.min(words.length - 1, prev + 1);
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
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 px-2 flex flex-wrap gap-2 w-full max-w-80">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          className="flex-1 whitespace-nowrap grid place-items-center bg-subtle/50 border-b-2 border-secondary/10 rounded-md active:bg-hovered duration-200 p-3 disabled:opacity-50 disabled:pointer-events-none"
        >
          &#8592; Previous
        </button>
        <button
          disabled={currentIndex === words.length - 1 || reviewResult[currentIndex] === "untouched"}
          onClick={() => setCurrentIndex((prev) => Math.min(words.length - 1, prev + 1))}
          className="flex-1 whitespace-nowrap grid place-items-center bg-subtle/50 border-b-2 border-secondary/10 rounded-md active:bg-hovered duration-200 p-3 disabled:opacity-50 disabled:pointer-events-none"
        >
          Next &#x2192;
        </button>
      </div>
    </div>
  );
}
