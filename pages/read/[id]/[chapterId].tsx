import { BackRouteButton } from "@/components";
import { BottomBar, NextSentenceButton, PrevSentenceButton, TextContainer } from "@/modules/speech";
import { useElementOutOfView, useParagraphs, useSpeech } from "@/utils";
import React from "react";

export default function Read() {
  const { sentences } = useParagraphs();

  const { currentSentenceIdx, currentWordRange, playbackState, play, pause, toSentence } = useSpeech(sentences);

  const { isOutOfView, direction, scrollToCurrentWord } = useElementOutOfView("current-word");

  const ref = React.useRef() as React.MutableRefObject<HTMLDivElement>;

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
        {isOutOfView && (
          <button
            style={{
              left: `${ref.current?.getBoundingClientRect().left + ref.current?.getBoundingClientRect().width - 32}px`,
            }}
            onClick={scrollToCurrentWord}
            className="fixed bottom-4 bg-hovered/50 backdrop-blur-sm active:bg-hovered text-white w-9 h-9 grid place-items-center pb-2.5 pt-1.5 px-2 rounded-md duration-200 z-50"
          >
            {direction === "top" && "↑"}
            {direction === "bottom" && "↓"}
          </button>
        )}

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
