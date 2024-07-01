export const HSK_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export const CHARACTERS_PER_PAGE = 48;
export const CHARACTERS_PER_LEVEL = {
  1: 500,
  2: 772,
  3: 973,
  4: 1000,
  5: 1071,
  6: 1140,
  7: 2000,
  8: 2000,
  9: 1636,
};

export type Level = keyof typeof CHARACTERS_PER_LEVEL;

export type ChineseCharacter = {
  id: string;
  hanzi: string;
  traditional: string;
  pinyin: string;
  translations: Array<string>;
};
