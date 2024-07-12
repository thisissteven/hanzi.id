import { FlashcardedResult } from "@/pages/api/flashcard/en";
import { cn } from "@/utils";
import { AudioButton } from "../hsk";
import React from "react";

export function DisectedCharacters({
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
    <div className="px-3 sm:px-4 bg-softblack relative">
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
