import { useState, useEffect, useRef, useCallback } from "react";
import { preload } from "swr";
import useSWRImmutable from "swr/immutable";

export interface Response {
  mp3: string;
  text: string;
  timing: Timing[];
}

export interface Timing {
  time: number;
  type: string;
  start: number;
  end: number;
  value: string;
}

export const useSpeechManager = (
  sentences: string[],
  {
    rate,
    onEndCallback,
    baseUrl,
  }: {
    rate: number;
    onEndCallback: () => void;
    baseUrl: (index: number) => string;
  }
) => {
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [currentWordRange, setCurrentWordRange] = useState<[number, number]>([0, 0]);
  const [playbackState, setPlaybackState] = useState<"playing" | "paused">("paused");

  const playbackStateRef = useRef(playbackState);
  const rateRef = useRef(rate);
  const lastHighlightedWord = useRef<[number, number] | null>([0, 0]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();

      const audio = audioRef.current;

      audio.onended = async () => {
        lastHighlightedWord.current = null;
        await new Promise((resolve) => setTimeout(resolve, 300 / rateRef.current));
        setCurrentWordRange([0, 0]);
        setCurrentSentenceIdx((prev) => {
          if (prev < sentences.length - 1) {
            return prev + 1;
          } else {
            setPlaybackState("paused");
            playbackStateRef.current = "paused";
            onEndCallback();
            return prev;
          }
        });
      };
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.onended = null;
        audioRef.current.ontimeupdate = null;
      }
    };
  }, [onEndCallback, sentences.length]);

  const key = baseUrl(currentSentenceIdx);
  const { data } = useSWRImmutable<Response>(
    key.includes("undefined") ? undefined : key,
    async (_: string) => {
      const contentUrl = `https://content.hanzi.id/${baseUrl(currentSentenceIdx)}`;
      const response = await fetch(contentUrl);
      return response.json();
    },
    {
      onSuccess: async (_, key) => {
        const nextSentenceIndex = key.split("/").pop()?.split(".")[0] ?? "0";
        const nextKey = baseUrl(parseInt(nextSentenceIndex));
        if (nextKey) {
          preload(nextKey, async (_: string) => {
            const contentUrl = `https://content.hanzi.id/${baseUrl(currentSentenceIdx)}`;
            const response = await fetch(contentUrl);
            return response.json();
          });
        }
      },
    }
  );

  useEffect(() => {
    if (!audioRef.current || !data) return;

    const audio = audioRef.current;
    audio.playbackRate = rateRef.current;
    let animationFrameId: number;
    let lastUpdateTime = 0;
    const fps = 30;
    const interval = 1000 / fps;

    const updateWordHighlight = (currentTime: number) => {
      if (!audio) return;

      if (currentTime - lastUpdateTime >= interval) {
        lastUpdateTime = currentTime;
        const adjustedTime = audio.currentTime * 1000;

        const currentWord = data.timing.find((word, index) => {
          const nextWord = data.timing[index + 1];
          return (
            (adjustedTime >= word.time && nextWord && adjustedTime < nextWord.time) ||
            (adjustedTime >= word.time && index === data.timing.length - 1)
          );
        });

        if (currentWord) {
          const newRange: [number, number] = [currentWord.start, currentWord.end];

          // Only update state if it's actually different
          if (
            lastHighlightedWord.current &&
            lastHighlightedWord.current[1] < newRange[1]
          ) {
            setCurrentWordRange(newRange);
            lastHighlightedWord.current = newRange;
          }
        }
      }

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(updateWordHighlight);
    };

    // Start animation after slight delay
    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(updateWordHighlight);
    }, 300 / rateRef.current);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [data]);

  useEffect(() => {
    if (!audioRef.current || !data) return;

    const audio = audioRef.current;
    const src = `data:audio/mpeg;base64,${data.mp3}`;

    if (audio.src !== src) {
      audio.src = src;
      audio.load();
    }

    audio.onloadeddata = () => {
      audio.playbackRate = rateRef.current;

      if (playbackStateRef.current === "playing") {
        lastHighlightedWord.current = [0, 0];
        audio.play();
      }
    };
  }, [data]);

  useEffect(() => {
    if (rateRef.current !== rate) {
      rateRef.current = rate;
    }
  }, [rate]);

  const play = () => {
    audioRef.current?.play();
    setPlaybackState("playing");
    playbackStateRef.current = "playing";
  };

  const pause = () => {
    audioRef.current?.pause();
    setPlaybackState("paused");
    playbackStateRef.current = "paused";
  };

  const toSentence = useCallback((index: number) => {
    setCurrentSentenceIdx(index);
    setCurrentWordRange([0, 0]);
    lastHighlightedWord.current = [0, 0];
  }, []);

  return {
    currentSentenceIdx,
    currentWordRange,
    playbackState,
    play,
    pause,
    toSentence,
    sentences,
    audioRef,
  };
};
