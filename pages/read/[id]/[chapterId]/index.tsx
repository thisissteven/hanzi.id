import { Layout } from "@/modules/layout";
import {
  BottomBar,
  ChangeFontSize,
  ChangeSpeed,
  DefinitionModal,
  ScrollToCurrentButton,
  TextContainer,
  ToggleBlur,
} from "@/modules/speech";
import { useSpeech } from "@/utils";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useRouter } from "next/router";
import React from "react";
import { useLastRead } from "@/modules/home/explore";
import { useLocale } from "@/locales/use-locale";
import { useSmoothScroll } from "@/hooks";
import { ChangeMode } from "@/modules/speech/buttons/change-mode";
import { ChangeVoice } from "@/modules/speech/buttons/change-voice";

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

  const smoothScrollToIndex = useSmoothScroll(virtualizer);

  const toLastRead = React.useCallback(
    (index: number) => {
      toSentence(index);
      const additionalOffset = index === sentences.length - 1 ? 0 : -50;
      smoothScrollToIndex(index, {
        align: "start",
        duration: 1000,
        additionalOffset,
      });
    },
    [sentences.length, smoothScrollToIndex, toSentence]
  );

  const { updateLastRead } = useLastRead({
    bookId,
    chapterId,
    scrollFn: toLastRead,
  });

  React.useEffect(() => {
    if (bookId && chapterId) {
      if (currentSentenceIdx > 0) {
        updateLastRead({
          bookId,
          chapterId,
          lastSentenceIndex: currentSentenceIdx.toString(),
        });
      }
      if (sentenceIndex && parseInt(sentenceIndex) > 0) {
        updateLastRead({
          bookId,
          chapterId,
          lastSentenceIndex: sentenceIndex,
        });
      }
    }
  }, [bookId, chapterId, currentSentenceIdx, sentenceIndex, updateLastRead]);

  const lastReadSentenceIndex = React.useRef<null | number>(null);
  React.useEffect(() => {
    if (!sentenceIndex && lastReadSentenceIndex.current !== null) {
      toSentence(lastReadSentenceIndex.current);
      smoothScrollToIndex(lastReadSentenceIndex.current, {
        align: "start",
        duration: 1000,
      });
      lastReadSentenceIndex.current = null;
    } else if (sentenceIndex) {
      lastReadSentenceIndex.current = parseInt(sentenceIndex);
    }
  }, [sentenceIndex, sentences.length, smoothScrollToIndex, toSentence]);

  const { t } = useLocale();

  return (
    <Layout>
      <div className="min-h-dvh bg-black">
        {/* <DefinitionModal
          onClose={() => router.back()}
          getDefinitionUrl={(locale) =>
            `https://content.hanzi.id/books/${bookId}/${chapterId}/${locale}/${sentenceIndex}.json`
          }
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
        /> */}

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
                    onClick={() => {
                      router.back();
                    }}
                    className="mt-4 py-2 pl-3 pr-4 rounded-md duration-200 active:bg-hovered flex items-center gap-2"
                  >
                    <div className="mb-[3px]">&#8592;</div> {t.return}
                  </button>
                </div>
                <div className="flex gap-2 max-[810px]:-mr-0 -mr-2">
                  <ToggleBlur isPlaying={playbackState === "playing"} />
                  {/* <ChangeMode /> */}
                  <ChangeFontSize />
                  {/* <ChangeSpeed /> */}
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
