import React, { useState, useEffect, useRef } from "react";
import HanziWriter from "hanzi-writer";
import { useLocale } from "@/locales/use-locale";
import { LucidePencil } from "lucide-react";
import { cn } from "@/utils";

const unicodeRange = /^[\u4e00-\u9fa5]$/;

export const HanziStrokeSimulator = ({ toggleQuiz, text }: { toggleQuiz: (hanzi: string) => void; text: string }) => {
  const [character, setCharacter] = useState("");
  const writerRefs = useRef([]) as React.MutableRefObject<HanziWriter[]>;
  const [writerState, setWriterState] = useState<Array<"playing" | "paused" | "ready">>([]);

  React.useEffect(() => {
    if (text && text.length > 0) {
      setCharacter(text);
    }
  }, [text]);

  const [visibleRadical, setVisibleRadical] = useState(false);

  const { t } = useLocale();

  const chineseCharacters = character.split("").filter((char) => {
    return unicodeRange.test(char);
  });

  const prevChineseCharacters = useRef(chineseCharacters);

  useEffect(() => {
    writerRefs.current.forEach((writer) => {
      writer.updateColor("radicalColor", visibleRadical ? "#337ab7" : "#fefefe");
    });
  }, [visibleRadical]);

  useEffect(() => {
    if (prevChineseCharacters.current.length > chineseCharacters.length) {
      writerRefs.current = writerRefs.current.slice(0, chineseCharacters.length);
    }
    prevChineseCharacters.current = chineseCharacters;
    const writers = writerRefs.current;
    if (chineseCharacters.length > 0) {
      chineseCharacters.forEach((_, index) => {
        if (writers[index]) {
          if (writers[index]._character?.symbol !== chineseCharacters[index]) {
            writers[index].setCharacter(chineseCharacters[index]);
          }
        } else {
          const writer = HanziWriter.create(`character-target-${index}`, chineseCharacters[index], {
            width: 100,
            height: 100,
            padding: 5,
            strokeAnimationSpeed: 1,
            delayBetweenStrokes: 100,
            strokeColor: "#fefefe",
            outlineColor: "#333",
            drawingColor: "#333",
            radicalColor: visibleRadical ? "#337ab7" : "#fefefe",
          });
          writerRefs.current.push(writer);
          setWriterState((prev) => [...prev, "ready"]);
        }
      });
    }
  }, [chineseCharacters, visibleRadical]);

  return (
    <div className="md:px-3">
      <div className="flex max-sm:flex-col gap-2">
        <input
          type="text"
          value={character}
          onChange={(event) => {
            setCharacter(event.target.value);
          }}
          placeholder={t.hanziStrokePlaceholder}
          className="bg-transparent pl-3 pr-10 py-2 rounded-md border border-subtle ring-offset-black ring-smoke focus:ring-offset-2 focus:ring-2 text-secondary focus:text-white transition-shadow duration-200 placeholder:text-secondary/50 focus:outline-none w-full"
        />
        <button
          onClick={() => {
            setVisibleRadical((prev) => !prev);
          }}
          className={cn(
            "px-4 py-2 whitespace-nowrap rounded-md bg-subtle/50 duration-200 font-medium",
            visibleRadical ? "opacity-100 bg-subtle text-sky-500" : "opacity-50 active:bg-softzinc"
          )}
        >
          {visibleRadical ? t.hideRadical : t.showRadical}
        </button>
      </div>
      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
        {chineseCharacters.map((_, index) => {
          return (
            <div
              key={index}
              className="p-2 border border-secondary/10 rounded-md flex flex-col items-center justify-end"
            >
              <div id={`character-target-${index}`}></div>
              <div className="grid grid-cols-2 gap-2 w-full">
                <button
                  onClick={() => toggleQuiz(chineseCharacters[index])}
                  className="w-full grid place-items-center p-3 rounded-md bg-subtle/50 active:bg-hovered duration-200"
                >
                  <LucidePencil size={16} />
                </button>

                <button
                  onClick={() => {
                    if (writerState[index] === "playing") {
                      writerRefs.current[index].pauseAnimation();
                      setWriterState((prev) => {
                        const newState = [...prev];
                        newState[index] = "paused";
                        return newState;
                      });
                    } else if (writerState[index] === "paused") {
                      writerRefs.current[index].resumeAnimation();
                      setWriterState((prev) => {
                        const newState = [...prev];
                        newState[index] = "playing";
                        return newState;
                      });
                    } else {
                      writerRefs.current[index].animateCharacter({
                        onComplete: () => {
                          setWriterState((prev) => {
                            const newState = [...prev];
                            newState[index] = "ready";
                            return newState;
                          });
                        },
                      });
                      setWriterState((prev) => {
                        const newState = [...prev];
                        newState[index] = "playing";
                        return newState;
                      });
                    }
                  }}
                  className="w-full grid place-items-center px-3 py-2 rounded-md bg-subtle/50 active:bg-hovered duration-200"
                >
                  {writerState[index] === "playing" ? <PauseIcon /> : <PlayIcon />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function PauseIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" className="w-4 h-4 fill-current">
      <path d="M8.5 4C7.67157 4 7 4.67157 7 5.5V30.5C7 31.3284 7.67157 32 8.5 32H11.5C12.3284 32 13 31.3284 13 30.5V5.5C13 4.67157 12.3284 4 11.5 4H8.5ZM24.5 4C23.6716 4 23 4.67157 23 5.5V30.5C23 31.3284 23.6716 32 24.5 32H27.5C28.3284 32 29 31.3284 29 30.5V5.5C29 4.67157 28.3284 4 27.5 4H24.5Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 10 10" className="w-4 h-4 fill-current">
      <path d="M8.25 4.567a.5.5 0 0 1 0 .866l-7.5 4.33A.5.5 0 0 1 0 9.33V.67A.5.5 0 0 1 .75.237l7.5 4.33Z"></path>
    </svg>
  );
}
