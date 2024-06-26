import React from "react";

export function useOnboarded() {
  const [isOnboarded, setIsOnboarded] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const focusOnboarded = localStorage.getItem("focus_onboarded");
    if (focusOnboarded) {
      setIsOnboarded(true);
    } else {
      setIsOnboarded(false);
    }
  }, []);

  return { isOnboarded, setIsOnboarded };
}
