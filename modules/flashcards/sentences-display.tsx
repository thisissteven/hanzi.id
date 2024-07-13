import { DragToScrollWrapper, Popover, usePreferences } from "@/components";
import React from "react";
import clsx from "clsx";
import { AudioButton } from "../hsk";
import { Sentences } from "./example-sentences";

export function SentencesDisplay({ hanzi, lessons }: { hanzi: string; lessons: Sentences }) {
  const [currentLevel, setCurrentLevel] = React.useState<string | null>(lessons?.[0]?.lessonInfo?.level?.toLowerCase());

  const lessonLevelSet = new Set(lessons.map((lesson) => lesson.lessonInfo.level.toLowerCase()));
  const lessonLevels = Array.from(lessonLevelSet);

  const currentLesson = lessons.filter((lesson) => lesson.lessonInfo.level.toLowerCase() === currentLevel);

  const regex = new RegExp(`(${hanzi})`);

  const { isSimplified } = usePreferences();

  if (lessons.length === 0) {
    return (
      <p className="ml-3 sm:ml-4 text-lightgray">
        No example sentences found for <span className="text-xl text-smokewhite">{hanzi}</span>
      </p>
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
      <ul className="relative space-y-2 px-4 mt-2">
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
                    <AudioButton
                      size="small"
                      key={index}
                      text={isSimplified ? lesson.simplified : lesson.traditional}
                      speed={1.3}
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
