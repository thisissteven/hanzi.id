import { cn } from "@/utils";
import { useReading } from "../layout";

type LineProps = {
  index: number;
  paused?: boolean;
  sentences: string[];
  currentSentenceIndex: number;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"li">;

export function Line({ index, paused = false, sentences, currentSentenceIndex, children, ...rest }: LineProps) {
  const { blurred } = useReading();

  const shouldBlur = index < currentSentenceIndex && !paused;
  const isCurrentSentence = index === currentSentenceIndex;
  const isNotYetRevealed = index > currentSentenceIndex;
  const isRevealed = !isNotYetRevealed && index < currentSentenceIndex;

  const isPausedAndNotYetRevealed = paused && isNotYetRevealed;

  const isLast = index === sentences.length - 1;

  return (
    <li
      className={cn(
        "relative px-3 md:px-4 ease duration-500",
        shouldBlur && !isLast && paused && blurred && "blur-[2px] duration-1000",
        shouldBlur && !isLast && !paused && blurred && "blur-[2px] transition-two-thousand",
        isCurrentSentence && "opacity-100",
        isRevealed && !isLast && paused && "opacity-30 duration-1000",
        isRevealed && !isLast && !paused && "opacity-30 transition-two-thousand",
        isNotYetRevealed && blurred && "opacity-0",
        isNotYetRevealed && !blurred && "opacity-30",
        isRevealed && "cursor-default hover:blur-0 hover:opacity-50 hover:delay-0 hover:duration-200",
        isPausedAndNotYetRevealed &&
          "opacity-30 duration-1000 cursor-default hover:opacity-50 hover:delay-0 hover:duration-200"
      )}
      {...rest}
    >
      <p className="py-2 relative pointer-events-none">{children}</p>
    </li>
  );
}
