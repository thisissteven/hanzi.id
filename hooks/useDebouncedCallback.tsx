import * as React from "react";

export function useDebouncedCallback() {
  const isFirstTime = React.useRef(true);
  const timeoutId = React.useRef<NodeJS.Timeout>();

  const debounce = React.useCallback((fn: (...args: unknown[]) => unknown, ms = 300) => {
    return function (this: unknown, ...args: unknown[]) {
      clearTimeout(timeoutId.current);
      if (isFirstTime.current) {
        fn.apply(this, args);
        isFirstTime.current = false;
        timeoutId.current = setTimeout(() => {
          isFirstTime.current = true;
        }, ms);
      } else {
        timeoutId.current = setTimeout(() => {
          fn.apply(this, args);
        }, ms);
      }
    };
  }, []);

  return debounce;
}
