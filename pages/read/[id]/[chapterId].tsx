import { BackRouteButton } from "@/components";
import { Layout } from "@/modules/layout";
import {
  BottomBar,
  NextSentenceButton,
  PrevSentenceButton,
  ScrollToCurrentButton,
  TextContainer,
} from "@/modules/speech";
import { useParagraphs, useSpeech } from "@/utils";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import React from "react";
import { Toaster } from "sonner";

export default function Read() {
  const { sentences } = useParagraphs();

  const { currentSentenceIdx, currentWordRange, playbackState, play, pause, toSentence } = useSpeech(sentences);

  const ref = React.useRef() as React.MutableRefObject<HTMLDivElement>;

  const virtualizer = useWindowVirtualizer({
    count: sentences.length,
    estimateSize: () => 100,
    overscan: 0,
  });

  return (
    <Layout>
      <Toaster position="top-center" />

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
          <ScrollToCurrentButton
            totalSentences={sentences.length}
            currentSentenceIdx={currentSentenceIdx}
            virtualizer={virtualizer}
            element={ref.current}
          />

          <div ref={ref}>
            <div className="sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 pb-2 border-b-[1.5px] border-b-subtle">
              <div className="px-2 flex justify-between items-end">
                <div className="w-fit">
                  <BackRouteButton defaultBack />
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
                paused={playbackState === "paused"}
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
    </Layout>
  );
}
