import { VirtualizedList } from "@/components";

import React from "react";
import { Line } from "./line";
import { CurrentSentence } from "./current-sentence";
import { useDebounce } from "@/utils";

export function TextContainer({
  sentences,
  currentSentenceIdx,
  toSentence,
  currentWordRange,
  paused,
}: {
  sentences: string[];
  currentSentenceIdx: number;
  toSentence: (index: number) => void;
  currentWordRange: number[];
  paused: boolean;
}) {
  const highlightRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;

  const isPaused = useDebounce(paused, 200);

  return (
    <div className="text-semiwhite">
      <ul
        onMouseLeave={() => {
          highlightRef.current.style.transitionProperty = "opacity";
          highlightRef.current.style.opacity = "0";
        }}
        onTouchEnd={() => {
          highlightRef.current.style.transitionProperty = "opacity";
          highlightRef.current.style.opacity = "0";
        }}
        className="relative text-lg md:text-xl list-none pb-4"
      >
        <div
          ref={highlightRef}
          className="absolute w-full bg-[#242424] rounded-lg ease duration-200 will-change-transform"
        ></div>

        <VirtualizedList data={sentences}>
          {(items, virtualizer) => {
            if (!sentences) return null;

            return items.map((item) => {
              const index = item.index;
              const sentence = sentences[index];

              return (
                <VirtualizedList.Item key={item.key} virtualizer={virtualizer} item={item}>
                  <Line
                    key={index}
                    sentences={sentences}
                    paused={isPaused}
                    currentSentenceIndex={currentSentenceIdx}
                    onClick={() => {
                      if (index > currentSentenceIdx && !paused) return;
                      if (index === currentSentenceIdx) return;
                      toSentence(index);
                    }}
                    index={index}
                    onMouseEnter={(e) => {
                      if (index > currentSentenceIdx && !paused) {
                        highlightRef.current.style.opacity = "0";
                      } else {
                        const justEntered = highlightRef.current.style.opacity === "0";
                        if (justEntered) {
                          highlightRef.current.style.transitionProperty = "opacity";
                        } else {
                          highlightRef.current.style.transitionProperty = "transform, height, opacity";
                        }

                        highlightRef.current.style.transform = `translateY(${item.start}px)`;
                        highlightRef.current.style.height = `${e.currentTarget.offsetHeight}px`;
                        highlightRef.current.style.opacity = "1";
                      }
                    }}
                  >
                    {index === currentSentenceIdx ? (
                      <CurrentSentence
                        sentence={sentence}
                        currentSentenceIdx={currentSentenceIdx}
                        wordRange={currentWordRange}
                      />
                    ) : (
                      sentence
                    )}
                  </Line>
                </VirtualizedList.Item>
              );
            });
          }}
        </VirtualizedList>
      </ul>
    </div>
  );
}
