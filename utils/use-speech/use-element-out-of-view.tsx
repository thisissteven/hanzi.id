import React from "react";
import throttle from "lodash.throttle";

type Direction = "top" | "bottom" | null;

export function useElementOutOfView(currentSentenceIndex: number) {
  const [isOutOfView, setIsOutOfView] = React.useState(false);
  const [direction, setDirection] = React.useState<Direction>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const checkElementOutOfView = throttle(() => {
      const elementExists = document.querySelector(`[data-index="${currentSentenceIndex}"]`) !== null;

      if (!elementExists) {
        setIsOutOfView(true);
      } else {
        setIsOutOfView(false);
      }

      const firstDataIndex = document.querySelector("[data-index]");

      if (firstDataIndex) {
        const sentenceIndex = firstDataIndex.getAttribute("data-index");

        if (sentenceIndex) {
          const index = parseInt(sentenceIndex, 10);

          if (index < currentSentenceIndex) {
            setDirection("bottom");
          } else {
            setDirection("top");
          }
        }
      }
    }, 100);

    window.addEventListener("scroll", checkElementOutOfView);

    return () => {
      window.removeEventListener("scroll", checkElementOutOfView);
    };
  }, [currentSentenceIndex]);

  return { isOutOfView, direction };
}
