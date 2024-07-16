import React from "react";
import { AudioProvider, Flashcard, Layout, useFlashcard } from "@/modules/layout";
import { AlertModal, BackRouteButton, createSuccessToast, LoadMore, usePreferences } from "@/components";
import { LucideTrash2 } from "lucide-react";
import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";

import {
  CardDetailsModal,
  FlashcardProvider,
  FlashcardSettingsModal,
  FooterButtons,
  VirtualizedCards,
} from "@/modules/flashcards";
import { useLocale } from "@/locales/use-locale";
import { FlashcardedResult } from "@/pages/api/flashcard/en";
import { PremadeFlashcards } from ".";

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

  const flashcards: Array<[string, string[]]> = data ? Object.entries(data) : [];
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
              flashcard={{
                chapter: router.query.category as string,
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

function DisplayFlashcard({ flashcard }: { flashcard: Flashcard }) {
  const [bookName, chapterName] = flashcard.chapter.split("-");

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
            withoutFlashcardButton
          />
        </FlashcardProvider>
      </AudioProvider>
      <FlashcardSettingsModal flashcard={flashcard} />
      <h1 className="mx-4 mt-4 text-2xl font-semibold text-primary">{chapterName}</h1>
      <p className="mx-4 mt-1 text-secondary">{bookName}</p>

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
