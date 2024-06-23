import { franc } from "franc";
import { readingTime } from "reading-time-estimator";

export function getStatsFromText(text: string) {
  const localeMapping = {
    eng: "en", // English
    cmn: "cn", // Simplified Chinese (Mandarin)
  } as const;
  const locale = franc(text) as keyof typeof localeMapping;

  const result = readingTime(text, 150, localeMapping[locale] || "en");
  return result;
}
