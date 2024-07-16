import React from "react";
import { AudioProvider, Flashcard, Layout } from "@/modules/layout";
import { BackRouteButton, LoadMore, usePreferences } from "@/components";
import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";

import { CardDetailsModal, FlashcardProvider, FlashcardSettingsModal, VirtualizedCards } from "@/modules/flashcards";
import { useLocale } from "@/locales/use-locale";
import { FlashcardedResult } from "@/pages/api/flashcard/en";
import { PremadeFlashcards } from ".";
import { Stat } from "@/modules/tools";

export default function PremadeFlashcardsDetailsPage() {
  const router = useRouter();

  const bookChapterId = router.query.bookChapterId as string;

  const { locale } = useLocale();
  const { isSimplified } = usePreferences();

  const { data } = useSWRImmutable<PremadeFlashcards>(
    bookChapterId ? `/api/flashcard/premade/${bookChapterId}` : null,
    async (_: string) => {
      const [bookId, chapterId] = bookChapterId.split("-");
      const content = isSimplified ? "flashcards-sim" : "flashcards-trad";
      const contentUrl = `https://content.hanzi.id/books/${bookId}/${chapterId}/vocabularies/${locale}/${content}.json`;
      const response = await fetch(contentUrl);
      const data = await response.json();
      return data;
    }
  );

  const flashcards: Array<[string, string[]]> = data ? Object.entries(data.categorized) : [];
  const flashcardItem = flashcards.find(([category]) => category === router.query.category);

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
              category={flashcardItem[0]}
              flashcard={{
                chapter: `${data?.bookName}-${data?.chapterName}`,
                words: flashcardItem[1],
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

function DisplayFlashcard({ flashcard, category }: { flashcard: Flashcard; category: string }) {
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

        <div className="px-2 md:pr-0">
          <Stat>{category}</Stat>
        </div>
      </div>

      <div className="min-h-[calc(100dvh-22rem)]">
        <VirtualizedCards
          cards={cards}
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
    </>
  );
}
