import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { FlashcardedResult } from "@/pages/api/flashcard";
import React from "react";
import { cn } from "@/utils";

export function CardDetailsModal({ details, onClose }: { details?: FlashcardedResult; onClose: () => void }) {
  const latestDetails = React.useRef(details) as React.MutableRefObject<FlashcardedResult | undefined>;

  const [entryIndex, setEntryIndex] = React.useState(0);

  React.useEffect(() => {
    if (details) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.scrollbarGutter = "stable";
      latestDetails.current = details;
      setEntryIndex(0);
    }

    const timeout = setTimeout(() => {
      if (!details) {
        document.body.style.overflowY = "scroll";
        document.documentElement.style.scrollbarGutter = "";
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [details]);

  const hanzi = details?.simplified ?? latestDetails.current?.simplified;
  const isIdiom = hanzi && hanzi.length >= 4;

  const entries = details?.entries ?? latestDetails.current?.entries ?? [];
  const currentEntry = entries[entryIndex];

  return (
    <Dialog className="relative z-[998]" open={Boolean(details)} onClose={onClose}>
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
                          <p className="mt-1 text-3xl md:text-4xl font-medium">{hanzi}</p>
                          <div className="flex items-end gap-2">
                            <p className="font-medium">{currentEntry.pinyin}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 flex items-end gap-2">
                          <p className="text-3xl md:text-4xl font-medium">{hanzi}</p>
                          <div>
                            <p className="font-medium">{currentEntry?.pinyin}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {entries.length > 1 && (
                      <div className="space-x-2 mt-2">
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