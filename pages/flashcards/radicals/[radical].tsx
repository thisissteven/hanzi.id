import React from "react";
import { AudioProvider, Flashcard, Layout } from "@/modules/layout";
import { BackRouteButton, createSuccessToast, LoadMore, usePreferences } from "@/components";
import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";

import { CardDetailsModal, FlashcardProvider, FlashcardSettingsModal, VirtualizedCards } from "@/modules/flashcards";
import { useLocale } from "@/locales/use-locale";
import { FlashcardedResult } from "@/pages/api/flashcard/en";

export type RadicalFlashcard = {
  radical: string;
  description: string;
  hanzis: string[];
};

export default function RadicalFlashcardsDetailsPage() {
  const router = useRouter();

  const radical = router.query.radical as string;

  const { locale } = useLocale();

  const { data } = useSWRImmutable<RadicalFlashcard>(
    radical ? `/api/flashcard/radicals/${locale}/${radical}` : null,
    async (_: string) => {
      const contentUrl = `https://content.hanzi.id/radicals/list/${locale}/${radical}.json`;
      const response = await fetch(contentUrl);
      const data = await response.json();
      return data;
    }
  );

  const flashcardItem = data ? data.hanzis : undefined;

  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto md:px-8">
          <div className="max-md:sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 max-md:px-2 pb-2 border-b-[1.5px] border-b-subtle">
            <div className="flex justify-between">
              <div className="w-fit">
                <BackRouteButton defaultBack />
              </div>
            </div>
          </div>
          {flashcardItem && (
            <DisplayFlashcard
              flashcard={{
                chapter: `${data?.radical}-${data?.description}`,
                words: flashcardItem,
              }}
            />
          )}
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

  const [loadingBatch, setLoadingBatch] = React.useState(-1);
  const [cards, setCards] = React.useState<FlashcardedResult[]>([]);

  const [details, setDetails] = React.useState<FlashcardedResult>();

  const chunkedCards = React.useMemo(() => {
    const cards = chunkArray(flashcard.words, CHUNK_SIZE);
    return {
      data: cards,
      maxBatch: cards.length,
    };
  }, [flashcard.words]);

  const isEnd = loadingBatch === chunkedCards.maxBatch;

  const { t, locale } = useLocale();
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
      <FlashcardSettingsModal flashcard={flashcard} />

      <div className="flex flex-wrap justify-between items-end gap-2">
        <div className="">
          <h1 className="mx-4 mt-4 text-2xl font-semibold text-primary line-clamp-1">{chapterName}</h1>
          <p className="mx-4 mt-1 text-secondary line-clamp-2">{bookName}</p>
        </div>
      </div>

      <div className="min-h-[calc(100dvh-22rem)]">
        <VirtualizedCards
          cards={cards.filter((card) => card.entries && card.entries.length > 0)}
          onCardClick={(card) => {
            setDetails(card);
            router.push({ query: { ...router.query, open: true } }, undefined, { shallow: true });
          }}
        />
        <LoadMore
          isEnd={isEnd}
          whenInView={() => {
            if (!isEnd && !isValidating) {
              setLoadingBatch((prev) => prev + 1);
            }
          }}
        />
      </div>

      <div className="sticky bottom-2 mt-6 max-md:mx-4 flex flex-col md:flex-row justify-end gap-2 pb-2">
        <button
          type="button"
          onClick={() => {
            const flashcards = JSON.parse(localStorage.getItem("flashcard-data") || "[]");
            const isChapterExist = flashcards.find(
              (flashcard: any) => flashcard.chapter === `${bookName}-${chapterName}`
            );
            if (!isChapterExist) {
              localStorage.setItem("flashcard-data", JSON.stringify([...flashcards, flashcard]));
            } else {
              const set = new Set([...isChapterExist.words, ...flashcard.words]);
              const combinedWords = Array.from(set);
              const updatedFlashcards = flashcards.map((flashcard: any) =>
                flashcard.chapter === `${bookName}-${chapterName}` ? { ...flashcard, words: combinedWords } : flashcard
              );
              localStorage.setItem("flashcard-data", JSON.stringify(updatedFlashcards));
            }
            createSuccessToast(t.wordsAdded, {
              id: "add-to-flashcard-success",
            });
          }}
          className="shrink-0 rounded-md font-medium max-md:w-full text-white p-3 md:py-2.5 md:px-4 duration-200 bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {t.addAllToFlashcard}
        </button>
      </div>
    </>
  );
}
