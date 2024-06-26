import React from "react";
import { Layout } from "@/modules/layout";
import { BackRouteButton, Divider, VirtualizedList } from "@/components";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn, push } from "@/utils";
import useSWRImmutable from "swr/immutable";
import { useRouter } from "next/router";
import { useRouter as useNavigationRouter } from "next/navigation";
import { GetBookByIdResponse } from "@/pages/api/book/[id]";
import { LucideBookOpen, LucidePlay, PlayIcon } from "lucide-react";
import { useScrollToTop } from "@/modules/new";
import { LastRead } from "@/modules/home/explore";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

function BookDetails() {
  const router = useRouter();
  const navigationRouter = useNavigationRouter();

  const id = router.query.id as string;

  const { data: book, isLoading } = useSWRImmutable<GetBookByIdResponse>(
    id ? `/book/${id}` : undefined,
    async (url) => {
      const response = await fetch(`/api/${url}`);
      const data = await response.json();
      return data;
    },
    {
      keepPreviousData: true,
    }
  );

  const source = book?.image?.source;
  const title = book?.title;
  const description = book?.description;
  const chapters = book?.chapters || [];

  const [lastRead, setLastRead] = React.useState<LastRead[]>([]);

  React.useEffect(() => {
    const lastRead = localStorage.getItem("lastRead") ?? "[]";
    if (lastRead) {
      setLastRead(JSON.parse(lastRead));
    }
  }, []);

  useScrollToTop();

  const virtualizer = useWindowVirtualizer({
    count: chapters.length,
    estimateSize: () => 350,
    overscan: 3,
  });

  return (
    <div className="mt-8 pb-8 max-md:px-4">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "tween", duration: 0.2 }}
          >
            Loading book details...
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "tween", duration: 0.2 }}
            key="book-details"
          >
            <div className="flex max-md:flex-col max-md:items-center items-end gap-4 md:gap-6">
              <div className="relative w-56 md:w-52 aspect-[9/12] shrink-0">
                <div
                  className={cn("absolute inset-0 w-full h-full", "dark:shadow-[_0px_10px_140px_rgb(30,77,105,0.8)]")}
                  aria-hidden
                ></div>
                <div className="relative rounded-lg overflow-hidden w-full h-full ring-4 ring-blue-400/20">
                  {source && (
                    <Image src={source} width={430} height={430} alt="cover" className="object-cover w-full h-full" />
                  )}
                </div>
              </div>

              <div className="max-md:text-center">
                <h1 className="text-2xl md:text-3xl font-bold mt-2">{title}</h1>
                <p className="mt-2 text-secondary">{description}</p>
                <div className="max-md:mt-4 mt-3 inline-flex text-xs items-center rounded-full bg-blue-500/10 dark:bg-blue-400/10 px-2 py-1 font-medium text-blue-500 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 dark:ring-blue-400/20">
                  {chapters.length} {chapters.length > 1 ? "chapters" : "chapter"}
                </div>
              </div>
            </div>

            <Divider className="my-6" />

            <h2 className="text-xl md:text-2xl font-semibold">Chapters</h2>

            <ul>
              <VirtualizedList virtualizer={virtualizer}>
                {(items, virtualizer) => {
                  if (!chapters) return null;

                  return items.map((item) => {
                    const index = item.index;
                    const chapter = chapters[index];

                    const lastReadChapter = lastRead
                      .find((read) => read.bookId === book?.id)
                      ?.chapters.find((localChapter) => localChapter.chapterId === chapter.id);

                    const lastSentenceIndex = lastReadChapter?.lastSentenceIndex ?? "0";
                    const readingProgress = ((parseInt(lastSentenceIndex) + 1) / chapter.totalSentences) * 100;

                    return (
                      <VirtualizedList.Item key={item.key} virtualizer={virtualizer} item={item}>
                        <li key={index} className="py-5 sm:py-8 border-b border-b-secondary/20">
                          <h2 className="text-xl font-medium">
                            {index + 1}: {chapter.title}
                          </h2>
                          <p className="mt-2 text-secondary leading-7 line-clamp-4 md:line-clamp-3">
                            {chapter.shortContent}
                          </p>

                          <div className="mt-4 flex max-sm:flex-col sm:items-center justify-between gap-4">
                            <div className="flex gap-2 items-center w-fit text-xs">
                              {chapter.wordCount && (
                                <span className="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 font-medium text-white ring-1 ring-inset ring-gray-400/20">
                                  {chapter.wordCount} words
                                </span>
                              )}
                              {chapter.estimatedReadingTime && chapter.estimatedReadingTime > 0 && (
                                <span className="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 font-medium text-white ring-1 ring-inset ring-gray-400/20">
                                  {chapter.estimatedReadingTime} minutes reading time
                                </span>
                              )}
                              {Math.floor(readingProgress) > 0 && (
                                <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
                                  {readingProgress.toFixed()} %
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                push(navigationRouter, `/read/${book?.id}/${chapter.id}`);
                              }}
                              aria-label={`Play chapter ${index + 1}: ${chapter.title}`}
                              className="flex duration-200 items-center gap-x-2 leading-6 text-sm rounded-full bg-blue-400/10 px-4 py-2 font-medium text-blue-400 active:bg-blue-400/20 ring-1 ring-inset ring-blue-400/20"
                            >
                              <LucideBookOpen size={20} className="mt-0.5" />
                              <span aria-hidden="true">Start Reading</span>
                            </button>
                          </div>
                        </li>
                      </VirtualizedList.Item>
                    );
                  });
                }}
              </VirtualizedList>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Info() {
  const pathname = usePathname();

  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto md:px-8 pb-4">
          <div className="max-md:sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 max-md:px-2 pb-2 border-b-[1.5px] border-b-subtle">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "tween", duration: 0.2 }}
                className="w-fit"
              >
                <BackRouteButton />
              </motion.div>
            </AnimatePresence>
          </div>

          <BookDetails />
        </main>
      </div>
    </Layout>
  );
}
