import { cn, useElementOutOfView } from "@/utils";
import { useDebounce, useSmoothScroll, useWindowSize } from "@/hooks";
import { Virtualizer } from "@tanstack/react-virtual";

export function ScrollToCurrentButton({
  currentSentenceIdx,
  virtualizer,
  element,
  totalSentences,
}: {
  currentSentenceIdx: number;
  virtualizer: Virtualizer<Window, Element>;
  element: HTMLDivElement;
  totalSentences: number;
}) {
  const { isOutOfView, direction } = useElementOutOfView(currentSentenceIdx, totalSentences);
  const actualDirection = useDebounce(direction, 200);

  const { width } = useWindowSize();

  const left =
    width < 810
      ? element?.getBoundingClientRect().left + element?.getBoundingClientRect().width - 48
      : element?.getBoundingClientRect().left + element?.getBoundingClientRect().width - 32;

  const smoothScrollToIndex = useSmoothScroll(virtualizer);

  return (
    <button
      style={{
        left,
      }}
      onClick={() => {
        smoothScrollToIndex(currentSentenceIdx - 1, {
          align: "start",
          duration: 1000,
        });
        // if (direction === "top") {
        //   virtualizer.scrollToOffset(virtualizer.getOffsetForIndex(currentSentenceIdx)[0], {
        //     behavior: "smooth",
        //     align: virtualizer.getOffsetForIndex(currentSentenceIdx)[1],
        //   });
        // } else {
        //   virtualizer.scrollToIndex(currentSentenceIdx + 5, {
        //     behavior: "smooth",
        //     align: "center",
        //   });
        // }
      }}
      className={cn(
        "fixed max-[810px]:bottom-20 bottom-4 bg-hovered/50 backdrop-blur-sm active:bg-hovered text-white w-9 h-9 grid place-items-center pb-2.5 pt-1.5 px-2 rounded-md duration-200 z-30",
        isOutOfView ? "opacity-100" : "opacity-0"
      )}
    >
      {actualDirection === "top" && "↑"}
      {actualDirection === "bottom" && "↓"}
    </button>
  );
}
