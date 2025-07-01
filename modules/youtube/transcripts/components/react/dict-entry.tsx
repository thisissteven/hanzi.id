import { useState, useEffect, useMemo } from "react";
import { Drawer } from "vaul";
import { useDictEntry } from "../../provider/dict-entry";
import { useAudioPlayer } from "../../../hooks/useAudioPlayer";
import { getSentenceTransliteration, getTransliteration } from "../../components/utils";
import { posReadableMap } from "../../components/constants";
import { useSubtitleSettings } from "../../provider/subtitle-settings";
import { formatTime } from "../../../utils/transcripts";
import { useReactPlayer } from "../../provider/react-player";
import { CopyButton } from "./copy-button";
import { Divider } from "@/components";
import { LucideVolume2, LucideX } from "lucide-react";
import { cn } from "@/utils";

function SentencesExamples({ word }: { word: string }) {
  const { subtitles, subsTranslations } = useSubtitleSettings();

  const sentencesExamplesFromSubtitles = useMemo(() => {
    if (word && subtitles && subsTranslations) {
      const examples = [];
      for (let i = 0; i < subtitles.length; i++) {
        if (examples.length === 3) break;
        const subtitle = subtitles[i];

        const transliteration = subtitle.tokens.map(getTransliteration).join(" ").trim();

        const sentenceChunks = subtitle.text
          .split(word ? word : "")
          .flatMap((chunk, i, arr) => (i < arr.length - 1 ? [chunk, word] : [chunk]));

        const translation = subsTranslations[i];

        if (subtitle.text.includes(word) && examples.length < 3) {
          examples.push({
            index: i,
            transliteration,
            sentenceChunks,
            translation,
            ...subtitle,
          });
        }
      }
      return examples;
    } else {
      return [];
    }
  }, [subsTranslations, subtitles, word]);

  const { onTimestampClick } = useReactPlayer();

  if (sentencesExamplesFromSubtitles.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mt-4">
        <p className="text-xs text-secondary uppercase tracking-wide mb-2">Examples from Subtitles</p>

        <div className="space-y-4">
          {sentencesExamplesFromSubtitles.map((sentence, index) => {
            return (
              <div key={index} className="relative border-l-2 border-l-softzinc pl-2 pr-3 mb-2">
                <CopyButton
                  className="top-2 right-4"
                  text={`${word}: \n\n${sentence.text}\n${sentence.translation}\n- - - - -\n`}
                />
                <button
                  onClick={() => onTimestampClick(sentence.begin, sentence.end)}
                  className="mt-2 text-sm text-blue-300 active:text-blue-400"
                >
                  {formatTime(sentence.begin)}
                </button>
                <div className="flex justify-between items-center">
                  <p className="text-white text-xl">
                    {sentence.sentenceChunks.map((text, index) => {
                      const isActive = text === word;
                      return (
                        <span key={index} className={isActive ? "text-yellow-600 dark:text-yellow-500" : ""}>
                          {text}
                        </span>
                      );
                    })}
                  </p>
                </div>
                <p className="text-secondary dark:text-gray-400 italic">{sentence.transliteration}</p>
                <p className="text-blue-800 pr-8 dark:text-blue-400 mt-2">{sentence.translation}</p>
              </div>
            );
          })}
        </div>
      </div>
      <Divider />
    </>
  );
}

export function DictEntry({
  lang,
  withExamplesFromSubtitles,
  limitHeight,
}: {
  lang: string;
  withExamplesFromSubtitles?: boolean;
  limitHeight?: boolean;
}) {
  const { drawerOpen, setDrawerOpen, setSentenceParams, isLoading, audio, sentenceAudio, dictEntry, token } =
    useDictEntry();
  const { play } = useAudioPlayer(audio);
  const { play: playSentence } = useAudioPlayer(sentenceAudio);

  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  const { videoSize } = useSubtitleSettings();

  const isDesktop = viewport.width > 640;
  const height =
    isDesktop || !limitHeight || videoSize === "full-screen"
      ? `${viewport.height + 4}px`
      : videoSize === "half-screen"
      ? `${viewport.height * 0.5}px`
      : `${viewport.height - (viewport.width * 9) / 16}px`;

  const isSmToMd = viewport.width < 768 && viewport.width > 640;
  const isMobile = viewport.width < 640;
  const width = isSmToMd ? "320px" : isMobile ? viewport.width : "448px";

  useEffect(() => {
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const handleResize = () =>
      setViewport({
        width: window.innerWidth,
        height: viewportHeight,
      });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [word, transliteration] = token.split(",");

  return (
    <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen} direction={isDesktop ? "right" : "bottom"}>
      <Drawer.Portal>
        <Drawer.Overlay
          className={cn("fixed inset-0 z-30", limitHeight && (!isDesktop || isSmToMd) ? "" : "bg-black/40 ")}
        />
        <Drawer.Content
          className={cn(
            "bg-black rounded-none transition-transform focus:outline-none p-0",
            isDesktop ? "right-0 top-0 bottom-0" : "bottom-0 left-0 right-0",
            "fixed z-40 flex flex-col h-full w-full overflow-hidden"
          )}
          style={{
            maxHeight: height,
            maxWidth: width,
          }}
        >
          <div className="p-4 overflow-y-auto scrollbar">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <Drawer.Title asChild>
                <div className="flex justify-between items-end gap-4">
                  <div className="flex flex-col items-center w-fit">
                    <p className="text-sm text-green-400 italic">{transliteration}</p>
                    <p className="text-3xl font-bold text-yellow-400">{word}</p>
                  </div>
                  <button
                    onClick={play}
                    className="mb-1 text-smokewhite opacity-50 active:opacity-100 active:text-blue-400"
                  >
                    <LucideVolume2 />
                  </button>
                </div>
              </Drawer.Title>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-smokewhite opacity-50 active:opacity-100"
              >
                <LucideX />
              </button>
            </div>

            {/* Definitions */}
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                <div className="mb-4 space-y-2">
                  {dictEntry?.renderData?.fullDictRenderData?.entries?.[0]?.posGroups.map((group, idx) => (
                    <div key={idx}>
                      <p className="text-secondary italic">{group.pos ? `(${group.pos})` : ""}</p>
                      <p className="text-black dark:text-white">{group.translations.join(", ")}</p>
                    </div>
                  ))}
                </div>

                {/* <WordStatusButtons
                  word={word}
                  pos={dictEntry?.renderData?.fullDictRenderData?.entries?.[0]?.posGroups?.[0].pos || "X"}
                  lang={lang}
                  transliteration={transliteration}
                /> */}

                <Divider />

                {withExamplesFromSubtitles && <SentencesExamples word={word} />}

                {/* Example Sentences */}
                <div className="mt-4">
                  <p className="text-xs text-secondary uppercase tracking-wide mb-2">Examples by Part of Speech</p>

                  {!dictEntry?.tatoebaExamples
                    ? "No Examples found."
                    : Object.entries(dictEntry.tatoebaExamples).map(([pos, examples]) => (
                        <div key={pos} className="mb-4 space-y-4">
                          <p className="text-sm font-semibold text-gray-300 mb-2">{posReadableMap[pos]}</p>

                          {examples.map((example: any, index: number) => {
                            const transliteration = example.nlp.map(getSentenceTransliteration).join(" ").trim();

                            const sentenceParams = `${example.text},${example.textHash}`;

                            return (
                              <div key={index} className="relative border-l-2 border-l-softzinc pl-2 pr-3 mb-2">
                                <div className="flex justify-between items-center">
                                  <p className="text-white text-xl">
                                    {example.nlp.map((token: any, index: number) => {
                                      const isActive = token.form.text === word;
                                      return (
                                        <span
                                          key={index}
                                          className={isActive ? "text-yellow-600 dark:text-yellow-500" : ""}
                                        >
                                          {token.form.text}
                                        </span>
                                      );
                                    })}
                                  </p>
                                </div>
                                <p className="text-gray-400 italic">{transliteration}</p>
                                <p className="text-blue-400 mt-2">{example.translation?.text}</p>
                                <p className="text-xs text-secondary mt-1">Frequency Rank: {example.avgFreqRank}</p>
                                <div className="mt-4 flex gap-4">
                                  <CopyButton
                                    text={`${word}: \n\n${example.text}\n${example.translation?.text}\n- - - - -\n`}
                                    className="relative right-0"
                                  />
                                  <button
                                    className="text-smokewhite opacity-50 active:opacity-100 active:text-blue-400"
                                    onClick={() => {
                                      setSentenceParams(sentenceParams);
                                      playSentence();
                                    }}
                                  >
                                    <LucideVolume2 className="-mt-0.5 w-6 h-6" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                </div>
              </>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
