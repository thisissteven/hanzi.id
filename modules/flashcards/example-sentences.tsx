import { useLocale } from "@/locales/use-locale";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import useSWRImmutable from "swr/immutable";
import { SentencesDisplay } from "./sentences-display";
import { AnimateChangeInHeight } from "./animate-height";

export type Sentences = Array<{
  english: string;
  pinyin: string;
  simplified: string;
  traditional: string;
  lessonInfo: {
    level: string;
  };
}>;

export function ExampleSentences({ hanzi }: { hanzi: string }) {
  const [show, setShow] = React.useState(false);

  const { t, locale } = useLocale();

  const displayText = show ? t.hideExampleSentences : t.seeExampleSentences;

  const { data } = useSWRImmutable<Sentences>(`/example-sentences/${hanzi}`, async () => {
    const res = await fetch(`https://content.hanzi.id/lessons/${locale}/${hanzi}.json`);
    return res.json();
  });

  const sentences = data ?? [];

  return (
    <React.Fragment>
      <div className="relative w-full pt-6">
        {/* <Divider /> */}
        <div className="border-t border-t-secondary/10 pt-4"></div>

        {/* Translate Sentence Button */}
        <button
          onClick={() => setShow(!show)}
          className="grid place-items-center px-3 py-0.5 text-xs absolute top-1/2 -translate-y-[calc(50%-0.25rem)] left-1/2 -translate-x-1/2 bg-softblack active:bg-hovered duration-200 text-sky-300 rounded-full border border-secondary/10 min-w-[6.75rem]"
        >
          {displayText}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {show && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
          >
            <div className="border-b border-b-secondary/10 pb-4">
              <span className="px-3 sm:px-4 text-sm text-secondary">{t.exampleSentences}:</span>
              <SentencesDisplay hanzi={hanzi} lessons={sentences} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}
