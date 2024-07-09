import { createErrorToast, LoadingBar } from "@/components";
import { cn } from "@/utils";
import { AnimatePresence } from "framer-motion";
import { LucideMousePointerClick } from "lucide-react";
import { TypingInput } from "./typing-input";
import { TypingStats } from "./typing-stats";
import { TypingStatsProvider } from "./use-typing-stats";
import { useTypingTest } from "./use-typing-test";
import { TypingTestData, normalizeArrays, unicodeRange } from "./utils";
import React from "react";
import { useLocale } from "@/locales/use-locale";
import { Layout } from "../layout";
import { useTypingTestSettings } from "./use-typing-test-settings";
import { AddWordsToFlashcard } from "./add-words-to-flashcard";

export function TypingTestContent({
  isLoading,
  words,
  shuffleWords,
  setDisabled,
}: {
  isLoading: boolean;
  words: TypingTestData[];
  shuffleWords: () => void;
  setDisabled: (value: boolean) => void;
}) {
  const { wordStatuses, testStatus, currentIndex, nextWord, updateWord, updateTestStatus } = useTypingTest(words);
  const {
    settings: { showPinyin, time },
  } = useTypingTestSettings();

  const currentWordRef = React.useRef() as React.MutableRefObject<HTMLLIElement | null>;
  const caretRef = React.useRef() as React.MutableRefObject<HTMLDivElement | null>;
  const inputRef = React.useRef() as React.MutableRefObject<HTMLInputElement | null>;
  const overlayRef = React.useRef() as React.MutableRefObject<HTMLDivElement | null>;

  React.useEffect(() => {
    if (testStatus === "waiting for you") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [setDisabled, testStatus]);

  const resetTest = React.useCallback(() => {
    shuffleWords();
    updateTestStatus("waiting for you");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [shuffleWords, updateTestStatus]);

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isAlphabet = /^[a-z]$/.test(e.key);

      const isCapsAlphabet = /^[A-Z]$/.test(e.key);

      if (isCapsAlphabet) {
        createErrorToast("Your CAPS LOCK is on!", {});
      }

      if (isAlphabet || isCapsAlphabet) {
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resetTest]);

  React.useEffect(() => {
    if (currentWordRef.current) {
      currentWordRef.current.scrollIntoView({ behavior: "smooth", block: "center" });

      setTimeout(() => {
        if (currentWordRef.current && caretRef.current) {
          const { x, y } = {
            x: currentWordRef.current.offsetLeft + 1,
            y: currentWordRef.current.offsetTop + currentWordRef.current.offsetHeight,
          };

          if (inputRef.current) {
            inputRef.current.style.left = `${x}px`;
            inputRef.current.style.top = `${y}px`;
          }

          const { xRef, yRef } = {
            xRef: currentWordRef.current.offsetLeft - 2,
            yRef: currentWordRef.current.offsetTop + 2,
          };

          caretRef.current.style.left = `${xRef}px`;
          caretRef.current.style.top = `${yRef}px`;
        }
      }, 0);

      const wordsLength = wordStatuses[currentIndex].word.length;
      if (wordsLength > 0) {
        setTimeout(() => {
          if (caretRef.current && currentWordRef.current) {
            const currentSpan: any = currentWordRef.current.children[wordsLength - 1];
            const { x, y } = {
              x: currentSpan.offsetLeft + currentSpan.offsetWidth - 2,
              y: currentSpan.offsetTop + 2,
            };
            caretRef.current.style.left = `${x}px`;
            caretRef.current.style.top = `${y}px`;
          }
        }, 0);
      }
    }
  }, [testStatus, wordStatuses, currentIndex]);

  const onEnd = React.useCallback(() => {
    updateTestStatus("finished");
    inputRef.current?.blur();
  }, [updateTestStatus]);

  const { t } = useLocale();

  return (
    <div>
      <TypingStatsProvider
        key={time.toString()}
        time={time}
        onEnd={onEnd}
        testStatus={testStatus}
        wordStatuses={wordStatuses}
      >
        <TypingStats />
      </TypingStatsProvider>
      <div
        className="relative"
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        <ul className="relative mt-4 px-2 py-3 flex flex-wrap gap-4 h-40 overflow-hidden bg-black">
          <div
            ref={caretRef}
            key={(testStatus === "ongoing").toString()}
            className={cn(
              "absolute top-[13px] left-[6px] w-1 h-7 sm:h-8 rounded-full bg-sky-500/50",
              testStatus === "ongoing" && "duration-100",
              testStatus === "waiting for you" && "animate-blink"
            )}
          />
          {words.map((word, index) => {
            const correct = wordStatuses[index].status === "correct";
            const wrong = wordStatuses[index].status === "wrong";
            const inactive = wordStatuses[index].status === "inactive";
            const current = wordStatuses[index].status === "current";

            const { typedCharacters, actualCharacters } = normalizeArrays(
              wordStatuses[index].word.split(""),
              word.hanzi.split("")
            );

            const isFinishedAndInactive = testStatus === "finished" && wordStatuses[index].status === "inactive";
            const pinyin = word.pinyin.split(" ");

            return (
              <li
                key={index}
                ref={current ? currentWordRef : null}
                className={cn(
                  "text-2xl sm:text-3xl font-medium duration-500",
                  (inactive || current) && "text-secondary/40",
                  isFinishedAndInactive && "opacity-0",
                  wrong && "underline underline-offset-8 decoration-mossgreen"
                )}
              >
                {actualCharacters.map((char, index) => {
                  const typedChar = typedCharacters[index];

                  const correctChar = typedChar === char && typedChar !== null;
                  const wrongChar = typedChar !== char && typedChar !== null;

                  const charToDisplay = typedChar || char;

                  return (
                    <span
                      key={index}
                      className={cn(
                        "relative duration-500",
                        correctChar && "text-smokewhite",
                        correct && "text-smokewhite",
                        wrongChar && "text-mossgreen",
                        !typedChar && "text-lightgray"
                      )}
                    >
                      {charToDisplay}
                      <span
                        className={cn(
                          "absolute -top-[15px] sm:-top-3.5 left-1/2 -translate-x-1/2 text-xs sm:text-sm color-opacity-transition",
                          current && showPinyin ? "opacity-100" : "opacity-0"
                        )}
                      >
                        {pinyin[index]}
                      </span>
                    </span>
                  );
                })}
              </li>
            );
          })}

          <TypingInput
            ref={inputRef}
            testStatus={testStatus}
            onFocus={() => {
              if (caretRef.current) {
                caretRef.current.style.opacity = "1";
                if (testStatus === "waiting for you") {
                  caretRef.current.classList.add("animate-blink");
                }
              }
              if (overlayRef.current) {
                overlayRef.current.style.opacity = "0";
                overlayRef.current.style.transitionDelay = "0ms";
              }
            }}
            onBlur={() => {
              if (caretRef.current) {
                caretRef.current.style.opacity = "0";
                caretRef.current.classList.remove("animate-blink");
              }
              if (overlayRef.current) {
                overlayRef.current.style.opacity = "1";
                overlayRef.current.style.transitionDelay = "2500ms";
              }
            }}
            onChange={(e) => {
              const value = e.target.value;
              const chineseCharacterValue = value
                .split("")
                .filter((char) => {
                  return unicodeRange.test(char);
                })
                .join("");
              if (wordStatuses[currentIndex].word !== chineseCharacterValue) {
                updateWord(chineseCharacterValue);
              }
              if (testStatus === "waiting for you") {
                updateTestStatus("ongoing");
              }
            }}
            onNextWord={(value) => {
              nextWord(value);
            }}
          />
        </ul>
        <div
          ref={overlayRef}
          className={cn(
            "absolute select-none grid place-items-center inset-0 w-full h-full bg-black/50 backdrop-blur-sm duration-300",
            isLoading ? "opacity-100" : ""
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isLoading ? (
              <LoadingBar visible />
            ) : (
              <Layout className="flex items-center justify-center gap-2 flex-wrap">
                <LucideMousePointerClick className="shrink-0" /> <span className="text-center">{t.clickHere}</span>
              </Layout>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-8 w-fit mx-auto flex gap-2">
        <button
          onClick={resetTest}
          className="px-4 py-2 active:bg-hovered duration-200 rounded-md flex items-center gap-2 focus:bg-subtle/50 focus:outline-none outline-transparent text-secondary active:text-white border border-secondary/20"
        >
          {t.restart}
        </button>
        {testStatus === "finished" && currentIndex > 0 && (
          <AddWordsToFlashcard words={words} wordStatuses={wordStatuses} currentIndex={currentIndex} />
        )}
      </div>
    </div>
  );
}
