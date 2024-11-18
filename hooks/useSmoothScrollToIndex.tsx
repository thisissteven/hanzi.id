import * as React from "react";

import { Virtualizer } from "@tanstack/react-virtual";

function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

type EaseInOutType = "quint" | "cubic" | "sine" | "quad";

function easeInOut(t: number, type: EaseInOutType) {
  switch (type) {
    case "quint":
      return easeInOutQuint(t);
    case "cubic":
      return easeOutCubic(t);
    case "sine":
      return easeInOutSine(t);
    case "quad":
      return easeInOutQuad(t);
  }
}

// base on smooth scroll example from v2 https://github.com/TanStack/virtual/blob/main/examples/smooth-scroll/src/main.jsx
export const useSmoothScroll = (virtualizer: Virtualizer<Window, Element>, easeInOutType: EaseInOutType = "quint") => {
  const scrollingRef = React.useRef(0);

  return React.useCallback(
    (
      index: number,
      {
        align: initialAlign,
        duration = 1000,
        additionalOffset = 0,
      }: { align?: "start" | "center" | "end" | "auto"; duration?: number; additionalOffset?: number } = {}
    ) => {
      const start = virtualizer.scrollOffset ?? 0;
      const startTime = (scrollingRef.current = Date.now());
      const [, align] = virtualizer.getOffsetForIndex(index, initialAlign) ?? [0, "start"];

      const run = () => {
        if (scrollingRef.current !== startTime) return;
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = easeInOut(Math.min(elapsed / duration, 1), easeInOutType);
        const [offset] = virtualizer.getOffsetForIndex(index, align) ?? [0, "start"];
        const interpolated = start + (offset - start) * progress;

        if (elapsed < duration) {
          virtualizer.scrollToOffset(interpolated + additionalOffset, { align: "start" });
          requestAnimationFrame(run);
        } else {
          virtualizer.scrollToOffset(interpolated + additionalOffset, { align: "start" });
        }
      };

      requestAnimationFrame(run);
    },
    [easeInOutType, virtualizer]
  );
};
