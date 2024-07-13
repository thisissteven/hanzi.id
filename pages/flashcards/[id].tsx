import React from "react";
import { AudioProvider, Flashcard, Layout, useFlashcard } from "@/modules/layout";
import { AlertModal, BackRouteButton, createSuccessToast, LoadMore, RouteDialog } from "@/components";
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
                className="mt-4 p-2 rounded-md duration-200 active:bg-hovered text-secondary flex items-center gap-2"
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

      {cards.length > 0 && (
        <FooterButtons
          onExport={() => {
            exportToPleco(flashcard.words, flashcard.chapter);
            createSuccessToast(t.exportSuccessful, {
              id: "export-pleco-success",
            });
          }}
        />
      )}
    </>
  );
}
