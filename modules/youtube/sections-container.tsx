import { usePreferences } from "@/components";
import { useLocale } from "@/locales/use-locale";
import { SegmentedResult } from "@/pages/api/segment/en";
import { cn } from "@/utils";
import React from "react";
import { AudioButton } from "../hsk";
import { AddOrRemoveFromFlashcard } from "../speech";
import { useWindowSize } from "@/hooks";

export function SectionsContainer({
  isPlaying,
  sections,
  children,
  flashcardName,
}: {
  isPlaying: boolean;
  sections: SegmentedResult[];
  children: React.ReactNode;
  flashcardName: string;
}) {
  const { t } = useLocale();
  const { isSimplified } = usePreferences();

  const segments = React.useMemo(() => sections.flat(), [sections]);
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);
  const [entryIndex, setEntryIndex] = React.useState(0);

  React.useEffect(() => {
    if (segments) {
      const firstNonPunctuationIndex = segments.findIndex((segment) => !segment.isPunctuation);
      setActiveIndex(firstNonPunctuationIndex);
    }
  }, [segments]);

  const currentSection = segments?.[activeIndex];

  const currentSimplifiedLength = currentSection?.simplified?.length;
  const isIdiom = currentSimplifiedLength && currentSimplifiedLength >= 3;

  const currentEntries = currentSection?.entries ?? [];

  const actualEntryIndex = Math.min(entryIndex, currentEntries.length - 1);
  const currentEntry = currentEntries[actualEntryIndex] ?? [];

  const currentHanzi = isSimplified ? currentSection?.simplified : currentSection?.traditional;

  const possibleWords = Array.from(new Set([currentSection?.simplified, currentSection?.traditional])).filter(
    (item) => item !== undefined
  );

  const { width } = useWindowSize();

  return (
    <div>
      <p className="text-2xl text-center">
        {segments.map((section, index) => {
          const isLastIndex = segments.length - 1 === index;

          let additionalPunctuation = "";
          let nextIndex = index + 1;

          while (nextIndex < segments.length && segments[nextIndex].isPunctuation && !isLastIndex) {
            additionalPunctuation += segments[nextIndex].simplified;
            nextIndex++;
          }
          if (section.isPunctuation && index > 0) return null;

          return (
            <span
              key={index}
              onClick={() => {
                if (!section.isPunctuation) {
                  setActiveIndex(index);
                  setEntryIndex(0);
                }
              }}
              className={cn("inline-block select-none", "whitespace-pre-wrap")}
            >
              <span
                className={cn(
                  "underline-offset-4 cursor-pointer border-b-[1.5px] border-softblack",
                  "relative rounded-b-md rounded-t pb-0.5 box-clone active:bg-indigo-300/20",
                  activeIndex === index && !isPlaying && "bg-indigo-300/30 border-sky-300 active:bg-indigo-300/30",
                  isPlaying && "pointer-events-none border-transparent"
                )}
              >
                {isSimplified ? section.simplified : section.traditional}
              </span>
              {additionalPunctuation.trim()}
            </span>
          );
        })}
      </p>

      {children}

      {activeIndex >= 0 && (
        <div
          className="mt-4 mx-auto duration-200"
          style={{
            maxWidth: width > 768 ? "940px" : "calc(100dvw - 2rem)",
            opacity: isPlaying ? 0 : 1,
          }}
        >
          <div className="relative">
            <span className="text-sm text-secondary">{t.definition}:</span>

            <div className="flex justify-between">
              {isIdiom ? (
                <div>
                  <p className="mt-1 text-4xl md:text-5xl font-medium">{currentHanzi}</p>
                  <div className="flex items-end gap-2 mt-1.5">
                    <p className="font-medium text-lg md:text-xl">{currentEntry?.pinyin}</p>
                    <AudioButton text={currentHanzi ?? ""} size="normal" />
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex items-end gap-2">
                  <p className="text-4xl md:text-5xl font-medium">{currentHanzi}</p>
                  <div>
                    <p className="font-medium text-lg md:text-xl">{currentEntry?.pinyin}</p>
                  </div>
                  <AudioButton text={currentHanzi ?? ""} size="normal" />
                </div>
              )}

              <AddOrRemoveFromFlashcard
                key={currentHanzi}
                chapterName={flashcardName}
                word={currentHanzi}
                possibleWords={possibleWords}
              />
            </div>

            {currentEntries.length > 1 && (
              <div className="flex flex-wrap gap-2 mt-3">
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

            <ul className="mt-1 ml-4 pr-1 md:grid md:grid-cols-2">
              {currentEntry?.english?.map((definition, index) => {
                return (
                  <li key={index} className="list-disc">
                    {definition}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
