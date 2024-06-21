import React from "react";

type Direction = "top" | "bottom" | null;

export function useElementOutOfView(elementId: string) {
  const [isOutOfView, setIsOutOfView] = React.useState(false);
  const [direction, setDirection] = React.useState<Direction>(null);

  const scrollToCurrentWord = React.useCallback(() => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementTop = element.getBoundingClientRect().top;
      const screenHeight = window.innerHeight;
      const targetTop = screenHeight / 2;

      window.scrollBy({
        top: elementTop - targetTop,
        behavior: "smooth",
      });
    }
  }, [elementId]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    function checkElementOutOfView() {}

    window.addEventListener("scroll", () => {
      const element = document.getElementById(elementId);

      if (!element) {
        setIsOutOfView(true);
      } else {
        setIsOutOfView(false);
      }
    });

    return () => {
      window.removeEventListener("scroll", () => {
        const element = document.getElementById(elementId);

        if (!element) {
          setIsOutOfView(true);
        } else {
          setIsOutOfView(false);
        }
      });
    };
  }, [elementId]);

  return { isOutOfView, direction, scrollToCurrentWord };
}
