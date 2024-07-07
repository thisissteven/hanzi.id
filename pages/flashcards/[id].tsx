import React from "react";
import { AudioProvider, Flashcard, Layout, useFlashcard } from "@/modules/layout";
import { AlertModal, BackRouteButton, createSuccessToast, LoadMore, usePreferences } from "@/components";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRightIcon, LucideDownload, LucideTrash2 } from "lucide-react";
import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";

import { CardDetailsModal, FlashcardProvider } from "@/modules/flashcards";
import { useLocale } from "@/locales/use-locale";
import { FlashcardedResult } from "../api/flashcard/en";

function exportToPleco(words: string[], filename: string) {
  const element = document.createElement("a");
  const file = new Blob(
    [`// ${filename}`, ...words].map((str) => str + "\n"),
    { type: "text/plain" }
  );
  element.href = URL.createObjectURL(file);
  element.download = `${filename}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export default function FlashcardsDetailsPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { flashcardItem, removeFlashcard } = useFlashcard(id);

  const [openAlert, setOpenAlert] = React.useState(false);

  React.useEffect(() => {
    if (openAlert) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.scrollbarGutter = "stable";
    }

    const timeout = setTimeout(() => {
      if (!openAlert) {
        document.body.style.overflowY = "scroll";
        document.documentElement.style.scrollbarGutter = "";
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [openAlert]);

  const { t } = useLocale();

  return (
    <Layout>
      <AlertModal
        open={openAlert}
        onClose={(value) => setOpenAlert(value)}
        alertProps={{
          cancelText: t.flashcard.cancelText,
          confirmText: t.flashcard.confirmText,
          title: t.flashcard.title,
          description: t.flashcard.description,
        }}
        callback={() => {
          // Delete flashcard
          removeFlashcard();
          setOpenAlert(false);
          createSuccessToast(t.flashcard.successToast, {
            id: "delete-flashcard-success",
            duration: 5000,
          });
          router.back();
        }}
      />
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto md:px-8">
          <div className="max-md:sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 max-md:px-2 pb-2 border-b-[1.5px] border-b-subtle">
            <div className="flex justify-between">
              <div className="w-fit">
                <BackRouteButton />
              </div>
              <button
                onClick={() => setOpenAlert(true)}
                className="mt-4 p-2 rounded-md duration-200 active:bg-hovered flex items-center gap-2"
              >
                <LucideTrash2 />
              </button>
            </div>
          </div>
          {flashcardItem && <DisplayFlashcard flashcard={flashcardItem} />}
        </main>
      </div>
    </Layout>
  );
}

const chunkArray = (array: string[], size: number) => {
  const chunkedArray = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArray.push(array.slice(i, i + size));
  }
  return chunkedArray;
};

const CHUNK_SIZE = 50;

function DisplayFlashcard({ flashcard }: { flashcard: Flashcard }) {
  const [bookName, chapterName] = flashcard.chapter.split("-");
  const [exported, setExported] = React.useState(false);

  const [loadingBatch, setLoadingBatch] = React.useState(-1);
  const [cards, setCards] = React.useState<FlashcardedResult[]>([]);

  const [details, setDetails] = React.useState<FlashcardedResult>();

  const { t } = useLocale();

  const chunkedCards = React.useMemo(() => {
    const cards = chunkArray(flashcard.words, CHUNK_SIZE);
    return {
      data: cards,
      maxBatch: cards.length,
    };
  }, [flashcard.words]);

  const isEnd = loadingBatch === chunkedCards.maxBatch;

  const { locale } = useLocale();
  const { data, isValidating } = useSWRImmutable<FlashcardedResult[]>(
    !isEnd && loadingBatch > -1 ? `flashcard/${locale}?text=${chunkedCards.data[loadingBatch].join("-")}` : undefined,
    async (url: string) => {
      const response = await fetch(`/api/${url}`);
      const data = await response.json();
      return data;
    }
  );

  React.useEffect(() => {
    if (data) setCards((prev) => [...prev, ...data]);
  }, [data]);

  const router = useRouter();

  const { isSimplified } = usePreferences();

  return (
    <>
      <AudioProvider>
        <FlashcardProvider>
          <CardDetailsModal
            chapterName={`${bookName}-${chapterName}`}
            details={details}
            onClose={() => {
              setDetails(undefined);
              router.back();
            }}
          />
        </FlashcardProvider>
      </AudioProvider>
      <h1 className="mx-4 mt-4 text-2xl font-semibold text-primary">{chapterName}</h1>
      <p className="mx-4 mt-2 text-secondary text-sm">{bookName}</p>

      <div className="min-h-[calc(100dvh-22rem)]">
        <ul className="mt-4 border-t border-t-secondary/10 grid sm:grid-cols-2">
          {cards.map((card, index) => {
            const pinyin = card?.entries?.map((entry) => entry.pinyin).join("/");
            const translations = card?.entries?.[0].english.join(", ");

            return (
              <li key={index} className="border-b border-b-secondary/10">
                <button
                  onClick={() => {
                    setDetails(card);
                    router.push(router.asPath + "?open=true", undefined, { shallow: true });
                  }}
                  className="text-left w-full md:hover:bg-hovered active:bg-hovered duration-200 flex items-center justify-between pr-3 sm:pr-2"
                >
                  <div className="relative group transition select-none text-3xl w-full">
                    <div className="pl-3 pr-4 pt-8 pb-3 flex gap-2 items-center">
                      <div className="shrink-0 font-medium">{isSimplified ? card?.simplified : card?.traditional}</div>

                      <div className="overflow-x-hidden flex-1">
                        <div className="text-sm font-medium text-smokewhite">{pinyin ?? t.loading}</div>
                        <div className="text-sm line-clamp-1 max-w-[95%] text-secondary">
                          {translations ?? t.loading}
                        </div>
                      </div>

                      <div className="absolute left-4 top-3 text-xs text-secondary">{index + 1}</div>
                    </div>
                  </div>

                  <ChevronRightIcon className="h-5 w-5 shrink-0 flex-none text-secondary/50" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
        <LoadMore
          isEnd={isEnd}
          whenInView={() => {
            if (!isEnd && !isValidating) {
              setLoadingBatch((prev) => prev + 1);
            }
          }}
        />
      </div>

      {cards.length > 0 && (
        <AnimatePresence mode="wait" initial={false}>
          {exported ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: [1, 0],
                transition: {
                  delay: 2,
                },
              }}
              exit={{
                opacity: 0,
              }}
              transition={{ type: "tween", duration: 0.2 }}
              className="sticky bottom-4 mt-8 max-md:mx-4 flex justify-end"
            >
              {t.exportSuccessful}
            </motion.div>
          ) : (
            <motion.div
              key="export"
              exit={{
                opacity: 0,
              }}
              transition={{ type: "tween", duration: 0.2 }}
              className="sticky bottom-4 mt-8 max-md:mx-4 flex justify-end"
            >
              <button
                type="button"
                onClick={() => {
                  exportToPleco(flashcard.words, flashcard.chapter);
                  setExported(true);
                }}
                className="rounded-md font-medium max-md:w-full text-black dark:text-white p-3 md:py-2.5 md:px-4 duration-200 bg-blue-500 active:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {t.exportForPleco} <LucideDownload size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
