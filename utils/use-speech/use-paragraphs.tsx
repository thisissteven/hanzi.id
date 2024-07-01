import React from "react";
import { getParagraphs } from "./paragraph-utils";

const startQuote = "「";
const endQuote = "」";

export function useParagraphs(text: string, isUnique: boolean) {
  const paragraphs = React.useMemo(() => {
    return isUnique ? getParagraphs(text, startQuote, endQuote) : getParagraphs(text);
  }, [isUnique, text]);

  const sentences = React.useMemo(() => paragraphs.flat(), [paragraphs]);

  return { paragraphs, sentences };
}
