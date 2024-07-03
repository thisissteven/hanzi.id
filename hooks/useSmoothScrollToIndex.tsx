import * as React from "react";

import { Virtualizer } from "@tanstack/react-virtual";

function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}
// base on smooth scroll example from v2 https://github.com/TanStack/virtual/blob/main/examples/smooth-scroll/src/main.jsx
export const useSmoothScroll = (virtualizer: Virtualizer<Window, Element>) => {
  const scrollingRef = React.useRef(0);

  return React.useCallback(
    (
      index: number,
      { align: initialAlign, duration = 1000 }: { align?: "start" | "center" | "end" | "auto"; duration?: number } = {}
    ) => {
      const start = virtualizer.scrollOffset;
      const startTime = (scrollingRef.current = Date.now());
      const [, align] = virtualizer.getOffsetForIndex(index, initialAlign);

      const run = () => {
        if (scrollingRef.current !== startTime) return;
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = easeInOutQuint(Math.min(elapsed / duration, 1));
        const [offset] = virtualizer.getOffsetForIndex(index, align);
        const interpolated = start + (offset - start) * progress;

        if (elapsed < duration) {
          virtualizer.scrollToOffset(interpolated, { align: "start" });
          requestAnimationFrame(run);
        } else {
          virtualizer.scrollToOffset(interpolated, { align: "start" });
        }
      };

      requestAnimationFrame(run);
    },
    [virtualizer]
  );
};
