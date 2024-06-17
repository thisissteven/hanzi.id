import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { NewReadingProps } from "../constants";
import { readingTime } from "reading-time-estimator";
import { franc } from "franc";
import { DeleteIcon } from "lucide-react";

function ContentStats({ index }: { index: number }) {
  const { watch } = useFormContext<NewReadingProps>();

  const field = watch(`chapters.${index}`);
  const localeMapping = {
    eng: "en", // English
    cmn: "cn", // Simplified Chinese (Mandarin)
  } as const;
  const locale = franc(field.content) as keyof typeof localeMapping;

  const result = readingTime(field.content, 150, localeMapping[locale] || "en");
  return (
    <div className="mx-auto flex gap-2 items-center w-fit">
      <div className="h-12 w-[1px] rounded-full bg-secondary"></div>
      <div className="text-sm">
        <p>{result.words} words</p>
        <p className="text-xs">≈ {result.minutes} minutes reading time</p>
      </div>
    </div>
  );
}

export function TypeOrPasteText() {
  const { control, register } = useFormContext<NewReadingProps>();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: "chapters",
  });

  return (
    <div>
      <div className="mt-2">
        <div className="text-secondary flex flex-wrap w-fit items-center gap-x-1.5 rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset ring-gray-800">
          <svg className="h-1.5 w-1.5 fill-blue-400" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>
          Tip: Pressing <span className="font-mono text-blue-200">Enter</span> on the current caret position will create
          a new reading chapter.
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {fields.map((field, index) => {
          return (
            <React.Fragment key={field.id}>
              <div className="space-y-2">
                <div className="relative">
                  <input
                    {...register(`chapters.${index}.title`)}
                    className="bg-transparent pl-3 px-3 py-2 rounded-md border border-subtle ring-offset-black ring-smoke focus:ring-offset-2 focus:ring-2 transition-shadow duration-[200ms] placeholder:text-secondary/50 focus:outline-none w-full"
                    type="text"
                    placeholder="Chapter name"
                    required
                  />
                  <span className="absolute text-xs bg-black/50 backdrop-blur-sm h-7 w-8 text-secondary right-1 top-1/2 -translate-y-1/2 grid place-items-center">
                    {index + 1}
                  </span>
                </div>
                <div className="max-md:space-y-2 md:flex gap-2">
                  <textarea
                    {...register(`chapters.${index}.content`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        append({ title: "", content: "" });
                      }
                    }}
                    spellCheck="false"
                    className="bg-transparent px-3 py-2 rounded-md border border-subtle ring-offset-black ring-smoke focus:ring-offset-2 focus:ring-2 transition-shadow duration-[200ms] placeholder:text-secondary/50 focus:outline-none w-full h-[8.5rem]"
                    placeholder="Type or paste your chapter contents here"
                  />
                  <div>
                    <button
                      type="button"
                      disabled={fields.length === 1}
                      onClick={() => {
                        remove(index);
                      }}
                      title="remove chapter"
                      className="rounded-md max-md:w-full max-md:py-2 disabled:pointer-events-none disabled:opacity-50 duration-[200ms] border border-rose-700/20 bg-rose-800/20 active:bg-rose-800/30 text-rose-700 active:text-rose-600 w-12 h-full grid place-items-center"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              </div>
              <ContentStats index={index} />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
