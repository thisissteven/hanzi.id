type CurrentSentenceProps = {
  sentence: string;
  wordRange: number[];
  currentSentenceIdx: number;
  mode: "normal" | "flash";
  isPlaying: boolean;
};

export function FlashSentence({ sentence, wordRange, currentSentenceIdx, mode, isPlaying }: CurrentSentenceProps) {
  const [start, end] = wordRange;

  const currentWord = sentence.slice(start, end);

  if (!sentence) return null;

  if (mode === "flash" && isPlaying) {
    return (
      <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        <div className="grid place-items-center gap-2">
          <div className="w-36 h-px bg-smoke"></div>
          <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-neutral-50">{currentWord}</span>
          <div className="opacity-0" aria-hidden>
            行
          </div>
          <div className="w-36 h-px bg-smoke"></div>
        </div>
      </div>
    );
  }

  return null;
}
