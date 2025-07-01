import { ranges } from "./hook";
import { NLPGroup, Token } from "./types";

type CategorizedGroups = {
  [label: string]: Token[];
};

export function groupTokensByFreq(nlp: NLPGroup[]): CategorizedGroups {
  const categorized: CategorizedGroups = {};
  const seenForms: Set<string> = new Set();

  for (const sentence of nlp) {
    for (const token of sentence) {
      const freq = typeof token.freq === "number" ? token.freq : null;
      if (freq === null) continue;

      const formText = token.form.text;
      if (seenForms.has(formText)) continue;
      seenForms.add(formText);

      const range = ranges.find((r) => freq >= r.min && freq <= r.max);
      if (!range) continue;

      if (!categorized[range.label]) {
        categorized[range.label] = [];
      }
      categorized[range.label].push(token);
    }
  }

  return categorized;
}

export function getColorClass(key: string, useUnderline: boolean, map: Record<string, string>) {
  const base = map[key] || "";
  return useUnderline ? `${base} underline decoration-[1.5px] underline-offset-4` : base;
}

export function getFreqRangeLabel(freq: number | null | undefined, ranges: any[]): string {
  if (typeof freq !== "number") return "unknown";
  const range = ranges.find((r) => freq >= r.min && freq <= r.max);
  return range ? range.label : "unknown";
}

export function getSentenceTransliteration(token: any): string {
  // Try .form.pinyin (joined without spaces, as in your example)
  if (Array.isArray(token?.form?.pinyin)) {
    return token.form.pinyin?.join("");
  }

  if (Array.isArray(token?.form_norm?.pinyin)) {
    return token?.form_norm.pinyin?.join("");
  }

  // Fallback to translit in various places
  const translitSources = [token?.form?.translit, token?.form_norm?.translit, token?.lemma?.translit];

  for (const source of translitSources) {
    if (Array.isArray(source)) return source.join(" ");
    if (typeof source === "string") return source;
  }

  return "";
}

export function getTransliteration(token: any): string {
  // Try pinyin (array of strings)
  if (Array.isArray(token.form?.pinyin)) {
    return token.form.pinyin.join(" ");
  }

  // Try translit as array or string (form)
  if (token.form?.translit) {
    return Array.isArray(token.form.translit) ? token.form.translit.join(" ") : token.form.translit;
  }

  // Try form_norm.translit
  if (token.form_norm?.translit) {
    return Array.isArray(token.form_norm.translit) ? token.form_norm.translit.join(" ") : token.form_norm.translit;
  }

  // Try lemma.translit
  if (token.lemma?.translit) {
    return Array.isArray(token.lemma.translit) ? token.lemma.translit.join(" ") : token.lemma.translit;
  }

  return "";
}
