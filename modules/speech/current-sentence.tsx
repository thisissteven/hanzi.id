import { useScrollWhenSpeaking } from "@/utils";
import React from "react";

type CurrentSentenceProps = {
  sentence: string;
  wordRange: number[];
  currentSentenceIdx: number;
};

export function CurrentSentence({ sentence, wordRange, currentSentenceIdx }: CurrentSentenceProps) {
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
      {sentence.slice(end)}
    </span>
  );
}
