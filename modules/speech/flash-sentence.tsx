import { cn } from "@/utils";

type CurrentSentenceProps = {
  sentence: string;
  wordRange: number[];
  currentSentenceIdx: number;
  mode: "normal" | "flash";
  isPlaying: boolean;
};

export function FlashSentence({ sentence, wordRange, mode, isPlaying }: CurrentSentenceProps) {
  const [start, end] = wordRange;

  const currentWord = sentence.slice(start, end);

  if (!sentence) return null;

  if (mode === "flash" && isPlaying) {
    return (
      <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        <div className="grid place-items-center gap-2">
          <div className="w-36 h-px bg-smoke"></div>
          <div className={cn("whitespace-nowrap text-neutral-50", !currentWord && "opacity-0")}>
            {currentWord ? currentWord : "词"}
          </div>
          <div className="w-36 h-px bg-smoke"></div>
        </div>
      </div>
    );
  }

  return null;
}
