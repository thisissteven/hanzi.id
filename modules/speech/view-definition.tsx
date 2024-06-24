import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";
import * as React from "react";
import IdHanziMap from "@/data/id-hanzi-map.json";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

import { SegmentApiResponse } from "@/pages/api/segment";
import { cn } from "@/utils";
import { useReading } from "../layout";
import { Divider, LoadingBar } from "@/components";

export type IdHanziMapKey = keyof typeof IdHanziMap;

export function DefinitionModal() {
  const router = useRouter();
  const sentence = router.query.sentence as string;

  const { data, isLoading } = useSWRImmutable<SegmentApiResponse>(`/segment?text=${sentence}`, {
    keepPreviousData: true,
    onSuccess: (data) => {
      const result = data.result.flat();
      const firstNonPunctuationIndex = result.findIndex((segment) => !segment.isPunctuation);
      setActiveIndex(firstNonPunctuationIndex);
    },
  });

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
        className="fixed inset-y-0 left-0 w-screen bg-black/20 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-y-0 left-0 z-[999] w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className={cn(
              "relative transform overflow-hidden rounded-lg bg-white px-4 pb-2 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-full sm:max-w-xl sm:p-6 sm:pb-4 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95",
              "bg-softblack text-smokewhite"
            )}
          >
            {isLoading && (
              <div className="grid place-items-center absolute inset-0 h-full z-50 bg-black/50 mb-8">
                {<LoadingBar className="scale-150" visible />}
              </div>
            )}

            <div>
              <div>
                <span className="text-sm text-secondary">Sentence:</span>
                <p className={cn(fontSize.className)}>
                  {sections?.map((section, index) => {
                    return (
                      <span
                        key={index}
                        onClick={() => {
                          if (!section.isPunctuation) {
                            setActiveIndex(index);
                          }
                        }}
                        className={cn(
                          "inline-block select-none underline-offset-4 cursor-pointer border-b-[1.5px] border-softblack",
                          !section.isPunctuation &&
                            "relative rounded-b-md rounded-t pb-0.5 box-clone active:bg-indigo-300/20",
                          activeIndex === index && "bg-indigo-300/30 border-sky-300 active:bg-indigo-300/30"
                        )}
                      >
                        {section.simplified}
                      </span>
                    );
                  })}
                </p>
              </div>

              <Divider />

              <div>
                <span className="text-sm text-secondary">Definition:</span>

                {data && (
                  <React.Fragment>
                    {isIdiom ? (
                      <>
                        <p className="mt-1 text-3xl md:text-4xl font-medium">{currentSection?.simplified}</p>
                        <div className="flex items-end gap-2">
                          <p className="font-medium">{currentEntry?.pinyin}</p>
                        </div>
                      </>
                    ) : (
                      <div className="mt-1 flex items-end gap-2">
                        <p className="text-3xl md:text-4xl font-medium">{currentSection?.simplified}</p>
                        <div>
                          <p className="font-medium">{currentEntry?.pinyin}</p>
                        </div>
                      </div>
                    )}

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

                    <ul className="mt-1 ml-4">
                      {currentEntry?.english?.map((definition, index) => {
                        return (
                          <li key={index} className="list-disc">
                            {definition}
                          </li>
                        );
                      })}
                    </ul>

                    <div className="mt-1 flex justify-end">
                      <button
                        onClick={() => {
                          const pathname = router.asPath.split("?")[0];
                          router.push(pathname, undefined, {
                            shallow: true,
                          });
                        }}
                        className="block rounded-md font-medium duration-200 bg-hovered active:bg-subtle px-3 py-1.5"
                      >
                        OK
                      </button>
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
