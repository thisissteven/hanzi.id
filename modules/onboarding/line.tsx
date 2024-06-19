import { cn } from "@/utils";

type LineProps = {
  onMouseEnter: (e: React.MouseEvent<HTMLLIElement>) => void;
  index: number;
  currentSentenceIndex: number;
  children: React.ReactNode;
  isLast: boolean;
};

export function Line({ onMouseEnter, index, currentSentenceIndex, isLast, children }: LineProps) {
  const shouldBlur = index < currentSentenceIndex;
  const shouldShow = index === currentSentenceIndex;
  const isNotYetRevealed = index > currentSentenceIndex;
  const isRevealed = !isNotYetRevealed && index < currentSentenceIndex;

  return (
    <li
      onMouseEnter={onMouseEnter}
      className={cn(
        "relative px-3 md:px-4 ease duration-500",
        shouldBlur && !isLast && "blur-[2px] duration-[2000ms]",
        shouldShow && "opacity-100",
        isRevealed && !isLast && "opacity-30 duration-[2000ms]",
        isNotYetRevealed && "opacity-0",
        isRevealed && "cursor-default hover:blur-0 hover:opacity-100 hover:delay-0 hover:duration-200"
      )}
    >
      <p className="py-2 relative pointer-events-none">{children}</p>
    </li>
  );
}
