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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();

      const audio = audioRef.current;

      audio.onended = async () => {
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

    // Normalize timing data based on playback rate
    const normalizedTimings = data.timing.map((word) => ({
      ...word,
      normalizedTime: word.time / audio.playbackRate, // Adjust timing for speed
    }));

    const updateWordHighlight = () => {
      if (!audio) return;
      const adjustedTime = (audio.currentTime * 1000) / audio.playbackRate; // Normalize current time

      const currentWord = normalizedTimings.find((word, index) => {
        const nextWord = normalizedTimings[index + 1];
        return (
          (adjustedTime >= word.normalizedTime && nextWord && adjustedTime < nextWord.normalizedTime) ||
          (adjustedTime >= word.normalizedTime && index === normalizedTimings.length - 1) // Last word case
        );
      });

      if (currentWord) {
        setCurrentWordRange([currentWord.start, currentWord.end]);
      }

      animationFrameId = requestAnimationFrame(updateWordHighlight);
    };

    animationFrameId = requestAnimationFrame(updateWordHighlight);

    return () => cancelAnimationFrame(animationFrameId);
  }, [data]); // Re-run when audio data or rate changes

  useEffect(() => {
    if (data && audioRef.current) {
      const audio = audioRef.current;
      const src = `data:audio/mpeg;base64,${data.mp3}`;
      audio.src = src;
      audio.load();

      audio.onloadeddata = () => {
        audio.playbackRate = rateRef.current;

        if (playbackStateRef.current === "playing") {
          audio.play();
        }
      };
    }
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
