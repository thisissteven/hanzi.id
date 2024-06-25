import { Level } from "@/data";

export type HanziApiResponse = {
  definition: {
    hsk: Level;
    simplified: string;
    entries: Array<{
      pinyin: string;
      definitions: Array<string>;
    }>;
  } | null;
};

export type HanziRelatedApiResponse = {
  related: Array<{
    simplified: string;
    pinyin: string;
    definition: string;
  }>;

  idioms: Array<{
    simplified: string;
    pinyin: string;
    definition: string;
  }>;

  lessons: Array<{
    simplified: string;
    pinyin: string;
    english: string;
    audioUrl: string;
    lessonInfo: {
      level: string;
    };
  }>;
};
