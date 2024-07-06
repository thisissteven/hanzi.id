export const HSK_LEVELS_OLD = [1, 2, 3, 4, 5, 6] as const;
export const CHARACTERS_PER_PAGE_OLD = 50;
export const CHARACTERS_PER_LEVEL_OLD = {
  1: 150,
  2: 150,
  3: 300,
  4: 600,
  5: 1300,
  6: 2500,
};

export type LevelOld = keyof typeof CHARACTERS_PER_LEVEL_OLD;
