import { BackRouteButton, usePreferences } from "@/components";
import { useLocale } from "@/locales/use-locale";
import { Layout } from "@/modules/layout";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";

export type PremadeFlashcards = {
  [key: string]: string[];
};

const description = {
  id: {
    "sangat dasar": "1-500",
    dasar: "500-1000",
    "sangat umum": "1000-2000",
    umum: "2000-3700",
    "tidak umum": "3700-6300",
    jarang: "6300-10500",
    "sangat jarang": "10500-18600",
    langka: "18600-50000",
  },
  en: {
    "very basic": "1-500",
    basic: "500-1000",
    "very common": "1000-2000",
    common: "2000-3700",
    uncommon: "3700-6300",
    rare: "6300-10500",
    "very rare": "10500-18600",
    obscure: "18600-50000",
  },
} as any;

export default function PremadeFlashcards() {
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

  const flashcards = data ? Object.entries(data) : [];

  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto md:px-8">
          <div className="max-md:sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 max-md:px-2 pb-2 border-b-[1.5px] border-b-subtle">
            <div className="w-fit">
              <BackRouteButton />
            </div>
          </div>

          <ul>
            {flashcards?.map(([category, hanziList]) => {
              return (
                <motion.li
                  key={category}
                  transition={{ type: "tween", duration: 0.2 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-b-secondary/10"
                >
                  <Link
                    href={`/flashcards/premade/${bookChapterId}/${category}`}
                    scroll={false}
                    className="text-left p-4 w-full md:hover:bg-hovered active:bg-hovered duration-200 flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-auto">
                      <h3 className="text-xl font-medium text-primary">{category}</h3>
                      <div className="mt-1 flex gap-2 items-center">
                        <p className="text-secondary text-sm">{description[locale][category]}</p>

                        <div className="inline-flex max-sm:hidden text-xs items-center rounded-full backdrop-blur-sm bg-blue-500/10 dark:bg-blue-400/10 px-2 py-1 font-medium text-blue-500 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 dark:ring-blue-400/20 w-fit">
                          {hanziList.length} 卡
                        </div>
                      </div>
                    </div>

                    <ChevronRightIcon
                      className="h-5 w-5 shrink-0 flex-none text-secondary/50 max-sm:hidden"
                      aria-hidden="true"
                    />

                    <div className="inline-flex sm:hidden text-sm items-center rounded-full backdrop-blur-sm bg-blue-500/10 dark:bg-blue-400/10 px-3 py-1 font-medium text-blue-500 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 dark:ring-blue-400/20 w-fit">
                      {hanziList.length} 卡
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
