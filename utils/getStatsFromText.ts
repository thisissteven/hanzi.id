import { franc } from "franc";
import { readingTime } from "reading-time-estimator";

export function getStatsFromText(text: string) {
  const localeMapping = {
    eng: "en", // English
    cmn: "cn", // Simplified Chinese (Mandarin)
    und: "cn", // Simplified Chinese (Mandarin)
  } as const;
  const locale = franc(text) as keyof typeof localeMapping;

  const result = readingTime(text, 150, localeMapping[locale] || "en");
  return result;
}

export function countCharacters(characters: string) {
  const results: { [k: string]: number } = {};
  const chineseCharRegex = /[\u4E00-\u9FFF]/; // Regex for Chinese characters

  for (let char of characters.split("")) {
    if (chineseCharRegex.test(char)) {
      char in results ? (results[char] += 1) : (results[char] = 1);
    }
  }

  return Object.entries(results)
    .map(([k, v]) => ({ char: k, count: v }))
    .sort((a, b) => b.count - a.count);
}

export function getCharactersFromText(text: string) {
  const localeMapping = {
    eng: "en", // English
    cmn: "cn", // Simplified Chinese (Mandarin)
    und: "cn", // Simplified Chinese (Mandarin)
  } as const;
  const locale = franc(text) as keyof typeof localeMapping;

  const result = readingTime(text, 150, localeMapping[locale] || "en");

  const sorted = countCharacters(text);

  return {
    count: result.words,
    unique: sorted.length,
    sorted,
  };
}
