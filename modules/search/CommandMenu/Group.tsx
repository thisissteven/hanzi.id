import clsx from "clsx";
import { Command } from "cmdk";
import React from "react";
import { CommandMenuItem } from "./Item";
import { Divider, usePreferences } from "@/components";
import { useLocale } from "@/locales/use-locale";
import { TranslateApiResponse } from "@/pages/api/translate";
import { AudioButton } from "@/modules/hsk";
import { cn } from "@/utils";

export function CommandMenuGroupCard({
  active,
  data,
  sentence,
}: {
  active: number[];
  data: TranslateApiResponse;
  sentence: string;
}) {
  const { isSimplified } = usePreferences();

  const { t } = useLocale();

  const sections = data.result.flat();
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);
  const [entryIndex, setEntryIndex] = React.useState(0);

  const currentSection = sections[activeIndex];

  const currentSimplifiedLength = currentSection?.simplified.length;
  const isIdiom = currentSimplifiedLength && currentSimplifiedLength >= 4;

  const currentEntries = currentSection?.entries ?? [];

  const actualEntryIndex = Math.min(entryIndex, currentEntries.length - 1);
  const currentEntry = currentEntries[actualEntryIndex] ?? [];

  React.useEffect(() => {
    if (data) {
      const result = data.result.flat();
      const firstNonPunctuationIndex = result.findIndex((segment) => !segment.isPunctuation);
      setActiveIndex(firstNonPunctuationIndex);
    }
  }, [data]);

  const showTranslations = active.includes(0);
  const showDefinitions = active.includes(1);

  return (
    <div>
      <div className="px-3 sm:px-4">
        <span className="text-sm text-secondary">{t.keyword}</span>
        <p className="text-xl md:text-2xl tracking-wider mt-1 leading-[30px]">
          {sections.map((section, index) => {
            const isLastIndex = sections.length - 1 === index;

            let additionalPunctuation = "";
            let nextIndex = index + 1;

            while (nextIndex < sections.length && sections[nextIndex].isPunctuation && !isLastIndex) {
              additionalPunctuation += sections[nextIndex].simplified;
              nextIndex++;
            }
            if (section.isPunctuation && index > 0) return null;

            const hanzi = isSimplified ? section.simplified : section.traditional;

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
                    activeIndex === index && "bg-indigo-300/30 border-sky-300 active:bg-indigo-300/30"
                  )}
                >
                  {hanzi}
                </span>
                {additionalPunctuation}
              </span>
            );
          })}
        </p>
        <div className="mt-2 flex justify-end">
          <AudioButton speed={1.2} size={"normal"} text={sentence} />
        </div>
      </div>

      {showTranslations && (
        <div className="pt-4">
          <div className="border-t border-t-secondary/10">
            <div className="mt-4 px-3 sm:px-4">
              <span className="text-sm text-secondary">{t.translation}:</span>
              <p className="mt-1">{data.translated}</p>
            </div>
          </div>
        </div>
      )}

      <Divider />

      {showDefinitions && (
        <div className="px-3 sm:px-4 relative bg-softblack">
          <span className="text-sm text-secondary">{t.definition}:</span>

          <React.Fragment>
            <div className="flex justify-between">
              {isIdiom ? (
                <div>
                  <p className="mt-1 text-3xl md:text-4xl font-medium">
                    {isSimplified ? currentSection?.simplified : currentSection?.traditional}
                  </p>
                  <div className="flex items-end gap-2">
                    <p className="font-medium">{currentEntry?.pinyin}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex items-end gap-2">
                  <p className="text-3xl md:text-4xl font-medium">
                    {isSimplified ? currentSection?.simplified : currentSection?.traditional}
                  </p>
                  <div>
                    <p className="font-medium">{currentEntry?.pinyin}</p>
                  </div>
                </div>
              )}
            </div>

            {currentEntries.length > 1 && (
              <div className="flex flex-wrap gap-2 mt-2">
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
        </div>
      )}
    </div>
  );
}

export function CommandMenuGroupSearch({
  heading,
  data,
  onSelect,
}: {
  heading?: string;
  data: string[];
  onSelect: (value: string) => void;
}) {
  return (
    <>
      <style jsx global>{`
        [cmdk-group-heading] {
          padding: 0.5rem;
        }
      `}</style>
      <Command.Group heading={heading} className={clsx("text-span text-xs font-light tracking-wide")}>
        {data.map((text, index) => {
          return <CommandMenuItem key={text + index} value={text} onSelect={onSelect} text={text} />;
        })}
      </Command.Group>
    </>
  );
}
