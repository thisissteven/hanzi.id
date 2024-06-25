let isListenerAdded = false;

export function push(
  router: {
    push: (path: string, options: { scroll: boolean }) => void;
  },
  path: string
) {
  if (isListenerAdded) return;

  const currentScrollPosition = window.scrollY || document.documentElement.scrollTop;

  if (currentScrollPosition === 0) {
    // If already at the top, directly navigate
    router.push(path, {
      scroll: false,
    });
  } else {
    // Scroll to the top smoothly
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Set the listener added flag to true
    isListenerAdded = true;

    // Listen for the scroll event to detect when the scroll has completed
    const handleScroll = () => {
      if (window.scrollY === 0) {
        // Remove the event listener to prevent it from firing multiple times
        window.removeEventListener("scroll", handleScroll);

        // Navigate to the new route
        router.push(path, {
          scroll: false,
        });

        // Reset the listener added flag to false
        isListenerAdded = false;
      }
    };

    // Add the event listener
    window.addEventListener("scroll", handleScroll);
  }
}

export function back(router: { back: () => void }) {
  if (isListenerAdded) return;

  const currentScrollPosition = window.scrollY || document.documentElement.scrollTop;

  if (currentScrollPosition === 0) {
    // If already at the top, directly navigate
    router.back();
  } else {
    // Scroll to the top smoothly
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Set the listener added flag to true
    isListenerAdded = true;

    // Listen for the scroll event to detect when the scroll has completed
    const handleScroll = () => {
      if (window.scrollY === 0) {
        // Remove the event listener to prevent it from firing multiple times
        window.removeEventListener("scroll", handleScroll);

        // Navigate to the new route
        router.back();

        // Reset the listener added flag to false
        isListenerAdded = false;
      }
    };

    // Add the event listener
    window.addEventListener("scroll", handleScroll);
  }
}

export function replace(
  router: {
    replace: (path: string, options: { scroll: boolean }) => void;
  },
  path: string
) {
  if (isListenerAdded) return;

  const currentScrollPosition = window.scrollY || document.documentElement.scrollTop;

  if (currentScrollPosition === 0) {
    // If already at the top, directly navigate
    router.replace(path, {
      scroll: false,
    });
  } else {
    // Scroll to the top smoothly
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Set the listener added flag to true
    isListenerAdded = true;

    // Listen for the scroll event to detect when the scroll has completed
    const handleScroll = () => {
      if (window.scrollY === 0) {
        // Remove the event listener to prevent it from firing multiple times
        window.removeEventListener("scroll", handleScroll);

        // Navigate to the new route
        router.replace(path, {
          scroll: false,
        });

        // Reset the listener added flag to false
        isListenerAdded = false;
      }
    };

    // Add the event listener
    window.addEventListener("scroll", handleScroll);
  }
}

export function replaceRead(
  router: {
    replace: (path: string, options: { scroll: boolean }) => void;
  },
  path: string,
  scrollFn: () => void
) {
  if (isListenerAdded) return;

  const currentScrollPosition = window.scrollY || document.documentElement.scrollTop;

  if (currentScrollPosition === 0) {
    // If already at the top, directly navigate
    router.replace(path, {
      scroll: false,
    });
  } else {
    // Scroll to the top smoothly
    scrollFn();

    // Set the listener added flag to true
    isListenerAdded = true;

    // Listen for the scroll event to detect when the scroll has completed
    const handleScroll = () => {
      if (window.scrollY === 0) {
        // Remove the event listener to prevent it from firing multiple times
        window.removeEventListener("scroll", handleScroll);

        // Navigate to the new route
        router.replace(path, {
          scroll: false,
        });

        // Reset the listener added flag to false
        isListenerAdded = false;
      }
    };

    // Add the event listener
    window.addEventListener("scroll", handleScroll);
  }
}

export function pushRead(
  router: {
    push: (path: string, options: { scroll: boolean }) => void;
  },
  path: string,
  scrollFn: () => void
) {
  if (isListenerAdded) return;

  const currentScrollPosition = window.scrollY || document.documentElement.scrollTop;

  if (currentScrollPosition === 0) {
    // If already at the top, directly navigate
    router.push(path, {
      scroll: false,
    });
  } else {
    // Scroll to the top smoothly
    scrollFn();

    // Set the listener added flag to true
    isListenerAdded = true;

    // Listen for the scroll event to detect when the scroll has completed
    const handleScroll = () => {
      if (window.scrollY === 0) {
        // Remove the event listener to prevent it from firing multiple times
        window.removeEventListener("scroll", handleScroll);

        // Navigate to the new route
        router.push(path, {
          scroll: false,
        });

        // Reset the listener added flag to false
        isListenerAdded = false;
      }
    };

    // Add the event listener
    window.addEventListener("scroll", handleScroll);
  }
}
