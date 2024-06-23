import React from "react";

type ButtonCooldownOptions = {
  maxClicks?: number;
  throttle?: number;
};

export function useThrottledClickHandler<T>(
  customHandleClick: T extends (...args: any) => void ? T : never,
  options?: ButtonCooldownOptions
) {
  const clickCountRef = React.useRef(0);

  const maxClicks = options?.maxClicks || 1;
  const throttleDuration = options?.throttle || 200;

  const [disabled, setDisabled] = React.useState(false);

  const handleClick = React.useCallback(
    (...args: any) => {
      if (clickCountRef.current >= maxClicks) {
        setDisabled(true);
        return;
      }
      customHandleClick(...args);
      clickCountRef.current += 1;
    },
    [customHandleClick, maxClicks]
  );

  React.useEffect(() => {
    const id = setInterval(() => {
      clickCountRef.current = 0;
      setDisabled(false);
    }, throttleDuration);

    return () => {
      clearInterval(id);
    };
  }, [throttleDuration]);

  return [handleClick as T, disabled] as const;
}
