import { BottomBar, TextContainer } from "@/modules/speech";
import { useParagraphs, useSpeech } from "@/utils";
import React from "react";

export default function Read() {
  const { sentences } = useParagraphs();

  const { currentSentenceIdx, currentWordRange, playbackState, play, pause, toSentence } = useSpeech(sentences);

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
        <div>
          <div className="sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 max-[810px]:px-4 px-2 pb-4 border-b-[1.5px] border-b-subtle">
            <h1 className="text-2xl md:text-3xl font-bold">After School</h1>
          </div>

          <div className="mt-4 max-[810px]:px-4 px-2">
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
