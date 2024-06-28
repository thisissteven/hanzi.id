import { DragToScrollWrapper, Popover } from "@/components";
import React from "react";
import clsx from "clsx";
import { AudioButton } from "../AudioButton";
import { HanziApiResponse } from "../types";

export function ExampleSentences({ hanzi, lessons }: { hanzi: string; lessons: HanziApiResponse["lessons"] }) {
  const [currentLevel, setCurrentLevel] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (lessons.length > 0) {
      setCurrentLevel(lessons[0].lessonInfo.level.toLowerCase());
    }
  }, [lessons]);

  const lessonLevelSet = new Set(lessons.map((lesson) => lesson.lessonInfo.level.toLowerCase()));
  const lessonLevels = Array.from(lessonLevelSet);

  const currentLesson = lessons.filter((lesson) => lesson.lessonInfo.level.toLowerCase() === currentLevel);

  const regex = new RegExp(`(${hanzi})`);

  if (lessons.length === 0) {
    return (
      <p className="ml-4 text-lightgray">
        No example sentences found for <span className="text-xl text-smokewhite">{hanzi}</span>
      </p>
    );
  }

  return (
    <>
      {lessonLevels.length > 1 && (
        <DragToScrollWrapper key={hanzi}>
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
      <ul className="relative space-y-2 px-4">
        {currentLesson.map((lesson, index) => {
          const splitted = lesson.simplified.split(regex);

          return (
            <li key={index} className="list-none">
              <Popover>
                <Popover.Trigger className="text-left sm:text-lg font-medium">
                  {splitted.map((part, index) => {
                    if (part === hanzi)
                      return (
                        <span className="text-sky-400" key={index}>
                          {hanzi}
                        </span>
                      );
                    return <React.Fragment key={index}>{part}</React.Fragment>;
                  })}
                  <AudioButton size="small" key={lesson.audioUrl} url={lesson.audioUrl} />
                </Popover.Trigger>
                <Popover.Content
                  align="start"
                  className="text-xs sm:text-sm leading-5 text-smokewhite px-2 max-[640px]:max-w-[calc(100vw-1rem)] max-w-[calc(570px-1rem)]"
                >
                  <p>{lesson.pinyin}</p>
                </Popover.Content>
              </Popover>
              <p className="text-sm sm:text-base text-gray">{lesson.english}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
