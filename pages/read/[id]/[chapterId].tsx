import { BackRouteButton } from "@/components";
import { useDebounce } from "@/hooks";
import { BottomBar, NextSentenceButton, PrevSentenceButton, TextContainer } from "@/modules/speech";
import { cn, useElementOutOfView, useParagraphs, useSpeech } from "@/utils";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import React from "react";

export default function Read() {
  const { sentences } = useParagraphs();

  const { currentSentenceIdx, currentWordRange, playbackState, play, pause, toSentence } = useSpeech(sentences);

  const ref = React.useRef() as React.MutableRefObject<HTMLDivElement>;

  const virtualizer = useWindowVirtualizer({
    count: sentences.length,
    estimateSize: () => 100,
    overscan: 5,
  });

  const { isOutOfView, direction } = useElementOutOfView(currentSentenceIdx);
  const actualDirection = useDebounce(direction, 200);

  return (
    <div className="min-h-dvh bg-black">
      <style jsx>{`
        #container {
          display: grid;
          grid-template-columns: minmax(500px, 1fr) 320px;
          width: 100%;
          max-width: calc(768px + 320px);
          margin: 0 auto;
          min-height: 100vh;
          min-height: 100dvh;
        }

        @media (max-width: 810px) {
          #container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <main id="container" className="relative">
        <button
          style={{
            left: ref.current?.getBoundingClientRect().left + ref.current?.getBoundingClientRect().width - 32,
          }}
          onClick={() => {
            virtualizer.scrollToIndex(currentSentenceIdx, {
              behavior: "smooth",
            });
          }}
          className={cn(
            "fixed bottom-4 bg-hovered/50 backdrop-blur-sm active:bg-hovered text-white w-9 h-9 grid place-items-center pb-2.5 pt-1.5 px-2 rounded-md duration-200 z-50",
            isOutOfView ? "opacity-100" : "opacity-0"
          )}
        >
          {actualDirection === "top" && "↑"}
          {actualDirection === "bottom" && "↓"}
        </button>

        <div ref={ref}>
          <div className="sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 pb-2 border-b-[1.5px] border-b-subtle">
            <div className="flex justify-between items-end">
              <div className="w-fit">
                <BackRouteButton />
              </div>
              <div className="flex gap-2">
                <PrevSentenceButton
                  disabled={currentSentenceIdx === 0}
                  onClick={() => toSentence(currentSentenceIdx - 1)}
                />
                <NextSentenceButton
                  disabled={currentSentenceIdx === sentences.length - 1}
                  onClick={() => toSentence(currentSentenceIdx + 1)}
                />
              </div>
            </div>
          </div>

          <div className="relative mt-4 max-[810px]:px-4 px-2">
            <TextContainer
              paused={playbackState !== "playing"}
              currentSentenceIdx={currentSentenceIdx}
              toSentence={toSentence}
              sentences={sentences}
              currentWordRange={currentWordRange}
              virtualizer={virtualizer}
            />
          </div>
        </div>

        {/* <HanziList currentSentence={currentSentence} currentWordRange={currentWordRange} /> */}
        <BottomBar
          sentences={sentences}
          currentSentenceIdx={currentSentenceIdx}
          toSentence={toSentence}
          playbackState={playbackState}
          play={play}
          pause={pause}
        />
      </main>
    </div>
  );
}
