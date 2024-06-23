import React, { DependencyList } from "react";

export function useScrollWhenSpeaking(deps: DependencyList = []) {
  const currentWordRef = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    if (currentWordRef.current) {
      const element = currentWordRef.current;
      const elementTop = element.getBoundingClientRect().top;
      const screenHeight = window.innerHeight;
      const targetTop = screenHeight / 8;

      window.scrollBy({
        top: elementTop - 180 - targetTop,
        behavior: "smooth",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  return currentWordRef;
}

export function useScrollWhenSpeakingWithRef(ref: React.MutableRefObject<HTMLElement>, deps: any[] = []) {
  const currentWordRef = React.useRef<HTMLLIElement | null>(null);

  React.useEffect(() => {
    if (currentWordRef.current && ref.current) {
      const element = currentWordRef.current;
      const elementTop = element.getBoundingClientRect().top - ref.current.getBoundingClientRect().top;
      const containerHeight = ref.current.clientHeight;
      const targetTop = containerHeight / 1.5;

      ref.current.scrollBy({
        top: elementTop - targetTop,
        behavior: "smooth",
      });
    }
  }, [deps, ref]);

  return currentWordRef;
}
