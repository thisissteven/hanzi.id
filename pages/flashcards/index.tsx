import React from "react";
import { Flashcard, Layout, useFlashcardList } from "@/modules/layout";
import { BackRouteButton, createErrorToast, createSuccessToast, Divider, RouteDialog, Textarea } from "@/components";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { useLocale } from "@/locales/use-locale";
import { useRouter } from "next/router";

const chineseCharRegex = /[\u4E00-\u9FFF]/;

function AddNewFlashcardModal({
  setFlashcards,
}: {
  setFlashcards: React.Dispatch<React.SetStateAction<Array<Flashcard>>>;
}) {
  const router = useRouter();

  const open = Boolean(router.query.add);

  const { t } = useLocale();

  return (
    <RouteDialog
      className="sm:max-w-lg"
      open={open}
      onClose={() => {
        router.back();
      }}
      withoutOkButton
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const target = e.target as typeof e.target & {
            0: { value: string };
            1: { value: string };
            2: { value: string };
          };
          if (target) {
            const title = target[0].value;
            const description = target[1].value;
            const words = target[2].value;

            const chapter = `${description}-${title}`;
            const flashcard = {
              chapter,
              words: words
                .split("\n")
                .filter((word) => {
                  return chineseCharRegex.test(word);
                })
                .map((word) => {
                  return word.trim();
                }),
            };

            const currentFlashcards = JSON.parse(localStorage.getItem("flashcard-data") ?? "[]");

            if (currentFlashcards.some((f: any) => f.chapter === chapter)) {
              createErrorToast(t.flashcardExists, {
                id: "flashcard-exists",
              });
            } else {
              localStorage.setItem("flashcard-data", JSON.stringify([...currentFlashcards, flashcard]));
              setFlashcards((prev) => [...prev, flashcard]);
              createSuccessToast(t.wordsAdded, {
                id: "flashcard-success",
              });
              router.back();
            }
          }
        }}
        className="space-y-4"
      >
        <p>{t.pleaseFill}</p>
        <div className="relative">
          <input
            className="bg-transparent pl-3 pr-10 py-2 rounded-md border border-subtle ring-offset-black ring-smoke focus:ring-offset-2 focus:ring-2 text-secondary focus:text-white transition-shadow duration-200 placeholder:text-secondary/50 focus:outline-none w-full"
            type="text"
            placeholder={t.placeholderFlashcardTitle}
            required
          />
          <span className="absolute text-xs bg-black/50 backdrop-blur-sm h-7 w-8 text-secondary right-1 top-1/2 -translate-y-1/2 grid place-items-center">
            {1}
          </span>
        </div>

        <div className="relative">
          <input
            className="bg-transparent pl-3 pr-10 py-2 rounded-md border border-subtle ring-offset-black ring-smoke focus:ring-offset-2 focus:ring-2 text-secondary focus:text-white transition-shadow duration-200 placeholder:text-secondary/50 focus:outline-none w-full"
            type="text"
            placeholder={t.placeholderFlashcardDescription}
            required
          />
          <span className="absolute text-xs bg-black/50 backdrop-blur-sm h-7 w-8 text-secondary right-1 top-1/2 -translate-y-1/2 grid place-items-center">
            {2}
          </span>
        </div>

        <Textarea placeholder={t.addNewFlashcardPlaceholder} required minHeight="136px" preventHeightChange />

        <div className="mt-2 flex justify-end bg-softblack">
          <button
            type="submit"
            className="block rounded-md font-medium duration-200 bg-hovered active:bg-subtle px-3 py-1.5"
          >
            OK
          </button>
        </div>
      </form>
    </RouteDialog>
  );
}

function AddNewFlashcardButton({
  setFlashcards,
}: {
  setFlashcards: React.Dispatch<React.SetStateAction<Array<Flashcard>>>;
}) {
  const { t } = useLocale();
  const router = useRouter();
  return (
    <>
      <AddNewFlashcardModal setFlashcards={setFlashcards} />
      <button
        type="button"
        onClick={() => router.push({ query: { ...router.query, add: true } }, undefined, { shallow: true })}
        className="shrink-0 rounded-md font-medium max-md:w-full text-white p-3 md:py-2.5 md:px-4 duration-200 bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {t.add}
      </button>
    </>
  );
}

export default function FlashcardsPage() {
  const { flashcards, setFlashcards } = useFlashcardList();

  const { t } = useLocale();

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
            <div className="max-md:px-4 mt-4">
              <AddNewFlashcardButton setFlashcards={setFlashcards} />
              {flashcards.length === 0 && <div className="mt-2">{t.emptyFlashcard}</div>}
              {flashcards.length > 0 && <Divider />}
            </div>

            <ul className="-mt-4">
              {flashcards.map((flashcard) => {
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
                      href={`/flashcards/${flashcard.chapter}`}
                      scroll={false}
                      className="text-left p-4 w-full md:hover:bg-hovered active:bg-hovered duration-200 flex items-center justify-between"
                    >
                      <div className="min-w-0 flex-auto">
                        <h3 className="text-xl font-medium text-primary">{chapterName}</h3>
                        <div className="mt-1 flex gap-2 items-center">
                          <p className="text-secondary">{bookName}</p>

                          <div className="whitespace-nowrap inline-flex max-sm:hidden text-xs items-center rounded-full backdrop-blur-sm bg-blue-500/10 dark:bg-blue-400/10 px-2 py-1 font-medium text-blue-500 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 dark:ring-blue-400/20 w-fit">
                            {flashcard.words.length} 卡
                          </div>
                        </div>
                      </div>

                      <ChevronRightIcon
                        className="h-5 w-5 shrink-0 flex-none text-secondary/50 max-sm:hidden"
                        aria-hidden="true"
                      />

                      <div className="inline-flex whitespace-nowrap sm:hidden text-sm items-center rounded-full backdrop-blur-sm bg-blue-500/10 dark:bg-blue-400/10 px-3 py-1 font-medium text-blue-500 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 dark:ring-blue-400/20 w-fit">
                        {flashcard.words.length} 卡
                      </div>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </main>
      </div>
    </Layout>
  );
}
