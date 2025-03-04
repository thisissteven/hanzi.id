import { cn, useScrollWhenSpeaking } from "@/utils";
import React from "react";

type CurrentSentenceProps = {
  sentence: string;
  wordRange: number[];
  currentSentenceIdx: number;
  mode: "normal" | "flash";
  isPlaying: boolean;
};

export function CurrentSentence({ sentence, wordRange, currentSentenceIdx, mode, isPlaying }: CurrentSentenceProps) {
  const [start, end] = wordRange;

  const ref = useScrollWhenSpeaking([currentSentenceIdx]);

  const currentWord = sentence.slice(start, end);

  if (!sentence) return null;

  return (
    <span>
      {sentence.slice(0, start)}
      <span
        ref={ref}
        // className="relative border-b-[1.5px] border-pink-300 rounded-x-full py-0.5"
        className="relative rounded-b-md bg-indigo-300/30 rounded-t border-b-[1.5px] border-sky-300 py-0.5 box-clone"
      >
        {currentWord}
      </span>
      <span className={cn(isPlaying && "opacity-30", start !== 0 && "opacity-30", "duration-200")}>
        {sentence.slice(end)}
      </span>
    </span>
  );
}
