export const getFetchUrl = (testType: TestType, isSimplified: boolean) => {
  const prefix = isSimplified ? "simplified" : "traditional";
  return `https://content.hanzi.id/typing-test/chinese_${prefix}_${testType}.json`;
};

export const getTestTypeDisplayName = (testType: TestType) => {
  switch (testType) {
    case "basic":
      return "basic";
    case "1k":
      return "1k frequent";
    case "5k":
      return "5k frequent";
    case "10k":
      return "10k frequent";
    case "50k":
      return "50k frequent";
  }
};

export function shuffleAndSlice(array: TypingTestData[], time: number) {
  return array.sort(() => Math.random() - 0.5).slice(0, 200);
}

export const getInitialWordStatuses = (words: TypingTestData[]) => {
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

export function normalizeArrays(typedCharacters: Array<string | null>, actualCharacters: Array<string | null>) {
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

export type WordStatus = "correct" | "wrong" | "inactive" | "current";
export type TestStatus = "waiting for you" | "ongoing" | "finished";
export type TestType = "basic" | "1k" | "5k" | "10k" | "50k";
export type TypingTestData = {
  hanzi: string;
  pinyin: string;
};

export const testTypes = ["basic", "1k", "5k", "10k", "50k"] as Array<TestType>;

export const unicodeRange = /^[\u4e00-\u9fa5\d]+$/;
