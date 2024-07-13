import { BackRouteButton, LoadingBar } from "@/components";
import { useLocale } from "@/locales/use-locale";
import { FlashcardReviewContent } from "@/modules/flashcards";
import { Layout, useFlashcard } from "@/modules/layout";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React from "react";
import useSWRImmutable from "swr/immutable";
import { FlashcardedResult } from "../api/flashcard/en";

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

  const { t, locale } = useLocale();
  const { data, isLoading } = useSWRImmutable<FlashcardedResult[]>(
    words.length > 0 ? `flashcard/${locale}?text=${words.join("-")}` : undefined,
    async (url: string) => {
      const response = await fetch(`/api/${url}`);
      const data = await response.json();
      return data;
    }
  );

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
            {isLoading || !data ? (
              <Layout key="loading-bar" className="absolute w-full max-w-[960px] h-80 grid place-items-center">
                <div className="flex gap-2 items-center">
                  <LoadingBar visible /> {t.loadingFlashcards}
                </div>
              </Layout>
            ) : (
              <Layout key="content">
                <FlashcardReviewContent words={data} />
              </Layout>
            )}
          </AnimatePresence>
        </main>
      </div>
    </Layout>
  );
}
