import { usePreferences } from "@/components";
import { FlashcardedResult, FlashcardedResultStrict } from "@/pages/api/flashcard/en";
import React from "react";
import { CharacterCard } from "./character-card";

export function FlashcardReviewContent({ words }: { words: FlashcardedResultStrict[] }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const { isSimplified } = usePreferences();

  const [flipped, setFlipped] = React.useState<number | null>(null);

  const containerRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;
  const cardRefs = React.useRef([]) as React.MutableRefObject<(HTMLDivElement | null)[]>;

  React.useEffect(() => {
    if (cardRefs.current[currentIndex]) {
      cardRefs.current[currentIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex]);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-11.25rem)]">
      <div className="w-full overflow-x-auto flex gap-2 scrollbar-none pointer-events-none" ref={containerRef}>
        {words.map((word, index) => {
          const character = isSimplified ? word.simplified : word.traditional;
          const pinyin = word.entries.map((entry) => entry.pinyin).join(", ");
          const translations = word.entries[0].english.join(", ");
          const active = index === currentIndex;
          return (
            <div
              key={word.simplified}
              className="shrink-0 w-full max-sm:px-2 sm:max-w-80 aspect-square"
              ref={(el) => {
                if (el) {
                  cardRefs.current[index] = el;
                }
              }}
            >
              <CharacterCard
                id={index + 1}
                character={character}
                pinyin={pinyin}
                translations={translations}
                isFlipped={index === flipped}
                className={active ? "opacity-100" : "opacity-40 scale-90"}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          className="px-4 py-2 bg-softblack text-smokewhite rounded-md font-medium duration-200 active:bg-subtle"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => Math.min(words.length - 1, prev + 1))}
          className="px-4 py-2 bg-softblack text-smokewhite rounded-md font-medium duration-200 active:bg-subtle"
        >
          Next
        </button>
        <button onClick={() => setFlipped(currentIndex === flipped ? null : currentIndex)}>flip</button>
      </div>
    </div>
  );
}
