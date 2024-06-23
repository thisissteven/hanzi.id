import { VirtualizedList } from "@/components";

import React from "react";
import { Line } from "./line";
import { CurrentSentence } from "./current-sentence";
import { cn, useDebounce } from "@/utils";
import { Virtualizer } from "@tanstack/react-virtual";
import useIsMobile from "@/hooks/useIsMobile";
import { useReading } from "../layout";

export function TextContainer({
  sentences,
  currentSentenceIdx,
  toSentence,
  currentWordRange,
  paused,
  virtualizer,
}: {
  sentences: string[];
  currentSentenceIdx: number;
  toSentence: (index: number) => void;
  currentWordRange: number[];
  paused: boolean;
  virtualizer: Virtualizer<Window, Element>;
}) {
  const highlightRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;

  const isMobile = useIsMobile();

  const isPaused = useDebounce(paused, 200);

  const { blurred } = useReading();

  React.useEffect(() => {
    if (isPaused) {
      highlightRef.current.style.opacity = "0";
    }
  }, [isPaused]);

  return (
    <div>
      <ul
        onMouseLeave={() => {
          highlightRef.current.style.transitionProperty = "opacity";
          highlightRef.current.style.opacity = "0";
        }}
        className="relative text-lg md:text-xl list-none max-[810px]:pb-20 pb-4"
      >
        <div
          ref={highlightRef}
          className={cn(
            "absolute w-full bg-[#242424] rounded-lg ease duration-200 will-change-transform",
            !isPaused && "opacity-0"
          )}
        ></div>

        <VirtualizedList virtualizer={virtualizer}>
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
                      if (index > currentSentenceIdx && !paused && blurred) return;
                      if (index === currentSentenceIdx) return;
                      toSentence(index);
                    }}
                    index={index}
                    onMouseEnter={(e) => {
                      if (isMobile) return;
                      if (index > currentSentenceIdx && !paused && blurred) {
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
                      <>
                        <CurrentSentence
                          sentence={sentence}
                          currentSentenceIdx={currentSentenceIdx}
                          wordRange={currentWordRange}
                        />
                        {isMobile && (
                          <span
                            className={cn(
                              "bg-red-500 w-1.5 h-1.5 rounded-full absolute top-[1.25rem] -left-4 duration-200",
                              isPaused ? "opacity-100" : "opacity-0"
                            )}
                          ></span>
                        )}
                      </>
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
