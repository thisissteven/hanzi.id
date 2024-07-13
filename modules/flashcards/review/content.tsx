import { usePreferences } from "@/components";
import { FlashcardedResultStrict } from "@/pages/api/flashcard/en";
import React from "react";
import { CharacterCard } from "./character-card";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ReviewResult } from "./review-result";
import { Pagination } from "./pagination";
import { Controls } from "./controls";
import { useWindowSize } from "@/hooks";

export type CardStatus = "wrong" | "correct" | "untouched";

export function FlashcardReviewContent({
  words,
  onCardClick,
}: {
  words: FlashcardedResultStrict[];
  onCardClick: (card: FlashcardedResultStrict) => void;
}) {
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

  const { width } = useWindowSize();

  const containerHeight = width && width < 640 ? Math.min(width - 16, 384) : 320;

  const rowVirtualizer = useVirtualizer({
    count: words.length + 1,
    estimateSize: () => containerHeight,
    overscan: 5,
    getScrollElement: () => containerRef.current,
    horizontal: true,
  });

  React.useLayoutEffect(() => {
    rowVirtualizer?.measure?.();
  }, [rowVirtualizer, containerHeight]);

  const viewportWidth = Math.min(width, 960);
  const marginLeftRight =
    width > 768
      ? viewportWidth / 2 - containerHeight / 2 - 32
      : width > 384
      ? viewportWidth / 2 - containerHeight / 2
      : undefined;

  return (
    <div className="max-sm:px-2 flex flex-col items-center justify-center min-h-[calc(100dvh-5.5rem)] md:min-h-[calc(100dvh-12.5rem)]">
      <ReviewResult reviewResult={reviewResult} />
      <div className="mt-4 w-full overflow-x-hidden flex gap-2 scrollbar-none" ref={containerRef}>
        <div
          style={{
            width: `${rowVirtualizer.getTotalSize()}px`,
            height: containerHeight,
            position: "relative",
            marginLeft: marginLeftRight,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const index = virtualItem.index;
            const word = words[index];

            if (!word) {
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${virtualItem.size}px`,
                    height: "100%",
                    transform: `translateX(${virtualItem.start}px)`,
                  }}
                >
                  <div
                    key="placeholder"
                    className="shrink-0 w-full max-w-96 sm:max-w-80 aspect-square"
                    ref={(el) => {
                      if (el) {
                        cardRefs.current[index] = el;
                      }
                    }}
                  ></div>
                </div>
              );
            }

            const character = isSimplified ? word.simplified : word.traditional;
            const pinyin = word.entries.map((entry) => entry.pinyin).join(", ");
            const translations = word.entries[0].english.join(", ");
            const active = index === currentIndex;

            return (
              <div
                key={virtualItem.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${virtualItem.size}px`,
                  height: "100%",
                  transform: `translateX(${virtualItem.start}px)`,
                }}
              >
                <div
                  key={word.simplified}
                  className="shrink-0 w-full max-w-96 sm:max-w-80 aspect-square"
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
                    status={reviewResult[index]}
                    onCardClick={() => {
                      onCardClick(word);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Controls
        currentIndex={currentIndex}
        flipped={flipped}
        reviewResult={reviewResult}
        setCurrentIndex={setCurrentIndex}
        setFlipped={setFlipped}
        setReviewResult={setReviewResult}
        wordsLength={words.length}
      />
      <Pagination
        currentIndex={currentIndex}
        reviewResult={reviewResult}
        wordsLength={words.length}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
}
