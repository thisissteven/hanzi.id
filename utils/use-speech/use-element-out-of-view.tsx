import React from "react";
import throttle from "lodash.throttle";

type Direction = "top" | "bottom" | null;

export function useElementOutOfView(currentSentenceIndex: number, totalSentences: number) {
  const [isOutOfView, setIsOutOfView] = React.useState(false);
  const [direction, setDirection] = React.useState<Direction>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const checkElementOutOfView = throttle(() => {
      const elements = document.querySelectorAll("[data-index]");
      const currentElement = document.querySelector(`[data-index="${currentSentenceIndex}"]`);

      if (!currentElement) {
        setIsOutOfView(true);
      } else {
        if (currentSentenceIndex < 5 || currentSentenceIndex >= totalSentences - 5) {
          setIsOutOfView(false);
          return;
        }

        if (currentElement) {
          const index = Array.from(elements).indexOf(currentElement);
          if (index === 0 || index >= elements.length - 4) {
            setIsOutOfView(true);
          } else {
            setIsOutOfView(false);
          }
        }
      }

      const firstDataIndex = elements[0];

      if (firstDataIndex) {
        const sentenceIndex = firstDataIndex.getAttribute("data-index");

        if (sentenceIndex) {
          const index = parseInt(sentenceIndex, 10);

          if (index + 2 <= currentSentenceIndex) {
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
  }, [currentSentenceIndex, totalSentences]);

  return { isOutOfView, direction };
}
