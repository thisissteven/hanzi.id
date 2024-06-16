import React from "react";

export function useOnboarded() {
  const [isOnboarded, setIsOnboarded] = React.useState(false);

  React.useEffect(() => {
    const focusOnboarded = localStorage.getItem("focus_onboarded");
    if (focusOnboarded) {
      setIsOnboarded(true);
    }
  }, []);

  return { isOnboarded, setIsOnboarded };
}
