import { useTimer } from "use-timer";
import { TestStatus, WordStatus } from "./utils";
import React from "react";
import { useTypingTestSettings } from "./use-typing-test-settings";

function getExpiryTimestamp(seconds: number) {
  const time = new Date();
  time.setSeconds(time.getSeconds() + seconds);
  return time;
}

const TypingStatsContext = React.createContext(
  {} as {
    wpm: number;
    accuracy: number;
    seconds: number;
    testStatus: TestStatus;
  }
);

export function useTypingStats() {
  return React.useContext(TypingStatsContext);
}

export function TypingStatsProvider({
  onEnd,
  testStatus,
  wordStatuses,
  children,
  time,
}: {
  onEnd: () => void;
  testStatus: TestStatus;
  wordStatuses: Array<{ word: string; status: WordStatus }>;
  children: React.ReactNode;
  time: number;
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

  const {
    time: seconds,
    start,
    reset,
  } = useTimer({
    autostart: false,
    initialTime: time,
    timerType: "DECREMENTAL",
    endTime: 0,
    onTimeOver: onEnd,
  });

  const wpm = React.useMemo(() => {
    // Convert time from seconds to minutes for WPM calculation
    const timeInMinutes = time / 60;

    // Calculate WPM
    const wordsPerMinute = Math.round(correctWords / timeInMinutes);

    return wordsPerMinute;
  }, [correctWords, time]);

  React.useEffect(() => {
    if (testStatus === "ongoing") {
      start();
    }
  }, [start, testStatus]);

  React.useEffect(() => {
    if (testStatus === "waiting for you") {
      reset();
    }
  }, [reset, testStatus]);

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
