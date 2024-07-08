import { cn } from "@/utils";
import { LucideMousePointerClick } from "lucide-react";
import React from "react";

const words = [
  "我们",
  "他们",
  "没有",
  "自己",
  "中国",
  "可以",
  "问题",
  "工作",
  "这个",
  "生活",
  "这样",
  "已经",
  "这些",
  "一些",
  "起来",
  "什么",
  "现在",
  "社会",
  "关系",
  "第一",
  "因为",
  "开始",
  "许多",
  "时间",
  "人们",
  "今天",
  "国家",
  "思想",
  "一定",
  "如果",
  "同时",
  "需要",
  "重要",
  "为了",
  "就是",
  "人民",
  "认为",
  "成为",
  "北京",
  "历史",
  "方面",
  "情况",
  "而且",
  "学生",
  "这里",
  "但是",
  "孩子",
  "可能",
  "发生",
  "必须",
  "只有",
  "要求",
  "发现",
  "进行",
  "特别",
  "得到",
  "文化",
  "同志",
  "发展",
  "日本",
  "因此",
  "对于",
  "领导",
  "时候",
  "政府",
];

type WordStatus = "correct" | "wrong" | "inactive" | "current";
type TestStatus = "waiting for you" | "ongoing" | "finished";

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
          break;
      }
    },
    [words]
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
      if (currentWordIndex === 0) {
        updateTestStatus("ongoing");
      }
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

export default function TypingTest() {
  const { wordStatuses, testStatus, currentIndex, nextWord, updateWord, updateTestStatus } = useTypingTest(words);

  const currentWordRef = React.useRef() as React.MutableRefObject<HTMLLIElement | null>;
  const caretRef = React.useRef() as React.MutableRefObject<HTMLDivElement | null>;
  const inputRef = React.useRef() as React.MutableRefObject<HTMLInputElement | null>;
  const overlayRef = React.useRef() as React.MutableRefObject<HTMLDivElement | null>;

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

  return (
    <div className="mx-auto container max-w-3xl">
      <div className="h-[11.28rem]"></div>
      <h1 className="text-2xl md:text-3xl">
        Typing Test{" "}
        <span
          className={cn(
            "text-base",
            testStatus === "waiting for you" && "text-secondary/40",
            testStatus === "ongoing" && "text-sky-500",
            testStatus === "finished" && "text-smokewhite"
          )}
        >
          ({testStatus})
        </span>
      </h1>
      <p className="mt-2 text-lg text-secondary">Test your typing speed with the following words:</p>
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
              testStatus === "ongoing" ? "duration-100" : "animate-blink"
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

            return (
              <li
                key={index}
                ref={current ? currentWordRef : null}
                className={cn("text-3xl font-medium duration-500", (inactive || current) && "text-secondary/40")}
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
                overlayRef.current.style.transitionDelay = "500ms";
              }
            }}
            disabled={testStatus === "finished"}
            onChange={(e) => {
              const value = e.currentTarget.value;
              const chineseCharacterValue = value
                .split("")
                .filter((char) => {
                  return unicodeRange.test(char);
                })
                .join("");
              if (wordStatuses[currentIndex].word !== chineseCharacterValue) {
                updateWord(chineseCharacterValue);
              }
            }}
            onNextWord={(value) => {
              nextWord(value);
            }}
          />
        </ul>
        <div
          ref={overlayRef}
          className="absolute select-none flex items-center justify-center gap-2 inset-0 w-full h-full bg-black/50 backdrop-blur-sm duration-300"
        >
          <LucideMousePointerClick /> Click here or press any key to focus
        </div>
      </div>

      <div className="mt-4 w-fit flex gap-2">
        <button
          onClick={() => {
            updateTestStatus("waiting for you");
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
        >
          <span className="text-smokewhite">Restart</span>
        </button>
      </div>
    </div>
  );
}

const SPACE_KEY = " ";

type InputProps = {
  onNextWord: (value: string) => void;
} & React.ComponentPropsWithoutRef<"input">;

const Input = React.forwardRef(function Input(
  { onNextWord, onChange, ...rest }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const [value, setValue] = React.useState("");

  return (
    <input
      type="text"
      ref={ref}
      // className="w-52 sm:w-64 px-3 py-2 rounded-md focus:outline-none bg-softblack placeholder:text-lightgray"
      className="absolute inset-0 focus:outline-none opacity-0 w-2 h-2"
      placeholder="press space after each word"
      value={value}
      onChange={(e) => {
        onChange?.(e);
        setValue(e.currentTarget.value);
      }}
      onKeyDown={(e) => {
        if (e.key === SPACE_KEY) {
          const trimmedValue = e.currentTarget.value.trim();
          onNextWord(trimmedValue);
          setValue("");
        }
      }}
      {...rest}
    />
  );
});
