import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";
import * as React from "react";
import IdHanziMap from "@/data/id-hanzi-map.json";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

import { SegmentApiResponse } from "@/pages/api/segment";
import { cn } from "@/utils";
import { useReading } from "../layout";
import { Divider, LoadingBar } from "@/components";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { SaveToFlashcard } from "./save-to-flashcard";

export type IdHanziMapKey = keyof typeof IdHanziMap;

type DefinitionModalProps = {
  previousSentence: () => string;
  nextSentence: () => string;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
};

export function DefinitionModal({
  previousSentence,
  nextSentence,
  previousDisabled,
  nextDisabled,
}: DefinitionModalProps) {
  const router = useRouter();
  const sentence = router.query.sentence as string;

  const { data, isLoading } = useSWRImmutable<SegmentApiResponse>(
    sentence ? `/segment?text=${sentence}` : undefined,
    async (url) => {
      const response = await fetch(`/api/${url}`);
      // Simulate loading for better UX
      await new Promise((resolve) => setTimeout(resolve, 200));
      return response.json();
    },
    {
      keepPreviousData: true,
    }
  );

  React.useEffect(() => {
    if (data) {
      const result = data.result.flat();
      const firstNonPunctuationIndex = result.findIndex((segment) => !segment.isPunctuation);
      setActiveIndex(firstNonPunctuationIndex);
    }
  }, [data]);

  React.useEffect(() => {
    if (sentence) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.scrollbarGutter = "stable";
    }

    const timeout = setTimeout(() => {
      if (!sentence) {
        document.body.style.overflowY = "scroll";
        document.documentElement.style.scrollbarGutter = "";
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [sentence]);

  const sections = data?.result.flat();
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);
  const [entryIndex, setEntryIndex] = React.useState(0);

  const currentSection = sections?.[activeIndex];
  const currentSimplifiedLength = currentSection?.simplified.length;
  const isIdiom = currentSimplifiedLength && currentSimplifiedLength >= 4;

  const currentEntries = currentSection?.entries ?? [];

  const actualEntryIndex = Math.min(entryIndex, currentEntries.length - 1);
  const currentEntry = currentEntries[actualEntryIndex] ?? [];

  const { fontSize } = useReading();

  return (
    <Dialog
      className="relative z-[999]"
      open={Boolean(sentence)}
      onClose={() => {
        const pathname = router.asPath.split("?")[0];
        router.push(pathname, undefined, {
          shallow: true,
        });
      }}
    >
      <DialogBackdrop
        transition
        className="fixed inset-y-0 left-0 w-screen z-[999] bg-black/20 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-y-0 left-0 z-[999] w-screen p-2 sm:p-4 overflow-y-auto">
        <div className="flex justify-center text-center sm:items-center">
          <DialogPanel
            transition
            className={cn(
              "relative transform overflow-hidden rounded-lg bg-white py-3 sm:py-4 text-left shadow-xl transition-all data-[closed]:-translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-full sm:max-w-xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95",
              "bg-softblack text-smokewhite"
            )}
          >
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "tween", duration: 0.2 }}
                  className="flex justify-center pt-6 sm:pt-7 absolute inset-0 h-full z-50 bg-black/50"
                >
                  {<LoadingBar className="scale-150" visible />}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between px-3 sm:px-4 text-secondary">
              <Link
                href={previousSentence()}
                prefetch={false}
                scroll={false}
                aria-disabled={previousDisabled}
                shallow
                className="flex select-none items-center gap-1 rounded-md font-medium duration-200 active:bg-hovered px-3 py-1.5 aria-disabled:opacity-50 aria-disabled:pointer-events-none"
              >
                <div className="mb-[3px]">&#8592;</div> Previous
              </Link>
              <Link
                href={nextSentence()}
                prefetch={false}
                scroll={false}
                aria-disabled={nextDisabled}
                shallow
                className="flex select-none items-center gap-1 rounded-md font-medium duration-200 active:bg-hovered px-3 py-1.5 aria-disabled:opacity-50 aria-disabled:pointer-events-none"
              >
                Next &#8594;
              </Link>
            </div>

            <Divider />

            <div className="mt-2">
              <div className="px-3 sm:px-4">
                <span className="text-sm text-secondary">Sentence:</span>
                <p className={cn(fontSize.className, "mt-1")}>
                  {sections?.map((section, index) => {
                    const isLastIndex = sections.length - 1 === index;
                    const additionalPunctuation =
                      !isLastIndex && sections[index + 1].isPunctuation && sections[index + 1].simplified;
                    if (section.isPunctuation) return null;
                    return (
                      <span
                        key={index}
                        onClick={() => {
                          if (!section.isPunctuation) {
                            setActiveIndex(index);
                            setEntryIndex(0);
                          }
                        }}
                        className={cn(
                          "inline-block select-none underline-offset-4 cursor-pointer border-b-[1.5px] border-softblack",
                          "relative rounded-b-md rounded-t pb-0.5 box-clone active:bg-indigo-300/20",
                          activeIndex === index && "bg-indigo-300/30 border-sky-300 active:bg-indigo-300/30"
                        )}
                      >
                        {section.simplified} {additionalPunctuation}
                      </span>
                    );
                  })}
                </p>
              </div>

              <Divider />

              <div className="px-3 sm:px-4">
                <span className="text-sm text-secondary">Definition:</span>

                {data && (
                  <React.Fragment>
                    <div className="flex justify-between">
                      {isIdiom ? (
                        <div>
                          <p className="mt-1 text-3xl md:text-4xl font-medium">{currentSection?.simplified}</p>
                          <div className="flex items-end gap-2">
                            <p className="font-medium">{currentEntry?.pinyin}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 flex items-end gap-2">
                          <p className="text-3xl md:text-4xl font-medium">{currentSection?.simplified}</p>
                          <div>
                            <p className="font-medium">{currentEntry?.pinyin}</p>
                          </div>
                        </div>
                      )}

                      <SaveToFlashcard key={currentSection?.simplified} word={currentSection?.simplified} />
                    </div>

                    {currentEntries.length > 1 && (
                      <div className="space-x-2 mt-2">
                        {currentEntries.map((_, index) => {
                          return (
                            <button
                              onClick={() => setEntryIndex(index)}
                              className={cn(
                                "rounded-md px-4 text-sm py-0.5 border",
                                entryIndex === index ? "bg-smokewhite text-black border-white" : "border-softzinc"
                              )}
                              key={index}
                            >
                              {index + 1}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <ul className="mt-1 ml-4 pr-1">
                      {currentEntry?.english?.map((definition, index) => {
                        return (
                          <li key={index} className="list-disc">
                            {definition}
                          </li>
                        );
                      })}
                    </ul>
                  </React.Fragment>
                )}
              </div>

              <Divider />

              <div className="mt-2 px-3 sm:px-4 flex justify-end">
                <button
                  onClick={() => {
                    const pathname = router.asPath.split("?")[0];
                    router.push(pathname, undefined, {
                      shallow: true,
                    });
                  }}
                  className="block rounded-md font-medium duration-200 text-secondary bg-hovered active:bg-subtle px-3 py-1.5"
                >
                  OK
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}