import { BackRouteButton, LoadingBar, usePreferences } from "@/components";
import React from "react";
import useSWRImmutable from "swr/immutable";
import { AnimatePresence } from "framer-motion";
import { Layout } from "@/modules/layout";
import {
  getFetchUrl,
  shuffleAndSlice,
  TypingTestData,
  TypingTestContent,
  TestTypeChips,
  TypingTestSettingsProvider,
  useTypingTestSettings,
  TypeSettingsDialog,
} from "@/modules/typing-test";

export default function TypingTest() {
  return (
    <>
      <div className="w-fit mx-auto">
        <BackRouteButton />
      </div>
      <div className="mx-auto container max-w-[960px] px-4 grid place-items-center min-h-[90dvh]">
        <div className="space-y-12 md:space-y-4">
          <TypingTestSettingsProvider>
            <TypingTestRenderer />
          </TypingTestSettingsProvider>
        </div>
      </div>
    </>
  );
}

function TypingTestRenderer() {
  const { isSimplified } = usePreferences();

  const {
    settings: { testType, time },
  } = useTypingTestSettings();

  const { data, isLoading } = useSWRImmutable<TypingTestData[]>(
    [testType, isSimplified],
    async ([testType]) => {
      const response = await fetch(getFetchUrl(testType, isSimplified));
      const data = await response.json();
      return data;
    },
    {
      keepPreviousData: true,
    }
  );

  const [words, setWords] = React.useState<TypingTestData[]>([]);
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(() => {
    if (data) {
      setWords(shuffleAndSlice(data, time));
    }
  }, [data, time]);

  return (
    <>
      <TypeSettingsDialog />
      <div className="w-fit mx-auto">
        <TestTypeChips disabled={disabled} />
      </div>
      <AnimatePresence initial={false} mode="wait">
        {words.length === 0 ? (
          <div className="h-[281px] sm:h-[305px] grid place-items-center">
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
                if (data) {
                  setWords(shuffleAndSlice(data, time));
                }
              }}
            />
          </Layout>
        )}
      </AnimatePresence>
    </>
  );
}
