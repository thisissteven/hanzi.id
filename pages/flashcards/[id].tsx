import React from "react";
import { Flashcard, Layout, useFlashcard, useFlashcardList } from "@/modules/layout";
import { BackRouteButton } from "@/components";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/router";

export default function FlashcardsDetailsPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const flashcard = useFlashcard(id);

  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto md:px-8">
          <div className="max-md:sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 max-md:px-2 pb-2 border-b-[1.5px] border-b-subtle">
            <div className="w-fit">
              <BackRouteButton />
            </div>
          </div>

          <div>
            <AnimatePresence mode="wait">
              {!flashcard ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "tween", duration: 0.2 }}
                  className="mt-4 ml-7 md:ml-8"
                >
                  Loading flashcard...
                </motion.div>
              ) : (
                <motion.div
                  key="flashcard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <DisplayFlashcard flashcard={flashcard} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </Layout>
  );
}

function DisplayFlashcard({ flashcard }: { flashcard: Flashcard }) {
  const [bookName, chapterName] = flashcard.chapter.split("-");

  return null;

  return (
    <div>
      <h1 className="mx-4 mt-4 text-2xl font-bold text-primary">{chapterName}</h1>
      <p className="mx-4 mt-2 text-secondary text-sm">{bookName}</p>
      <ul className="mt-4 border-t border-t-secondary/10">
        {flashcard.words.map((card, index) => {
          const [bookName, chapterName] = flashcard.chapter.split("-");
          return (
            <motion.li
              key={flashcard.chapter}
              transition={{ type: "tween", duration: 0.2 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b border-b-secondary/10"
            >
              <Link
                href={`/flashcard/${flashcard.chapter}`}
                scroll={false}
                className="text-left p-4 w-full md:hover:bg-hovered active:bg-hovered duration-200 flex items-center justify-between"
              >
                <div className="min-w-0 flex-auto">
                  <h3 className="text-lg font-medium text-primary">{chapterName}</h3>
                  <div className="mt-1 flex gap-2 items-center">
                    <p className="text-secondary text-sm">{bookName}</p>

                    <div className="inline-flex max-sm:hidden text-xs items-center rounded-full backdrop-blur-sm bg-blue-500/10 dark:bg-blue-400/10 px-2 py-1 font-medium text-blue-500 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 dark:ring-blue-400/20 w-fit">
                      {flashcard.words.length} {flashcard.words.length > 1 ? "cards" : "card"}
                    </div>
                  </div>
                </div>

                <ChevronRightIcon
                  className="h-5 w-5 shrink-0 flex-none text-secondary/50 max-sm:hidden"
                  aria-hidden="true"
                />

                <div className="inline-flex sm:hidden text-xs items-center rounded-full backdrop-blur-sm bg-blue-500/10 dark:bg-blue-400/10 px-2 py-1 font-medium text-blue-500 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 dark:ring-blue-400/20 w-fit">
                  {flashcard.words.length} {flashcard.words.length > 1 ? "cards" : "card"}
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
