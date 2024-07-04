import { useState, useEffect, useRef, useMemo } from "react";
import { createSpeechEngine, PlayingState } from "./speech";
import { franc } from "franc";
import { toast } from "sonner";
import useIsMobile from "@/hooks/useIsMobile";
import React from "react";
import { useParagraphs } from "./use-paragraphs";
import { useReading } from "@/modules/layout";
import { useRouter } from "next/router";
import { useChapterById } from "@/modules/speech";
import { useBookDetails } from "@/pages/read/[id]";
import { useLocale } from "@/locales/use-locale";
import { usePreferences } from "@/components";

const useSpeechManager = (
  sentences: Array<string>,
  {
    rate,
    onEndCallback,
  }: {
    rate: number;
    onEndCallback: () => void;
  }
) => {
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [currentWordRange, setCurrentWordRange] = useState([0, 0]);
  const [playbackState, setPlaybackState] = useState<PlayingState>("paused");

  const isMobile = useIsMobile();

  const lastChar = useRef({
    index: 0,
    sentence: sentences[0],
  });
  const currentCharIndex = useRef(0);
  const isPlaying = useRef(false);

  const speechEngine = useMemo(() => {
    if (typeof window !== "undefined") window.speechSynthesis.cancel();

    const localeMapping = {
      eng: "en-US", // English
      cmn: "zh-CN", // Simplified Chinese (Mandarin)
      und: "zh-CN", // Simplified Chinese (Mandarin)
    } as const;
    const sentenceToUse = sentences.find((sentence) => sentence.length > 0) ?? "";
    const locale = franc(sentenceToUse) as keyof typeof localeMapping;

    if (typeof window !== "undefined") {
      const voices = speechSynthesis.getVoices() ?? [];

      return createSpeechEngine({
        onBoundary: (e: SpeechSynthesisEvent) => {
          if (e.name === "word") {
            const previousIndex = lastChar.current.sentence.length - e.utterance.text.length;
            const inconsistent = lastChar.current.sentence.length - e.utterance.text.length !== lastChar.current.index;
            const offsetIndex = inconsistent ? previousIndex - e.charLength - 1 : lastChar.current.index;

            const wordStart = e.charIndex + offsetIndex;
            const wordEnd = e.charIndex + e.charLength + offsetIndex;

            setCurrentWordRange([wordStart, wordEnd]);

            currentCharIndex.current = wordStart;
          }
        },
        onEnd: (e) => {
          // handle pause + different chrome behavior
          if (e.charIndex !== e.utterance.text.length && e.charIndex !== 0 && e.charLength !== 0) {
            return;
          }

          currentCharIndex.current = 0;
          lastChar.current.index = 0;
          setCurrentWordRange([0, 0]);
          setCurrentSentenceIdx((prev) => {
            if (prev < sentences.length - 1) {
              lastChar.current.sentence = sentences[prev + 1];
              return prev + 1;
            }

            // end
            setPlaybackState("paused");
            isPlaying.current = false;
            onEndCallback();
            return prev;
          });
        },
        onStateUpdate: (state: PlayingState) => {
          if (state === "playing") {
            setPlaybackState("playing");
            isPlaying.current = true;
          }
          if (state === "audio-error" && !isMobile) {
            setTimeout(() => {
              setPlaybackState("paused");
              isPlaying.current = false;
            }, 500);
            toast.custom(
              (t) => (
                <div className="font-sans mx-auto select-none w-fit pointer-events-none rounded-full bg-[#232323] whitespace-nowrap py-3 px-6 flex items-center gap-3">
                  <div className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-rose-500 indicator"></div>
                  <span className="shrink-0">Audio source not found.</span>
                </div>
              ),
              {
                id: "audio-source-not-found",
                duration: 5000,
              }
            );
          }
        },
        voice: voices.find((voice) => voice.lang === localeMapping[locale]) ?? voices[0],
        rate: rate,
        isMobile,
      });
    }

    return null;
  }, [isMobile, onEndCallback, rate, sentences]);

  useEffect(() => {
    if (typeof window !== "undefined" && speechEngine) {
      speechEngine.cancel();
      speechEngine.load(sentences[currentSentenceIdx]);
      if (isPlaying.current) {
        speechEngine.play();
      }
    }
  }, [currentSentenceIdx, sentences, speechEngine]);

  const play = () => {
    speechEngine?.play();
  };

  const pause = () => {
    setPlaybackState("paused");
    isPlaying.current = false;
    speechEngine?.pause();

    const remainingText = sentences[currentSentenceIdx].slice(currentCharIndex.current);
    if (remainingText) {
      speechEngine?.cancel();
      speechEngine?.load(remainingText);

      lastChar.current = {
        index: currentCharIndex.current,
        sentence: sentences[currentSentenceIdx],
      };
    }
  };

  const toSentence = React.useCallback(
    (index: number) => {
      setCurrentWordRange([0, 0]);
      currentCharIndex.current = 0;
      lastChar.current = {
        index: 0,
        sentence: sentences[index],
      };

      setCurrentSentenceIdx(index);
    },
    [sentences]
  );

  return {
    currentSentenceIdx,
    currentWordRange,
    playbackState,
    play,
    pause,
    toSentence,
    sentences,
  };
};

const SpeechContext = React.createContext({} as ReturnType<typeof useSpeechManager>);

export const useSpeech = () => {
  return React.useContext(SpeechContext);
};

export function SpeechProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const isChapterPage = router.pathname === "/read/[id]/[chapterId]" || router.asPath === "/read/[id]/[chapterId]";

  React.useEffect(() => {
    if (!isChapterPage && typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      toast.dismiss("last-read");
    }
  }, [isChapterPage]);

  if (!isChapterPage) return children;
  return <SpeechContextProvider>{children}</SpeechContextProvider>;
}

function SpeechContextProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [_, rerender] = React.useReducer((s) => s + 1, 0);

  const bookId = router.query.id as string;
  const chapterId = router.query.chapterId as string;

  const { isSimplified } = usePreferences();

  const { data: chapter } = useChapterById(bookId, chapterId, isSimplified);
  const { data: book } = useBookDetails(bookId, isSimplified);

  const { sentences } = useParagraphs(chapter?.content ?? "", chapter?.book?.isUnique ?? false);
  const { speed } = useReading();

  const { t } = useLocale();

  const nextChapterId = React.useMemo(() => {
    try {
      return book?.chapters[book?.chapters.findIndex((chapter) => chapter.id === chapterId) + 1];
    } catch {
      return null;
    }
  }, [book?.chapters, chapterId]);

  const onEndCallback = React.useCallback(() => {
    if (nextChapterId) {
      toast.custom(
        (_) => (
          <div className="border border-secondary/10 font-sans mx-auto min-w-[300px] select-none w-fit rounded-full bg-black whitespace-nowrap py-2 pl-6 pr-2 flex items-center gap-3">
            <div className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-sky-400 indicator-blue"></div>
            <span className="shrink-0 flex-1">{t.nextChapter}</span>
            <button
              className="px-2 pt-0.5 pb-1.5 w-16 h-10 shrink-0 rounded-full text-sm bg-sky-500/10 active:bg-sky-500/20 transition text-blue-300 font-medium"
              onClick={() => {
                router.replace(`/read/${bookId}/${nextChapterId.id}`);
              }}
            >
              &#x2192;
            </button>
          </div>
        ),
        {
          id: "next-chapter",
          duration: Infinity,
        }
      );
    }
  }, [bookId, nextChapterId, router, t.nextChapter]);

  const value = useSpeechManager(sentences, {
    rate: speed,
    onEndCallback,
  });

  const lastChapterId = React.useRef(chapterId);

  React.useEffect(() => {
    if (chapterId) {
      toast.dismiss("next-chapter");
      lastChapterId.current = chapterId;
      rerender();
    }
  }, [chapterId]);

  return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>;
}
