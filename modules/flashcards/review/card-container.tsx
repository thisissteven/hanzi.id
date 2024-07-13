import React from "react";
import { usePreferences } from "@/components";
import { CharacterCard } from "./character-card";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useWindowSize } from "@/hooks";
import useIsMobile from "@/hooks/useIsMobile";
import { FlashcardedResultStrict } from "@/pages/api/flashcard/en";
import { useReview } from "./provider";

export function CardContainer({
  words,
  onCardClick,
}: {
  words: FlashcardedResultStrict[];
  onCardClick: (word: FlashcardedResultStrict) => void;
}) {
  const { isSimplified } = usePreferences();

  const containerRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;
  const cardRefs = React.useRef([]) as React.MutableRefObject<(HTMLDivElement | null)[]>;

  const { width } = useWindowSize();
  const isMobile = useIsMobile();

  const containerHeight = React.useMemo(() => (width && width < 640 ? Math.min(width - 16, 384) : 320), [width]);

  const rowVirtualizer = useVirtualizer({
    count: words.length + 1,
    estimateSize: () => containerHeight,
    overscan: isMobile ? 2 : 5,
    getScrollElement: () => containerRef.current,
    horizontal: true,
  });

  React.useLayoutEffect(() => {
    rowVirtualizer?.measure();
  }, [rowVirtualizer, containerHeight]);

  const viewportWidth = React.useMemo(() => Math.min(width, 960), [width]);
  const marginLeftRight = React.useMemo(
    () =>
      width > 768
        ? viewportWidth / 2 - containerHeight / 2 - 32
        : width > 384
        ? viewportWidth / 2 - containerHeight / 2
        : undefined,
    [containerHeight, viewportWidth, width]
  );

  const { currentIndex, reviewResult, flipped } = useReview();

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

  console.log("render card");

  return (
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
                  index={index}
                  character={character}
                  pinyin={pinyin}
                  translations={translations}
                  className={active ? "opacity-100" : "opacity-40 scale-90"}
                  status={reviewResult[index]}
                  isFlipped={flipped === index}
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
  );
}
