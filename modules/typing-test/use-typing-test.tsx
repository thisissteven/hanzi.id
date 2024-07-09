import React from "react";
import { useConfetti } from "@/modules/layout";
import { getInitialWordStatuses, TestStatus, TypingTestData, WordStatus } from "./utils";

export function useTypingTest(words: TypingTestData[]) {
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
      const currentWord = words[currentWordIndexRef.current].hanzi;
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
