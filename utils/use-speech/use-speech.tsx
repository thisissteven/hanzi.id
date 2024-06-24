import { useState, useEffect, useRef, useMemo } from "react";
import { createSpeechEngine, PlayingState } from "./speech";
import { franc } from "franc";
import { toast } from "sonner";
import useIsMobile from "@/hooks/useIsMobile";

const useSpeech = (
  sentences: Array<string>,
  {
    rate,
  }: {
    rate: number;
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
    const localeMapping = {
      eng: "en-US", // English
      cmn: "zh-CN", // Simplified Chinese (Mandarin)
    } as const;
    const locale = franc(sentences[0]) as keyof typeof localeMapping;

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
            // reset
            lastChar.current = {
              index: 0,
              sentence: sentences[0],
            };
            isPlaying.current = false;
            return 0;
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
  }, [isMobile, rate, sentences]);

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

  const toSentence = async (index: number) => {
    setCurrentWordRange([0, 0]);
    currentCharIndex.current = 0;
    lastChar.current = {
      index: 0,
      sentence: sentences[index],
    };

    setCurrentSentenceIdx(index);
  };

  return {
    currentSentenceIdx,
    currentWordRange,
    playbackState,
    play,
    pause,
    toSentence,
  };
};

export { useSpeech };
