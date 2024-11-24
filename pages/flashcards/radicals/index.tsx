import { BackRouteButton, Divider } from "@/components";
import { useLocale } from "@/locales/use-locale";
import { Layout } from "@/modules/layout";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import useSWRImmutable from "swr/immutable";

export type RadicalFlashcardsType = {
  title: string;
  radical: string;
  description: string;
  length: number;
};

export default function RadicalFlashcards() {
  const { locale, t } = useLocale();

  const { data } = useSWRImmutable<RadicalFlashcardsType[]>(
    locale ? `/api/flashcard/radicals/${locale}` : null,
    async (_: string) => {
      const contentUrl = `https://content.hanzi.id/radicals/list/${locale}/index.json`;
      const response = await fetch(contentUrl);
      const data = await response.json();
      return data;
    }
  );

  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto md:px-8">
          <div className="max-md:sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 max-md:px-2 pb-2 border-b-[1.5px] border-b-subtle">
            <div className="w-fit">
              <BackRouteButton />
            </div>
          </div>

          {data && (
            <>
              <h1 className="mx-4 mt-4 text-2xl font-semibold text-primary">{t.radicals.title}</h1>
              <p className="mx-4 mt-1 text-secondary">{t.radicals.description}</p>

              <Divider />
            </>
          )}

          <ul className="-mt-4">
            {data?.map((item, index) => {
              return (
                <motion.li
                  key={index}
                  transition={{ type: "tween", duration: 0.2 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-b-secondary/10"
                >
                  <Link
                    href={`/flashcards/radicals/${item.radical}`}
                    scroll={false}
                    className="text-left p-4 w-full md:hover:bg-hovered active:bg-hovered duration-200 flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-auto">
                      <h3 className="text-xl font-medium text-primary">{item.title}</h3>
                      <div className="mt-1 flex gap-2 items-center">
                        <p className="text-secondary text-sm">{item.description}</p>
                      </div>
                    </div>

                    <ChevronRightIcon
                      className="h-5 w-5 shrink-0 flex-none text-secondary/50 max-sm:hidden"
                      aria-hidden="true"
                    />

                    <div className="inline-flex sm:hidden text-sm items-center rounded-full backdrop-blur-sm bg-blue-500/10 dark:bg-blue-400/10 px-3 py-1 font-medium text-blue-500 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 dark:ring-blue-400/20 w-fit">
                      {item.length} 卡
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </main>
      </div>
    </Layout>
  );
}
