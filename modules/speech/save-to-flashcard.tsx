import { cn } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheckIcon, CirclePlusIcon } from "lucide-react";
import React from "react";
import { useReading } from "@/modules/layout";
import useSWRImmutable from "swr/immutable";
import { GetChapterByIdResponse } from "@/pages/api/chapter/[id]";
import { useRouter } from "next/router";
import { useFlashcardContext } from "@/modules/flashcards";
import { usePreferences } from "@/components";

export function useChapterById(bookId: string, chapterId: string, isSimplified: boolean) {
  const content = isSimplified ? "content-sim" : "content-trad";
  const swrData = useSWRImmutable<GetChapterByIdResponse>(
    `https://content.hanzi.id/books/${bookId}/${chapterId}/${content}.json`
  );

  return swrData;
}

export function SaveToFlashcard({ word }: { word?: string }) {
  const { flashcard, addToFlashcard, removeFromFlashcard } = useReading();

  const router = useRouter();

  const bookId = router.query.id as string;
  const chapterId = router.query.chapterId as string;

  const { isSimplified } = usePreferences();
  const { data: chapter } = useChapterById(bookId, chapterId, isSimplified);

  const chapterName = `${chapter?.book.title}-${chapter?.title}`;

  const currentFlashcard = React.useMemo(
    () => flashcard.find((item) => item.chapter === chapterName),
    [chapterName, flashcard]
  );

  if (!word || chapterName.includes("undefined")) return null;

  const isSaved = Boolean(currentFlashcard && currentFlashcard.words.includes(word));

  const Icon = isSaved ? CircleCheckIcon : CirclePlusIcon;
  return (
    <button
      type="button"
      className="group relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200 active:bg-hovered"
      onClick={() => {
        if (isSaved) {
          removeFromFlashcard(chapterName, word);
        } else {
          addToFlashcard(chapterName, word);
        }
      }}
      aria-label={isSaved ? "remove from flashcard" : "save to flashcard"}
    >
      <div className="absolute -inset-3 md:hidden" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isSaved.toString()}
          initial={{
            scale: 0.9,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          exit={{
            scale: 0.9,
            opacity: 0.5,
          }}
          transition={{
            duration: 0.15,
          }}
          className="flex items-center justify-center w-full h-full"
        >
          <Icon strokeWidth={1.5} className={cn("h-7 w-7", isSaved ? "text-sky-400" : "")} />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

export function AddOrRemoveFromFlashcard({
  chapterName,
  word,
  possibleWords,
}: {
  chapterName: string;
  word?: string;
  possibleWords: string[];
}) {
  const { flashcard, addToFlashcard, removeFromFlashcard } = useFlashcardContext();

  const currentFlashcard = React.useMemo(
    () => flashcard.find((item) => item.chapter === chapterName),
    [chapterName, flashcard]
  );

  if (!word || chapterName.includes("undefined")) return null;

  const isSaved = Boolean(currentFlashcard && possibleWords.some((hanzi) => currentFlashcard.words.includes(hanzi)));

  const Icon = isSaved ? CircleCheckIcon : CirclePlusIcon;
  return (
    <button
      type="button"
      className="group relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200 active:bg-hovered"
      onClick={() => {
        if (isSaved) {
          removeFromFlashcard(chapterName, possibleWords);
        } else {
          addToFlashcard(chapterName, possibleWords);
        }
      }}
      aria-label={isSaved ? "remove from flashcard" : "save to flashcard"}
    >
      <div className="absolute -inset-3 md:hidden" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isSaved.toString()}
          initial={{
            scale: 0.9,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          exit={{
            scale: 0.9,
            opacity: 0.5,
          }}
          transition={{
            duration: 0.15,
          }}
          className="flex items-center justify-center w-full h-full"
        >
          <Icon strokeWidth={1.5} className={cn("h-7 w-7", isSaved ? "text-sky-400" : "")} />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
