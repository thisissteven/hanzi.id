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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch the current sentence audio
  const key = baseUrl(currentSentenceIdx);
  const { data } = useSWRImmutable<Response>(
    key.includes("undefined") ? undefined : key,
    async (_: string) => {
      const contentUrl = `https://content.hanzi.id/${baseUrl(currentSentenceIdx)}`;
      const response = await fetch(contentUrl);
      return response.json();
    }
    // {
    //   onSuccess: async () => {
    //     // Prefetch the next sentence to minimize loading time
    //     const nextKey = baseUrl(currentSentenceIdx + 1);
    //     if (nextKey) {
    //       preload(nextKey, async (_: string) => {
    //         const contentUrl = `https://content.hanzi.id/${baseUrl(currentSentenceIdx)}`;
    //         const response = await fetch(contentUrl);
    //         return response.json();
    //       });
    //     }
    //   },
    // }
  );

  useEffect(() => {
    if (data && audioRef.current) {
      const src = `data:audio/mpeg;base64,${data.mp3}`;
      audioRef.current.src = src;
      audioRef.current.load();
    }
  }, [data]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplay = () => setPlaybackState("playing");
      audioRef.current.onpause = () => setPlaybackState("paused");

      audioRef.current.onended = () => {
        setCurrentWordRange([0, 0]); // Reset word range
        if (currentSentenceIdx < sentences.length - 1) {
          setCurrentSentenceIdx((prev) => prev + 1);
        } else {
          onEndCallback();
        }
      };

      audioRef.current.ontimeupdate = () => {
        if (!data) return;
        const currentTime = audioRef.current!.currentTime * 1000; // Convert to ms
        const currentWord = data.timing.find((word) => currentTime >= word.time && currentTime < word.time + 200);
        if (currentWord) {
          setCurrentWordRange([currentWord.start, currentWord.end]);
        }
      };
    }
  }, [data, currentSentenceIdx, sentences.length, onEndCallback]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.oncanplaythrough = () => {
        if (playbackState === "playing") {
          audioRef.current?.play();
        }
      };
    }
  }, [currentSentenceIdx, playbackState]);

  const play = () => {
    audioRef.current?.play();
  };

  const pause = () => {
    audioRef.current?.pause();
  };

  const toSentence = useCallback((index: number) => {
    setCurrentSentenceIdx(index);
    setCurrentWordRange([0, 0]); // Reset word range
  }, []);

  useEffect(() => {
    if (playbackState === "playing" && audioRef.current?.paused) {
      audioRef.current?.play();
    }
  }, [currentSentenceIdx, playbackState]);

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
