import { useScrollWhenSpeaking } from "@/utils";
import React from "react";

type CurrentWordProps = {
  sentence: string;
  wordRange: number[];
  currentSentenceIdx: number;
};

export default function CurrentWord({ sentence, wordRange, currentSentenceIdx }: CurrentWordProps) {
  const [start, end] = wordRange;

  const ref = useScrollWhenSpeaking([currentSentenceIdx]);

  const currentWord = sentence.slice(start, end);

  if (!sentence) return null;

  return (
    <span>
      {sentence.slice(0, start)}
      <span ref={ref} className="relative border-b-[1.5px] border-amber-300 py-0.5">
        {currentWord}
      </span>
      {sentence.slice(end)}
    </span>
  );
}
