import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React from "react";
import { cn } from "@/utils";
import { AddOrRemoveFromFlashcard } from "../speech";
import { FlashcardedResult } from "@/pages/api/flashcard/en";
import { useRouter } from "next/router";
import { Divider, usePreferences } from "@/components";
import { AudioButton } from "../hsk";

export function CardDetailsModal({
  chapterName,
  details,
  onClose,
}: {
  chapterName: string;
  details?: FlashcardedResult;
  onClose: () => void;
}) {
  const latestDetails = React.useRef(details) as React.MutableRefObject<FlashcardedResult | undefined>;

  const [entryIndex, setEntryIndex] = React.useState(0);

  const router = useRouter();
  const open = router.query.open;

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (!open) {
        document.body.style.overflowY = "scroll";
        document.documentElement.style.scrollbarGutter = "";
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [open]);

  React.useEffect(() => {
    if (details) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.scrollbarGutter = "stable";
      latestDetails.current = details;
      setEntryIndex(0);
    }
  }, [details]);

  const { isSimplified } = usePreferences();

  const hanzi = isSimplified
    ? details?.simplified ?? latestDetails.current?.simplified
    : details?.traditional ?? latestDetails.current?.traditional;
  const isIdiom = hanzi && hanzi.length >= 3;

  const entries = details?.entries ?? latestDetails.current?.entries ?? [];
  const disected = details?.disected ?? latestDetails.current?.disected ?? [];
  const currentEntry = entries[entryIndex];

  return (
    <Dialog className="relative z-[998]" open={Boolean(details && open)} onClose={onClose}>
      <DialogBackdrop
        transition
        className="fixed inset-y-0 left-0 w-screen z-[998] bg-black/20 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-y-0 left-0 z-[998] w-screen p-2 sm:p-4 overflow-y-auto">
        <div className="flex justify-center text-center sm:items-center">
          <DialogPanel
            transition
            className={cn(
              "relative transform overflow-hidden rounded-lg bg-white py-3 sm:py-4 text-left shadow-xl transition-all data-[closed]:-translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-full sm:max-w-xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95",
              "bg-softblack text-smokewhite"
            )}
          >
            <div className="mt-2 flex flex-col justify-between min-h-60">
              <div className="px-3 sm:px-4">
                <span className="text-sm text-secondary">Details:</span>

                {(details || latestDetails.current) && (
                  <React.Fragment>
                    <div className="flex justify-between">
                      {isIdiom ? (
                        <div>
                          <p className="mt-1 text-5xl font-medium">{hanzi}</p>
                          <div className="flex items-end gap-2 mt-1.5">
                            <p className="font-medium text-lg md:text-xl">{currentEntry?.pinyin}</p>
                            <AudioButton text={hanzi ?? ""} size="normal" />
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 flex items-end gap-2">
                          <p className="text-5xl font-medium">{hanzi}</p>
                          <div>
                            <p className="font-medium text-lg md:text-xl">{currentEntry?.pinyin}</p>
                          </div>
                          <AudioButton text={hanzi ?? ""} size="normal" />
                        </div>
                      )}

                      <AddOrRemoveFromFlashcard key={hanzi} chapterName={chapterName} word={hanzi} />
                    </div>

                    {entries.length > 1 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {entries.map((_, index) => {
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

                    <ul className="mt-1 ml-4 pr-1 text-lg">
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

              {disected.length > 1 && (
                <>
                  <Divider />
                  <DisectedCharacters disected={disected} isSimplified={isSimplified} />
                </>
              )}

              <div className="mt-2 px-3 sm:px-4 flex justify-end">
                <button
                  onClick={onClose}
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

function DisectedCharacters({
  disected,
  isSimplified,
}: {
  disected: FlashcardedResult["disected"];
  isSimplified: boolean;
}) {
  const [selected, setSelected] = React.useState(0);
  const [entryIndex, setEntryIndex] = React.useState(0);

  const selectedEntry = disected[selected];
  const hanzi = isSimplified ? selectedEntry.simplified : selectedEntry.traditional;

  const entries = selectedEntry.entries ?? [];
  const english = entries[entryIndex].english;
  const pinyin = entries[entryIndex].pinyin;
  const isIdiom = hanzi.length >= 3;

  return (
    <div className="mt-2 px-3 sm:px-4">
      <div className="flex flex-wrap gap-2">
        {disected.map((entry, index) => {
          const hanzi = isSimplified ? entry.simplified : entry.traditional;
          return (
            <button
              key={index}
              onClick={() => {
                setSelected(index);
                setEntryIndex(0);
              }}
              className={cn(
                "w-12 aspect-square grid place-items-center text-xl md:text-2xl rounded-md border duration-200",
                selected === index ? "bg-hovered/50 text-sky-500 border-sky-500/30" : "opacity-50 border-secondary/15"
              )}
            >
              {hanzi}
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between">
        {isIdiom ? (
          <div>
            <p className="mt-1 text-5xl font-medium">{hanzi}</p>
            <div className="flex items-end gap-2 mt-1.5">
              <p className="font-medium text-lg md:text-xl">{pinyin}</p>
              <AudioButton text={hanzi ?? ""} size="normal" />
            </div>
          </div>
        ) : (
          <div className="mt-1 flex items-end gap-2">
            <p className="text-5xl font-medium">{hanzi}</p>
            <div>
              <p className="font-medium text-lg md:text-xl">{pinyin}</p>
            </div>
            <AudioButton text={hanzi ?? ""} size="normal" />
          </div>
        )}
      </div>

      {entries.length > 1 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {entries.map((_, index) => {
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

      <ul className="mt-1 ml-4 pr-1 text-lg">
        {english.map((definition, index) => {
          return (
            <li key={index} className="list-disc">
              {definition}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
