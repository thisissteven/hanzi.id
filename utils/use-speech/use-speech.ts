import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createSpeechEngine, PlayingState } from "./speech";
import { franc } from "franc";

const useSpeech = (sentences: Array<string>) => {
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [currentWordRange, setCurrentWordRange] = useState([0, 0]);
  const [playbackState, setPlaybackState] = useState<PlayingState>("paused");

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

      return createSpeechEngine(
        {
          onBoundary: (e: SpeechSynthesisEvent) => {
            if (e.name === "word") {
              const previousIndex = lastChar.current.sentence.length - e.utterance.text.length;
              const inconsistent =
                lastChar.current.sentence.length - e.utterance.text.length !== lastChar.current.index;
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
          onStateUpdate: (state: PlayingState) => {},
        },
        voices.find((voice) => voice.lang === localeMapping[locale])?.name ?? voices[0]?.name
      );
    }

    return null;
  }, [sentences]);

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
    setPlaybackState("playing");
    isPlaying.current = true;
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
