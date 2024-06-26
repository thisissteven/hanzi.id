import { Layout } from "@/modules/layout";
import {
  BottomBar,
  ChangeFontSize,
  ChangeSpeed,
  DefinitionModal,
  ScrollToCurrentButton,
  TextContainer,
} from "@/modules/speech";
import { useSpeech } from "@/utils";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useRouter } from "next/router";
import React from "react";
import { useLastRead } from "@/modules/home/explore";

export default function Read() {
  const router = useRouter();

  const bookId = router.query.id as string;
  const chapterId = router.query.chapterId as string;
  const sentenceIndex = router.query.sentenceIndex as string;

  const { sentences, currentSentenceIdx, currentWordRange, playbackState, play, pause, toSentence } = useSpeech();

  const ref = React.useRef() as React.MutableRefObject<HTMLDivElement>;

  const virtualizer = useWindowVirtualizer({
    count: sentences.length,
    estimateSize: () => 100,
    overscan: 0,
  });

  const toLastRead = React.useCallback(
    (index: number) => {
      toSentence(index);
      virtualizer.scrollToIndex(index, {
        behavior: "smooth",
      });
    },
    [toSentence, virtualizer]
  );

  const { updateLastRead } = useLastRead({
    bookId,
    chapterId,
    scrollFn: toLastRead,
  });

  React.useEffect(() => {
    if (bookId && chapterId && currentSentenceIdx > 0 && playbackState === "playing") {
      updateLastRead({
        bookId,
        chapterId,
        lastSentenceIndex: currentSentenceIdx.toString(),
      });
    }
  }, [bookId, chapterId, currentSentenceIdx, updateLastRead, playbackState]);

  return (
    <Layout>
      <div className="min-h-dvh bg-black">
        <DefinitionModal
          totalSentences={sentences.length}
          previousDisabled={parseInt(sentenceIndex) === 0}
          nextDisabled={parseInt(sentenceIndex) === sentences.length - 1}
          previousSentence={() => {
            const index = Math.max(0, parseInt(sentenceIndex) - 1);
            return `/read/${bookId}/${chapterId}?sentence=${sentences[index]}&sentenceIndex=${index}`;
          }}
          nextSentence={() => {
            const index = Math.min(sentences.length - 1, parseInt(sentenceIndex) + 1);
            return `/read/${bookId}/${chapterId}?sentence=${sentences[index]}&sentenceIndex=${index}`;
          }}
        />

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

          <div>
            <div className="sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 pb-2 border-b-[1.5px] border-b-subtle">
              <div className="px-2 flex justify-between items-end">
                <div className="w-fit">
                  <button
                    onClick={() => router.back()}
                    className="mt-4 py-2 pl-3 pr-4 rounded-md duration-200 active:bg-hovered flex items-center gap-2"
                  >
                    <div className="mb-[3px]">&#8592;</div> Return
                  </button>
                </div>
                <div className="flex gap-2 max-[810px]:-mr-0 -mr-2">
                  <ChangeFontSize />
                  <ChangeSpeed />
                </div>
              </div>
            </div>

            <div className="relative mt-4 max-[810px]:px-4 px-2" ref={ref}>
              <TextContainer
                paused={playbackState === "paused"}
                currentSentenceIdx={currentSentenceIdx}
                toSentence={toSentence}
                sentences={sentences}
                currentWordRange={currentWordRange}
                virtualizer={virtualizer}
                pause={pause}
              />
            </div>
          </div>

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
