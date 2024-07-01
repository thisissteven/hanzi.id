import { Level } from "@/data";

export type HanziApiResponse = {
  definition: {
    hsk: Level;
    simplified: string;
    entries: Array<{
      pinyin: string;
      traditional: string;
      definitions: Array<string>;
    }>;
  } | null;

  related: Array<{
    simplified: string;
    traditional: string;
    pinyin: string;
    definition: string;
  }>;

  idioms: Array<{
    simplified: string;
    traditional: string;
    pinyin: string;
    definition: string;
  }>;

  lessons: Array<{
    simplified: string;
    traditional: string;
    pinyin: string;
    english: string;
    audioUrl: string;
    lessonInfo: {
      level: string;
    };
  }>;
};
