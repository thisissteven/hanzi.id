import React from "react";
import { Layout } from "@/modules/layout";
import { BackRouteButton, Divider } from "@/components";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn, push } from "@/utils";
import useSWRImmutable from "swr/immutable";
import { useRouter } from "next/router";
import { useRouter as useNavigationRouter } from "next/navigation";
import { GetBookByIdResponse } from "@/pages/api/book/[id]";
import { PlayIcon } from "lucide-react";

function BookDetails() {
  const router = useRouter();
  const navigationRouter = useNavigationRouter();

  const id = router.query.id as string;

  const { data, isLoading } = useSWRImmutable<GetBookByIdResponse>(
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

  const source = data?.image?.source;
  const title = data?.title;
  const description = data?.description;
  const chapters = data?.chapters || [];

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
                <div className="max-md:mt-4 mt-3 inline-flex text-xs items-center rounded-full backdrop-blur-sm bg-blue-500/10 dark:bg-blue-400/10 px-2 py-1 font-medium text-blue-500 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 dark:ring-blue-400/20">
                  {chapters.length} {chapters.length > 1 ? "chapters" : "chapter"}
                </div>
              </div>
            </div>

            <Divider className="my-6" />

            <h2 className="text-xl md:text-2xl font-semibold">Chapters</h2>

            {chapters.map((chapter, index) => (
              <div key={index} className="mt-8">
                <h2 className="text-xl font-medium">
                  {index + 1}: {chapter.title}
                </h2>
                <p className="mt-2 text-secondary leading-7 line-clamp-4 md:line-clamp-3">{chapter.content}</p>

                <div className="mt-4 flex items-center gap-4">
                  <button
                    onClick={() => {
                      push(navigationRouter, `/read/${data?.id}/${chapter.id}`);
                    }}
                    aria-label={`Play chapter ${index + 1}: ${chapter.title}`}
                    className="flex duration-200 items-center gap-x-3 text-sm font-bold leading-6 text-blue-500 active:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 dark:active:text-blue-500"
                  >
                    <PlayIcon />
                    <span aria-hidden="true">Read</span>
                  </button>
                </div>
              </div>
            ))}
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
