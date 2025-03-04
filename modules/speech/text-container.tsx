import { VirtualizedList } from "@/components";

import React from "react";
import { Line } from "./line";
import { CurrentSentence } from "./current-sentence";
import { cn, useDebounce } from "@/utils";
import { Virtualizer } from "@tanstack/react-virtual";
import useIsMobile from "@/hooks/useIsMobile";
import { useReading } from "../layout";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { FlashSentence } from "./flash-sentence";

export function TextContainer({
  sentences,
  currentSentenceIdx,
  toSentence,
  currentWordRange,
  paused,
  virtualizer,
  pause,
}: {
  sentences: string[];
  currentSentenceIdx: number;
  toSentence: (index: number) => void;
  currentWordRange: number[];
  paused: boolean;
  virtualizer: Virtualizer<Window, Element>;
  pause: () => void;
}) {
  const highlightRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;

  const isMobile = useIsMobile();

  const isPaused = useDebounce(paused, 200);

  const { blurred, fontSize, mode } = useReading();

  React.useEffect(() => {
    if (isPaused) {
      highlightRef.current.style.opacity = "0";
    }
  }, [isPaused]);

  const router = useRouter();

  return (
    <div className={cn("duration-500", sentences.length > 1 ? "opacity-100" : "opacity-0")}>
      <ul
        onMouseLeave={() => {
          highlightRef.current.style.transitionProperty = "opacity";
          highlightRef.current.style.opacity = "0";
        }}
        className={cn("relative list-none max-[810px]:pb-20 pb-4", fontSize.className)}
      >
        <div
          ref={highlightRef}
          className={cn(
            "absolute w-full bg-[#242424] rounded-lg ease duration-200 will-change-transform",
            !isPaused && "opacity-0"
          )}
        ></div>

        <VirtualizedList
          virtualizer={virtualizer}
          className={cn(
            mode === "normal" || (mode === "flash" && paused) ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
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
                      toast.dismiss("last-read");
                      if (index === currentSentenceIdx) {
                        if (!paused) {
                          pause();
                        }
                        router.push(
                          router.asPath +
                            `?sentence=${sentences[currentSentenceIdx]}&sentenceIndex=${currentSentenceIdx}`,
                          undefined,
                          {
                            shallow: true,
                          }
                        );
                        return;
                      }
                      if (index > currentSentenceIdx && !paused && blurred) return;
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
                          mode={mode}
                          isPlaying={!paused}
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

        {mode === "flash" && !paused && (
          <FlashSentence
            mode={mode}
            isPlaying={!paused}
            sentence={sentences[currentSentenceIdx]}
            currentSentenceIdx={currentSentenceIdx}
            wordRange={currentWordRange}
          />
        )}
      </ul>
    </div>
  );
}
