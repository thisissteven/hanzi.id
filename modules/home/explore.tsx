import { usePreferences } from "@/components";
import { useLocale } from "@/locales/use-locale";
import { GetAllBooksResponse } from "@/pages/api/book";
import { cn } from "@/utils";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import useSWRImmutable from "swr/immutable";

export type LastRead = {
  bookId: string;
  chapterId: string;
  chapters: Array<{
    chapterId: string;
    lastSentenceIndex: string;
  }>;
};

export function useLastRead({
  scrollFn,
  bookId,
  chapterId,
}: {
  scrollFn: (index: number) => void;
  bookId: string;
  chapterId: string;
}) {
  const { t } = useLocale();

  React.useEffect(() => {
    const lastRead = JSON.parse(localStorage.getItem("lastReadData") ?? "[]") as LastRead[];
    const lastReadItem = lastRead
      .find((read) => read.bookId === bookId)
      ?.chapters.find((chapter) => chapter.chapterId === chapterId);

    if (lastReadItem) scrollFn(parseInt(lastReadItem.lastSentenceIndex));
  }, [bookId, chapterId, scrollFn, t.goToLastReadSentence]);

  const updateLastRead = React.useCallback((args: { bookId: string; chapterId: string; lastSentenceIndex: string }) => {
    const lastRead = JSON.parse(localStorage.getItem("lastReadData") ?? "[]") as LastRead[];
    const book = lastRead.find((book) => book.bookId === args.bookId);
    const newLastReadItem = {
      chapterId: args.chapterId,
      lastSentenceIndex: args.lastSentenceIndex,
    };

    if (book) {
      const lastReadItem = book.chapters.find((chapter) => chapter.chapterId === args.chapterId);
      if (lastReadItem) {
        const newChapters = [
          newLastReadItem,
          ...book.chapters.filter((chapter) => chapter.chapterId !== args.chapterId),
        ];
        const newLastRead = [
          {
            bookId: args.bookId,
            chapterId: args.chapterId,
            chapters: newChapters,
          },
          ...lastRead.filter((book) => book.bookId !== args.bookId),
        ];
        localStorage.setItem("lastReadData", JSON.stringify(newLastRead));
      } else {
        const newChapters = [newLastReadItem, ...book.chapters];
        const newLastRead = [
          {
            bookId: args.bookId,
            chapterId: args.chapterId,
            chapters: newChapters,
          },
          ...lastRead.filter((book) => book.bookId !== args.bookId),
        ];
        localStorage.setItem("lastReadData", JSON.stringify(newLastRead));
      }
    } else {
      const newLastReadItem = {
        chapterId: args.chapterId,
        lastSentenceIndex: args.lastSentenceIndex,
      };
      const newLastRead = [
        {
          bookId: args.bookId,
          chapterId: args.chapterId,
          chapters: [newLastReadItem],
        },
        ...lastRead,
      ];
      localStorage.setItem("lastReadData", JSON.stringify(newLastRead));
    }
  }, []);

  return { updateLastRead };
}

export function useLastReadChapterId(bookId: string) {
  const lastReadChapterId = React.useMemo(() => {
    if (typeof window !== "undefined") {
      const lastRead = JSON.parse(localStorage.getItem("lastReadData") ?? "[]") as LastRead[];
      const lastReadItem = lastRead.find((read) => read.bookId === bookId);
      return lastReadItem?.chapterId;
    } else {
      return "";
    }
  }, [bookId]);

  return lastReadChapterId;
}

function useBooks() {
  const swrData = useSWRImmutable<{ data: GetAllBooksResponse }>("https://content.hanzi.id/books/list.json");

  return swrData;
}

export function Explore() {
  const [selected, setSelected] = React.useState(0);

  const [lastRead, setLastRead] = React.useState<LastRead[]>([]);

  React.useEffect(() => {
    const lastRead = localStorage.getItem("lastReadData") ?? "[]";
    if (lastRead) {
      setLastRead(JSON.parse(lastRead));
    }
  }, []);

  const { data } = useBooks();

  const books =
    selected === 0 ? data?.data : data?.data?.filter((book) => lastRead.some((read) => read.bookId === book.id));

  const { t, locale } = useLocale();

  const { isSimplified } = usePreferences();

  return (
    <div className="mt-4">
      <div className="flex gap-2 max-md:px-4 md:px-5">
        <button
          className={cn("px-3 duration-200", selected === 0 ? "opacity-100" : "opacity-50")}
          onClick={() => setSelected(0)}
        >
          {t.all}
        </button>
        <button
          className={cn("px-3 duration-200", selected === 1 ? "opacity-100" : "opacity-50")}
          onClick={() => setSelected(1)}
        >
          {t.lastRead}
        </button>
      </div>

      {!books && <div className="ml-6 md:ml-8 mt-4">{t.loadingAllBooks}</div>}

      {books && (
        <div>
          <ul className="mt-4 border-t border-t-secondary/10">
            {books.map((book, index) => {
              return (
                <motion.li
                  key={book.id}
                  transition={{ type: "tween", duration: 0.2 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-b-secondary/10 w-full"
                >
                  <Link
                    href={`/read/${book.id}`}
                    scroll={false}
                    className="inline-block w-full text-left max-md:px-4 py-4 md:w-full md:hover:bg-hovered active:bg-hovered duration-200"
                  >
                    <div className="flex gap-4">
                      <div className="w-4 max-md:hidden -ml-6 grid place-items-center">{index + 1}</div>
                      <div className="md:ml-2.5 relative w-20 md:w-32 aspect-square shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={book?.image?.source || "/placeholder.png"}
                          alt={`Cover Image: ${book.title}`}
                          className="object-cover w-full h-full"
                          width={92}
                          height={92}
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <h3 className="text-lg md:text-2xl font-semibold line-clamp-1">
                          {isSimplified ? book.title : book.titleTraditional}
                        </h3>
                        <p className="mt-1 max-md:text-sm text-secondary line-clamp-2 md:line-clamp-3">
                          {locale === "en" ? book.description : book.descriptionId}
                        </p>
                        <div className="mt-2 max-md:mt-4 inline-flex text-xs items-center rounded-full backdrop-blur-sm bg-blue-500/10 dark:bg-blue-400/10 px-2 py-1 font-medium text-blue-500 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 dark:ring-blue-400/20 w-fit">
                          {book.chapters.length} {book.chapters.length > 1 ? "chapters" : "chapter"}
                        </div>
                      </div>
                      <div className="max-md:hidden grid place-items-center pr-4">
                        <ChevronRight className="text-secondary" />
                      </div>
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
