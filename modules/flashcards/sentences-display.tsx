import { DragToScrollWrapper, Popover, usePreferences } from "@/components";
import React from "react";
import clsx from "clsx";
import { AudioButton } from "../hsk";
import { Sentences } from "./example-sentences";
import { CopyToClipboard } from "../speech";
import { useLocale } from "@/locales/use-locale";

export function SentencesDisplay({ hanzi, lessons }: { hanzi: string; lessons: Sentences }) {
  const [currentLevel, setCurrentLevel] = React.useState<string | null>(lessons?.[0]?.lessonInfo?.level?.toLowerCase());

  const lessonLevelSet = new Set(lessons.map((lesson) => lesson.lessonInfo.level.toLowerCase()));
  const lessonLevels = Array.from(lessonLevelSet);

  const currentLesson = lessons.filter((lesson) => lesson.lessonInfo.level.toLowerCase() === currentLevel);

  const regex = new RegExp(`(${hanzi})`);

  const { isSimplified } = usePreferences();

  const { t } = useLocale();

  if (lessons.length === 0) {
    return (
      <div className="ml-3 sm:ml-4">
        <p className="text-lightgray">
          {t.noExampleSentencesFound} <span className="text-xl text-smokewhite">{hanzi}</span>
        </p>
        <a
          className="text-sky-500 underline underline-offset-2"
          href={`https://www.purpleculture.net/dictionary-details?word=${hanzi}`}
          target="_blank"
        >
          {t.purpleCulture}
        </a>
      </div>
    );
  }

  return (
    <>
      {lessonLevels.length > 1 && (
        <DragToScrollWrapper key={hanzi} className="mt-2">
          {lessonLevels.map((level) => {
            return (
              <button
                onClick={() => {
                  setCurrentLevel(level);
                }}
                className={clsx(
                  "rounded-md px-4 text-sm py-0.5 border",
                  currentLevel === level ? "bg-smokewhite text-black border-white" : "border-softzinc"
                )}
                key={level}
              >
                {level}
              </button>
            );
          })}
        </DragToScrollWrapper>
      )}
      <ul className="relative space-y-2 px-3 sm:px-4 mt-2">
        {currentLesson.map((lesson, index) => {
          const splitted = isSimplified ? lesson.simplified.split(regex) : lesson.traditional.split(regex);

          return (
            <li key={index} className="list-none">
              <Popover>
                <Popover.Trigger asChild className="text-left text-xl font-medium">
                  <div role="button">
                    {splitted.map((part, index) => {
                      if (part === hanzi)
                        return (
                          <span className="text-sky-400" key={index}>
                            {hanzi}
                          </span>
                        );
                      return <React.Fragment key={index}>{part}</React.Fragment>;
                    })}
                    <CopyToClipboard
                      className="inline-flex align-middle max-sm:mb-0.5 active:bg-transparent md:w-9 md:h-9"
                      text={isSimplified ? lesson.simplified : lesson.traditional}
                      size={16}
                    />
                    <AudioButton
                      size="small"
                      key={index}
                      text={isSimplified ? lesson.simplified : lesson.traditional}
                      speed={1}
                    />
                  </div>
                </Popover.Trigger>
                <Popover.Content
                  align="start"
                  className="leading-5 text-smokewhite px-2 max-[640px]:max-w-[calc(100vw-1rem)] max-w-[calc(570px-1rem)]"
                >
                  <p>{lesson.pinyin}</p>
                </Popover.Content>
              </Popover>
              <p className="text-gray">{lesson.english}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
