import { cn, useElementOutOfView } from "@/utils";
import { useDebounce, useWindowSize } from "@/hooks";

export function ScrollToCurrentButton({
  currentSentenceIdx,
  virtualizer,
  element,
}: {
  currentSentenceIdx: number;
  virtualizer: any;
  element: HTMLDivElement;
}) {
  const { isOutOfView, direction } = useElementOutOfView(currentSentenceIdx);
  const actualDirection = useDebounce(direction, 200);

  const { width } = useWindowSize();

  const left =
    width < 810
      ? element?.getBoundingClientRect().left + element?.getBoundingClientRect().width - 48
      : element?.getBoundingClientRect().left + element?.getBoundingClientRect().width - 32;

  return (
    <button
      style={{
        left,
      }}
      onClick={() => {
        virtualizer.scrollToIndex(currentSentenceIdx, {
          behavior: "smooth",
        });
      }}
      className={cn(
        "fixed max-[810px]:bottom-20 bottom-4 bg-hovered/50 backdrop-blur-sm active:bg-hovered text-white w-9 h-9 grid place-items-center pb-2.5 pt-1.5 px-2 rounded-md duration-200 z-50",
        isOutOfView ? "opacity-100" : "opacity-0"
      )}
    >
      {actualDirection === "top" && "↑"}
      {actualDirection === "bottom" && "↓"}
    </button>
  );
}
