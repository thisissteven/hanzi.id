import { BackRouteButton } from "@/components";
import { Layout, useFlashcard } from "@/modules/layout";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React from "react";

export default function FlashcardReview() {
  const router = useRouter();

  const numOfCards = router.query.numOfCards as string;
  const category = router.query.category as string;
  const chapter = router.query.chapter as string;

  const { flashcardItem } = useFlashcard(chapter);

  const previousWords = React.useRef<string[]>([]);

  const words = React.useMemo(() => {
    try {
      const allWords = flashcardItem?.words ?? [];

      if (category === "Random") {
        const sorted = allWords.sort(() => Math.random() - 0.5).slice(0, Number(numOfCards));
        previousWords.current = sorted;
        return sorted;
      }

      const [start, end] = category.split("-").map(Number);
      const toReturn = allWords.slice(start - 1, end);
      previousWords.current = toReturn;
      return toReturn;
    } catch {
      return previousWords.current;
    }
  }, [category, flashcardItem?.words, numOfCards]);

  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto md:px-8 pb-4">
          <div className="max-md:sticky top-0 md:h-[11.25rem] flex flex-col justify-end bg-black z-20 max-md:px-4 border-b-[1.5px] border-b-subtle">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "tween", duration: 0.2 }}
                className="w-fit"
              >
                <BackRouteButton className="max-md:my-3 mb-2" />
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <FlashcardReviewContent words={words} />
          </AnimatePresence>
        </main>
      </div>
    </Layout>
  );
}

function FlashcardReviewContent({ words }: { words: string[] }) {
  const [index, setIndex] = React.useState(0);

  const currentWord = words[index];

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-11.25rem)]">
      <h1 className="text-4xl font-bold">{currentWord}</h1>
      <div className="flex space-x-4">
        <button
          onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
          className="px-4 py-2 bg-softblack text-smokewhite rounded-md font-medium duration-200 active:bg-subtle"
        >
          Previous
        </button>
        <button
          onClick={() => setIndex((prev) => Math.min(words.length - 1, prev + 1))}
          className="px-4 py-2 bg-softblack text-smokewhite rounded-md font-medium duration-200 active:bg-subtle"
        >
          Next
        </button>
      </div>
    </div>
  );
}
