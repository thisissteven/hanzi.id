import { usePreferences } from "@/components";
import { useLocale } from "@/locales/use-locale";
import { capitalizeFirstLetter } from "@/utils/use-speech/paragraph-utils";
import React from "react";
import useSWRImmutable from "swr/immutable";

function getChartData(data: Array<[string, string, number]>) {
  // Use a Map to group hanzi by category
  const categoryMap = new Map();

  data.forEach(([hanzi, category]) => {
    if (!categoryMap.has(category)) {
      categoryMap.set(category, { idioms: new Set(), words: new Set() });
    }
    const categoryData = categoryMap.get(category);

    if (hanzi.length >= 4) {
      categoryData.idioms.add(hanzi);
    } else {
      categoryData.words.add(hanzi);
    }
  });

  // Transform the map into the desired output format
  const result = Array.from(categoryMap.entries()).map(([name, { idioms, words }]) => ({
    name: capitalizeFirstLetter(name),
    idioms: idioms.size,
    words: words.size,
  }));

  return result;
}

function getWordsFromText(hanziList: Array<[string, string]>, text: string) {
  // Create a Map to store the count of each Hanzi found in the text
  const foundHanzi = new Map();

  // Check each Hanzi in the list for its presence in the text and count occurrences
  hanziList.forEach(([category, hanzi]) => {
    const regex = new RegExp(hanzi, "g");
    const matchCount = (text.match(regex) || []).length;
    if (matchCount > 0) {
      const key = JSON.stringify([category, hanzi]);
      if (foundHanzi.has(key)) {
        foundHanzi.set(key, foundHanzi.get(key) + matchCount);
      } else {
        foundHanzi.set(key, matchCount);
      }
    }
  });

  // Get the count of unique Hanzi found
  const uniqueHanziCount = foundHanzi.size;

  // Convert the Map back to an array of [category, hanzi, occurrence] triples
  const uniqueHanziArray = Array.from(foundHanzi.entries()).map(([key, count]) => {
    const [category, hanzi] = JSON.parse(key);
    return [hanzi, category, count];
  }) as Array<[string, string, number]>;

  const totalHanziOccurrences = Array.from(foundHanzi.values()).reduce((sum, count) => sum + count, 0);

  return {
    count: totalHanziOccurrences,
    unique: uniqueHanziCount,
    sorted: uniqueHanziArray,
    chartData: getChartData(uniqueHanziArray),
  };
}

export function useWords(text: string) {
  const { locale } = useLocale();
  const { isSimplified } = usePreferences();

  const list = isSimplified ? "hanzi-list" : "hanzi-list-trad";

  const { data } = useSWRImmutable(
    `https://content.hanzi.id/frequency/occurrence/${locale}/${list}.json`,
    async (url: string) => {
      const response = await fetch(url);
      return response.json();
    }
  );

  const memoized = React.useMemo(() => {
    if (!data) {
      return {
        count: 0,
        unique: 0,
        sorted: [],
        chartData: [],
      };
    }
    return getWordsFromText(data, text);
  }, [data, text]);

  return memoized;
}
