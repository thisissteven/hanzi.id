import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { LoadingBar } from ".";

export function LoadMore({ whenInView, isEnd }: { whenInView: () => void; isEnd?: boolean }) {
  const loaderRowRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const loaderRow = loaderRowRef.current;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        whenInView();
      }
    });

    if (loaderRow) {
      observer.observe(loaderRow);
    }

    return () => {
      if (loaderRow) {
        observer.unobserve(loaderRow);
      }
    };
  }, [whenInView]);

  if (isEnd) return null;

  const visible = isEnd === false || isEnd === undefined;

  return (
    <AnimatePresence mode="wait">
      <div
        ref={loaderRowRef}
        style={{
          height: 72,
        }}
        className="relative flex items-center justify-center"
      >
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "tween", duration: 0.2 }}
            className="grid place-items-center absolute inset-0 h-full z-50 bg-black/50"
          >
            {<LoadingBar visible />}
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
