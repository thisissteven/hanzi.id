import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { NewReadingProps } from "../constants";
import { readingTime } from "reading-time-estimator";
import { franc } from "franc";
import { EraserIcon } from "lucide-react";
import { FormTextarea } from "@/components/text-area";
import { useScrollToTop } from "./use-scroll-to-top";

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
    <div className="absolute right-2 bottom-16 md:right-16 md:bottom-2 pointer-events-none peer-focus:opacity-50">
      <div className="flex gap-2 items-center w-fit text-xs">
        <span className="inline-flex items-center rounded-md backdrop-blur-sm bg-gray-400/10 px-2 py-1 font-medium text-white ring-1 ring-inset ring-gray-400/20">
          {result.words} words
        </span>
        {result.minutes > 0 && (
          <span className="inline-flex items-center rounded-md backdrop-blur-sm bg-gray-400/10 px-2 py-1 font-medium text-white ring-1 ring-inset ring-gray-400/20">
            {result.minutes} minutes reading time
          </span>
        )}
      </div>
    </div>
  );
}

export function TypeOrPasteText() {
  const { control, register, getValues, setValue } = useFormContext<NewReadingProps>();
  const { fields, remove, insert } = useFieldArray({
    control,
    name: "chapters",
  });

  useScrollToTop();

  return (
    <div>
      <div className="mt-4">
        <div className="text-secondary flex flex-wrap w-fit items-center gap-x-1.5 rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset ring-gray-800">
          <svg className="h-1.5 w-1.5 fill-blue-400" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>
          Tip:
          <span>
            Pressing <span className="font-mono text-blue-200">Enter</span> on the current caret position will split the
            current chapter into two.
          </span>
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
                    className="bg-transparent pl-3 pr-10 py-2 rounded-md border border-subtle ring-offset-black ring-smoke focus:ring-offset-2 focus:ring-2 text-secondary focus:text-white transition-shadow duration-[200ms] placeholder:text-secondary/50 focus:outline-none w-full"
                    type="text"
                    placeholder="Chapter name"
                    required
                  />
                  <span className="absolute text-xs bg-black/50 backdrop-blur-sm h-7 w-8 text-secondary right-1 top-1/2 -translate-y-1/2 grid place-items-center">
                    {index + 1}
                  </span>
                </div>
                <div className="relative max-md:space-y-2 md:flex gap-2">
                  <Controller
                    control={control}
                    name={`chapters.${index}.content`}
                    render={({ field }) => (
                      <FormTextarea
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();

                            const target = e.target as HTMLTextAreaElement;

                            // Get the cursor position
                            const cursorPosition = target.selectionStart;

                            // Get the current content
                            const content = getValues(`chapters.${index}.content`);

                            // Split the content at the cursor position
                            const firstPart = content.slice(0, cursorPosition);
                            const secondPart = content.slice(cursorPosition);

                            setValue(`chapters.${index}.content`, firstPart);
                            insert(index + 1, { title: "", content: secondPart });
                          }
                        }}
                        placeholder="Type or paste your chapter contents here"
                      />
                    )}
                  />

                  <ContentStats index={index} />
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        if (fields.length > 1) remove(index);
                      }}
                      title="remove chapter"
                      className="rounded-md max-md:w-full max-md:py-2 disabled:pointer-events-none disabled:opacity-50 duration-[200ms] border border-rose-700/20 bg-rose-800/20 active:bg-rose-800/30 text-rose-700 active:text-rose-600 w-12 h-full grid place-items-center"
                    >
                      <EraserIcon />
                    </button>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
