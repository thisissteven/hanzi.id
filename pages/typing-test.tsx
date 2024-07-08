import { createErrorToast, LoadingBar } from "@/components";
import { cn } from "@/utils";
import { LucideMousePointerClick } from "lucide-react";
import React from "react";
import useSWRImmutable from "swr/immutable";
import { useTimer } from "react-timer-hook";
import { AnimatePresence } from "framer-motion";
import { Layout, useConfetti } from "@/modules/layout";
import { useLocale } from "@/locales/use-locale";

const simplified =
  "https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/languages/chinese_simplified.json";
const simplified_1k =
  "https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/languages/chinese_simplified_1k.json";
const simplified_5k =
  "https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/languages/chinese_simplified_5k.json";
const simplified_10k =
  "https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/languages/chinese_simplified_10k.json";
const simplified_50k =
  "https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/languages/chinese_simplified_50k.json";
const traditional =
  "https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/languages/chinese_traditional.json";

type WordStatus = "correct" | "wrong" | "inactive" | "current";
type TestStatus = "waiting for you" | "ongoing" | "finished";
type TestType = "simplified" | "simplified_1k" | "simplified_5k" | "simplified_10k" | "simplified_50k" | "traditional";

const fetchUrls: Record<TestType, string> = {
  simplified,
  simplified_1k,
  simplified_5k,
  simplified_10k,
  simplified_50k,
  traditional,
} as const;

function shuffle(array: string[]) {
  return array.sort(() => Math.random() - 0.5);
}

const getInitialWordStatuses = (words: string[]) => {
  return [
    {
      word: "",
      status: "current" as WordStatus,
    },
    ...Array.from({ length: words.length - 1 }, (_) => ({
      word: "",
      status: "inactive" as WordStatus,
    })),
  ];
};

function useTypingTest(words: string[]) {
  const [wordStatuses, setWordStatuses] = React.useState<
    Array<{
      word: string;
      status: WordStatus;
    }>
  >(getInitialWordStatuses(words));

  const [testStatus, setTestStatus] = React.useState<TestStatus>("waiting for you");

  const currentWordIndexRef = React.useRef(0);

  const { party } = useConfetti();

  const updateTestStatus = React.useCallback(
    (status: TestStatus) => {
      switch (status) {
        case "waiting for you":
          setTestStatus("waiting for you");
          setWordStatuses(getInitialWordStatuses(words));
          currentWordIndexRef.current = 0;
          break;
        case "ongoing":
          setTestStatus("ongoing");
          break;
        case "finished":
          setTestStatus("finished");
          party();
          break;
      }
    },
    [words, party]
  );

  const updateWord = React.useCallback(
    (word: string) => {
      const index = currentWordIndexRef.current;
      setWordStatuses((prev) => {
        const next = [...prev];
        if (next[index].word === word) {
          return prev;
        }
        next[index] = {
          word,
          status: next[index].status,
        };
        return next;
      });
    },
    [setWordStatuses]
  );

  const nextWord = React.useCallback(
    (input: string) => {
      const currentWord = words[currentWordIndexRef.current];
      const currentWordIndex = currentWordIndexRef.current;

      if (input === currentWord) {
        setWordStatuses((prev) => {
          const next = [...prev];
          next[currentWordIndex] = {
            word: next[currentWordIndex].word,
            status: "correct",
          };
          if (currentWordIndex < words.length - 1) {
            next[currentWordIndex + 1] = {
              word: next[currentWordIndex + 1].word,
              status: "current",
            };
          }
          return next;
        });
      } else {
        setWordStatuses((prev) => {
          const next = [...prev];
          next[currentWordIndex] = {
            word: next[currentWordIndex].word,
            status: "wrong",
          };
          if (currentWordIndex < words.length - 1) {
            next[currentWordIndex + 1] = {
              word: next[currentWordIndex + 1].word,
              status: "current",
            };
          }
          return next;
        });
      }

      if (currentWordIndex < words.length - 1) {
        currentWordIndexRef.current = currentWordIndex + 1;
      } else {
        updateTestStatus("finished");
      }
    },
    [updateTestStatus, words]
  );

  return {
    wordStatuses,
    testStatus,
    currentIndex: currentWordIndexRef.current,
    nextWord,
    updateWord,
    updateTestStatus,
  };
}

const unicodeRange = /^[\u4e00-\u9fa5]$/;

function normalizeArrays(typedCharacters: Array<string | null>, actualCharacters: Array<string | null>) {
  const maxLength = Math.max(typedCharacters.length, actualCharacters.length);

  // Fill typedCharacters with nulls if it's shorter
  while (typedCharacters.length < maxLength) {
    typedCharacters.push(null);
  }

  // Fill actualCharacters with nulls if it's shorter
  while (actualCharacters.length < maxLength) {
    actualCharacters.push(null);
  }

  return {
    typedCharacters,
    actualCharacters,
  };
}

const testTypes = [
  "simplified",
  "simplified_1k",
  "simplified_5k",
  "simplified_10k",
  "simplified_50k",
  "traditional",
] as Array<TestType>;

export default function TypingTest() {
  const [testType, setTestType] = React.useState<TestType>("simplified");
  const { data, isLoading } = useSWRImmutable<{
    words: string[];
  }>(
    testType,
    async () => {
      const response = await fetch(fetchUrls[testType]);
      const data = await response.json();
      return data;
    },
    {
      keepPreviousData: true,
    }
  );

  const [words, setWords] = React.useState<string[]>([]);
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(() => {
    if (data?.words) {
      setWords(shuffle(data.words).slice(0, 100));
    }
  }, [data]);

  return (
    <div className="mx-auto container max-w-[960px] px-4 grid place-items-center min-h-[90dvh]">
      <div className="space-y-12 md:space-y-4">
        <div className="w-fit mx-auto">
          <ul className="flex justify-center gap-2 md:gap-1.5 whitespace-nowrap flex-wrap">
            {testTypes.map((type) => {
              return (
                <li key={type} className="text-xs text-smokewhite font-light">
                  <button
                    disabled={disabled}
                    onClick={() => {
                      setTestType(type);
                    }}
                    className={cn(
                      "bg-zinc border-[1.5px] rounded-full px-3 py-0.5 duration-200",
                      testType === type ? "opacity-100 border-secondary/20" : "opacity-50 border-secondary/20"
                    )}
                  >
                    {type}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <AnimatePresence initial={false} mode="wait">
          {words.length === 0 ? (
            <div className="h-[265px] sm:h-[289px] grid place-items-center">
              <LoadingBar visible />
            </div>
          ) : (
            <Layout>
              <TypingTestContent
                isLoading={isLoading}
                words={words}
                setDisabled={(value) => {
                  setDisabled(value);
                }}
                shuffleWords={() => {
                  if (data?.words) {
                    setWords(shuffle(data.words).slice(0, 100));
                  }
                }}
              />
            </Layout>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const TypingStatsContext = React.createContext(
  {} as {
    wpm: number;
    accuracy: number;
    seconds: number;
    testStatus: TestStatus;
  }
);

function useTypingStats() {
  return React.useContext(TypingStatsContext);
}

function getExpiryTimestamp(seconds: number) {
  const time = new Date();
  time.setSeconds(time.getSeconds() + seconds);
  return time;
}

function TypingStatsProvider({
  time,
  onEnd,
  testStatus,
  wordStatuses,
  children,
}: {
  time: number;
  onEnd: () => void;
  testStatus: TestStatus;
  wordStatuses: Array<{ word: string; status: WordStatus }>;
  children: React.ReactNode;
}) {
  const correctWords = React.useMemo(() => {
    return wordStatuses.filter((word) => word.status === "correct").length;
  }, [wordStatuses]);

  const wrongWords = React.useMemo(() => {
    return wordStatuses.filter((word) => word.status === "wrong").length;
  }, [wordStatuses]);

  const accuracy = React.useMemo(() => {
    const totalWords = correctWords + wrongWords;
    if (totalWords === 0) {
      return 100;
    }
    return Math.round((correctWords / totalWords) * 100);
  }, [correctWords, wrongWords]);

  const { seconds, start, restart } = useTimer({
    expiryTimestamp: getExpiryTimestamp(time),
    onExpire: onEnd,
    autoStart: false,
  });

  const wpm = React.useMemo(() => {
    // Calculate total correct and wrong words
    const totalWords = correctWords + wrongWords;

    // Calculate WPM based on total correct words and total time in minutes
    if (totalWords === 0 || time === 0) {
      return 0;
    }

    // Convert time from seconds to minutes for WPM calculation
    const timeInMinutes = time / 60;

    // Calculate WPM
    const wordsPerMinute = Math.round(correctWords / timeInMinutes);

    return wordsPerMinute;
  }, [correctWords, wrongWords, time]);

  React.useEffect(() => {
    if (testStatus === "ongoing") {
      start();
    }
  }, [start, testStatus, time]);

  React.useEffect(() => {
    if (testStatus === "waiting for you") {
      restart(getExpiryTimestamp(time), false);
    }
  }, [restart, testStatus, time]);

  return (
    <TypingStatsContext.Provider
      value={{
        wpm,
        accuracy,
        seconds,
        testStatus,
      }}
    >
      {children}
    </TypingStatsContext.Provider>
  );
}

function TypingTestContent({
  isLoading,
  words,
  shuffleWords,
  setDisabled,
}: {
  isLoading: boolean;
  words: string[];
  shuffleWords: () => void;
  setDisabled: (value: boolean) => void;
}) {
  const { wordStatuses, testStatus, currentIndex, nextWord, updateWord, updateTestStatus } = useTypingTest(words);

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
            x: currentWordRef.current.offsetLeft,
            y: currentWordRef.current.offsetTop + currentWordRef.current.offsetHeight,
          };

          if (inputRef.current) {
            inputRef.current.style.left = `${x}px`;
            inputRef.current.style.top = `${y}px`;
          }

          const { xRef, yRef } = {
            xRef: currentWordRef.current.offsetLeft,
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
  }, [updateTestStatus]);

  const { t } = useLocale();

  return (
    <div>
      <TypingStatsProvider onEnd={onEnd} testStatus={testStatus} time={15} wordStatuses={wordStatuses}>
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
        <ul className="relative mt-4 px-2 flex flex-wrap gap-4 h-36 overflow-hidden bg-black">
          <div
            ref={caretRef}
            key={(testStatus === "ongoing").toString()}
            className={cn(
              "absolute top-[2px] left-1.5 w-1 h-8 rounded-full bg-sky-500/50",
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
              word.split("")
            );

            const isFinishedAndInactive = testStatus === "finished" && wordStatuses[index].status === "inactive";

            return (
              <li
                key={index}
                ref={current ? currentWordRef : null}
                className={cn(
                  "text-2xl sm:text-3xl font-medium duration-500",
                  (inactive || current) && "text-secondary/40",
                  isFinishedAndInactive && "opacity-0"
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
                        "duration-500",
                        correctChar && "text-smokewhite",
                        correct && "text-smokewhite",
                        wrongChar && "text-red-500",
                        wrong && "text-red-500"
                      )}
                    >
                      {charToDisplay}
                    </span>
                  );
                })}
              </li>
            );
          })}

          <Input
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
            "absolute select-none flex items-center justify-center gap-2 inset-0 w-full h-full bg-black/50 backdrop-blur-sm duration-300",
            isLoading ? "opacity-100" : ""
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isLoading ? (
              <LoadingBar visible />
            ) : (
              <Layout className="flex items-center justify-center">
                <LucideMousePointerClick /> {t.clickHere}
              </Layout>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-8 w-fit mx-auto">
        <button
          onClick={resetTest}
          className="px-4 py-2 active:bg-hovered duration-200 rounded-md flex items-center gap-2 focus:bg-subtle/50 focus:outline-none outline-transparent text-secondary active:text-white border border-secondary/20"
        >
          {t.restart}
        </button>
      </div>
    </div>
  );
}

function TypingStats() {
  const { accuracy, wpm, seconds, testStatus } = useTypingStats();
  const { t } = useLocale();
  return (
    <AnimatePresence mode="wait" initial={false}>
      {testStatus === "waiting for you" ? (
        <Layout key="waiting" className="h-8 sm:h-14 flex text-lightgray font-medium w-fit items-end gap-4">
          <p className="px-2">{t.startTyping}</p>
        </Layout>
      ) : (
        <Layout key="started" className="h-8 sm:h-14 grid grid-cols-3 text-lightgray font-medium w-fit items-end gap-4">
          <div
            className={cn("text-3xl md:text-4xl duration-500 text-center", testStatus === "finished" && "text-sky-500")}
          >
            {seconds}
            <span className="text-sm md:text-lg">s</span>
          </div>
          <div
            className={cn("text-3xl md:text-4xl duration-500 text-center", testStatus === "finished" && "text-sky-500")}
          >
            {wpm}
            <span className="text-sm md:text-lg">wpm</span>
          </div>
          <div
            className={cn("text-3xl md:text-4xl duration-500 text-center", testStatus === "finished" && "text-sky-500")}
          >
            {accuracy}
            <span className="text-sm md:text-lg">%</span>
          </div>
        </Layout>
      )}
    </AnimatePresence>
  );
}

const SPACE_KEY = " ";

type InputProps = {
  testStatus: TestStatus;
  onNextWord: (value: string) => void;
} & React.ComponentPropsWithoutRef<"input">;

const Input = React.forwardRef(function Input(
  { testStatus, onNextWord, onChange, ...rest }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (testStatus === "waiting for you") {
      setValue("");
    }
  }, [testStatus]);

  return (
    <input
      type="text"
      ref={ref}
      className="absolute inset-0 focus:outline-none bg-transparent caret-transparent placeholder:text-lightgray text-sm h-5"
      value={value}
      onChange={(e) => {
        if (testStatus !== "finished") {
          onChange?.(e);
          const value = e.target.value;
          if (value.charAt(value.length - 1) === SPACE_KEY) {
            const trimmedValue = value.trim();
            onNextWord(trimmedValue);
            setValue("");
          } else {
            setValue(value);
          }
        }
      }}
      {...rest}
    />
  );
});
